"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";
import { LayoutDashboard, Calendar, MessageSquare, DollarSign, Star, Settings, Bell } from "lucide-react";

export default function ProDashboard() {
  return (
    <div className="min-h-screen pt-16 bg-hearth-surface">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-hearth-border bg-hearth-surface/50 backdrop-blur-xl p-4 gap-1">
          <div className="mb-6 px-3"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-hearth-gold-500/20 to-hearth-copper-500/20 flex items-center justify-center text-hearth-gold-400 font-bold">RK</div><div><div className="font-semibold text-sm">Rajesh Kumar</div><div className="text-xs text-hearth-muted-foreground/50">Pro Account</div></div></div><div className="flex items-center gap-2 mt-3"><Stars rating={4.9} size="sm" showValue /><span className="text-xs text-hearth-muted-foreground/50">(324)</span></div></div>
          {[{"label":"Overview","href":"/pro","icon":LayoutDashboard},{"label":"My Jobs","href":"/pro/jobs","icon":Calendar},{"label":"Messages","href":"/pro/messages","icon":MessageSquare,"badge":5},{"label":"Earnings","href":"/pro/earnings","icon":DollarSign},{"label":"Reviews","href":"/pro/reviews","icon":Star},{"label":"Settings","href":"/pro/settings","icon":Settings}].map(l=>(
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${l.href === "/pro" ? "bg-hearth-gold-500/15 text-hearth-gold-400" : "text-hearth-muted-foreground/60 hover:bg-hearth-surface-700 hover:text-hearth-muted-foreground"}`}><l.icon className="h-4 w-4" /><span className="flex-1">{l.label}</span>{l.badge && <span className="h-5 w-5 rounded-full bg-hearth-gold-500/20 text-hearth-gold-400 text-[10px] flex items-center justify-center font-bold">{l.badge}</span>}</Link>
          ))}
        </aside>
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8"><div><h1 className="text-2xl font-display font-bold">Pro <span className="text-gradient-gold">Dashboard</span></h1><p className="text-sm text-hearth-muted-foreground/50">Manage your jobs and earnings</p></div><Badge variant="success">Online — Accepting Jobs</Badge></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[{ label: "Total Jobs", value: "847" },{ label: "Earnings (Apr)", value: "₹42,350" },{ label: "Rating", value: "4.9" },{ label: "Response", value: "98%" }].map(s => <Card key={s.label} variant="default" padding="md"><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-hearth-muted-foreground/50">{s.label}</div></Card>)}
            </div>
            <Card variant="default" padding="lg"><h2 className="text-lg font-semibold">Platform Ready</h2><p className="text-sm text-hearth-muted-foreground/50 mt-2">Connect to the backend API to see live jobs and earnings.</p></Card>
          </div>
        </main>
      </div>
    </div>
  );
}