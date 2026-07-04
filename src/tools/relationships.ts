import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Relationships ──
// Note: create uses contact_is + of_contact (not contact_id)

const relationshipCreateSchema = z.object({
  contact_is: z.number().int().describe("ID of the primary contact"),
  relationship_type_id: z.number().int().describe("Relationship type ID"),
  of_contact: z.number().int().describe("ID of the secondary contact"),
});

const relationshipUpdateSchema = z.object({
  id: idSchema,
  contact_is: z.number().int().optional().describe("ID of the primary contact"),
  relationship_type_id: z.number().int().optional().describe("Relationship type ID"),
  of_contact: z.number().int().optional().describe("ID of the secondary contact"),
});

const relationshipTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship",
    basePath: "/relationships",
    createSchema: relationshipCreateSchema,
    updateSchema: relationshipUpdateSchema,
  }),
];

// ── Relationship Types ── (read-only per API docs)

const relationshipTypeTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship_type",
    basePath: "/relationshiptypes",
    pluralName: "relationship_types",
  }),
];

// ── Relationship Type Groups ── (read-only per API docs)

const relationshipTypeGroupTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "relationship_type_group",
    basePath: "/relationshiptypegroups",
    pluralName: "relationship_type_groups",
  }),
];

// ── Gifts ──

const giftCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  recipient_id: z.number().int().nullable().optional().describe("ID of the contact the gift is for (partner/child)"),
  name: z.string().max(255).describe("Gift name"),
  comment: z.string().nullable().optional().describe("Gift comment"),
  url: z.string().nullable().optional().describe("Gift URL"),
  amount: z.string().nullable().optional().describe("Gift amount"),
  status: z.string().optional().describe("Gift status: idea, received, offered"),
  date: z.string().nullable().optional().describe("Gift date (YYYY-MM-DD)"),
});

const giftUpdateSchema = giftCreateSchema.extend({ id: idSchema });

const giftTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "gift",
    basePath: "/gifts",
    createSchema: giftCreateSchema,
    updateSchema: giftUpdateSchema,
  }),

  // Associate a photo to a gift
  {
    name: "monica_associate_gift_photo",
    description: "Associate a photo with a gift.",
    schema: z.object({
      gift_id: idSchema,
      photo_id: idSchema,
    }),
    handler: async (client, args) => {
      return client.update(`/gifts/${args.gift_id}/photo/${args.photo_id}`, {});
    },
  },
];

// ── Debts ──

const debtCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  in_debt: z.string().describe("Who is in debt: 'yes' (user owes contact) or 'no' (contact owes user)"),
  status: z.string().describe("Debt status: 'inprogress' or 'complete'"),
  amount: z.number().describe("Debt amount"),
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
