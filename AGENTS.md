## Project Overview

Arch-Mk2 is a pnpm monorepo implementing a production-grade industrial mining operations portal. The architecture features:
- **Frontend**: Next.js 16 App Router with Turbopack dev
- **Backend**: NestJS 11/Fastify API
- **Data Layer**: Supabase with strict Row Level Security (RLS)
- **Caching**: Two-tier Redis architecture
- **Agent Framework**: Role-based AI orchestration with SOUL.md contract compliance

Key components:
- Agentic tools SDK in `packages/agentic-tools-mcp`
- Custom AI agent roles defined under `.agents/`
- MCP server interface for cross-session memory management

---

## Build & Test Commands

| Task | Command |
|---|---|
| Full dev stack | `pnpm dev` |
| Framework checks | `pnpm type-check` |
| Quality gate | `pnpm quality` |
| Portal E2E | `pnpm test:e2e` |
| Agent memory management | `pnpm agentic-tools` |

---

## Code Structure

**Monorepo Layout**:
```
├── apps/
│   ├── portal/ (Next.js frontend)
│   ├── api/ (NestJS backend)
│   └── ops-gateway/ (MCP control plane)
├── packages/
│   ├── supabase/ (DB clients)
│   ├── redis/ (cache)
│   └── agentic-tools-mcp (AI infrastructure)
```

**Module Boundaries**:
- Apps cannot import `packages/database` directly
- `packages/supabase` must be used for runtime DB access
- Role-specific agent domains enforced via directory structure

---

## AI Agent Requirements

Under SOUL.md contract:
- All agents must implement `using-agent-skills` for skill discovery
- Critical changes require AUC in `AGENT_TRACER.md`
- Missing skills must be documented at `.agents/skills/`
- Cross-repo coordination tracked via Recopise tools

Agent roles defined in `SOUL.md`:
- `fullstack-nextjs-pro` (frontend/backend integration)
- `security-pro` (RLS enforcement)
- `devops-ci-pro` (CI/CD pipelines)

---

## Security Considerations

1. **Data Access**: Strict `@repo/supabase` boundary
2. **RLS Mandatory**: All table migrations must enable row-level security
3. **Secret Management**: No secrets in version control
4. **Agent Governance**: MCP server access controlled via environment variables
5. **Auditing**: All agent actions traced through AGENT_TRACER.md

---

## Development Practice

- Prefer `Edit` over `Write` for incremental changes
- Test-driven development pattern enforced
- Conventional Commits required
- Cross-repo dependencies tracked via Recopise
- MCP tools should be started with `pnpm agentic-tools`

---

## Critical Rules (From CLAUDE.md)
1. Data access must use `@repo/supabase`
2. RCA required for schema changes
3. API gateway requires proxy.ts
4. Agent tracing mandatory for non-obvious logic
5. Never modify `.claude/CLAUDE.md` manually