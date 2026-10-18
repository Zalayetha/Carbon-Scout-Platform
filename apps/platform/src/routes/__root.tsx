import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { platformLogger } from "../lib/logger";
import "../styles.css";

type SessionSummary = {
  id: string;
  updatedAt: string;
  title: string;
};

export const Route = createRootRoute({
  loader: async () => {
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) {
        platformLogger.warn(`Failed to load sessions: ${res.status}`);
        return { sessions: [] as SessionSummary[] };
      }
      const sessions = (await res.json()) as SessionSummary[];
      platformLogger.info(`Loaded ${sessions.length} sessions`);
      return { sessions };
    } catch (err) {
      platformLogger.error("Failed to fetch sessions:", err);
      return { sessions: [] as SessionSummary[] };
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function Sidebar() {
  const { sessions } = Route.useLoaderData();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-zinc-950 p-3 text-sm text-zinc-100 md:flex">
      <div className="mb-3 flex items-center gap-2.5 px-3 py-1">
        <img
          src="/carbon-scout-logo.svg"
          alt="Carbon Scout Logo"
          className="size-7 rounded object-contain"
        />
        <span className="font-semibold tracking-tight text-zinc-100">Carbon Scout</span>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 hover:bg-zinc-900 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        New chat
      </Link>

      <p className="mt-6 px-3 text-xs font-medium text-zinc-500">Chats</p>
      <nav className="mt-2 flex flex-col gap-1 overflow-y-auto">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to="/s/$id"
            params={{ id: session.id }}
            className="truncate rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-900 transition-colors"
            activeProps={{ className: "truncate rounded-lg bg-zinc-800 px-3 py-2 text-zinc-100" }}
          >
            {session.title}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/50 px-3 py-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
          CS
        </span>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-xs font-medium text-zinc-200">Carbon Analyst</span>
          <span className="truncate text-[10px] text-zinc-500">Voluntary Carbon Markets</span>
        </div>
      </div>
    </aside>
  );
}
