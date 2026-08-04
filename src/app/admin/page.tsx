"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, Briefcase, DollarSign, TrendingUp, Shield, Bell, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-16 bg-hearth-surface">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-hearth-border bg-hearth-surface/50 backdrop-blur-xl p-4 gap-1">
          <div className="mb-6 px-3"><div className="flex items-center gap-2"><div className="h-8 w-8 bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 rounded-lg flex items-center justify-center"><Shield className="h-4 w-4 text-white" /></div><span className="font-semibold text-sm">Admin Panel</span></div></div>
          {[{"label":"Overview","href":"/admin","icon":LayoutDashboard},{"label":"Users","href":"/admin/users","icon":Users},{"label":"Professionals","href":"/admin/pros","icon":Briefcase},{"label":"Revenue","href":"/admin/revenue","icon":DollarSign},{"label":"Analytics","href":"/admin/analytics","icon":TrendingUp}].map(l=>(
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${l.href === "/admin" ? "bg-hearth-gold-500/15 text-hearth-gold-400" : "text-hearth-muted-foreground/60 hover:bg-hearth-surface-700 hover:text-hearth-muted-foreground"}`}><l.icon className="h-4 w-4" /><span>{l.label}</span></Link>
          ))}
        </aside>
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-display font-bold mb-8">Admin <span className="text-gradient-gold">Overview</span></h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[{ label: "Revenue", value: "₹8.4Cr", change: "+23.5%" },{ label: "Users", value: "1.2M", change: "+12.3%" },{ label: "Bookings", value: "4,821", change: "+8.1%" },{ label: "AOV", value: "₹1,240", change: "-2.4%" }].map(kpi => (
                <Card key={kpi.label} variant="default" padding="md"><div className="text-2xl font-bold">{kpi.value}</div><div className="text-xs text-hearth-muted-foreground/50">{kpi.label} <span className={kpi.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>{kpi.change}</span></div></Card>
              ))}
            </div>
            <Card variant="default" padding="lg"><h2 className="text-lg font-semibold">Platform Ready</h2><p className="text-sm text-hearth-muted-foreground/50 mt-2">Connect to the backend API to see live data.</p></Card>
          </div>
        </main>
      </div>
    </div>
  );
}