import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Notes ──

const noteCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  body: z.string().describe("Note content"),
  is_favorited: z.boolean().optional().describe("Whether this note is favorited"),
});

const noteUpdateSchema = z.object({
  id: idSchema,
  body: z.string().optional().describe("Note content"),
  is_favorited: z.boolean().optional(),
});

const noteTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "note",
    basePath: "/notes",
    createSchema: noteCreateSchema,
    updateSchema: noteUpdateSchema,
  }),
];

// ── Tasks ──

const taskCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  title: z.string().max(255).describe("Task title"),
  description: z.string().nullable().optional().describe("Task description"),
  completed: z.boolean().optional().describe("Whether the task is completed"),
});

const taskUpdateSchema = taskCreateSchema.extend({ id: idSchema });

const taskTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "task",
    basePath: "/tasks",
    createSchema: taskCreateSchema,
    updateSchema: taskUpdateSchema,
  }),
];

// ── Reminders ──

const reminderCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  title: z.string().max(255).describe("Reminder title"),
  description: z.string().nullable().optional().describe("Reminder description"),
  frequency_type: z.string().describe("Frequency type: one_time, recurring, etc."),
  frequency_number: z.number().int().nullable().optional().describe("Frequency interval"),
  initial_date: z.string().describe("Initial date (YYYY-MM-DD)"),
});

const reminderUpdateSchema = reminderCreateSchema.extend({ id: idSchema });

const reminderTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "reminder",
    basePath: "/reminders",
    createSchema: reminderCreateSchema,
    updateSchema: reminderUpdateSchema,
  }),
];

// ── Tags ──

const tagCreateSchema = z.object({
  name: z.string().max(255).describe("Tag name"),
  description: z.string().nullable().optional().describe("Tag description"),
});

const tagUpdateSchema = tagCreateSchema.extend({ id: idSchema });

const tagTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "tag",
    basePath: "/tags",
    createSchema: tagCreateSchema,
    updateSchema: tagUpdateSchema,
  }),

  // Assign tag to contact
  {
    name: "monica_assign_tag_to_contact",
    description: "Assign a tag to a contact.",
    schema: z.object({
      contact_id: idSchema,
      tag_id: idSchema,
    }),
    handler: async (client, args) => {
      return client.create(`/contacts/${args.contact_id}/tags`, { tag_id: args.tag_id });
    },
  },

  // Remove tag from contact
  {
    name: "monica_remove_tag_from_contact",
    description: "Remove a tag from a contact.",
    schema: z.object({
      contact_id: idSchema,
      tag_id: idSchema,
    }),
    handler: async (client, args) => {
      return client.delete(`/contacts/${args.contact_id}/tags/${args.tag_id}`);
    },
  },
];

// ── Groups ──

const groupCreateSchema = z.object({
  name: z.string().max(255).describe("Group name"),
});

const groupUpdateSchema = groupCreateSchema.extend({ id: idSchema });

const groupTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "group",
    basePath: "/groups",
    createSchema: groupCreateSchema,
    updateSchema: groupUpdateSchema,
  }),
];

// ── Journal Entries ──

const journalCreateSchema = z.object({
  title: z.string().max(255).describe("Journal entry title"),
  post: z.string().describe("Journal entry content"),
});

const journalUpdateSchema = journalCreateSchema.extend({ id: idSchema });

const journalTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "journal_entry",
    basePath: "/journal",
    pluralName: "journal_entries",
    createSchema: journalCreateSchema,
    updateSchema: journalUpdateSchema,
  }),
];

export default [
  ...noteTools,
  ...taskTools,
  ...reminderTools,
  ...tagTools,
  ...groupTools,
  ...journalTools,
];
