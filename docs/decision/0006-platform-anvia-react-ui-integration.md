# ADR 0006: Platform Anvia React UI Integration Architecture

- **Status**: accepted
- **Date**: 2026-10-18
- **Authors**: Engineering Team

## Context

The Carbon Scout AI intelligence system requires a modern, responsive conversational web interface (`apps/platform`). The user interface must seamlessly connect to the backend agent streaming API (`apps/api`), persist and restore research sessions, and provide real-time token streaming with smooth rendering transitions.

Following the reference implementation from `Devscale-Indonesia/anvia-fullstack-app` (specifically `apps/web`), the platform must integrate official `@anvia` frontend packages:

1. `@anvia/client`: Low-level HTTP transport and streaming event protocol.
2. `@anvia/core`: Core message, event, and session schema types.
3. `@anvia/react`: React hooks (`useChat`, `initialMessagesFromMemory`).
4. `@anvia/react-ui`: Headless and styled conversational primitives (`ChatProvider`, `ThreadPrimitive`, `MessagePrimitive`, `ComposerPrimitive`).

## Decision

We configure `apps/platform` as a TanStack Router and Tailwind CSS v4 single-page application integrating the full Anvia React ecosystem:

### 1. Vite Proxy Layer (`apps/platform/vite.config.ts`)

- Configured Vite development server on port 3000.
- Implemented proxy routing rule:
  ```ts
  proxy: {
    "/api": {
      target: "http://localhost:8000",
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  }
  ```
- Ensures browser requests to `/api/sessions`, `/api/sessions/:id/messages`, and `/api/chat?sessionId=...` seamlessly route to the Hono API running on port 8000 without CORS issues.

### 2. Styling & Animation Pipeline (`apps/platform/src/styles.css`)

- Direct integration with Tailwind CSS v4 via `@import "tailwindcss";`.
- Native dark theme baseline (`#09090b` dark background, `#18181b` surface).
- ProseMirror / Tiptap focus outline suppression for cleaner composer inputs.
- Smooth token reveal animation for streaming responses via CSS keyframe `stream-fade-in` tied to `[data-state="revealing"]` attributes.

### 3. Application Route Hierarchy

- **`__root.tsx` (Root Layout & Navigation)**:
  - Route loader queries `/api/sessions` to dynamically populate conversation history in the sidebar.
  - Provides a "+ New chat" action button and persistent analyst user profile.
- **`index.tsx` (New Chat Landing View)**:
  - Presents Carbon Scout Platform header and brand subtitle.
  - Composer input with quick research prompt suggestion pills (Biochar Benchmarks 2025, EU CBAM Compliance, DAC Registry Pricing).
  - Generates a UUID for new sessions and navigates to `/s/$id` carrying initial prompt text in TanStack Router history state (`pendingMessage`).
- **`s.$id.tsx` (Session Chat View)**:
  - Pre-fetches session turn history from `/api/sessions/:id/messages` using `initialMessagesFromMemory`.
  - Connects to `/api/chat?sessionId=:id` via `createHttpClientTransport`.
  - Automatically submits initial `pendingMessage` upon mounting with StrictMode-safe timer guards.
  - Renders markdown chat responses with streaming reveal animations.

## Status Lifecycle

In accordance with documentation standards:

1. `accepted` – Active architectural standard (current status of this record).
2. `superseeded` – Replaced by a subsequent ADR.
3. `deprecated` – No longer recommended or supported.

## Consequences

### Positive

- Unified chat primitives from `@anvia/react-ui` reduce boilerplate for message streaming, error states, and scrolling.
- Instant session hydration from PostgreSQL via `/api/sessions/:id/messages`.
- Type safety ensured across TanStack Router code-splitting, Hono RPC client, and Anvia message protocols.
- Clean development workflow where Vite proxies all `/api` calls directly to the local Hono API server.

### Negative

- Client-side bundle size increases slightly due to Tiptap editor and markdown streaming parsers.
