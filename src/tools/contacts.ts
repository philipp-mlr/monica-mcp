import { z } from "zod";
import { makeEntityTool, idSchema, type ToolDef } from "../factory.js";

const contactFields = {
  first_name: z.string().describe("First name"),
  last_name: z.string().nullable().describe("Last name"),
  nickname: z.string().describe("Nickname"),
  gender_id: z.number().int().describe("Gender ID"),
  is_partial: z.boolean().describe("Whether this is a partial contact"),
  is_birthdate_known: z.boolean().describe("Whether birthdate is known"),
  birthdate: z.string().nullable().describe("Birthdate (YYYY-MM-DD)"),
  birthdate_is_age_based: z.boolean(),
  birthdate_is_year_unknown: z.boolean(),
  birthdate_age: z.number().int().nullable(),
  is_deceased: z.boolean().describe("Whether contact is deceased"),
  is_deceased_date_known: z.boolean().describe("Whether deceased date is known"),
  deceased_date: z.string().nullable(),
  job: z.string().nullable(),
  company: z.string().nullable(),
  food_preferencies: z.string().nullable(),
  stay_in_touch_frequency: z.number().int().nullable(),
};

const contactSchema = z.object(contactFields);

const contactTool = makeEntityTool({
  entityName: "contact",
  basePath: "/contacts",
  createSchema: contactSchema,
  listParams: {
    query: z.string().optional().describe("Search query (searches name, nickname, email, job, company)"),
    sort: z.string().optional().describe("Sort: created_at, -created_at, updated_at, -updated_at"),
    tag_id: z.number().int().optional().describe("Filter by tag ID"),
  },
  extraActions: {
    search: {
      description: "Search contacts by name, nickname, email, job, or company.",
      handler: async (client, args) => client.list("/contacts", args),
    },
    set_tags: {
      description: "Set tags on a contact by name. Automatically creates tags that don't exist yet. Adds tags without removing existing ones.",
      schema: {
        tags: z.array(z.string()).describe("Array of tag names to set"),
      },
      handler: async (client, args) =>
        client.create(`/contacts/${args.id}/setTags`, { tags: args.tags }),
    },
    update_career: {
      description: "Update a contact's career (job and company).",
      schema: {
        job: z.string().nullable().describe("Job title"),
        company: z.string().nullable().describe("Company name"),
      },
      handler: async (client, args) => {
        const { id, ...data } = args;
        return client.update(`/contacts/${id}/work`, data);
      },
    },
    list_activities: {
      description: "List activities for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/activities`, args),
    },
    list_calls: {
      description: "List calls for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/calls`, args),
    },
    list_addresses: {
      description: "List addresses for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/addresses`, args),
    },
    list_notes: {
      description: "List notes for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/notes`, args),
    },
    list_tasks: {
      description: "List tasks for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/tasks`, args),
    },
    list_reminders: {
      description: "List reminders for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/reminders`, args),
    },
    list_gifts: {
      description: "List gifts for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/gifts`, args),
    },
    list_debts: {
      description: "List debts for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/debts`, args),
    },
    list_relationships: {
      description: "List relationships for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/relationships`),
    },
    list_conversations: {
      description: "List conversations for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/conversations`, args),
    },
    list_photos: {
      description: "List photos for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/photos`, args),
    },
    list_documents: {
      description: "List documents for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/documents`, args),
    },
    list_fields: {
      description: "List contact fields (email, phone, etc.) for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/contactfields`),
    },
    list_audit_logs: {
      description: "Get audit logs for a contact.",
      handler: async (client, args) => client.list(`/contacts/${args.id}/auditlogs`),
    },
    assign_tag: {
      description: "Assign a tag to a contact.",
      schema: { tag_id: idSchema.describe("Tag ID to assign") },
      handler: async (client, args) => client.create(`/contacts/${args.id}/tags`, { tag_id: args.tag_id }),
    },
    remove_tag: {
      description: "Remove a tag from a contact.",
      schema: { tag_id: idSchema.describe("Tag ID to remove") },
      handler: async (client, args) => client.delete(`/contacts/${args.id}/tags/${args.tag_id}`),
    },
  },
});

const contactTools: ToolDef[] = [contactTool];

export default contactTools;