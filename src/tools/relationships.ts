import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Relationships ──

const relationshipCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  relationship_type_id: z.number().int().describe("Relationship type ID"),
});

const relationshipUpdateSchema = relationshipCreateSchema.extend({ id: idSchema });

const relationshipTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship",
    basePath: "/relationships",
    createSchema: relationshipCreateSchema,
    updateSchema: relationshipUpdateSchema,
  }),
];

// ── Relationship Types ──

const relationshipTypeCreateSchema = z.object({
  name: z.string().max(255).describe("Relationship type name (e.g. 'partner')"),
  name_reverse_relationship: z.string().max(255).describe("Reverse name (e.g. 'partner')"),
  relationship_type_group_id: z.number().int().describe("Relationship type group ID"),
});

const relationshipTypeUpdateSchema = relationshipTypeCreateSchema.extend({ id: idSchema });

const relationshipTypeTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship_type",
    basePath: "/relationshiptypes",
    pluralName: "relationship_types",
    createSchema: relationshipTypeCreateSchema,
    updateSchema: relationshipTypeUpdateSchema,
  }),
];

// ── Relationship Type Groups ──

const relationshipTypeGroupCreateSchema = z.object({
  name: z.string().max(255).describe("Group name (e.g. 'Family', 'Friend', 'Work')"),
});

const relationshipTypeGroupUpdateSchema = relationshipTypeGroupCreateSchema.extend({ id: idSchema });

const relationshipTypeGroupTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship_type_group",
    basePath: "/relationshiptypegroups",
    pluralName: "relationship_type_groups",
    createSchema: relationshipTypeGroupCreateSchema,
    updateSchema: relationshipTypeGroupUpdateSchema,
  }),
];

// ── Gifts ──

const giftCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  name: z.string().max(255).describe("Gift name"),
  comment: z.string().nullable().optional().describe("Gift comment"),
  url: z.string().nullable().optional().describe("Gift URL"),
  amount: z.number().nullable().optional().describe("Gift amount"),
  status: z.string().optional().describe("Gift status: idea, received, offered"),
});

const giftUpdateSchema = giftCreateSchema.extend({ id: idSchema });

const giftTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "gift",
    basePath: "/gifts",
    createSchema: giftCreateSchema,
    updateSchema: giftUpdateSchema,
  }),
];

// ── Debts ──

const debtCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  amount: z.number().describe("Debt amount"),
  in_debt: z.string().describe("Who is in debt: 'me' or 'contact'"),
  reason: z.string().nullable().optional().describe("Debt reason"),
});

const debtUpdateSchema = debtCreateSchema.extend({ id: idSchema });

const debtTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "debt",
    basePath: "/debts",
    createSchema: debtCreateSchema,
    updateSchema: debtUpdateSchema,
  }),
];

export default [
  ...relationshipTools,
  ...relationshipTypeTools,
  ...relationshipTypeGroupTools,
  ...giftTools,
  ...debtTools,
];
