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

---

## Product Documentation

Location: `docs/product/`  
Naming Convention: `xxx-meaningful-name.md` (e.g., `001-notes-platform-spec.md`)

### Document Sections

Product specifications should contain the following core sections:

1. **Product Decision**: Defines the scope, user goals, feature decisions, and architecture strategy.
2. **Notes**: Contains technical implementation notes, open questions, and reference material.

