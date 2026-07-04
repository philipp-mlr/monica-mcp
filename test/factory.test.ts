import { describe, it, expect } from "vitest";
import { makeEntityTool, makeReadOnlyTool } from "../src/factory.js";
import { z } from "zod";

describe("makeEntityTool", () => {
  it("should create a single tool with action parameter", () => {
    const tool = makeEntityTool({
      entityName: "contact",
      basePath: "/contacts",
      createSchema: z.object({ first_name: z.string() }),
    });
    expect(tool.name).toBe("monica_contact");
    expect(tool.description).toContain("contact");
    expect(tool.description).toContain("list");
    expect(tool.description).toContain("delete");
    expect(tool.schema.shape).toHaveProperty("action");
  });

  it("should include delete warning in description", () => {
    const tool = makeEntityTool({
      entityName: "note",
      basePath: "/notes",
      createSchema: z.object({ body: z.string() }),
    });
    expect(tool.description).toContain("irreversible");
  });

  it("should not include create/update for read-only entities", () => {
    const tool = makeEntityTool({
      entityName: "country",
      basePath: "/countries",
      actions: ["list", "get"],
    });
    expect(tool.description).not.toContain("create");
    expect(tool.description).not.toContain("delete");
  });

  it("should include extra actions in description and schema", () => {
    const tool = makeEntityTool({
      entityName: "gift",
      basePath: "/gifts",
      createSchema: z.object({ name: z.string() }),
      extraActions: {
        associate_photo: {
          description: "Associate a photo",
          handler: async () => ({}),
        },
      },
    });
    expect(tool.description).toContain("associate_photo");
  });
});

describe("makeReadOnlyTool", () => {
  it("should create a tool with only list and get actions", () => {
    const tool = makeReadOnlyTool({
      entityName: "country",
      basePath: "/countries",
    });
    expect(tool.name).toBe("monica_country");
    expect(tool.description).toContain("list");
    expect(tool.description).toContain("get");
    expect(tool.description).not.toContain("create");
    expect(tool.description).not.toContain("delete");
  });
});
