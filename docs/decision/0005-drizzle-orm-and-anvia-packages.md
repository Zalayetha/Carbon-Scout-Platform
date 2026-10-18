# ADR 0005: Drizzle ORM and Anvia Workspace Packages Architecture

- **Status**: accepted
- **Date**: 2026-10-18
- **Authors**: Engineering Team

## Context

The monorepo requires an autonomous AI research agent platform capable of analyzing Voluntary Carbon Markets (VCM) and auditing ESG compliance (Carbon Scout). This requires:

1. Persistent conversation memory storage integrated with an ORM.
2. A dedicated, modular agent package with domain context, tools, and evaluation suites.
3. Server-Sent Events (SSE) streaming API endpoints connecting client applications to agent execution.

## Decision

We introduce two modular workspace packages under `packages/` alongside updated backend API routes in `apps/api`:

### 1. Database Package (`packages/db` - `@anvia/db`)

- Powered by **Drizzle ORM** and `postgres` (postgres.js connection pooling).
- Implements durable Anvia memory storage (`agent_memory_sessions`, `agent_memory_messages`, `agent_memory_errors`) using `DrizzleMemoryStore` from `@anvia/memory-drizzle`.
- Stores structured market intelligence outputs via the `carbon_reports` table.
- Managed with Drizzle Kit (`pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`).

### 2. Autonomous Agent Package (`packages/agents` - `@anvia/agents`)

- Built with `@anvia/core`, `@anvia/lens`, and `@anvia/openai` for Carbon Scout intelligence.
- Incorporates domain context documents (`support-policy`) covering POJK, ISO 14064, GHG Protocol, GRI, and EU CBAM frameworks.
- Equipped with specialized tools:
  - `compileReport`: Structured Markdown generation with executive summaries and market disclaimers.
  - `searchWeb` & `fetchWebPage`: Live Tavily research with offline mock fallbacks for testing.
  - `sandboxTools`: Safe workspace file operations (`write_file`, `read_file`, `list_files`).
- Includes a 5-scenario evaluation suite (`clear-answer`, `ambiguous-request`, `no-useful-result`, `source-citation`, `report-file-created`).

### 3. Backend Streaming & Memory Protocol (`apps/api`)

- Mounts `/chat` accepting client messages and streaming back agent events via `@anvia/client` and `@anvia/server`.
- Exposes `/sessions` and `/sessions/:id/messages` to query conversation history directly from PostgreSQL.
- Exports chained `AppType` for full end-to-end Hono RPC type inference in web platform applications.

## Status Lifecycle

In accordance with documentation standards:

1. `accepted` – Active architectural standard (current status of this record).
2. `superseeded` – Replaced by a subsequent ADR.
3. `deprecated` – No longer recommended or supported.

## Consequences

### Positive

- Strict separation of concerns between database, agent intelligence, and HTTP routing layers.
- Application-owned database migrations with zero proprietary vendor lock-in.
- Type-safe, high-performance SSE streaming for real-time AI responses.
- Resilient evaluation matrix enabling continuous quality benchmarking.

### Negative

- Requires a running PostgreSQL instance (supported locally via `docker compose -f docker-compose.dev.yaml up -d`).
