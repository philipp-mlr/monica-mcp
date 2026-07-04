import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Notes ──

const noteCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  body: z.string().describe("Note content"),
  is_favorited: z.number().int().min(0).max(1).describe("Whether the note is favorited: 0 (false) or 1 (true)"),
});

const noteUpdateSchema = z.object({
  id: idSchema,
  body: z.string().optional().describe("Note content"),
  contact_id: z.number().int().optional().describe("Contact ID"),
  is_favorited: z.number().int().min(0).max(1).optional().describe("Favorited: 0 (false) or 1 (true)"),
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
  completed: z.number().int().min(0).max(1).describe("Task status: 0 (incomplete) or 1 (complete)"),
  completed_at: z.string().nullable().optional().describe("Completion date (YYYY-MM-DD)"),
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
  next_expected_date: z.string().describe("Date when the reminder should trigger (YYYY-MM-DD, must be in the future)"),
  frequency_type: z.string().describe("Frequency type: one_time, week, month, or year"),
  frequency_number: z.number().int().nullable().optional().describe("Frequency interval (for recurring reminders)"),
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
