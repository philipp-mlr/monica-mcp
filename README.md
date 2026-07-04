# monica-mcp

A full-coverage [Model Context Protocol](https://modelcontextprotocol.io) server for [Monica CRM](https://www.monicahq.com/). 29 tools covering all 30 API endpoints — search contacts, log activities, manage notes/tasks/reminders, track relationships, and more.

Designed for AI assistants like Claude Desktop, Hermes, Cline, and any MCP-compatible client.

> **Note:** This project is 100% AI-generated. The code, tests, CI/CD, and documentation were all written by an AI agent (Hermes). No human wrote any of the code.

## Design Philosophy

### Action-based tools (not one tool per CRUD op)

Most MCP servers expose 5 separate tools per entity (list, get, create, update, delete). With 30 entities that's 150 tools — flooding the LLM's context window with ~50K+ tokens just for tool definitions. Research shows tool selection accuracy degrades quickly past 15-20 tools.

This server uses **one tool per entity** with an `action` parameter:

```
monica_contact(action: "list" | "get" | "create" | "update" | "delete", ...)
```

Result: **29 tools** instead of 150+, ~10-15K tokens for definitions, and better tool selection accuracy.

### Safety by design

- **Delete is an action, not a tool** — the AI must explicitly pass `action: "delete"` rather than calling a tool named "delete"
- **Read-only mode** — set `MONICA_READ_ONLY=true` to block all write operations
- **Delete protection** — set `MONICA_DISABLE_DELETE=true` to block only deletes
- **Tool exclusion** — set `MONICA_EXCLUDE_TOOLS=monica_contact,monica_tag` to remove specific tools
- **Read-only entities** — countries, currencies, genders have no create/update/delete actions
- **Delete warnings** — every tool description includes "⚠️ delete is irreversible"

## Quick Start

### npx (recommended)

```json
{
  "mcpServers": {
    "monica": {
      "command": "npx",
      "args": ["-y", "monica-mcp"],
      "env": {
        "MONICA_BASE_URL": "https://your-monica-instance.com",
        "MONICA_API_TOKEN": "your-bearer-token"
      }
    }
  }
}
```

### Read-only mode (recommended for exploration)

```json
{
  "mcpServers": {
    "monica": {
      "command": "npx",
      "args": ["-y", "monica-mcp"],
      "env": {
        "MONICA_BASE_URL": "https://your-monica-instance.com",
        "MONICA_API_TOKEN": "your-bearer-token",
        "MONICA_READ_ONLY": "true"
      }
    }
  }
}
```

### Local development

```bash
git clone https://github.com/philipp-mlr/monica-mcp.git
cd monica-mcp
npm install
npm run build
MONICA_BASE_URL=https://your-monica-instance.com MONICA_API_TOKEN=your-token node dist/index.js
```

## Configuration

| Environment Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONICA_API_TOKEN` | Yes | — | Bearer token for Monica API |
| `MONICA_BASE_URL` | No | `https://app.monicahq.com` | Your Monica instance URL |
| `MONICA_READ_ONLY` | No | `false` | Block all create/update/delete operations |
| `MONICA_DISABLE_DELETE` | No | `false` | Block only delete operations |
| `MONICA_EXCLUDE_TOOLS` | No | — | Comma-separated tool names to exclude |

### Getting an API token

In Monica, go to **Settings → API → Create New Token**. Copy the generated Bearer token.

## Tool Reference

All 29 tools use an `action` parameter. Available actions vary per entity — see each tool's description for details.

### Contact Management

| Tool | Actions | Description |
|------|---------|-------------|
| `monica_contact` | list, get, create, update, delete, search, set_tags, update_career, list_activities, list_calls, list_addresses, list_notes, list_tasks, list_reminders, list_gifts, list_debts, list_relationships, list_conversations, list_photos, list_documents, list_fields, list_audit_logs, assign_tag, remove_tag | Full contact management with 15+ contact-scoped sub-queries |
| `monica_address` | list, get, create, update, delete | Address CRUD |
| `monica_contact_field` | list, get, create, update, delete | Contact field CRUD (email, phone, etc.) |
| `monica_contact_field_type` | list, get, create, update, delete | Contact field type CRUD |
| `monica_company` | list, get, create, update, delete | Company CRUD |
| `monica_occupation` | list, get, create, update, delete | Occupation CRUD |
| `monica_group` | list, get, create, update, delete | Contact group CRUD |

### Communication

| Tool | Actions | Description |
|------|---------|-------------|
| `monica_activity` | list, get, create, update, delete | Activity CRUD |
| `monica_activity_type` | list, get, create, update, delete | Activity type CRUD |
| `monica_activity_type_category` | list, get | Activity type categories (read-only) |
| `monica_call` | list, get, create, update, delete | Call log CRUD |
| `monica_conversation` | list, get, create, update, delete, list_messages, add_message, update_message, delete_message | Conversation + message threading |

### Productivity

| Tool | Actions | Description |
|------|---------|-------------|
| `monica_note` | list, get, create, update, delete | Note CRUD |
| `monica_task` | list, get, create, update, delete | Task CRUD |
| `monica_reminder` | list, get, create, update, delete | Reminder CRUD |
| `monica_tag` | list, get, create, update, delete | Tag CRUD |
| `monica_journal_entry` | list, get, create, update, delete | Journal entry CRUD |

### Professional & Financial

| Tool | Actions | Description |
|------|---------|-------------|
| `monica_relationship` | list, get, create, update, delete | Relationship CRUD |
| `monica_relationship_type` | list, get | Relationship types (read-only per API) |
| `monica_relationship_type_group` | list, get | Relationship type groups (read-only per API) |
| `monica_gift` | list, get, create, update, delete, associate_photo | Gift CRUD + photo association |
| `monica_debt` | list, get, create, update, delete | Debt CRUD |

### Reference Data (read-only)

| Tool | Actions | Description |
|------|---------|-------------|
| `monica_country` | list, get | Countries |
| `monica_currency` | list, get | Currencies |
| `monica_gender` | list, get | Genders |
| `monica_audit_log` | list | Audit logs |
| `monica_user` | get | Authenticated user info |
| `monica_photo` | list, get | Photos (upload not supported by Monica API) |
| `monica_document` | list, get | Documents (upload not supported by Monica API) |

## API Limitations

| Feature | Status | Reason |
| --- | --- | --- |
| Photo upload | Not supported | Monica API returns 405 |
| Document upload | Not supported | Monica API returns 405 |

## Tech Stack

- **Node.js 18+** — runtime
- **TypeScript** — type safety
- **@modelcontextprotocol/sdk** — MCP protocol implementation
- **Zod** — input validation
- **Vitest** — testing

## Development

```bash
npm run dev              # Start with hot reload (tsx watch)
npm run typecheck        # Type-check without emitting
npm test                 # Run tests (26 tests)
npm test -- --coverage   # Run tests with coverage
```

## Publishing to npm

This package is published to [npmjs.com](https://www.npmjs.com/package/monica-mcp) for `npx` usage.

### First-time setup

```bash
# 1. Create an npm account at https://www.npmjs.com/signup
# 2. Login on the CLI
npm login

# 3. Verify you're logged in
npm whoami
```

### Publishing a new version

```bash
# 1. Bump the version in package.json
npm version patch   # 0.1.0 → 0.1.1 (bug fixes)
npm version minor   # 0.1.0 → 0.2.0 (new features, backwards compatible)
npm version major   # 0.1.0 → 1.0.0 (breaking changes)

# 2. Build and publish
npm run build
npm publish

# Or dry-run first to see what gets published:
npm publish --dry-run
```

### CI/CD auto-publish

The included GitHub Actions workflow (`.github/workflows/ci.yml`) auto-publishes to npm when a commit on `main` starts with `release`. To use this:

1. Create an npm access token at https://www.npmjs.com/settings/~/tokens (type: Automation)
2. Add it as a GitHub secret: `NPM_TOKEN`
3. Push a commit: `git commit -m "release: v0.1.1"`

## License

MIT
