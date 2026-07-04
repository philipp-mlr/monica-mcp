import { z } from "zod";
import { makeCrudTools, idSchema, paginationSchema, type ToolDef } from "../factory.js";

// ── Activities ──

const activityCreateSchema = z.object({
  activity_type_id: z.number().int().describe("Activity type ID"),
  summary: z.string().max(255).describe("Short description"),
  description: z.string().max(1000000).optional().describe("Detailed description"),
  happened_at: z.string().describe("Date the activity happened (YYYY-MM-DD)"),
  contacts: z.array(z.number().int()).describe("Contact IDs associated with this activity"),
  emotions: z.array(z.number().int()).optional().describe("Emotion IDs"),
});

const activityUpdateSchema = activityCreateSchema.extend({ id: idSchema });

const activityTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "activity",
    basePath: "/activities",
    createSchema: activityCreateSchema,
    updateSchema: activityUpdateSchema,
  }),
];

// ── Activity Types ──

const activityTypeCreateSchema = z.object({
  name: z.string().max(255).describe("Activity type name"),
  activity_type_category_id: z.number().int().describe("Activity type category ID"),
});

const activityTypeUpdateSchema = activityTypeCreateSchema.extend({ id: idSchema });

const activityTypeTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "activity_type",
    basePath: "/activitytypes",
    pluralName: "activity_types",
    createSchema: activityTypeCreateSchema,
    updateSchema: activityTypeUpdateSchema,
  }),
];

// ── Activity Type Categories ── (read-only)

const activityTypeCategoryTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "activity_type_category",
    basePath: "/activitytypecategories",
    pluralName: "activity_type_categories",
  }),
];

// ── Calls ──

const callCreateSchema = z.object({
  content: z.string().max(100000).describe("Call description/content"),
  contact_id: z.number().int().describe("Contact ID"),
  called_at: z.string().describe("Date the call happened (YYYY-MM-DD)"),
});

const callUpdateSchema = callCreateSchema.extend({ id: idSchema });

const callTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "call",
    basePath: "/calls",
    createSchema: callCreateSchema,
    updateSchema: callUpdateSchema,
  }),
];

// ── Conversations ──

const conversationCreateSchema = z.object({
  contact_field_type_id: z.number().int().describe("Contact field type ID (channel)"),
  contact_id: z.number().int().describe("Contact ID"),
  conversation_content: z.string().describe("Initial message content"),
});

const conversationUpdateSchema = z.object({
  id: idSchema,
  contact_field_type_id: z.number().int().optional(),
  conversation_content: z.string().optional(),
});

const conversationTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "conversation",
    basePath: "/conversations",
    createSchema: conversationCreateSchema,
    updateSchema: conversationUpdateSchema,
  }),

  // Conversation messages (listed via conversation GET, no separate endpoint)
  {
    name: "monica_list_conversation_messages",
    description: "List all messages in a conversation.",
    schema: z.object({ conversation_id: idSchema }),
    handler: async (client, args) => {
      return client.getOne(`/conversations/${args.conversation_id}`);
    },
  },

  // Add message to conversation
  {
    name: "monica_add_conversation_message",
    description: "Add a message to an existing conversation.",
    schema: z.object({
      conversation_id: idSchema,
      content: z.string().describe("Message content"),
      written_at: z.string().describe("When the message was written (YYYY-MM-DD)"),
      written_by_me: z.boolean().describe("Whether the message was written by me"),
    }),
    handler: async (client, args) => {
      const { conversation_id, ...data } = args;
      return client.create(`/conversations/${conversation_id}/messages`, data);
    },
  },
];

export default [
  ...activityTools,
  ...activityTypeTools,
  ...activityTypeCategoryTools,
  ...callTools,
  ...conversationTools,
];
