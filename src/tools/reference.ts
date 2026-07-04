import { z } from "zod";
import { makeReadOnlyTool, type ToolDef } from "../factory.js";

// ── Reference data (read-only) ──

const countryTool = makeReadOnlyTool({ entityName: "country", basePath: "/countries" });
const currencyTool = makeReadOnlyTool({ entityName: "currency", basePath: "/currencies" });
const genderTool = makeReadOnlyTool({ entityName: "gender", basePath: "/genders" });

// ── Audit logs (read-only) ──

const auditLogTool: ToolDef = {
  name: "monica_audit_log",
  description: "List all audit logs in your account.",
  schema: z.object({}),
  handler: async (client) => client.list("/auditlogs"),
};

// ── User (read-only) ──

const userTool: ToolDef = {
  name: "monica_user",
  description: "Get the currently authenticated user's information.",
  schema: z.object({}),
  handler: async (client) => client.getOne("/me"),
};

// ── Photos (list/get/delete — upload not supported by Monica API) ──

const photoTool = makeReadOnlyTool({ entityName: "photo", basePath: "/photos" });

// ── Documents (list/get/delete — upload not supported by Monica API) ──

const documentTool = makeReadOnlyTool({ entityName: "document", basePath: "/documents" });

export default [countryTool, currencyTool, genderTool, auditLogTool, userTool, photoTool, documentTool];