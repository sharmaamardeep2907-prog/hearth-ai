"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 pb-20">
      <div className="absolute inset-0 bg-hearth-surface"><div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-hearth-gold-500/5 rounded-full blur-[120px]" /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><div className="h-9 w-9 bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 rounded-xl flex items-center justify-center"><Sparkles className="h-5 w-5 text-white" /></div><span className="font-display text-xl font-bold">HEARTH<span className="text-hearth-gold-400"> AI</span></span></Link>
        </div>
        <Card variant="default" padding="lg">
          <div className="text-center mb-6"><h1 className="text-2xl font-display font-bold text-hearth-muted-foreground mb-1">Join Hearth AI</h1><p className="text-sm text-hearth-muted-foreground/50">Create your account and get ₹500 off your first booking</p></div>
          <form className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" leftIcon={<User className="h-4 w-4" />} />
            <Input label="Email" placeholder="you@example.com" type="email" leftIcon={<Mail className="h-4 w-4" />} />
            <Input label="Phone (Optional)" placeholder="+91 98765 43210" type="tel" leftIcon={<Phone className="h-4 w-4" />} />
            <Input label="Password" placeholder="Min. 8 characters" type={showPassword ? "text" : "password"} leftIcon={<Lock className="h-4 w-4" />} rightIcon={showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />} />
            <div className="space-y-2 text-sm text-hearth-muted-foreground/60">{["8+ characters", "1 uppercase letter", "1 number"].map(r => <div key={r} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />{r}</div>)}</div>
            <label className="flex items-start gap-2 text-sm text-hearth-muted-foreground/60"><input type="checkbox" className="mt-0.5 rounded border-hearth-border" />I agree to the <Link href="/terms" className="text-hearth-gold-400 hover:underline">Terms</Link> and <Link href="/privacy" className="text-hearth-gold-400 hover:underline">Privacy Policy</Link></label>
            <Button variant="luxury" fullWidth size="lg" type="submit">Create Account <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <p className="text-center text-sm text-hearth-muted-foreground/50 mt-6">Already have an account? <Link href="/login" className="text-hearth-gold-400 font-medium hover:underline">Sign In</Link></p>
        </Card>
      </motion.div>
    </div>
  );
}