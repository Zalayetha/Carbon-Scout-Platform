# ADR 0001: Monorepo Architecture using pnpm Workspaces

- **Status**: accepted
- **Date**: 2026-10-10
- **Authors**: Engineering Team

## Context

We require a structured, scalable monorepo setup to host our backend services (`api`), web platform (`platform`), and shared utilities (`logger`). The architecture must support strict package boundaries, fast installations, and local package references.

## Decision

We adopt a **pnpm workspace** setup with the following layout:

- `apps/api`: Hono HTTP server with Zod schema validation via `@hono/zod-validator`.
- `apps/platform`: React 19 single-page application built with Vite and TanStack Router (file-based routing).
- `apps/logger`: Shared logging package used across applications via `"logger": "workspace:*"`.

## Status Lifecycle

In accordance with our documentation standards, all decision records maintain one of 3 statuses:

1. `accepted` – Active architectural standard (current status of this record).
2. `superseeded` – Replaced by a subsequent ADR.
3. `deprecated` – No longer recommended or supported.

## Consequences

### Positive

- High performant symlinked dependency management via `pnpm`.
- Type-safe cross-package imports using TypeScript declaration files.
- Unified root scripts for building and executing parallel dev servers (`pnpm dev`, `pnpm build`).

### Negative

- Requires developer alignment on using `pnpm` as the designated package manager.
