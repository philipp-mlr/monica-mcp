import type {
  MonicaSingleResponse,
  MonicaListResponse,
  MonicaDeleteResponse,
} from "./types.js";

export interface MonicaClientConfig {
  baseUrl: string;
  token: string;
}

export class MonicaClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: MonicaClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "") + "/api";
    this.headers = {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Monica API ${res.status} ${res.statusText}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  // ── Generic helpers ──

  get<T>(path: string) {
    return this.request<T>("GET", path);
  }

  list<T>(path: string, params?: Record<string, string | number | undefined>) {
    const qs = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
          .join("&")
      : "";
    return this.request<MonicaListResponse<T>>("GET", `${path}${qs}`);
  }

  getOne<T>(path: string) {
    return this.request<MonicaSingleResponse<T>>("GET", path);
  }

  create<T>(path: string, data: unknown) {
    return this.request<MonicaSingleResponse<T>>("POST", path, data);
  }

  update<T>(path: string, data: unknown) {
    return this.request<MonicaSingleResponse<T>>("PUT", path, data);
  }

  delete(path: string) {
    return this.request<MonicaDeleteResponse>("DELETE", path);
  }
}