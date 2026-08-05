"use client";
import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api";
interface User { id: string; name: string; email: string; phone?: string; role: "customer"|"provider"|"admin"; }
export function useAuth() {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (apiClient.getToken()) { apiClient.get<User>("/auth/me").then(r => setUser(r.data??null)).catch(() => apiClient.setToken(null)).finally(() => setLoading(false)); } else setLoading(false); }, []);
  const login = useCallback(async (email:string, pw:string) => { const r = await apiClient.post<any>("/auth/login",{email,password: pw}); if (r.data) { apiClient.setToken(r.data.tokens.accessToken); localStorage.setItem("hearth_refresh_token",r.data.tokens.refreshToken); setUser(r.data.user); } return r; }, []);
  const signup = useCallback(async (data: any) => { const r = await apiClient.post<any>("/auth/register",data); if (r.data) { apiClient.setToken(r.data.tokens.accessToken); localStorage.setItem("hearth_refresh_token",r.data.tokens.refreshToken); setUser(r.data.user); } return r; }, []);
  const logout = useCallback(() => { apiClient.setToken(null); localStorage.removeItem("hearth_refresh_token"); setUser(null); }, []);
  return { user, loading, login, signup, logout, isLoggedIn: !!user };
}
