import { z } from "zod";
import { makeEntityTool, idSchema, type ToolDef } from "../factory.js";

const relationshipFields = {
  contact_is: z.number().int().describe("ID of the primary contact"),
  relationship_type_id: z.number().int().describe("Relationship type ID"),
  of_contact: z.number().int().describe("ID of the secondary contact"),
};

const giftFields = {
  contact_id: z.number().int().describe("Contact ID"),
  recipient_id: z.number().int().nullable().describe("ID of the contact the gift is for (partner/child)"),
  name: z.string().max(255).describe("Gift name"),
  comment: z.string().nullable().describe("Gift comment"),
  url: z.string().nullable().describe("Gift URL"),
  amount: z.string().nullable().describe("Gift amount"),
  status: z.string().describe("Gift status: idea, received, offered"),
  date: z.string().nullable().describe("Gift date (YYYY-MM-DD)"),
};

const giftTool = makeEntityTool({
  entityName: "gift",
  basePath: "/gifts",
  createSchema: z.object(giftFields),
  extraActions: {
    associate_photo: {
      description: "Associate a photo with a gift.",
      schema: { photo_id: idSchema.describe("Photo ID to associate") },
      handler: async (client, args) => client.update(`/gifts/${args.id}/photo/${args.photo_id}`, {}),
    },
  },
});

const debtFields = {
  contact_id: z.number().int().describe("Contact ID"),
  in_debt: z.string().describe("Who is in debt: 'yes' (user owes contact) or 'no' (contact owes user)"),
  status: z.string().describe("Debt status: 'inprogress' or 'complete'"),
  amount: z.number().describe("Debt amount"),
  reason: z.string().nullable().describe("Debt reason"),
};

export default [
  makeEntityTool({ entityName: "relationship", basePath: "/relationships", createSchema: z.object(relationshipFields) }),
  makeEntityTool({ entityName: "relationship_type", basePath: "/relationshiptypes", actions: ["list", "get"] }),
  makeEntityTool({ entityName: "relationship_type_group", basePath: "/relationshiptypegroups", actions: ["list", "get"] }),
  giftTool,
  makeEntityTool({ entityName: "debt", basePath: "/debts", createSchema: z.object(debtFields) }),
] as ToolDef[];