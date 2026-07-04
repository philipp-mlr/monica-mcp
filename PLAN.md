# Project Plan: monica-mcp

## Goal

Build a full-coverage MCP server for Monica CRM in Node.js/TypeScript, published to npm for `npx` usage.

## Architecture

```
src/
├── index.ts          # MCP server entry point (stdio transport)
├── client.ts         # HTTP client wrapper (fetch-based)
├── types.ts          # TypeScript types for all 30 API entities
├── factory.ts        # Generic CRUD tool factory (DRY)
└── tools/
    ├── contacts.ts       # Contact management (32 tools)
    ├── communication.ts  # Activities, calls, conversations (29 tools)
    ├── organizations.ts  # Addresses, companies, fields, occupations (20 tools)
    ├── productivity.ts   # Notes, tasks, reminders, tags, groups, journal (25 tools)
    ├── relationships.ts  # Relationships, gifts, debts (15 tools)
    └── reference.ts      # Countries, currencies, genders, user, photos, docs (9 tools)
test/
├── client.test.ts    # Unit tests for HTTP client
├── factory.test.ts    # Unit tests for CRUD factory
└── tools.test.ts     # Coverage tests (count, uniqueness, completeness)
```

## API Coverage (30 endpoints)

All 30 Monica API endpoints are covered:

| Endpoint | CRUD | Tools |
|----------|------|-------|
| /contacts | Full | list, get, create, update, delete, search, career update, +15 scoped queries |
| /activities | Full | list, get, create, update, delete |
| /activitytypes | Full | list, get, create, update, delete |
| /activitytypecategories | Read | list, get |
| /addresses | Full | list, get, create, update, delete |
| /auditlogs | Read | list |
| /calls | Full | list, get, create, update, delete |
| /companies | Full | list, get, create, update, delete |
| /contactfields | Full | list, get, create, update, delete |
| /contactfieldtypes | Full | list, get, create, update, delete |
| /conversations | Full | list, get, create, update, delete, +messages |
| /countries | Read | list, get |
| /currencies | Read | list, get |
| /debts | Full | list, get, create, update, delete |
| /documents | List/Get/Delete | (upload not supported by Monica API) |
| /genders | Read | list, get |
| /gifts | Full | list, get, create, update, delete |
| /groups | Full | list, get, create, update, delete |
| /journal | Full | list, get, create, update, delete |
| /notes | Full | list, get, create, update, delete |
| /occupations | Full | list, get, create, update, delete |
| /photos | List/Get/Delete | (upload not supported by Monica API) |
| /relationships | Full | list, get, create, update, delete |
| /relationshiptypes | Full | list, get, create, update, delete |
| /relationshiptypegroups | Full | list, get, create, update, delete |
| /reminders | Full | list, get, create, update, delete |
| /tags | Full | list, get, create, update, delete, +assign/remove on contacts |
| /tasks | Full | list, get, create, update, delete |
| /me (user) | Read | get |

## Design Decisions

1. **Generic CRUD factory** — DRY approach: one `makeCrudTools()` function generates list/get/create/update/delete for each entity, then entity-specific tools are added separately
2. **Zod schemas** — input validation on every tool, passed as `inputSchema` to MCP
3. **No external deps beyond MCP SDK + Zod** — keep it lightweight
4. **Stdio transport only** — simplest for MCP, matches all other homelab MCP servers
5. **Full JSON responses** — all API responses returned as JSON text to the assistant (no count-only bug like Jacob-Stokes/monica-mcp)

## Known API Quirks

- Photo and document upload return HTTP 405 (Monica API limitation, not ours)
- Conversation messages are embedded in conversation GET response (no separate list endpoint)
- Contact dates (birthdate, deceased, first_met) have special semantics (age-based, year-unknown)

## Checklist

- [x] Scaffold project (package.json, tsconfig, gitignore)
- [x] TypeScript types for all 30 API entities
- [x] MonicaClient HTTP wrapper
- [x] CRUD factory + all entity tool files
- [x] MCP server entry point (index.ts)
- [x] README.md
- [x] LICENSE (MIT)
- [x] .env.example
- [x] Unit tests (client, factory, tool coverage)
- [x] GitHub Actions CI/CD (test on 18/20/22, build, npm publish)
- [ ] npm install + build + test verification
- [ ] npm publish
- [ ] Wire into Hermes NixOS config
