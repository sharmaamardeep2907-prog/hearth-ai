const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 2;

interface ApiOptions extends Omit<RequestInit, "body"> {
  timeout?: number; retries?: number;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

interface ApiResponse<T = unknown> {
  success: boolean; statusCode: number; message: string;
  requestId: string; timestamp: string; data?: T; metadata?: Record<string, unknown>;
}

class ApiError extends Error {
  public statusCode: number;
  public data: unknown;
  constructor(message: string, statusCode: number, data?: unknown) {
    super(message); this.name = "ApiError"; this.statusCode = statusCode; this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("hearth_access_token");
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) localStorage.setItem("hearth_access_token", token);
    else localStorage.removeItem("hearth_access_token");
  }

  getToken(): string | null { return this.token; }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const { timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, params, body, ...fetchOptions } = options;
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null) searchParams.append(key, String(value)); });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    const headers: Record<string, string> = { "Content-Type": "application/json", ...((fetchOptions.headers as Record<string, string>) || {}) };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, { ...fetchOptions, headers, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.status === 401 && this.token && attempt < retries) {
          const refreshed = await this.tryRefreshToken();
          if (refreshed) { headers["Authorization"] = `Bearer ${this.token}`; continue; }
        }
        const data: ApiResponse<T> = await response.json();
        if (!response.ok) throw new ApiError(data.message || "Request failed", response.status, data);
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        if (error.name === "AbortError") throw new ApiError("Request timed out", 408);
        if (error instanceof ApiError) throw error;
        if (attempt < retries && error.name !== "ApiError") {
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
          continue;
        }
      }
    }
    throw lastError || new ApiError("Request failed", 500);
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("hearth_refresh_token");
      if (!refreshToken) return false;
      const response = await fetch(`${this.baseUrl}/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken }) });
      if (!response.ok) return false;
      const data = await response.json();
      if (data.data?.tokens) {
        this.setToken(data.data.tokens.accessToken);
        localStorage.setItem("hearth_refresh_token", data.data.tokens.refreshToken);
        return true;
      }
      return false;
    } catch { return false; }
  }

  async get<T>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { ...options, method: "GET" }); }
  async post<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { ...options, method: "POST", body }); }
  async put<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { ...options, method: "PUT", body }); }
  async patch<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { ...options, method: "PATCH", body }); }
  async delete<T>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { ...options, method: "DELETE" }); }
}

export const apiClient = new ApiClient(API_BASE);
export { ApiError };
export type { ApiResponse, ApiOptions };