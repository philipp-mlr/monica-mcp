import { z } from "zod";
import type { MonicaClient } from "./client.js";

export type ToolHandler = (client: MonicaClient, args: any) => Promise<unknown>;

export interface ToolDef {
  name: string;
  description: string;
  schema: z.ZodObject<z.ZodRawShape>;
  handler: ToolHandler;
}

// ── Shared schemas ──

export const paginationSchema = {
  limit: z.number().int().min(1).max(100).optional().describe("Page size (max 100)"),
  page: z.number().int().min(1).optional().describe("Page number"),
};

export const idSchema = z.number().int().positive().describe("Entity ID");

// ── Action-based entity tool factory ──
//
// Design: instead of 5 separate tools per entity (list/get/create/update/delete),
// we produce ONE tool that takes an `action` parameter. This:
//
// 1. Reduces tool count by ~5x (146 → ~30 tools)
// 2. Each tool definition is ~300-500 tokens — 30 tools = ~10-15K tokens vs ~50K+
// 3. Delete is an action choice, not a separate tool — harder to trigger accidentally
// 4. The AI sees fewer options = better tool selection (research shows degradation >15-20 tools)
//
// The tradeoff: the AI must correctly choose `action` AND fill the right fields.
// We mitigate this with clear descriptions and the action enum.

export type EntityAction = "list" | "get" | "create" | "update" | "delete";

export function makeEntityTool(opts: {
  entityName: string;
  basePath: string;
  actions?: EntityAction[];
  createSchema?: z.ZodObject<z.ZodRawShape>;
  listParams?: Record<string, z.ZodTypeAny>;
  extraActions?: Record<string, {
    description: string;
    handler: (client: MonicaClient, args: any) => Promise<unknown>;
    schema?: Record<string, z.ZodTypeAny>;
  }>;
}): ToolDef {
  const { entityName, basePath } = opts;
  const actions = opts.actions ?? ["list", "get", "create", "update", "delete"];
  const hasCreate = actions.includes("create") && opts.createSchema;
  const hasUpdate = actions.includes("update") && opts.createSchema;
  const extraActions = opts.extraActions ?? {};

  // Build the action enum — includes standard + extra actions
  const allActionNames = [...actions, ...Object.keys(extraActions)];
  const actionEnum = z.enum(allActionNames as [string, ...string[]]);

  // Build the combined schema
  const schemaShape: z.ZodRawShape = {
    action: actionEnum.describe(
      `Operation to perform: ${allActionNames.join(" | ")}. ` +
      `"list" = paginated list, "get" = by ID, "create" = new record, ` +
      `"update" = modify by ID, "delete" = remove by ID (irreversible).`
    ),
  };

  // ID — required for get/update/delete
  if (actions.some(a => ["get", "update", "delete"].includes(a))) {
    schemaShape.id = idSchema.optional().describe(`Entity ID (required for get/update/delete)`);
  }

  // Pagination — for list
  if (actions.includes("list")) {
    Object.assign(schemaShape, paginationSchema);
    if (opts.listParams) {
      Object.assign(schemaShape, opts.listParams);
    }
  }

  // Create/update fields — spread from createSchema, all made optional
  if (hasCreate || hasUpdate) {
    for (const [key, val] of Object.entries(opts.createSchema!.shape)) {
      // Skip 'id' — we already added it above
      if (key === "id") continue;
      const zodVal = val as z.ZodTypeAny;
      // Make all fields optional in the combined schema
      schemaShape[key] = zodVal.optional();
    }
  }

  // Extra action params
  for (const [actionName, actionDef] of Object.entries(extraActions)) {
    if (actionDef.schema) {
      for (const [key, val] of Object.entries(actionDef.schema)) {
        schemaShape[key] = val;
      }
    }
  }

  const schema = z.object(schemaShape);

  // Build description
  const capabilities = actions.join(", ");
  let desc = `Manage ${entityName}s. Actions: ${capabilities}.`;
  if (actions.includes("delete")) {
    desc += ` ⚠️ delete is irreversible.`;
  }
  if (Object.keys(extraActions).length > 0) {
    desc += ` Additional actions: ${Object.keys(extraActions).join(", ")}.`;
  }

  // Build handler
  const handler: ToolHandler = async (client, args) => {
    const action = args.action as string;

    switch (action) {
      case "list": {
        const { action: _, id: __, ...params } = args;
        return client.list(basePath, params);
      }
      case "get":
        return client.getOne(`${basePath}/${args.id}`);
      case "create": {
        const { action: _, id: __, limit: ___, page: ____, ...data } = args;
        return client.create(basePath, data);
      }
      case "update": {
        const { action: _, id, limit: __, page: ___, ...data } = args;
        return client.update(`${basePath}/${id}`, data);
      }
      case "delete":
        return client.delete(`${basePath}/${args.id}`);
      default:
        // Extra actions
        if (extraActions[action]) {
          return extraActions[action].handler(client, args);
        }
        throw new Error(`Unknown action: ${action}`);
    }
  };

  return { name: `monica_${entityName}`, description: desc, schema, handler };
}

// ── Read-only entity tool (list + get only) ──

export function makeReadOnlyTool(opts: {
  entityName: string;
  basePath: string;
  pluralName?: string;
}): ToolDef {
  return makeEntityTool({
    entityName: opts.entityName,
    basePath: opts.basePath,
    actions: ["list", "get"],
  });
}
