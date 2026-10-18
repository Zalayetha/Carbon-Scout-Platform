# ADR 0003: Root End-to-End Testing Setup using Playwright

- **Status**: accepted
- **Date**: 2026-10-10
- **Authors**: Engineering Team

## Context

Our monorepo consists of multiple interdependent applications (`apps/api` and `apps/platform`). We need a reliable end-to-end (E2E) testing framework at the root level to test full integration flows, API data loading, and browser interaction.

## Decision

We adopt **Playwright** (`@playwright/test`) configured at the monorepo root level (`playwright.config.ts`):

1. **Test Location**: Tests are stored in the `./e2e` directory (e.g. `e2e/example.spec.ts`).
2. **Automated Web Server Launcher**: Configured `webServer` in `playwright.config.ts` to automatically launch both background dev servers (`pnpm api:dev` on port 8000 and `pnpm platform:dev` on port 3000) before executing E2E test suites.
3. **Execution Scripts**:
   - `pnpm test:e2e`: Runs headless Playwright test suite.
   - `pnpm test:e2e:ui`: Launches Playwright Interactive UI Mode for debugging.

## Status Lifecycle

- `accepted` – Active architectural standard (current status).
- `superseeded` – Replaced by a subsequent ADR.
- `deprecated` – No longer recommended or supported.

## Consequences

### Positive

- Ensures full integration between React frontend (`apps/platform`) and Hono backend (`apps/api`).
- Developers do not need to manually boot server processes prior to running E2E test commands.
- Multi-browser cross-platform testing capabilities.

### Negative

- Initial E2E runs download browser binaries (`Chromium`).
