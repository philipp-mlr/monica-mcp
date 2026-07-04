#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MonicaClient } from "./client.js";
import type { ToolDef } from "./factory.js";
import contacts from "./tools/contacts.js";
import communication from "./tools/communication.js";
import organizations from "./tools/organizations.js";
import productivity from "./tools/productivity.js";
import relationships from "./tools/relationships.js";
import reference from "./tools/reference.js";

// ── Environment ──

const baseUrl = process.env.MONICA_BASE_URL ?? "https://app.monicahq.com";
const token = process.env.MONICA_API_TOKEN ?? "";

if (!token) {
  console.error("MONICA_API_TOKEN environment variable is required");
  process.exit(1);
}

// ── Security configuration ──
// MONICA_READ_ONLY=true     → blocks all create/update/delete tools
// MONICA_DISABLE_DELETE=true → blocks only delete tools
// MONICA_EXCLUDE_TOOLS=a,b  → removes specific tools by name

const readOnly = process.env.MONICA_READ_ONLY === "true";
const disableDelete = process.env.MONICA_DISABLE_DELETE === "true";
const excludedTools = (process.env.MONICA_EXCLUDE_TOOLS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isWriteTool(name: string): boolean {
  return name.includes("_create_") || name.includes("_update_") || name.includes("_delete_") || name.includes("_set_") || name.includes("_assign_") || name.includes("_add_") || name.includes("_remove_") || name.includes("_associate_");
}

function isDeleteTool(name: string): boolean {
  return name.includes("_delete_");
}

// ── Tool filtering ──

const allTools: ToolDef[] = [
  ...contacts,
  ...communication,
  ...organizations,
  ...productivity,
  ...relationships,
  ...reference,
];

const activeTools = allTools.filter((tool) => {
  if (excludedTools.includes(tool.name)) return false;
  if (readOnly && isWriteTool(tool.name)) return false;
  if (disableDelete && isDeleteTool(tool.name)) return false;
  return true;
});

if (readOnly) {
  console.error("[monica-mcp] Read-only mode enabled — write tools are disabled");
}
if (disableDelete) {
  console.error("[monica-mcp] Delete tools are disabled");
}
if (excludedTools.length > 0) {
  console.error(`[monica-mcp] Excluded tools: ${excludedTools.join(", ")}`);
}

const client = new MonicaClient({ baseUrl, token });

const server = new Server(
  { name: "monica-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

// ── List tools ──

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: activeTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: "object" as const,
        properties: Object.fromEntries(
          Object.entries(tool.schema.shape).map(([key, val]) => [
            key,
            {
              type: (val as { _def: { typeName: string } })._def?.typeName === "ZodNumber"
                ? "number"
                : (val as { _def: { typeName: string } })._def?.typeName === "ZodBoolean"
                ? "boolean"
                : (val as { _def: { typeName: string } })._def?.typeName === "ZodArray"
                ? "array"
                : "string",
              description: (val as { description?: string }).description,
            },
          ]),
        ),
        required: Object.entries(tool.schema.shape)
          .filter(([, val]) => !(val as { isOptional: () => boolean }).isOptional())
          .map(([key]) => key),
      },
    })),
  };
});

// ── Call tool ──

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;

  // Safety check: even if the client sends a blocked tool name, refuse it
  if (excludedTools.includes(toolName)) {
    return {
      content: [{ type: "text", text: `Tool '${toolName}' is excluded by MONICA_EXCLUDE_TOOLS configuration.` }],
      isError: true,
    };
  }
  if (readOnly && isWriteTool(toolName)) {
    return {
      content: [{ type: "text", text: `Tool '${toolName}' is blocked in read-only mode (MONICA_READ_ONLY=true).` }],
      isError: true,
    };
  }
  if (disableDelete && isDeleteTool(toolName)) {
    return {
      content: [{ type: "text", text: `Delete tool '${toolName}' is blocked (MONICA_DISABLE_DELETE=true).` }],
      isError: true,
    };
  }

  const tool = activeTools.find((t) => t.name === toolName);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
      isError: true,
    };
  }

  try {
    const args = request.params.arguments ?? {};
    const result = await tool.handler(client, args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
