# Zalsoft Monorepo Template

A modern, high-performance TypeScript monorepo template powered by **pnpm workspaces**, featuring a lightweight Hono backend, React 19 frontend with TanStack Router file-based routing, a shared logger package, Oxlint quality tooling, and Playwright end-to-end testing.

---

## 🏗️ Repository Architecture

```
.
├── apps/
│   ├── api/                  # Hono backend API server (Hono + Zod + zValidator)
│   ├── platform/             # Web frontend (React 19 + Vite + TanStack Router)
│   └── logger/               # Shared logging workspace package ("logger")
├── docs/
│   ├── decision/             # Architecture Decision Records (ADRs)
│   ├── product/              # Product specifications and notes
│   └── README.md             # Documentation guidelines & status specs
├── e2e/                      # Playwright E2E integration test suites
├── packages/                 # Modular shared libraries & packages
├── .husky/                   # Git pre-commit hooks (lint, typecheck, build)
├── playwright.config.ts      # Playwright test configuration & webServer launcher
├── pnpm-workspace.yaml       # Workspace configuration (apps/*, packages/*)
└── package.json              # Root scripts and workspace devDependencies
```

---

## 🚀 Tech Stack

- **Package Manager**: [pnpm Workspaces](https://pnpm.io/workspaces)
- **Backend (`apps/api`)**: [Hono](https://hono.dev/), [Zod](https://zod.dev/), `@hono/zod-validator`, `@hono/node-server`
- **Frontend (`apps/platform`)**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TanStack Router](https://tanstack.com/router) (File-based routing), [Tailwind CSS v4](https://tailwindcss.com/)
- **Shared Utilities (`apps/logger`)**: Modular logging package with levels (`info`, `warn`, `error`, `debug`)
- **Code Quality & Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html), `oxfmt`, [Husky](https://typicode.github.io/husky/)
- **End-to-End Testing**: [Playwright](https://playwright.dev/) with automated dual-server orchestration

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

---

## 💻 Development Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts both `api` (port 8000) and `platform` (port 3000) dev servers in parallel |
| `pnpm api:dev` | Runs `apps/api` development server |
| `pnpm platform:dev` | Runs `apps/platform` Vite development server |
| `pnpm build` | Builds all packages and applications across the workspace |
| `pnpm typecheck` | Runs TypeScript type checking (`tsc --noEmit`) across all workspace projects |
| `pnpm lint` | Runs `oxlint` linter across the codebase |
| `pnpm format` | Runs `oxfmt` formatter across the codebase |
| `pnpm test:e2e` | Runs Playwright E2E test suite with automated server booting |
| `pnpm test:e2e:ui` | Opens Playwright Interactive UI mode for debugging E2E tests |

---

## 🧪 Testing & Pre-commit Hooks

### E2E Testing with Playwright
Playwright automatically boots both `apps/api` and `apps/platform` before running tests.

```bash
pnpm test:e2e
```

### Git Hooks (Husky)
Husky automatically enforces code quality checks on `git commit`:
1. `pnpm lint` (Oxlint)
2. `pnpm typecheck` (TypeScript)
3. `pnpm build` (Workspace compilation)

---

## 📚 Documentation & ADRs

All architectural and product decisions are tracked inside `docs/`:

- **Decision Records (`docs/decision/xxxx-meaningfulname.md`)**: Maintain 3 statuses:
  - `accepted`: Active architectural standard.
  - `superseeded`: Superseded by a newer decision.
  - `deprecated`: Phased out and no longer recommended.
- **Product Docs (`docs/product/xxx-meaningfulname.md`)**: Divided into **Product Decision** and **Notes**.

---

