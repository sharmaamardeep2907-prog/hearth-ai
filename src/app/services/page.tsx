"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Stars } from "@/components/ui/stars";
import { serviceCategories } from "@/data/categories";
import { Search, Sparkles, MapPin, Filter, Star, Heart, Shield, Award, Clock } from "lucide-react";

const mockPros = [
  { id: "p1", name: "Rajesh Kumar", category: "Electrician", rating: 4.9, reviews: 324, price: 499, experience: 8, city: "Mumbai", verified: true, featured: true, available: true },
  { id: "p2", name: "Amit Singh", category: "Plumber", rating: 4.8, reviews: 256, price: 449, experience: 6, city: "Delhi", verified: true, featured: true, available: true },
  { id: "p3", name: "Suresh Patel", category: "AC Repair", rating: 4.7, reviews: 198, price: 399, experience: 10, city: "Bangalore", verified: true, featured: false, available: true },
  { id: "p4", name: "Deepak Sharma", category: "Carpenter", rating: 4.9, reviews: 412, price: 599, experience: 12, city: "Mumbai", verified: true, featured: true, available: true },
  { id: "p5", name: "Priya Verma", category: "Salon & Spa", rating: 4.8, reviews: 567, price: 699, experience: 5, city: "Delhi", verified: true, featured: true, available: false },
  { id: "p6", name: "Vikram Rao", category: "Painter", rating: 4.6, reviews: 143, price: 349, experience: 7, city: "Hyderabad", verified: false, featured: false, available: true },
];

export default function ServicesPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const filtered = mockPros.filter(p => { if (selectedCategory && p.category !== selectedCategory) return false; if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false; return true; });

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge variant="gold" className="mb-4" icon={<Sparkles className="h-3 w-3" />}>Browse Professionals</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"><span className="text-hearth-muted-foreground">Find the </span><span className="text-gradient-gold">Perfect Pro</span></h1>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hearth-muted-foreground/40" /><input placeholder="Search professionals..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl border border-hearth-border bg-hearth-surface-800 text-hearth-muted-foreground placeholder:text-hearth-muted-foreground/30 text-sm focus:outline-none focus:border-hearth-gold-500/50" /></div>
          <Button variant="secondary" size="md" leftIcon={<Filter className="h-4 w-4" />}>Filters</Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button onClick={() => setSelectedCategory(null)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory ? "bg-hearth-gold-500/20 text-hearth-gold-400 border border-hearth-gold-500/30" : "bg-hearth-surface-800 text-hearth-muted-foreground/60 border border-hearth-border"}`}>All</button>
          {serviceCategories.slice(0,10).map(c => <button key={c.id} onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === c.name ? "bg-hearth-gold-500/20 text-hearth-gold-400 border border-hearth-gold-500/30" : "bg-hearth-surface-800 text-hearth-muted-foreground/60 border border-hearth-border"}`}>{c.name}</button>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pro, i) => (
            <motion.div key={pro.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Card variant="interactive" padding="md" className="group h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-hearth-gold-500/20 to-hearth-copper-500/20 flex items-center justify-center text-hearth-gold-400 font-bold text-lg shrink-0">{pro.name.split(" ").map(n=>n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5"><h3 className="font-semibold text-hearth-muted-foreground truncate">{pro.name}</h3>{pro.verified && <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" />}</div>
                    <p className="text-sm text-hearth-muted-foreground/50">{pro.category}</p>
                  </div>
                  <button className="shrink-0 h-9 w-9 rounded-lg border border-hearth-border flex items-center justify-center text-hearth-muted-foreground/40 hover:text-red-400 transition-colors"><Heart className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-hearth-gold-400 fill-hearth-gold-400" /><span className="font-semibold">{pro.rating}</span><span className="text-hearth-muted-foreground/50">({pro.reviews})</span></div>
                  <div className="flex items-center gap-1 text-hearth-muted-foreground/50"><Clock className="h-3 w-3" />{pro.experience}yrs</div>
                  <div className="flex items-center gap-1 text-hearth-muted-foreground/50"><MapPin className="h-3 w-3" />{pro.city}</div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-hearth-border">
                  <div><span className="text-xl font-bold">₹{pro.price}</span><span className="text-sm text-hearth-muted-foreground/50"> /visit</span></div>
                  <Button variant="luxury" size="sm">Book</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}