"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/categories";
import { Sparkles, Search, MapPin, Zap, Shield, Clock, Star, ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-hearth-surface">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-hearth-gold-500/5 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-hearth-copper-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-dot opacity-30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <Badge variant="gold" className="px-4 py-2 text-sm gap-2" icon={<Sparkles className="h-3.5 w-3.5" />}>Now Powered by GPT-4o — Experience Next-Gen AI Booking</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-hearth-muted-foreground">Your Home, </span><span className="text-gradient-gold">Served</span><br />
              <span className="text-hearth-muted-foreground">by Intelligence</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="text-lg sm:text-xl text-hearth-muted-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered marketplace connecting you with 50,000+ verified professionals across 20+ categories.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="max-w-2xl mx-auto mb-10">
              <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? "ring-2 ring-hearth-gold-500/40 shadow-hearth-glow" : ""}`}>
                <div className="flex items-center bg-hearth-surface-800 rounded-2xl border border-hearth-border overflow-hidden">
                  <div className="flex-1 flex items-center gap-3 px-5 py-4">
                    <Search className="h-5 w-5 text-hearth-muted-foreground/40 shrink-0" />
                    <input type="text" placeholder='Try "AC repair near me" or "best plumber"' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="flex-1 bg-transparent text-hearth-muted-foreground placeholder:text-hearth-muted-foreground/30 text-sm focus:outline-none" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-4 border-l border-hearth-border">
                    <MapPin className="h-4 w-4 text-hearth-muted-foreground/40" />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-32 bg-transparent text-hearth-muted-foreground placeholder:text-hearth-muted-foreground/30 text-sm focus:outline-none" />
                  </div>
                  <div className="pr-2"><Button variant="luxury" size="lg"><Sparkles className="h-4 w-4" /><span className="hidden sm:inline">AI Search</span></Button></div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-hearth-muted-foreground/50">
              {[{ icon: CheckCircle2, text: "50,000+ Professionals", color: "text-emerald-400" },{ icon: Star, text: "4.8 Average Rating", color: "text-hearth-gold-400 fill-hearth-gold-400" },{ icon: Shield, text: "Verified & Insured", color: "text-blue-400" },{ icon: Clock, text: "Book in 60 seconds", color: "text-hearth-copper-400" }].map(({ icon: Icon, text, color }) => (<div key={text} className="flex items-center gap-1.5"><Icon className={`h-4 w-4 ${color}`} />{text}</div>))}
            </motion.div>
          </div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[5%] top-1/4 hidden lg:block">
            <Card variant="glass" padding="sm" className="w-64"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-400" /></div><div><p className="text-xs text-hearth-muted-foreground/50">Completed</p><p className="text-lg font-bold">2.4M+</p></div></div></Card>
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute right-[8%] top-1/3 hidden lg:block">
            <Card variant="glass" padding="sm" className="w-56"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-hearth-gold-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-hearth-gold-400" /></div><div><p className="text-xs text-hearth-muted-foreground/50">Customers</p><p className="text-lg font-bold">1.2M+</p></div></div></Card>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge variant="gold" className="mb-4" icon={<Sparkles className="h-3 w-3" />}>All Services</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"><span className="text-hearth-muted-foreground">Every Service You Need, </span><span className="text-gradient-gold">In One Place</span></h2>
            <p className="text-lg text-hearth-muted-foreground/60 max-w-2xl mx-auto">From fixing a leaky tap to planning your dream wedding — find verified professionals for everything.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {serviceCategories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link href={`/services/${cat.slug}`}>
                  <Card variant="interactive" padding="md" className="group text-center h-full">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-hearth-gold-500/10 border border-hearth-gold-500/20 flex items-center justify-center text-hearth-gold-400 group-hover:bg-hearth-gold-500/20 group-hover:scale-110 transition-all duration-300"><span className="font-bold text-sm">{cat.name.charAt(0)}</span></div>
                      <div><h3 className="font-semibold text-hearth-muted-foreground group-hover:text-hearth-gold-400 transition-colors text-sm">{cat.name}</h3><p className="text-xs text-hearth-muted-foreground/50 mt-0.5">{cat.serviceCount.toLocaleString()}+ pros</p></div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link href="/services"><Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>View All 20+ Categories</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-hearth-surface-900/50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-hearth-gold-500/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge variant="gold" className="mb-4" icon={<Zap className="h-3 w-3" />}>How It Works</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"><span className="text-hearth-muted-foreground">From Need to Done, </span><span className="text-gradient-gold">in 4 Steps</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Describe Your Need", "AI Matches & Compares", "Book & Pay Seamlessly", "Rate & Earn Rewards"].map((title, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card variant="default" padding="lg" className="h-full group hover:border-hearth-gold-500/20 transition-colors">
                  <span className="text-3xl font-bold text-hearth-muted-foreground/10 font-display block mb-3">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-semibold text-hearth-muted-foreground mb-2">{title}</h3>
                  <p className="text-sm text-hearth-muted-foreground/60 leading-relaxed">{[ "Tell our AI what you need — type naturally or pick from categories.", "Our AI finds top-rated pros. Compare ratings, prices, and reviews.", "Choose, book, and pay securely. Instant confirmation with tracking.", "Rate your experience. Earn loyalty points with every booking." ][i]}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SHOWCASE ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge variant="gold" className="mb-4" icon={<Sparkles className="h-3 w-3" />}>AI Powered</Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
                <span className="text-hearth-muted-foreground">Not Just a Listing. </span><span className="text-gradient-gold">Intelligent Matching.</span>
              </h2>
              <p className="text-lg text-hearth-muted-foreground/60 mb-8">Our GPT-4o powered engine understands context — not just keywords. Describe your problem in plain English and our AI finds the perfect professional.</p>
              <div className="space-y-4">
                {["Natural Language Understanding", "Smart Skill Matching", "Dynamic Pricing & ETAs", "Fraud Detection & Safety"].map((title) => (
                  <div key={title} className="flex gap-3"><div className="mt-0.5 h-5 w-5 rounded-full bg-hearth-gold-500/10 border border-hearth-gold-500/20 flex items-center justify-center shrink-0"><CheckCircle2 className="h-3 w-3 text-hearth-gold-400" /></div><div><h4 className="font-medium text-hearth-muted-foreground text-sm">{title}</h4><p className="text-sm text-hearth-muted-foreground/50 mt-0.5">{title === "Natural Language Understanding" ? "Describe your issue like you'd tell a friend." : title === "Smart Skill Matching" ? "Pros are matched on verified skills, experience, and past performance." : title === "Dynamic Pricing & ETAs" ? "Real-time pricing and accurate arrival estimates." : "AI-powered verification and fraud prevention for every booking."}</p></div></div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-hearth-gold-500/30 to-hearth-copper-500/30 rounded-3xl blur-xl opacity-50" />
              <Card variant="golden" padding="lg" className="relative"><div className="space-y-3"><p className="text-sm bg-hearth-surface-700 rounded-2xl p-4 max-w-[85%]">My AC is making a weird noise and not cooling properly. Can someone come check it today?</p><div className="flex justify-end"><div className="bg-hearth-gold-500/15 border border-hearth-gold-500/20 rounded-2xl p-4 max-w-[85%]"><p className="text-sm">I found 3 top-rated AC technicians near you:</p><div className="mt-2 space-y-2">{[{ name: "Rajesh K", rating: 4.9, price: "₹499" },{ name: "Amit S", rating: 4.8, price: "₹449" },{ name: "Suresh P", rating: 4.7, price: "₹399" }].map((p) => (<div key={p.name} className="flex items-center justify-between bg-hearth-surface-800/50 rounded-xl p-2 text-xs"><div><span className="font-medium">{p.name}</span><span className="text-hearth-gold-400 ml-2">★ {p.rating}</span></div><div className="text-right"><div className="font-medium">{p.price}</div></div></div>))}</div></div></div><p className="text-sm bg-hearth-surface-700 rounded-2xl p-4 max-w-[85%]">Book Rajesh at 4:30 PM please!</p><div className="flex justify-end"><div className="bg-hearth-gold-500/15 border border-hearth-gold-500/20 rounded-2xl p-4 max-w-[85%]"><p className="text-sm">✅ Done! Rajesh Kumar will arrive at <strong>4:30 PM</strong> today. Total: ₹499.</p></div></div></div></Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative rounded-3xl bg-gradient-to-br from-hearth-surface-800 to-hearth-surface-900 border border-hearth-gold-500/20 p-12 md:p-16 overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hearth-gold-500/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <Badge variant="gold" className="mb-6" icon={<Sparkles className="h-3 w-3" />}>Get Started Today</Badge>
                <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"><span className="text-hearth-muted-foreground">Ready to Experience </span><span className="text-gradient-gold">Hearth AI?</span></h2>
                <p className="text-lg text-hearth-muted-foreground/60 mb-8">Join 1.2 million+ Indians who trust Hearth AI for all their service needs. Your first booking is on us.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup"><Button variant="luxury" size="xl"><Sparkles className="h-5 w-5" />Get Started Free</Button></Link>
                  <Link href="/services"><Button variant="secondary" size="xl">Browse Services</Button></Link>
                </div>
                <p className="text-xs text-hearth-muted-foreground/40 mt-4">No credit card required. First booking up to ₹500 free.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}