import { z } from "zod";
import { makeEntityTool, type ToolDef } from "../factory.js";

const addressFields = {
  name: z.string().max(255).describe("Address label (e.g. 'Home', 'Work')"),
  street: z.string().max(255).nullable().describe("Street address"),
  city: z.string().max(255).nullable().describe("City"),
  province: z.string().max(255).nullable().describe("Province/state"),
  postal_code: z.string().max(255).nullable().describe("Postal code"),
  country: z.string().max(3).describe("Country ID (ISO code)"),
  contact_id: z.number().int().describe("Contact ID"),
};

const contactFieldFields = {
  contact_id: z.number().int().describe("Contact ID"),
  contact_field_type_id: z.number().int().describe("Contact field type ID"),
  data: z.string().describe("Field content (e.g. email address, phone number)"),
};

const contactFieldTypeFields = {
  name: z.string().max(255).describe("Field type name (e.g. 'Instagram')"),
  fontawesome_icon: z.string().nullable().describe("FontAwesome icon class"),
  protocol: z.string().nullable().describe("Protocol (e.g. 'mailto:')"),
  delible: z.boolean().describe("Whether this type can be deleted"),
  type: z.string().describe("Type: email, phone, whatsapp, etc."),
};

const companyFields = {
  name: z.string().max(255).describe("Company name"),
  website: z.string().max(255).nullable().describe("Company website URL"),
  number_of_employees: z.number().int().nullable().describe("Number of employees"),
};

const occupationFields = {
  contact_id: z.number().int().describe("Contact ID"),
  company_id: z.number().int().describe("Company ID"),
  title: z.string().max(255).describe("Job title"),
  description: z.string().max(1000).nullable().describe("Job description"),
  salary: z.number().int().nullable().describe("Estimated salary"),
  salary_unit: z.string().nullable().describe("Salary unit: year, month, week, day, hour"),
  currently_works_here: z.boolean().nullable().describe("Whether the contact currently works here"),
  start_date: z.string().nullable().describe("Start date (YYYY-MM-DD)"),
  end_date: z.string().nullable().describe("End date (YYYY-MM-DD)"),
};

export default [
  makeEntityTool({ entityName: "address", basePath: "/addresses", createSchema: z.object(addressFields) }),
  makeEntityTool({ entityName: "contact_field", basePath: "/contactfields", createSchema: z.object(contactFieldFields) }),
  makeEntityTool({ entityName: "contact_field_type", basePath: "/contactfieldtypes", createSchema: z.object(contactFieldTypeFields) }),
  makeEntityTool({ entityName: "company", basePath: "/companies", createSchema: z.object(companyFields) }),
  makeEntityTool({ entityName: "occupation", basePath: "/occupations", createSchema: z.object(occupationFields) }),
] as ToolDef[];