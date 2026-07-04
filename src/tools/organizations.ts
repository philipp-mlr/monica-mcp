import { z } from "zod";
import { makeCrudTools, idSchema, type ToolDef } from "../factory.js";

// ── Addresses ──

const addressCreateSchema = z.object({
  name: z.string().max(255).describe("Address label (e.g. 'Home', 'Work')"),
  street: z.string().max(255).nullable().optional().describe("Street address"),
  city: z.string().max(255).nullable().optional().describe("City"),
  province: z.string().max(255).nullable().optional().describe("Province/state"),
  postal_code: z.string().max(255).nullable().optional().describe("Postal code"),
  country: z.string().max(3).describe("Country ID (ISO code)"),
  contact_id: z.number().int().describe("Contact ID"),
});

const addressUpdateSchema = addressCreateSchema.extend({ id: idSchema });

const addressTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "address",
    basePath: "/addresses",
    createSchema: addressCreateSchema,
    updateSchema: addressUpdateSchema,
  }),
];

// ── Contact Fields ──

const contactFieldCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  contact_field_type_id: z.number().int().describe("Contact field type ID"),
  content: z.string().describe("Field content (e.g. email address, phone number)"),
});

const contactFieldUpdateSchema = contactFieldCreateSchema.extend({ id: idSchema });

const contactFieldTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "contact_field",
    basePath: "/contactfields",
    pluralName: "contact_fields",
    createSchema: contactFieldCreateSchema,
    updateSchema: contactFieldUpdateSchema,
  }),
];

// ── Contact Field Types ──

const contactFieldTypeCreateSchema = z.object({
  name: z.string().max(255).describe("Field type name (e.g. 'Instagram')"),
  fontawesome_icon: z.string().nullable().optional().describe("FontAwesome icon class"),
  protocol: z.string().nullable().optional().describe("Protocol (e.g. 'mailto:')"),
  type: z.string().describe("Type: email, phone, whatsapp, etc."),
});

const contactFieldTypeUpdateSchema = contactFieldTypeCreateSchema.extend({ id: idSchema });

const contactFieldTypeTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "contact_field_type",
    basePath: "/contactfieldtypes",
    pluralName: "contact_field_types",
    createSchema: contactFieldTypeCreateSchema,
    updateSchema: contactFieldTypeUpdateSchema,
  }),
];

// ── Companies ──

const companyCreateSchema = z.object({
  name: z.string().max(255).describe("Company name"),
  website: z.string().max(255).nullable().optional().describe("Company website URL"),
  number_of_employees: z.number().int().nullable().optional().describe("Number of employees"),
});

const companyUpdateSchema = companyCreateSchema.extend({ id: idSchema });

const companyTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "company",
    basePath: "/companies",
    createSchema: companyCreateSchema,
    updateSchema: companyUpdateSchema,
  }),
];

// ── Occupations ──

const occupationCreateSchema = z.object({
  contact_id: z.number().int().describe("Contact ID"),
  company: z.string().describe("Company name"),
  job: z.string().describe("Job title"),
});

const occupationUpdateSchema = occupationCreateSchema.extend({ id: idSchema });

const occupationTools: ToolDef[] = [
  ...makeCrudTools({
    entityName: "occupation",
    basePath: "/occupations",
    createSchema: occupationCreateSchema,
    updateSchema: occupationUpdateSchema,
  }),
];

export default [
  ...addressTools,
  ...contactFieldTools,
  ...contactFieldTypeTools,
  ...companyTools,
  ...occupationTools,
];
