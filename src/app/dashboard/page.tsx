"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Stars } from "@/components/ui/stars";
import { LayoutDashboard, Calendar, MessageSquare, CreditCard, Star, Settings, Bell, Search, Sparkles, ArrowUpRight, ChevronRight, Menu, LogOut } from "lucide-react";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 3 },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-16 bg-hearth-surface">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-hearth-border bg-hearth-surface/50 backdrop-blur-xl p-4 gap-1">
          {sidebarLinks.map(link => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${link.href === "/dashboard" ? "bg-hearth-gold-500/15 text-hearth-gold-400" : "text-hearth-muted-foreground/60 hover:bg-hearth-surface-700 hover:text-hearth-muted-foreground"}`}>
              <link.icon className="h-4 w-4" /><span className="flex-1">{link.label}</span>{link.badge && <span className="h-5 w-5 rounded-full bg-hearth-gold-500/20 text-hearth-gold-400 text-[10px] flex items-center justify-center font-bold">{link.badge}</span>}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t border-hearth-border"><button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-hearth-muted-foreground/60 hover:text-red-400 transition-all w-full"><LogOut className="h-4 w-4" />Sign Out</button></div>
        </aside>
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="text-2xl font-display font-bold text-hearth-muted-foreground">Welcome back, <span className="text-gradient-gold">Amardeep</span></h1><p className="text-sm text-hearth-muted-foreground/50">Here&apos;s what&apos;s happening</p></div>
              <div className="flex items-center gap-3"><Button variant="ghost" size="icon"><Bell className="h-4 w-4" /><span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-hearth-gold-400" /></Button><Avatar fallback="AS" size="sm" /></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[{ label: "Total Bookings", value: "47", color: "text-blue-400", bg: "bg-blue-500/10" },{ label: "Active", value: "3", color: "text-amber-400", bg: "bg-amber-500/10" },{ label: "Spent", value: "₹24,350", color: "text-emerald-400", bg: "bg-emerald-500/10" },{ label: "Reviews", value: "12", color: "text-hearth-gold-400", bg: "bg-hearth-gold-500/10" }].map(s => (
                <Card key={s.label} variant="default" padding="md"><div className="flex items-center gap-3"><div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`} /><div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-hearth-muted-foreground/50">{s.label}</div></div></div></Card>
              ))}
            </div>
            <Card variant="default" padding="lg"><h2 className="text-lg font-semibold mb-4">Recent Bookings</h2><p className="text-sm text-hearth-muted-foreground/50">Bookings will appear here once you connect to the backend API.</p></Card>
          </div>
        </main>
      </div>
    </div>
  );
}