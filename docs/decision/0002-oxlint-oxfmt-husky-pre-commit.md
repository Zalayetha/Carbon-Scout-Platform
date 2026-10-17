# ADR 0002: Adoption of Oxlint, Oxfmt, and Husky Pre-Commit Hooks

- **Status**: accepted
- **Date**: 2026-10-10
- **Authors**: Engineering Team

## Context

To maintain high code quality across our pnpm monorepo without sacrificing developer speed, we require automated code linting, formatting, and pre-commit verification before code can be committed into version control.

## Decision

We adopt **Oxlint**, **Oxfmt**, and **Husky** across the monorepo:

1. **Oxlint (`oxlint`)**: Chosen for high-performance JavaScript and TypeScript code linting.
2. **Oxfmt (`oxfmt`)**: Adopted for code formatting.
3. **Husky**: Integrated into Git hooks (`.husky/pre-commit`) to automatically run:
   - `pnpm lint` (`oxlint .`)
   - `pnpm typecheck` (`pnpm --recursive run typecheck`)
   - `pnpm build` (`pnpm --recursive run build`)

## Status Lifecycle

- `accepted` – Active architectural standard (current status).
- `superseeded` – Replaced by a subsequent ADR.
- `deprecated` – No longer recommended or supported.

## Consequences

### Positive
- Instant feedback on code quality issues using ultra-fast Oxlint checks.
- Guarantees that broken code or type errors cannot be committed into Git history.
- Zero manual setup required for developers after `pnpm install` due to Husky's `prepare` script.

### Negative
- Committing code takes a few extra seconds while type checking and building run in pre-commit.

