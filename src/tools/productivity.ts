import { z } from "zod";
import { makeEntityTool, type ToolDef } from "../factory.js";

const noteFields = {
  contact_id: z.number().int().describe("Contact ID"),
  body: z.string().describe("Note content"),
  is_favorited: z.number().int().min(0).max(1).describe("Favorited: 0 (false) or 1 (true)"),
};

const taskFields = {
  contact_id: z.number().int().describe("Contact ID"),
  title: z.string().max(255).describe("Task title"),
  description: z.string().nullable().describe("Task description"),
  completed: z.number().int().min(0).max(1).describe("Status: 0 (incomplete) or 1 (complete)"),
  completed_at: z.string().nullable().describe("Completion date (YYYY-MM-DD)"),
};

const reminderFields = {
  contact_id: z.number().int().describe("Contact ID"),
  title: z.string().max(255).describe("Reminder title"),
  description: z.string().nullable().describe("Reminder description"),
  next_expected_date: z.string().describe("Trigger date (YYYY-MM-DD, must be in the future)"),
  frequency_type: z.string().describe("Frequency type: one_time, week, month, or year"),
  frequency_number: z.number().int().nullable().describe("Frequency interval (for recurring reminders)"),
};

const tagFields = {
  name: z.string().max(255).describe("Tag name"),
  description: z.string().nullable().describe("Tag description"),
};

const groupFields = {
  name: z.string().max(255).describe("Group name"),
};

const journalFields = {
  title: z.string().max(255).describe("Journal entry title"),
  post: z.string().describe("Journal entry content"),
};

export default [
  makeEntityTool({ entityName: "note", basePath: "/notes", createSchema: z.object(noteFields) }),
  makeEntityTool({ entityName: "task", basePath: "/tasks", createSchema: z.object(taskFields) }),
  makeEntityTool({ entityName: "reminder", basePath: "/reminders", createSchema: z.object(reminderFields) }),
  makeEntityTool({ entityName: "tag", basePath: "/tags", createSchema: z.object(tagFields) }),
  makeEntityTool({ entityName: "group", basePath: "/groups", createSchema: z.object(groupFields) }),
  makeEntityTool({ entityName: "journal_entry", basePath: "/journal", createSchema: z.object(journalFields) }),
] as ToolDef[];