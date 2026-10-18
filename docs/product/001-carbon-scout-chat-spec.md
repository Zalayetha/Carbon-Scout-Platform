# Product Spec 001: Carbon Scout Agent & Chat API Platform

- **Date**: 2026-10-18
- **Authors**: Product & Engineering Team

## Product Decision

### Problem Statement & Scope

Sustainability analysts and corporate ESG teams require real-time market intelligence on Voluntary Carbon Markets (VCM) and verification against carbon accounting standards (POJK, ISO 14064, GHG Protocol, GRI, and EU CBAM). Traditional manual research across registries (Puro.earth, Verra, Gold Standard) is time-consuming and prone to stale data.

The Carbon Scout platform provides an autonomous conversational research agent coupled with a persistent backend API to research benchmarks, audit compliance, compile structured reports, and track conversation sessions across user workflows.

### Key Decisions

1. **Conversational Intelligence API (`apps/api`)**:
   - `POST /chat?sessionId=:id`: Streams agent reasoning, tool invocations, and answers in real-time using `@anvia/client` protocol.
   - `GET /sessions`: Returns user conversation sessions with auto-derived session titles for sidebar navigation.
   - `GET /sessions/:id/messages`: Hydrates full message history for any previously conducted research session.

2. **Durable Memory & Report Storage (`packages/db`)**:
   - Leverages **Drizzle ORM** with PostgreSQL to store chat turns, session checkpoints, and error telemetry.
   - Implements a dedicated `carbon_reports` table to persist structured intelligence reports and market citations.

3. **Autonomous Research Capabilities (`packages/agents`)**:
   - Researches VCM pricing benchmarks (Biochar, Direct Air Capture, Forestry, Cookstoves) for 2024–2026 vintages.
   - Enforces strict abstention policies for unlisted private entities (e.g., local private bakeries without public registry listings).
   - Automatically attaches the mandatory volatility disclaimer: _"Prices reflect voluntary carbon market benchmarks and are subject to market volatility."_
   - Safely compiles reports into the local sandbox filesystem (`output/carbon_scout_report.md`).

### Target Outcomes

- Sub-second first-token latency on streaming agent responses.
- Complete conversation recovery across browser reloads via PostgreSQL session persistence.
- Zero hallucinations on private company carbon valuations via automated abstention boundaries.

---

## Notes

### Implementation Details

- **Database Layer**: Migrations are managed via `drizzle-kit` (`pnpm db:generate`, `pnpm db:migrate`). Tables include `agent_memory_sessions`, `agent_memory_messages`, `agent_memory_errors`, and `carbon_reports`.
- **Agent Memory**: Initialized with `DrizzleMemoryStore` from `@anvia/memory-drizzle` within `apps/api/src/index.ts`.
- **Search & Fallbacks**: Uses `searchWeb` and `fetchWebPage` backed by Tavily API, with an automatic fallback to `mockResearchService` if `TAVILY_API_KEY` is not configured.
- **Evaluation Matrix**: Continuously tested via `@anvia/core/evals` across 5 core scenarios (`pnpm eval`, `pnpm eval:contain`, `pnpm eval:abstention`, `pnpm eval:exact-match`).

### References & Documentation

- [Zalayetha/Carbon-Scout Reference Repository](https://github.com/Zalayetha/Carbon-Scout)
- [Devscale Indonesia Fullstack Reference](https://github.com/Devscale-Indonesia/anvia-fullstack-app)
- [ADR 0005: Drizzle ORM and Anvia Workspace Packages Architecture](../decision/0005-drizzle-orm-and-anvia-packages.md)
