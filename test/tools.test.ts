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

describe("tool coverage", () => {
  it("should have at least 100 tools", () => {
    expect(allTools.length).toBeGreaterThanOrEqual(100);
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

  it("should cover contacts CRUD", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_list_contacts");
    expect(names).toContain("monica_get_contact");
    expect(names).toContain("monica_create_contact");
    expect(names).toContain("monica_update_contact");
    expect(names).toContain("monica_delete_contact");
    expect(names).toContain("monica_search_contacts");
  });

  it("should cover journal entries", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_list_journal_entries");
    expect(names).toContain("monica_create_journal_entry");
  });

  it("should cover conversation messages", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_list_conversation_messages");
    expect(names).toContain("monica_add_conversation_message");
  });

  it("should cover tag assignment", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("monica_assign_tag_to_contact");
    expect(names).toContain("monica_remove_tag_from_contact");
  });
});
