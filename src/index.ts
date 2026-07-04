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

const allTools: ToolDef[] = [
  ...contacts,
  ...communication,
  ...organizations,
  ...productivity,
  ...relationships,
  ...reference,
];

const baseUrl = process.env.MONICA_BASE_URL ?? "https://app.monicahq.com";
const token = process.env.MONICA_API_TOKEN ?? "";

if (!token) {
  console.error("MONICA_API_TOKEN environment variable is required");
  process.exit(1);
}

const client = new MonicaClient({ baseUrl, token });

const server = new Server(
  { name: "monica-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: "object" as const,
        properties: Object.fromEntries(
          Object.entries(tool.schema.shape).map(([key, val]) => [
            key,
            { type: (val as { _def: { typeName: string } })._def?.typeName === "ZodNumber"
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
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
