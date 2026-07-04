import { describe, it, expect } from "vitest";
import { makeCrudTools } from "../src/factory.js";

describe("makeCrudTools", () => {
  it("should generate 5 tools for a full CRUD entity", () => {
    const tools = makeCrudTools({
      entityName: "contact",
      basePath: "/contacts",
      createSchema: {} as never,
      updateSchema: {} as never,
    });
    expect(tools).toHaveLength(5);
    expect(tools.map((t) => t.name)).toEqual([
      "monica_list_contacts",
      "monica_get_contact",
      "monica_create_contact",
      "monica_update_contact",
      "monica_delete_contact",
    ]);
  });

  it("should generate 3 tools for a read-only entity (no create/update)", () => {
    const tools = makeCrudTools({
      entityName: "country",
      basePath: "/countries",
      pluralName: "countries",
    });
    expect(tools).toHaveLength(3);
    expect(tools.map((t) => t.name)).toEqual([
      "monica_list_countries",
      "monica_get_country",
      "monica_delete_country",
    ]);
  });

  it("should use entityName singular for get/create/update/delete", () => {
    const tools = makeCrudTools({
      entityName: "activity_type",
      basePath: "/activitytypes",
    });
    expect(tools[1].name).toBe("monica_get_activity_type");
    expect(tools[2].name).toBe("monica_delete_activity_type");
  });

  it("should set correct descriptions", () => {
    const tools = makeCrudTools({
      entityName: "note",
      basePath: "/notes",
    });
    expect(tools[0].description).toBe("List all notes in your account. Supports pagination.");
    expect(tools[1].description).toBe("Get a specific note by ID.");
    expect(tools[2].description).toBe("Delete a note by ID.");
  });
});
