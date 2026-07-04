import { z } from "zod";
import type { MonicaClient } from "./client.js";

export type ToolHandler = (client: MonicaClient, args: any) => Promise<unknown>;

export interface ToolDef {
  name: string;
  description: string;
  schema: z.ZodObject<z.ZodRawShape>;
  handler: ToolHandler;
}

// ── Pagination schema (shared) ──

export const paginationSchema = {
  limit: z.number().int().min(1).max(100).optional().describe("Page size (max 100)"),
  page: z.number().int().min(1).optional().describe("Page number"),
};

// ── ID schema (shared) ──

export const idSchema = z.number().int().positive().describe("Entity ID");

// ── Generic CRUD factory ──
// Generates list/get/create/update/delete tools for a given entity.
// `basePath` is the API path e.g. "/contacts"
// `entityName` is the human name e.g. "contact"
// `createSchema` and `updateSchema` are zod objects for input validation.

export function makeCrudTools(opts: {
  entityName: string;
  basePath: string;
  pluralName?: string;
  createSchema?: z.ZodObject<z.ZodRawShape>;
  updateSchema?: z.ZodObject<z.ZodRawShape>;
  listParams?: Record<string, z.ZodTypeAny>;
}): ToolDef[] {
  const tools: ToolDef[] = [];
  const { entityName, basePath } = opts;
  const plural = opts.pluralName ?? `${entityName}s`;

  // List
  tools.push({
    name: `monica_list_${plural}`,
    description: `List all ${plural} in your account. Supports pagination.`,
    schema: z.object({
      ...paginationSchema,
      ...(opts.listParams ?? {}),
    }),
    handler: async (client, args) => {
      return client.list(basePath, args);
    },
  });

  // Get
  tools.push({
    name: `monica_get_${entityName}`,
    description: `Get a specific ${entityName} by ID.`,
    schema: z.object({ id: idSchema }),
    handler: async (client, args) => {
      return client.getOne(`${basePath}/${args.id}`);
    },
  });

  // Create
  if (opts.createSchema) {
    tools.push({
      name: `monica_create_${entityName}`,
      description: `Create a new ${entityName}.`,
      schema: opts.createSchema,
      handler: async (client, args) => {
        return client.create(basePath, args);
      },
    });
  }

  // Update
  if (opts.updateSchema) {
    tools.push({
      name: `monica_update_${entityName}`,
      description: `Update an existing ${entityName}.`,
      schema: opts.updateSchema,
      handler: async (client, args) => {
        const { id, ...data } = args;
        return client.update(`${basePath}/${id}`, data);
      },
    });
  }

  // Delete
  tools.push({
    name: `monica_delete_${entityName}`,
    description: `Delete a ${entityName} by ID.`,
    schema: z.object({ id: idSchema }),
    handler: async (client, args) => {
      return client.delete(`${basePath}/${args.id}`);
    },
  });

  return tools;
}
