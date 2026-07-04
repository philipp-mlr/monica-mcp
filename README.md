# monica-mcp

A full-coverage [Model Context Protocol](https://modelcontextprotocol.io) server for [Monica CRM](https://www.monicahq.com/). 130+ operations across all 30 API endpoints — search contacts, log activities, manage notes/tasks/reminders, track relationships, and more.

Designed for AI assistants like Claude Desktop, Hermes, Cline, and any MCP-compatible client.

## Features

- **Full API coverage** — all 30 Monica API endpoints, not just the common ones
- **130+ tools** — list, get, create, update, delete for every entity type
- **Contact-scoped queries** — list activities, notes, calls, tasks, etc. for any contact
- **Search** — find contacts by name, email, job, company
- **Tag management** — assign/remove tags on contacts
- **Conversation threading** — list conversations and add messages
- **Lightweight** — pure Node.js, ~50MB RAM, sub-second startup
- **npx-ready** — no clone or build required

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

### Local development

```bash
git clone https://github.com/philipp-mlr/monica-mcp.git
cd monica-mcp
npm install
npm run build
node dist/index.js
```

## Configuration

| Environment Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONICA_API_TOKEN` | Yes | — | Bearer token for Monica API |
| `MONICA_BASE_URL` | No | `https://app.monicahq.com` | Your Monica instance URL |

### Getting an API token

In Monica, go to **Settings → API → Create New Token**. Copy the generated Bearer token.

## Tool Categories

### Contact Management (32 tools)
Contacts, contact fields, contact field types, addresses, groups, occupations — full CRUD plus contact-scoped queries for activities, calls, notes, tasks, reminders, gifts, debts, relationships, conversations, photos, documents, and audit logs.

### Communication (29 tools)
Activities, activity types, activity type categories, calls, conversations, conversation messages — full CRUD plus message threading.

### Productivity (25 tools)
Notes, tasks, reminders, tags (with contact assignment), groups, journal entries — full CRUD.

### Professional (19 tools)
Companies, relationships, relationship types, relationship type groups — full CRUD.

### Financial (20 tools)
Gifts, debts, documents, photos — CRUD where supported (photo/document upload not supported by Monica API).

### Reference Data (9 tools)
Countries, currencies, genders, audit logs — read-only. Plus user info.

## API Limitations

The Monica API itself has two endpoints that return HTTP 405:

| Feature | Status | Reason |
| --- | --- | --- |
| Photo upload | Not supported | Monica API returns 405 |
| Document upload | Not supported | Monica API returns 405 |

All other operations work as documented.

## Tech Stack

- **Node.js 18+** — runtime
- **TypeScript** — type safety
- **@modelcontextprotocol/sdk** — MCP protocol implementation
- **Zod** — input validation
- **Vitest** — testing

## Development

```bash
npm run dev          # Start with hot reload (tsx watch)
npm run typecheck    # Type-check without emitting
npm test             # Run tests
npm test -- --coverage  # Run tests with coverage
```

## License

MIT
