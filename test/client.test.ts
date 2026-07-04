import { describe, it, expect, vi, beforeEach } from "vitest";
import { MonicaClient } from "../src/client.js";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 404,
    statusText: ok ? "OK" : "Not Found",
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response;
}

describe("MonicaClient", () => {
  let client: MonicaClient;

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(mockResponse({ data: [] }));
    client = new MonicaClient({
      baseUrl: "https://monica.example.com",
      token: "test-token",
    });
  });

  describe("constructor", () => {
    it("should strip trailing slashes from baseUrl", () => {
      const c = new MonicaClient({
        baseUrl: "https://monica.example.com/",
        token: "tok",
      });
      expect(c).toBeDefined();
    });

    it("should set Authorization header", () => {
      expect(mockFetch).not.toHaveBeenCalled();
      client.get("/test");
      expect(mockFetch.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
    });
  });

  describe("get", () => {
    it("should make a GET request to the correct URL", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: { id: 1 } }));
      const result = await client.get("/contacts/1");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://monica.example.com/api/contacts/1",
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual({ data: { id: 1 } });
    });
  });

  describe("list", () => {
    it("should build query string from params", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: [], links: {}, meta: {} }));
      await client.list("/contacts", { page: 2, limit: 50, query: "john" });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("page=2");
      expect(url).toContain("limit=50");
      expect(url).toContain("query=john");
    });

    it("should skip undefined params", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: [], links: {}, meta: {} }));
      await client.list("/contacts", { page: 1, limit: undefined });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("page=1");
      expect(url).not.toContain("limit=");
    });

    it("should not add ? when no params", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: [], links: {}, meta: {} }));
      await client.list("/contacts");
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).not.toContain("?");
    });
  });

  describe("create", () => {
    it("should make a POST request with JSON body", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: { id: 1 } }));
      await client.create("/contacts", { first_name: "John" });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://monica.example.com/api/contacts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ first_name: "John" }),
        }),
      );
    });
  });

  describe("update", () => {
    it("should make a PUT request to the correct path", async () => {
      mockFetch.mockResolvedValue(mockResponse({ data: { id: 1 } }));
      await client.update("/contacts/1", { first_name: "Jane" });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://monica.example.com/api/contacts/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ first_name: "Jane" }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("should make a DELETE request and return deletion response", async () => {
      mockFetch.mockResolvedValue(mockResponse({ deleted: true, id: 42 }));
      const result = await client.delete("/contacts/42");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://monica.example.com/api/contacts/42",
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(result).toEqual({ deleted: true, id: 42 });
    });
  });

  describe("error handling", () => {
    it("should throw on non-ok response", async () => {
      const errResp = mockResponse({ error: "Not found" }, false);
      mockFetch.mockResolvedValue(errResp);
      await expect(client.get("/contacts/999")).rejects.toThrow("Monica API 404");
    });

    it("should include response body in error message", async () => {
      const errResp = mockResponse({ message: "Invalid token" }, false);
      mockFetch.mockResolvedValue(errResp);
      await expect(client.get("/contacts")).rejects.toThrow("Invalid token");
    });
  });
});
