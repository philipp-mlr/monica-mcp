import { describe, it, expect } from "vitest";
import contacts from "../src/tools/contacts.js";
import communication from "../src/tools/communication.js";
import organizations from "../src/tools/organizations.js";
import productivity from "../src/tools/productivity.js";
import relationships from "../src/tools/relationships.js";
import reference from "../src/tools/reference.js";

const allTools = [
  ...contacts,
  ...communication,
  ...organizations,
  ...productivity,
  ...relationships,
  ...reference,
];

describe("tool coverage (action-based design)", () => {
  it("should have 20-35 tools (consolidated, not one per CRUD op)", () => {
    expect(allTools.length).toBeGreaterThanOrEqual(20);
    expect(allTools.length).toBeLessThanOrEqual(35);
  });

  it("should have unique tool names", () => {
    const names = allTools.map((t) => t.name);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    expect(duplicates).toEqual([]);
  });

  it("every tool should have a name, description, schema, and handler", () => {
    for (const tool of allTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.schema).toBeDefined();
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("should have monica_contact with action parameter", () => {
    const contact = allTools.find((t) => t.name === "monica_contact");
    expect(contact).toBeDefined();
    expect(contact!.schema.shape).toHaveProperty("action");
  });

  it("should have monica_conversation with message actions", () => {
    const conv = allTools.find((t) => t.name === "monica_conversation");
    expect(conv).toBeDefined();
    expect(conv!.description).toContain("add_message");
    expect(conv!.description).toContain("delete_message");
  });

  it("should have monica_gift with associate_photo action", () => {
    const gift = allTools.find((t) => t.name === "monica_gift");
    expect(gift).toBeDefined();
    expect(gift!.description).toContain("associate_photo");
  });

  it("should have read-only tools for countries, currencies, genders", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_country");
    expect(names).toContain("monica_currency");
    expect(names).toContain("monica_gender");
  });

  it("should not have delete on read-only entities", () => {
    const country = allTools.find((t) => t.name === "monica_country");
    expect(country!.description).not.toContain("delete");
  });

  it("should have journal_entry tool", () => {
    expect(allTools.map((t) => t.name)).toContain("monica_journal_entry");
  });

  it("should have user and audit_log tools", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_user");
    expect(names).toContain("monica_audit_log");
  });
});
