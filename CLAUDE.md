# monica-mcp Agent Guide

## Architecture

- **29 action-based tools** — one per entity, takes `action: "list"|"get"|"create"|"update"|"delete"` parameter
- **Full coverage** — all 30 Monica API endpoints
- **Design rationale** — consolidated from 146 to 29 tools to save ~40K tokens of tool definitions
- **Tested against** Monica v4.1.2

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| Contact | `monica_contact` | CRUD + search + tags + career + 15 scoped queries |
| Communication | `monica_activity`, `monica_call`, `monica_conversation` | CRUD + message threading |
| Productivity | `monica_note`, `monica_task`, `monica_reminder`, `monica_tag`, `monica_journal_entry` | Full CRUD |
| Professional | `monica_relationship`, `monica_company`, `monica_occupation` | CRUD |
| Financial | `monica_gift`, `monica_debt` | CRUD + photo association |
| Reference | `monica_country`, `monica_currency`, `monica_gender`, `monica_user` | Read-only |

## Common Workflows

**Add a contact + note + task:**
```
monica_contact(action: "create", first_name: "John", ...)
  → get id
monica_note(action: "create", contact_id: ..., body: "...", is_favorited: 0)
monica_task(action: "create", contact_id: ..., title: "...", completed: 0)
```

**Search for a contact:**
```
monica_contact(action: "search", query: "John")
```

**List what you know about a contact:**
```
monica_contact(action: "list_notes", id: ...)
monica_contact(action: "list_activities", id: ...)
monica_contact(action: "list_relationships", id: ...)
```

## Safety

- All tools include the `action` parameter — the AI must explicitly choose delete
- System env vars: `MONICA_READ_ONLY=true` blocks writes, `MONICA_DISABLE_DELETE=true` blocks deletes
- Countries, currencies, genders are read-only (no create/update/delete)

## Key Files

| File | Purpose |
|------|---------|
| `src/factory.ts` | Core factory — `makeEntityTool()` produces one action-based tool per entity |
| `src/tools/*.ts` | Entity tool definitions with zod schemas |
| `src/index.ts` | Server entry with security safeguard enforcement |
| `src/client.ts` | HTTP client wrapping Monica REST API |
| `.github/workflows/release.yml` | Tag-based npm publish + GitHub Release |
| `.github/workflows/version-watchdog.yml` | Daily check for new Monica releases |