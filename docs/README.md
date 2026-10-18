# Documentation Overview

Welcome to the monorepo documentation directory.

## Directory Layout

```
docs/
├── decision/               # Architecture Decision Records (ADRs)
│   └── xxxx-meaningfulname.md
├── product/                # Product design documents & specifications
│   └── xxx-meaningfulname.md
└── README.md
```

---

## Architecture Decision Records (ADRs)

Location: `docs/decision/`  
Naming Convention: `xxxx-meaningful-name.md` (e.g., `0001-pnpm-workspace-architecture.md`)

### Decision Statuses

Every decision record **must** set its status to one of the following 3 values:

- **`accepted`**: The decision has been agreed upon and is currently implemented in the codebase.
- **`superseeded`**: The decision was accepted in the past but has been superseded by a newer ADR.
- **`deprecated`**: The decision is no longer recommended or applicable and has been phased out.

### Index of Decision Records

| ADR                                                                    | Title                                               | Status     | Date       |
| ---------------------------------------------------------------------- | --------------------------------------------------- | ---------- | ---------- |
| [ADR 0001](decision/0001-pnpm-workspace-architecture.md)               | Monorepo PNPM Workspace Architecture                | `accepted` | 2026-10-18 |
| [ADR 0002](decision/0002-oxlint-oxfmt-husky-pre-commit.md)             | Oxlint, Oxfmt & Husky Pre-commit Quality Pipeline   | `accepted` | 2026-10-18 |
| [ADR 0003](decision/0003-playwright-e2e-testing-setup.md)              | Playwright Dual-Server E2E Testing Pipeline         | `accepted` | 2026-10-18 |
| [ADR 0004](decision/0004-monorepo-readme-documentation.md)             | Monorepo README & Documentation Structure           | `accepted` | 2026-10-18 |
| [ADR 0005](decision/0005-drizzle-orm-and-anvia-packages.md)            | Drizzle ORM PostgreSQL Memory Store Architecture    | `accepted` | 2026-10-18 |
| [ADR 0006](decision/0006-platform-anvia-react-ui-integration.md)       | Platform Anvia React UI Integration Architecture    | `accepted` | 2026-10-18 |
| [ADR 0007](decision/0007-openrouter-model-and-logging-architecture.md) | OpenRouter Model Provider and Observability Logging | `accepted` | 2026-10-18 |

---

## Product Documentation

Location: `docs/product/`  
Naming Convention: `xxx-meaningful-name.md` (e.g., `001-carbon-scout-chat-spec.md`)

### Index of Product Specifications

| Spec                                                                   | Title                                      | Status |
| ---------------------------------------------------------------------- | ------------------------------------------ | ------ |
| [001-carbon-scout-chat-spec.md](product/001-carbon-scout-chat-spec.md) | Carbon Scout AI Intelligence Platform Spec | Active |
