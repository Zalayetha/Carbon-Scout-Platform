import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { platformLogger } from "../lib/logger";

declare module "@tanstack/react-router" {
  interface HistoryState {
    pendingMessage?: string;
  }
}

export const Route = createFileRoute("/")({
  component: NewChat,
});

// New chat: the composer only. The first message is sent from the session page.
function NewChat() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    const id = crypto.randomUUID();
    platformLogger.info(
      `Starting new chat session ${id} with message: "${message.slice(0, 50)}..."`,
    );
    void navigate({ to: "/s/$id", params: { id }, state: { pendingMessage: message } });
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 items-center px-4 text-sm font-medium text-zinc-400 border-b border-zinc-800/40">
        Carbon Scout Platform
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <img
          src="/carbon-scout-logo.svg"
          alt="Carbon Scout Logo"
          className="mb-4 size-16 object-contain"
        />
        <h1 className="mb-2 text-2xl font-semibold text-zinc-100">Carbon Scout Platform</h1>
        <p className="mb-6 text-sm text-zinc-400 text-center">
          Autonomous Carbon Market Intelligence &amp; ESG Compliance Agent
        </p>

        <form onSubmit={submit} className="w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-3xl border border-zinc-700 bg-zinc-800 p-2 focus-within:border-zinc-500">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="flex-1 bg-transparent px-3 py-2 leading-6 text-zinc-100 outline-none placeholder:text-zinc-500"
              placeholder="Ask about carbon benchmarks, EU CBAM, Biochar, DAC..."
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-300 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors"
            >
              ↑
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => setText("What are current Biochar carbon removal benchmarks for 2025?")}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            🌿 Biochar Benchmarks 2025
          </button>
          <button
            type="button"
            onClick={() => setText("Explain EU CBAM reporting requirements for industrial imports")}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            📊 EU CBAM Compliance
          </button>
          <button
            type="button"
            onClick={() => setText("Compile an executive research report on DAC registry pricing")}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            📑 DAC Registry Pricing
          </button>
        </div>
      </div>
    </main>
  );
}
