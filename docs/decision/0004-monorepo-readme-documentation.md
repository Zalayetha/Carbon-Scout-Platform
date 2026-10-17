# ADR 0004: Monorepo Root README Documentation Standard

- **Status**: accepted
- **Date**: 2026-10-10
- **Authors**: Engineering Team

## Context

A clear, comprehensive repository README is essential for onboarding developers, documenting workspace architecture, listing development scripts, and providing clear instructions on building, running, and testing applications.

## Decision

We establish a root `README.md` containing:
1. **Architecture Overview**: Map of `apps/`, `packages/`, `docs/`, and `e2e/`.
2. **Tech Stack Overview**: Explicitly listing pnpm workspaces, Hono, React 19, Vite, TanStack Router, Oxlint, Husky, and Playwright.
3. **Command Matrix**: Unified reference table for `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test:e2e`.
4. **Documentation Rules**: Guidelines referencing `docs/` and ADR status workflows.

## Status Lifecycle

- `accepted` – Active architectural standard (current status).
- `superseeded` – Replaced by a subsequent ADR.
- `deprecated` – No longer recommended or supported.

## Consequences

### Positive
- Clear developer experience and quick onboarding path.
- Standardized documentation reference across the codebase.

### Negative
- Requires updating the README when adding new apps or top-level scripts.

