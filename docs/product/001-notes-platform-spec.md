# Product Spec 001: Notes & Platform Core System

- **Date**: 2026-10-10
- **Authors**: Product & Engineering Team

## Product Decision

### Problem Statement & Scope
Users need a fast, intuitive web interface (`apps/platform`) to manage notes, connected to a robust, type-safe API backend (`apps/api`).

### Key Decisions
1. **File-based Routing**: Utilize TanStack Router in `apps/platform` for type-safe, URL-driven state and loader data fetching.
2. **Strict Request Validation**: Utilize Hono with `@hono/zod-validator` in `apps/api` to validate JSON request bodies against Zod schemas.
3. **Structured Event Logging**: All critical application lifecycle and network events must be logged using the workspace `logger` package.

### Target Outcomes
- Seamless developer experience with shared workspace packages.
- Zero-drift API communication between platform loaders and backend endpoints.

---

## Notes

### Implementation Details
- **API Client**: `apps/platform` consumes backend contracts defined in `apps/api/src/index.ts` (`AppType`) via Hono RPC (`hc<AppType>`).
- **Development Workflow**: Execute `pnpm dev` at the repository root to launch both API and frontend dev servers concurrently.

### Future Considerations
- Add database persistence layer (Prisma / Drizzle ORM) for note storage.
- Introduce authentication & authorization middleware.

