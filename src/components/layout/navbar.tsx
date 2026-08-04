"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Menu, X, ChevronDown, Sparkles, Bell, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { serviceCategories } from "@/data/categories";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: serviceCategories.map((c) => ({ label: c.name, href: `/services/${c.slug}` })) },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Professionals", href: "/pro" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", isScrolled ? "bg-hearth-surface/80 backdrop-blur-xl border-b border-hearth-border/50 shadow-hearth-sm" : "bg-transparent")}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-hearth-surface-800 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-hearth-gold-400" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-hearth-muted-foreground">HEARTH<span className="text-hearth-gold-400"> AI</span></span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={item.href} className={cn("flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200", "text-hearth-muted-foreground/70 hover:text-hearth-muted-foreground hover:bg-hearth-surface-700/50")}>
                    {item.label}{item.children && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                  </Link>
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="bg-hearth-surface-800 border border-hearth-border rounded-2xl shadow-hearth-xl p-3 w-[580px] backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-1">
                          {item.children.map((child: { label: string; href: string }) => (
                            <Link key={child.label} href={child.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-hearth-surface-700/70 transition-colors">
                              <div className="h-8 w-8 rounded-lg bg-hearth-gold-500/10 flex items-center justify-center shrink-0"><span className="text-hearth-gold-400 text-xs font-bold">{child.label.charAt(0)}</span></div>
                              <span className="text-sm text-hearth-muted-foreground/80">{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex"><Search className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex"><Heart className="h-4 w-4" /></Button>
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link href="/signup"><Button variant="luxury" size="sm"><Sparkles className="h-3.5 w-3.5" />Join Hearth</Button></Link>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[320px] bg-hearth-surface-800 border-l border-hearth-border shadow-hearth-xl overflow-y-auto">
              <div className="p-6 pt-20 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center justify-between px-4 py-3 rounded-xl text-hearth-muted-foreground/80 hover:bg-hearth-surface-700 transition-colors" onClick={() => setMobileOpen(false)}><span className="font-medium">{item.label}</span></Link>
                ))}
                <div className="pt-6 px-4 space-y-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="secondary" fullWidth>Sign In</Button></Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}><Button variant="luxury" fullWidth><Sparkles className="h-4 w-4" />Join Hearth</Button></Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}