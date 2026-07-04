import { z } from "zod";
import { makeEntityTool, idSchema, type ToolDef } from "../factory.js";

const activityFields = {
  activity_type_id: z.number().int().describe("Activity type ID"),
  summary: z.string().max(255).describe("Short description"),
  description: z.string().max(1000000).describe("Detailed description"),
  happened_at: z.string().describe("Date the activity happened (YYYY-MM-DD)"),
  contacts: z.array(z.number().int()).describe("Contact IDs associated with this activity"),
  emotions: z.array(z.number().int()).describe("Emotion IDs"),
};

const callFields = {
  content: z.string().max(100000).describe("Call description/content"),
  contact_id: z.number().int().describe("Contact ID"),
  called_at: z.string().describe("Date the call happened (YYYY-MM-DD)"),
};

const conversationFields = {
  contact_field_type_id: z.number().int().describe("Contact field type ID (channel)"),
  conversation_content: z.string().describe("Initial message content"),
  contact_id: z.number().int().describe("Contact ID"),
};

const conversationTool = makeEntityTool({
  entityName: "conversation",
  basePath: "/conversations",
  createSchema: z.object(conversationFields),
  extraActions: {
    list_messages: {
      description: "List all messages in a conversation.",
      handler: async (client, args) => client.getOne(`/conversations/${args.id}`),
    },
    add_message: {
      description: "Add a message to a conversation.",
      schema: {
        message_content: z.string().describe("Message content"),
        written_at: z.string().describe("When written (YYYY-MM-DD)"),
        written_by_me: z.boolean().describe("Whether written by me"),
      },
      handler: async (client, args) => {
        const { id, message_content, written_at, written_by_me } = args;
        return client.create(`/conversations/${id}/messages`, {
          content: message_content,
          written_at,
          written_by_me,
        });
      },
    },
    update_message: {
      description: "Update a message in a conversation. Requires conversation_id and message_id.",
      schema: {
        message_id: idSchema.describe("Message ID"),
        message_content: z.string().describe("Updated message content"),
        written_at: z.string().optional().describe("When written (YYYY-MM-DD)"),
        written_by_me: z.boolean().optional().describe("Whether written by me"),
      },
      handler: async (client, args) => {
        return client.update(`/conversations/${args.id}/messages/${args.message_id}`, {
          content: args.message_content,
          written_at: args.written_at,
          written_by_me: args.written_by_me,
        });
      },
    },
    delete_message: {
      description: "Delete a message from a conversation. Requires conversation_id and message_id.",
      schema: {
        message_id: idSchema.describe("Message ID to delete"),
      },
      handler: async (client, args) => client.delete(`/conversations/${args.id}/messages/${args.message_id}`),
    },
  },
});

export default [
  makeEntityTool({ entityName: "activity", basePath: "/activities", createSchema: z.object(activityFields) }),
  makeEntityTool({ entityName: "activity_type", basePath: "/activitytypes", createSchema: z.object({ name: z.string().max(255), activity_type_category_id: z.number().int() }) }),
  makeEntityTool({ entityName: "activity_type_category", basePath: "/activitytypecategories", actions: ["list", "get"] }),
  makeEntityTool({ entityName: "call", basePath: "/calls", createSchema: z.object(callFields) }),
  conversationTool,
];