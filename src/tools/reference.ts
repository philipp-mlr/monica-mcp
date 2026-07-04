import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Countries (read-only) ──

const countryTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "country",
    basePath: "/countries",
    pluralName: "countries",
  }),
];

// ── Currencies (read-only) ──

const currencyTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "currency",
    basePath: "/currencies",
    pluralName: "currencies",
  }),
];

// ── Genders (read-only) ──

const genderTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "gender",
    basePath: "/genders",
  }),
];

// ── Audit Logs (read-only) ──

const auditLogTools: ToolDef[] = [
  {
    name: "monica_list_audit_logs",
    description: "List all audit logs in your account.",
    schema: z.object({}),
    handler: async (client) => {
      return client.list("/auditlogs");
    },
  },
];

// ── User (read-only, no delete) ──

const userTools: ToolDef[] = [
  {
    name: "monica_get_user",
    description: "Get the currently authenticated user's information.",
    schema: z.object({}),
    handler: async (client) => {
      return client.getOne("/me");
    },
  },
];

// ── Photos (list/get/delete only — upload not supported by Monica API) ──

const photoTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "photo",
    basePath: "/photos",
  }),
];

// ── Documents (list/get/delete only — upload not supported by Monica API) ──

const documentTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "document",
    basePath: "/documents",
  }),
];

export default [
  ...countryTools,
  ...currencyTools,
  ...genderTools,
  ...auditLogTools,
  ...userTools,
  ...photoTools,
  ...documentTools,
];
