import {
  Agent,
  type AgentStream,
  type MemoryScope,
  type MemoryStore,
  type Message,
  type UserMessage,
} from "@anvia/core";
import { staticContext } from "./context/document.js";
import { BASE_INSTRUCTIONS } from "./instruction.js";
import { getLens } from "./lens.js";
import { DEFAULT_MODEL_ID, getModel } from "./model.js";
import { compileReportTool, fetchWebPageTool, sandboxTools, searchWebTool } from "./tools/index.js";

export type RunAgentOptions = {
  messages: readonly Message[];
  // Optional. The store (e.g. DrizzleMemoryStore from @anvia/db) keeps the conversation per session.
  memory?: {
    store: MemoryStore;
    session: MemoryScope;
  };
  modelId?: string;
  maxTurns?: number;
  abortSignal?: AbortSignal;
};

export function createAgent(
  options: {
    modelId?: string;
    memory?: { store: MemoryStore; session: MemoryScope };
    maxTurns?: number;
  } = {},
) {
  return new Agent({
    id: "carbon-scout-agent",
    model: getModel(options.modelId ?? DEFAULT_MODEL_ID),
    instructions: BASE_INSTRUCTIONS,
    context: staticContext,
    tools: [searchWebTool, fetchWebPageTool, compileReportTool, ...sandboxTools],
    maxTurns: options.maxTurns ?? 25,
    memory: options.memory ? { store: options.memory.store, savePolicy: "turn" } : undefined,
    observability: {
      observers: { lens: getLens().observer({ captureMode: "full" }) },
      primaryTrace: "lens",
    },
  });
}

export function runAgent(options: RunAgentOptions): AgentStream<string> {
  const agent = createAgent({
    modelId: options.modelId,
    memory: options.memory,
    maxTurns: options.maxTurns,
  });

  if (options.memory) {
    const prompt = [...options.messages].reverse().find((m): m is UserMessage => m.role === "user");
    if (!prompt) throw new Error("runAgent requires at least one user message.");
    return agent.stream({
      prompt,
      session: options.memory.session,
      abortSignal: options.abortSignal,
    });
  }

  return agent.stream({
    messages: options.messages,
    abortSignal: options.abortSignal,
  });
}
