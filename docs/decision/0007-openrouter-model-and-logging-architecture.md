# ADR 0007: OpenRouter Model Provider and Observability Logging Architecture

- **Status**: accepted
- **Date**: 2026-10-18
- **Authors**: Engineering Team

## Context

During the deployment of the Carbon Scout chat completion stream at `/chat`, two core architectural requirements were addressed:

1. **Model Provider Standardization**:
   - Initial testing with a proxy gateway (`gateway.devscale.id`) resulted in non-standard Server-Sent Event (SSE) streaming behavior, where token `usage` metrics were emitted twice per stream (both on the terminal chunk and on the trailer chunk).
   - In accordance with `@anvia/openai`'s strict protocol assertion, multiple `final` events threw `"Completion provider returned an invalid tool call."`.
   - Following the upstream reference architecture in `Devscale-Indonesia/anvia-fullstack-app`, the system required standardization on **OpenRouter** (`https://openrouter.ai/api/v1`) using the canonical model `openai/gpt-6-luna` with explicit `api: "chat"` mode.

2. **Fullstack Structured Logging**:
   - End-to-end observability was required across both the Hono API server and the Vite React platform without taking on heavy external logging dependencies.
   - The workspace needed a lightweight, modular logger package (`apps/logger`) capable of being imported across frontend and backend packages with customizable prefixes and log levels (`info`, `warn`, `error`, `debug`).

3. **Brand Identity & Static Assets**:
   - Consistent branding across the platform required integrating the official Carbon Scout SVG logo from `Zalayetha/Carbon-Scout` into the web app, sidebar navigation, HTML favicon, and root documentation.

---

## Decision

### 1. Model Provider Configuration (`packages/agents/src/model.ts`)

- Standardized on OpenRouter:
  ```typescript
  import { OpenAIClient } from "@anvia/openai";

  export const DEFAULT_MODEL_ID = "openai/gpt-6-luna";
  const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

  let client: OpenAIClient | undefined;

  function getClient(): OpenAIClient {
    if (!client) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("Set OPENROUTER_API_KEY.");
      client = new OpenAIClient({ apiKey, baseUrl: OPENROUTER_BASE_URL });
    }
    return client;
  }

  export function getModel(modelId: string = DEFAULT_MODEL_ID) {
    return getClient().completionModel({ modelId, api: "chat" });
  }
  ```
- Complies fully with upstream OpenRouter protocol without requiring monkey-patching or modifying external library code in `node_modules`.

### 2. Fullstack Workspace Logger (`apps/logger`)

- Configured a dedicated workspace package (`"logger"`) exporting `createLogger({ prefix?: string })`.
- **Backend API (`apps/api`)**:
  - `apiLogger = createLogger({ prefix: "API" })`
  - Added global HTTP request/response latency middleware measuring execution time and status code.
  - Added telemetry across `/chat`, `/sessions`, `/sessions/:id/messages`, and database memory store validation.
  - Implemented unhandled error catching via `app.onError`.
- **Frontend Platform (`apps/platform`)**:
  - `platformLogger = createLogger({ prefix: "Platform" })`
  - Integrated in TanStack Router root loader, New Chat submit handler, and Session Chat streaming lifecycle.

### 3. Brand Identity & Favicon Integration

- Downloaded `carbon-scout-logo.svg` from `Zalayetha/Carbon-Scout` to:
  - `public/carbon-scout-logo.svg` (root brand asset)
  - `apps/platform/public/carbon-scout-logo.svg` (Vite static asset)
- Configured SVG favicon in `apps/platform/index.html`.
- Replaced temporary emoji badge in `apps/platform/src/routes/__root.tsx` with branded SVG icon.
- Added centered brand header in `apps/platform/src/routes/index.tsx`.
- Updated root `README.md` with centered logo banner.

---

## Status Lifecycle

In accordance with documentation standards:

1. `accepted` – Active architectural standard (current status of this record).
2. `superseeded` – Replaced by a subsequent ADR.
3. `deprecated` – No longer recommended or supported.

---

## Consequences

### Positive

- Standard OpenRouter protocol ensures clean, single-trailer SSE streaming compatible with all Anvia SDK consumers.
- Unified structured logging across `apps/api` and `apps/platform` provides immediate visibility into stream lifecycle, request latencies, and session errors.
- Visual polish and brand consistency established across favicon, sidebar, chat views, and repository documentation.
- Pre-commit quality gates (`oxlint`, `oxfmt`, `tsc --noEmit`, Playwright) pass with zero errors.

### Negative

- Requires active `OPENROUTER_API_KEY` in environment for live agent generation.
