"use client";
import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api";
export function useProviders() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const fetch = useCallback(async (filters: any = {}) => { setLoading(true); try { const r = await apiClient.get("/providers", { params: filters }); setProviders(r.data??[]); if (r.metadata) setMeta(r.metadata as any); } finally { setLoading(false); } }, []);
  const fetchCategory = useCallback(async (slug: string, filters: any = {}) => { setLoading(true); try { const r = await apiClient.get(`/categories/${slug}`, { params: filters }); setProviders(r.data??[]); if (r.metadata) setMeta(r.metadata as any); } finally { setLoading(false); } }, []);
  const search = useCallback(async (q: string, filters: any = {}) => { setLoading(true); try { const r = await apiClient.get("/search", { params: { q, ...filters } }); setProviders(r.data??[]); if (r.metadata) setMeta(r.metadata as any); } finally { setLoading(false); } }, []);
  return { providers, loading, meta, fetch, fetchCategory, search };
}
