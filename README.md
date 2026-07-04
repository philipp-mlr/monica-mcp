# monica-mcp

A full-coverage [Model Context Protocol](https://modelcontextprotocol.io) server for [Monica CRM](https://www.monicahq.com/). 146 tools across all 30 API endpoints — search contacts, log activities, manage notes/tasks/reminders, track relationships, and more.

Designed for AI assistants like Claude Desktop, Hermes, Cline, and any MCP-compatible client.

> **Note:** This project is 100% AI-generated. The code, tests, CI/CD, and documentation were all written by an AI agent (Hermes). No human wrote any of the code.

## Features

- **Full API coverage** — all 30 Monica API endpoints, not just the common ones
- **146 tools** — list, get, create, update, delete for every entity type
- **Contact-scoped queries** — list activities, notes, calls, tasks, etc. for any contact
- **Search** — find contacts by name, email, job, company
- **Tag management** — assign/remove tags on contacts, bulk set tags by name
- **Conversation threading** — list conversations, add/update/delete messages
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
MONICA_BASE_URL=https://your-monica-instance.com MONICA_API_TOKEN=your-token node dist/index.js
```

## Configuration

| Environment Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONICA_API_TOKEN` | Yes | — | Bearer token for Monica API |
| `MONICA_BASE_URL` | No | `https://app.monicahq.com` | Your Monica instance URL |

### Getting an API token

In Monica, go to **Settings → API → Create New Token**. Copy the generated Bearer token.

## Tool Reference

### Contact Management (53 tools)

| Tool | Description |
|------|-------------|
| `monica_list_contacts` | List all contacts. Supports pagination, search query, and sorting. |
| `monica_get_contact` | Get a specific contact by ID. |
| `monica_create_contact` | Create a new contact. |
| `monica_update_contact` | Update an existing contact. |
| `monica_delete_contact` | Delete a contact by ID. |
| `monica_search_contacts` | Search contacts by name, nickname, email, job, or company. |
| `monica_list_contacts_by_tag` | List all contacts associated with a specific tag. |
| `monica_set_contact_tags` | Set tags on a contact by name. Auto-creates tags that don't exist. |
| `monica_get_contact_audit_logs` | Get audit logs for a specific contact. |
| `monica_update_contact_career` | Update a contact's career (job and company). |
| `monica_list_contact_activities` | List all activities for a specific contact. |
| `monica_list_contact_calls` | List all calls for a specific contact. |
| `monica_list_contact_addresses` | List all addresses for a specific contact. |
| `monica_list_contact_notes` | List all notes for a specific contact. |
| `monica_list_contact_tasks` | List all tasks for a specific contact. |
| `monica_list_contact_reminders` | List all reminders for a specific contact. |
| `monica_list_contact_gifts` | List all gifts for a specific contact. |
| `monica_list_contact_debts` | List all debts for a specific contact. |
| `monica_list_contact_relationships` | List all relationships for a specific contact. |
| `monica_list_contact_conversations` | List all conversations for a specific contact. |
| `monica_list_contact_photos` | List all photos for a specific contact. |
| `monica_list_contact_documents` | List all documents for a specific contact. |
| `monica_list_fields_for_contact` | List all contact fields (email, phone, etc.) for a specific contact. |
| `monica_list_addresses` | List all addresses. |
| `monica_get_address` / `monica_create_address` / `monica_update_address` / `monica_delete_address` | Address CRUD. |
| `monica_list_contact_fields` / `monica_get_contact_field` / `monica_create_contact_field` / `monica_update_contact_field` / `monica_delete_contact_field` | Contact field CRUD. |
| `monica_list_contact_field_types` / `monica_get_contact_field_type` / `monica_create_contact_field_type` / `monica_update_contact_field_type` / `monica_delete_contact_field_type` | Contact field type CRUD. |
| `monica_list_occupations` / `monica_get_occupation` / `monica_create_occupation` / `monica_update_occupation` / `monica_delete_occupation` | Occupation CRUD. |
| `monica_assign_tag_to_contact` | Assign a tag to a contact. |
| `monica_remove_tag_from_contact` | Remove a tag from a contact. |
| `monica_list_groups` / `monica_get_group` / `monica_create_group` / `monica_update_group` / `monica_delete_group` | Group CRUD. |

### Communication (27 tools)

| Tool | Description |
|------|-------------|
| `monica_list_activities` / `monica_get_activity` / `monica_create_activity` / `monica_update_activity` / `monica_delete_activity` | Activity CRUD. |
| `monica_list_activity_types` / `monica_get_activity_type` / `monica_create_activity_type` / `monica_update_activity_type` / `monica_delete_activity_type` | Activity type CRUD. |
| `monica_list_activity_type_categories` / `monica_get_activity_type_category` | Activity type category list/get (read-only). |
| `monica_list_calls` / `monica_get_call` / `monica_create_call` / `monica_update_call` / `monica_delete_call` | Call CRUD. |
| `monica_list_conversations` / `monica_get_conversation` / `monica_create_conversation` / `monica_update_conversation` / `monica_delete_conversation` | Conversation CRUD. |
| `monica_list_conversation_messages` | List all messages in a conversation. |
| `monica_add_conversation_message` | Add a message to a conversation. |
| `monica_update_conversation_message` | Update a message in a conversation. |
| `monica_delete_conversation_message` | Delete a message from a conversation. |

### Productivity (25 tools)

| Tool | Description |
|------|-------------|
| `monica_list_notes` / `monica_get_note` / `monica_create_note` / `monica_update_note` / `monica_delete_note` | Note CRUD. |
| `monica_list_tasks` / `monica_get_task` / `monica_create_task` / `monica_update_task` / `monica_delete_task` | Task CRUD. |
| `monica_list_reminders` / `monica_get_reminder` / `monica_create_reminder` / `monica_update_reminder` / `monica_delete_reminder` | Reminder CRUD. |
| `monica_list_tags` / `monica_get_tag` / `monica_create_tag` / `monica_update_tag` / `monica_delete_tag` | Tag CRUD. |
| `monica_list_journal_entries` / `monica_get_journal_entry` / `monica_create_journal_entry` / `monica_update_journal_entry` / `monica_delete_journal_entry` | Journal entry CRUD. |

### Professional (13 tools)

| Tool | Description |
|------|-------------|
| `monica_list_companies` / `monica_get_company` / `monica_create_company` / `monica_update_company` / `monica_delete_company` | Company CRUD. |
| `monica_list_relationships` / `monica_get_relationship` / `monica_create_relationship` / `monica_update_relationship` / `monica_delete_relationship` | Relationship CRUD. |
| `monica_list_relationship_types` / `monica_get_relationship_type` | Relationship type list/get (read-only per API). |
| `monica_list_relationship_type_groups` / `monica_get_relationship_type_group` | Relationship type group list/get (read-only per API). |

### Financial (17 tools)

| Tool | Description |
|------|-------------|
| `monica_list_gifts` / `monica_get_gift` / `monica_create_gift` / `monica_update_gift` / `monica_delete_gift` | Gift CRUD. |
| `monica_associate_gift_photo` | Associate a photo with a gift. |
| `monica_list_debts` / `monica_get_debt` / `monica_create_debt` / `monica_update_debt` / `monica_delete_debt` | Debt CRUD. |
| `monica_list_photos` / `monica_get_photo` / `monica_delete_photo` | Photo list/get/delete (upload not supported by Monica API). |
| `monica_list_documents` / `monica_get_document` / `monica_delete_document` | Document list/get/delete (upload not supported by Monica API). |

### Reference Data (11 tools)

| Tool | Description |
|------|-------------|
| `monica_list_countries` / `monica_get_country` | Country list/get. |
| `monica_list_currencies` / `monica_get_currency` | Currency list/get. |
| `monica_list_genders` / `monica_get_gender` | Gender list/get. |
| `monica_list_audit_logs` | List all audit logs. |
| `monica_get_user` | Get the authenticated user's info. |

## API Limitations

The Monica API itself has two endpoints that return HTTP 405:

| Feature | Status | Reason |
| --- | --- | --- |
| Photo upload | Not supported | Monica API returns 405 |
| Document upload | Not supported | Monica API returns 405 |

Relationship types and relationship type groups are read-only per the API docs — only list and get are available.

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
npm test                 # Run tests
npm test -- --coverage   # Run tests with coverage
```

## License

MIT
