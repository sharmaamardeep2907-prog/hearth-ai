"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { serviceCategories } from "@/data/categories";

const footerLinks = {
  Services: serviceCategories.slice(0, 8).map((c) => ({ label: c.name, href: `/services/${c.slug}` })),
  Company: [{ label: "About Us", href: "/about" },{ label: "Careers", href: "/careers" },{ label: "Blog", href: "/blog" },{ label: "Contact", href: "/contact" }],
  Support: [{ label: "Help Center", href: "/help" },{ label: "Safety", href: "/safety" },{ label: "Terms of Service", href: "/terms" },{ label: "Privacy Policy", href: "/privacy" }],
  "For Pros": [{ label: "Join as Professional", href: "/pro/join" },{ label: "Pro Resources", href: "/pro/resources" },{ label: "Partner Program", href: "/pro/partner" }],
};

export function Footer() {
  return (
    <footer className="relative border-t border-hearth-border bg-hearth-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-hearth-surface-800 to-hearth-surface-900 border border-hearth-gold-500/10 p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-hearth-gold-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-2xl font-display font-bold text-hearth-muted-foreground mb-2">Get the latest from <span className="text-hearth-gold-400">Hearth AI</span></h3>
              <p className="text-hearth-muted-foreground/60">New services, offers, and AI features — right in your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input placeholder="Enter your email" className="min-w-[240px] bg-hearth-surface-700 border-hearth-border" />
              <Button variant="luxury">Subscribe<ArrowUpRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 rounded-xl flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
              <span className="font-display text-lg font-bold">HEARTH<span className="text-hearth-gold-400"> AI</span></span>
            </Link>
            <p className="text-sm text-hearth-muted-foreground/60 mb-4 leading-relaxed">AI-powered service marketplace connecting you with trusted professionals for every need.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-hearth-muted-foreground mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (<li key={link.label}><Link href={link.href} className="text-sm text-hearth-muted-foreground/60 hover:text-hearth-gold-400 transition-colors">{link.label}</Link></li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-hearth-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-hearth-border/50">
            <p className="text-xs text-hearth-muted-foreground/40">&copy; {new Date().getFullYear()} Hearth AI. Made with <Heart className="inline h-3 w-3 text-hearth-gold-400 fill-hearth-gold-400" /> for India.</p>
            <div className="flex items-center gap-4 text-xs text-hearth-muted-foreground/40">
              <Link href="/terms" className="hover:text-hearth-muted-foreground/60 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-hearth-muted-foreground/60 transition-colors">Privacy</Link>
              <Link href="/sitemap" className="hover:text-hearth-muted-foreground/60 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}