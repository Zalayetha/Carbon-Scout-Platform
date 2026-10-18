import { serve } from "@hono/node-server";
import { runAgent } from "@anvia/agents";
import { agentToClientStream, parseClientStreamRequest } from "@anvia/client";
import { createClientStreamResponse } from "@anvia/server";
import { db, DrizzleMemoryStore } from "@anvia/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Message } from "@anvia/core";
import { createLogger } from "logger";

const apiLogger = createLogger({ prefix: "API" });

const app = new Hono();

app.onError((err, c) => {
  apiLogger.error(`Unhandled error on ${c.req.method} ${c.req.path}:`, err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

// Conversation memory lives in Postgres via Drizzle ORM (see packages/db).
const memoryStore = new DrizzleMemoryStore({ db });
await memoryStore.validate();
apiLogger.info("Database memory store validated successfully.");

// Single user for now. Replace with the real user id once auth exists.
const USER_ID = "default-user";

function scopeFor(sessionId: string) {
  return { sessionId, userId: USER_ID };
}

// First user text in a conversation, used as the sidebar title.
function firstUserText(
  messages: readonly { message: Message }[] | readonly Message[],
): string | undefined {
  const first = messages.find((m) => {
    const msg = "message" in m ? m.message : m;
    return msg.role === "user";
  });
  if (!first) return undefined;

  const msg = "message" in first ? first.message : first;
  if (typeof msg.content === "string") return msg.content;
  if (Array.isArray(msg.content)) {
    const textPart = (msg.content as Array<{ type?: string; text?: string }>).find(
      (part) => part.type === "text",
    );
    if (textPart && typeof textPart.text === "string") {
      return textPart.text;
    }
  }
  return undefined;
}

const routes = app
  .use("*", cors())
  .use("*", async (c, next) => {
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    apiLogger.info(`--> ${method} ${path}`);
    await next();
    const duration = Date.now() - start;
    apiLogger.info(`<-- ${method} ${path} ${c.res.status} (${duration}ms)`);
  })
  .get("/", (c) => c.json({ name: "carbon-scout-api", status: "ok" }))
  .get("/health", (c) => c.json({ status: "healthy" }))
  .post("/chat", async (c) => {
    const sessionId = c.req.query("sessionId");
    if (!sessionId) {
      apiLogger.warn("Missing sessionId query parameter on /chat");
      return c.text("sessionId query parameter is required.", 400);
    }

    const rawBody = await c.req.json();
    const body = parseClientStreamRequest(rawBody);
    if (body.type !== "messages") {
      apiLogger.warn(`Invalid body type on /chat: '${body.type}'`);
      return c.text("This endpoint accepts messages only.", 400);
    }

    apiLogger.info(
      `Starting chat stream for session '${sessionId}' with ${body.messages.length} messages`,
    );

    const events = agentToClientStream({
      events: runAgent({
        messages: body.messages,
        memory: { store: memoryStore, session: scopeFor(sessionId) },
      }),
    });

    return createClientStreamResponse({ events });
  })
  // Sessions of the current user, newest first, for the sidebar.
  .get("/sessions", async (c) => {
    const inspector = memoryStore.inspector;
    if (!inspector) {
      apiLogger.error("Memory store does not support listing sessions.");
      throw new Error("Memory store does not support listing sessions.");
    }

    apiLogger.info(`Fetching sessions for user: ${USER_ID}`);
    const conversations = await inspector.listConversations({ limit: 50, userId: USER_ID });
    const sessions = await Promise.all(
      conversations.map(async (summary) => {
        const conversation = await inspector.getConversation({ ref: summary.ref });
        return {
          id: summary.sessionId,
          updatedAt: summary.updatedAt,
          title: (conversation && firstUserText(conversation.messages)) ?? "New chat",
        };
      }),
    );

    sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    apiLogger.info(`Returning ${sessions.length} sessions`);
    return c.json(sessions);
  })
  // Saved messages of one session, used to prefill the chat on page load.
  .get("/sessions/:id/messages", async (c) => {
    const id = c.req.param("id");
    apiLogger.info(`Loading messages for session: ${id}`);
    const messages = await memoryStore.load({ scope: scopeFor(id) });
    apiLogger.info(`Loaded ${messages.length} messages for session: ${id}`);
    return c.json(messages);
  });

const port = Number(process.env.PORT ?? 8000);

serve({ fetch: app.fetch, port }, (info) => {
  apiLogger.info(`Carbon Scout API listening on http://localhost:${info.port}`);
});

export type AppType = typeof routes;
