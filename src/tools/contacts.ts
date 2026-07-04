import { z } from "zod";
import { makeCrudTools, idSchema, paginationSchema, type ToolDef } from "../factory.js";

const contactCreateSchema = z.object({
  first_name: z.string().describe("First name"),
  last_name: z.string().nullable().optional().describe("Last name"),
  nickname: z.string().optional().describe("Nickname"),
  gender_id: z.number().int().optional().describe("Gender ID"),
  is_partial: z.boolean().optional().describe("Whether this is a partial contact"),
  is_birthdate_known: z.boolean().describe("Whether birthdate is known"),
  birthdate: z.string().nullable().optional().describe("Birthdate (YYYY-MM-DD)"),
  birthdate_is_age_based: z.boolean().optional(),
  birthdate_is_year_unknown: z.boolean().optional(),
  birthdate_age: z.number().int().nullable().optional(),
  is_deceased: z.boolean().describe("Whether contact is deceased"),
  is_deceased_date_known: z.boolean().describe("Whether deceased date is known"),
  deceased_date: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  food_preferencies: z.string().nullable().optional(),
  stay_in_touch_frequency: z.number().int().nullable().optional(),
  ...paginationSchema,
});

const contactUpdateSchema = contactCreateSchema.extend({
  id: idSchema,
});

const contactTools: ToolDef[] = [
  // Standard CRUD
  ...makeCrudTools({
    entityName: "contact",
    basePath: "/contacts",
    createSchema: contactCreateSchema,
    updateSchema: contactUpdateSchema,
    listParams: {
      query: z.string().optional().describe("Search query"),
      sort: z.string().optional().describe("Sort: created_at, -created_at, updated_at, -updated_at"),
    },
  }),

  // Search contacts
  {
    name: "monica_search_contacts",
    description: "Search contacts by name, nickname, email, job, or company.",
    schema: z.object({
      query: z.string().describe("Search term"),
      ...paginationSchema,
    }),
    handler: async (client, args) => {
      return client.list("/contacts", args);
    },
  },

  // List contacts by tag
  {
    name: "monica_list_contacts_by_tag",
    description: "List all contacts associated with a specific tag.",
    schema: z.object({
      tag_id: idSchema,
      ...paginationSchema,
    }),
    handler: async (client, args) => {
      return client.list(`/tags/${args.tag_id}/contacts`, args);
    },
  },

  // Set tags on a contact (bulk, auto-creates tags that don't exist)
  {
    name: "monica_set_contact_tags",
    description: "Set tags on a contact by name. Automatically creates tags that don't exist yet. Adds tags without removing existing ones.",
    schema: z.object({
      contact_id: idSchema,
      tags: z.array(z.string()).describe("List of tag names to set"),
    }),
    handler: async (client, args) => {
      return client.create(`/contacts/${args.contact_id}/setTags`, { tags: args.tags });
    },
  },

  // Get contact audit logs
  {
    name: "monica_get_contact_audit_logs",
    description: "Get audit logs for a specific contact.",
    schema: z.object({ id: idSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.id}/auditlogs`);
    },
  },

  // Update contact career
  {
    name: "monica_update_contact_career",
    description: "Update a contact's career (job and company).",
    schema: z.object({
      id: idSchema,
      job: z.string().nullable().describe("Job title"),
      company: z.string().nullable().describe("Company name"),
    }),
    handler: async (client, args) => {
      const { id, ...data } = args;
      return client.update(`/contacts/${id}/work`, data);
    },
  },

  // ── Contact-scoped sub-resources ──

  // List activities for a contact
  {
    name: "monica_list_contact_activities",
    description: "List all activities for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/activities`, args);
    },
  },

  // List calls for a contact
  {
    name: "monica_list_contact_calls",
    description: "List all calls for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/calls`, args);
    },
  },

  // List addresses for a contact
  {
    name: "monica_list_contact_addresses",
    description: "List all addresses for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/addresses`, args);
    },
  },

  // List notes for a contact
  {
    name: "monica_list_contact_notes",
    description: "List all notes for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/notes`, args);
    },
  },

  // List tasks for a contact
  {
    name: "monica_list_contact_tasks",
    description: "List all tasks for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/tasks`, args);
    },
  },

  // List reminders for a contact
  {
    name: "monica_list_contact_reminders",
    description: "List all reminders for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/reminders`, args);
    },
  },

  // List gifts for a contact
  {
    name: "monica_list_contact_gifts",
    description: "List all gifts for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/gifts`, args);
    },
  },

  // List debts for a contact
  {
    name: "monica_list_contact_debts",
    description: "List all debts for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/debts`, args);
    },
  },

  // List relationships for a contact
  {
    name: "monica_list_contact_relationships",
    description: "List all relationships for a specific contact.",
    schema: z.object({ contact_id: idSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/relationships`);
    },
  },

  // List conversations for a contact
  {
    name: "monica_list_contact_conversations",
    description: "List all conversations for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/conversations`, args);
    },
  },

  // List photos for a contact
  {
    name: "monica_list_contact_photos",
    description: "List all photos for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/photos`, args);
    },
  },

  // List documents for a contact
  {
    name: "monica_list_contact_documents",
    description: "List all documents for a specific contact.",
    schema: z.object({ contact_id: idSchema, ...paginationSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/documents`, args);
    },
  },

  // List contact fields for a contact
  {
    name: "monica_list_fields_for_contact",
    description: "List all contact fields (email, phone, etc.) for a specific contact.",
    schema: z.object({ contact_id: idSchema }),
    handler: async (client, args) => {
      return client.list(`/contacts/${args.contact_id}/contactfields`);
    },
  },
];

export default contactTools;
