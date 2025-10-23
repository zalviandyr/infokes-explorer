const base =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api") ?? "/api";

export const API_BASE = `${base}/v1`;

