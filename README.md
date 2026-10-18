<div align="center">
  <img src="./public/carbon-scout-logo.svg" alt="Carbon Scout Logo" width="180" />

# 🌱 Carbon Scout Platform

### Autonomous Voluntary Carbon Market Intelligence & ESG Compliance Platform

</div>

<p align="center">
  An enterprise-grade fullstack autonomous AI agent platform for Voluntary Carbon Market (VCM) intelligence and ESG compliance auditing. Powered by <strong>pnpm workspaces</strong>, <strong>Anvia AI SDK</strong>, <strong>OpenRouter</strong>, <strong>Hono</strong>, <strong>React 19</strong>, <strong>TanStack Router</strong>, and <strong>Drizzle ORM</strong> with PostgreSQL.
</p>

---

## 🏗️ Repository Architecture

```
.
├── apps/
│   ├── api/                  # Hono backend API server (Chat SSE streaming, session RPC)
│   ├── platform/             # Modern web UI (React 19 + TanStack Router + Tailwind v4 + @anvia/react-ui)
│   └── logger/               # Workspace logging package with custom prefixes & levels
├── docs/
│   ├── decision/             # Architecture Decision Records (ADR 0001 - 0006)
│   ├── product/              # Product specifications (001-carbon-scout-chat-spec.md)
│   └── README.md             # Documentation standards and review guidelines
├── e2e/                      # Playwright end-to-end integration test suites
├── packages/
│   ├── db/                   # PostgreSQL schema & DrizzleMemoryStore (@anvia/memory-drizzle)
│   └── agents/               # Carbon Scout agent, tools, prompts, & evaluation suites
├── public/
│   └── carbon-scout-logo.svg # Official Carbon Scout brand mark
├── playwright.config.ts      # Multi-server E2E test orchestration (API + Platform)
├── pnpm-workspace.yaml       # Workspace definition (apps/*, packages/*)
└── package.json              # Monorepo root scripts & dev dependencies
```

---

## 🚀 Key Features & Capabilities

- **Autonomous VCM Intelligence**: Discovers real-time pricing benchmarks (Biochar, DAC, Forestry, Cookstoves) via live Tavily web intelligence.
- **Fullstack SSE Token Streaming**: True end-to-end streaming from OpenRouter through Hono to React ProseMirror markdown components with animated token streams.
- **Multi-Session Conversation Memory**: Persistent chat history stored in PostgreSQL via Drizzle ORM and `@anvia/memory-drizzle`.
- **Policy Compliance & Abstention**: Built-in guardrails against unverified private entity quotes, enforcing mandatory VCM volatility disclaimers.
- **Lens Observability**: Native telemetry hooks capturing full agent traces, tool runs, and decision cycles.

---

## 🛠️ Tech Stack

| Domain                  | Technology                                                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Package Management**  | [pnpm Workspaces](https://pnpm.io/workspaces) (Isolated monorepo topology)                                                                                       |
| **Agent Core**          | [`@anvia/core`](https://www.npmjs.com/package/@anvia/core), [`@anvia/openai`](https://www.npmjs.com/package/@anvia/openai), [OpenRouter](https://openrouter.ai/) |
| **Backend API**         | [Hono](https://hono.dev/) v4, `@hono/node-server`, `@anvia/server`, `@anvia/client`                                                                              |
| **Frontend UI**         | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TanStack Router](https://tanstack.com/router), [Tailwind CSS v4](https://tailwindcss.com/)         |
| **Agent UI Components** | [`@anvia/react-ui`](https://www.npmjs.com/package/@anvia/react-ui), `@anvia/react`                                                                               |
| **Database & ORM**      | [PostgreSQL 16](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/), `@anvia/memory-drizzle`                                                  |
| **Testing & Quality**   | [Playwright](https://playwright.dev/) E2E, [Oxlint](https://oxc.rs/), `oxfmt`, [Husky](https://typicode.github.io/husky/)                                        |

---

## ⚡ Getting Started

### 1. Prerequisites

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`
- **Docker**: For running the local PostgreSQL container

### 2. Environment Setup

Create `.env` in the root directory:

```env
# Database (PostgreSQL with Drizzle ORM)
DATABASE_URL="postgres://anvia:anvia@localhost:5433/anvia"

# Model Provider (OpenRouter)
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"

# Research & Web Intelligence
TAVILY_API_KEY="tvly-your-tavily-key"

# Anvia Lens Observability (Optional)
ANVIA_LENS_BASE_URL="http://localhost"
ANVIA_LENS_MEDIA_UPLOAD_ENABLED="false"
```

### 3. Start Database

```bash
docker compose -f docker-compose.dev.yaml up -d
```

### 4. Install & Run

```bash
# Install workspace dependencies
pnpm install

# Start both API (port 8000) and Web Platform (port 3000)
pnpm dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 💻 Development Commands

| Command             | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Starts backend API (8000) and frontend platform (3000) concurrently |
| `pnpm api:dev`      | Runs `apps/api` development server with `tsx watch`                 |
| `pnpm platform:dev` | Runs `apps/platform` Vite development server                        |
| `pnpm build`        | Compiles all workspace projects and packages                        |
| `pnpm typecheck`    | Runs `tsc --noEmit` across all workspace projects                   |
| `pnpm lint`         | Runs `oxlint` across all files                                      |
| `pnpm format`       | Formats codebase using `oxfmt`                                      |
| `pnpm test:e2e`     | Runs Playwright integration tests with dual-server orchestration    |
| `pnpm test:e2e:ui`  | Opens Playwright Interactive UI mode                                |

---

## 🧪 Testing & Pre-Commit Quality Gates

### Playwright E2E Integration Tests

Playwright automatically launches both the Hono backend server and Vite platform before executing tests:

```bash
pnpm test:e2e
```

### Git Hooks (Husky)

Husky automatically runs pre-commit verification before every commit:

1. `oxlint`
2. `tsc --noEmit` (all workspaces)
3. `pnpm build`

---

## 📚 Architecture Decision Records (ADRs)

Key technical choices are documented in `docs/decision/`:

- [ADR 0001: Monorepo PNPM Workspace Architecture](docs/decision/0001-pnpm-workspace-architecture.md)
- [ADR 0002: Oxlint, Oxfmt & Husky Pre-commit Quality Pipeline](docs/decision/0002-oxlint-oxfmt-husky-pre-commit.md)
- [ADR 0003: Playwright Dual-Server E2E Testing Pipeline](docs/decision/0003-playwright-e2e-testing-setup.md)
- [ADR 0005: Drizzle ORM PostgreSQL Memory Store](docs/decision/0005-drizzle-orm-and-anvia-packages.md)
- [ADR 0006: Platform Anvia React UI Integration Architecture](docs/decision/0006-platform-anvia-react-ui-integration.md)
