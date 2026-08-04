"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hearth-surface"><div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-hearth-gold-500/5 rounded-full blur-[120px]" /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><div className="h-9 w-9 bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 rounded-xl flex items-center justify-center"><Sparkles className="h-5 w-5 text-white" /></div><span className="font-display text-xl font-bold">HEARTH<span className="text-hearth-gold-400"> AI</span></span></Link>
        </div>
        <Card variant="default" padding="lg">
          <div className="text-center mb-6"><h1 className="text-2xl font-display font-bold text-hearth-muted-foreground mb-1">Welcome Back</h1><p className="text-sm text-hearth-muted-foreground/50">Sign in to your Hearth AI account</p></div>
          <form className="space-y-4">
            <Input label="Email" placeholder="you@example.com" type="email" leftIcon={<Mail className="h-4 w-4" />} />
            <Input label="Password" placeholder="••••••••" type={showPassword ? "text" : "password"} leftIcon={<Lock className="h-4 w-4" />} rightIcon={showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />} />
            <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-hearth-muted-foreground/60"><input type="checkbox" className="rounded border-hearth-border" />Remember me</label><Link href="/forgot-password" className="text-hearth-gold-400 hover:underline">Forgot password?</Link></div>
            <Button variant="luxury" fullWidth size="lg" type="submit">Sign In <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-hearth-border" /></div><div className="relative flex justify-center text-xs"><span className="bg-hearth-surface-800 px-4 text-hearth-muted-foreground/50">or continue with</span></div></div>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="secondary" fullWidth size="md">G</Button>
            <Button variant="secondary" fullWidth size="md">GH</Button>
            <Button variant="secondary" fullWidth size="md">G</Button>
          </div>
          <p className="text-center text-sm text-hearth-muted-foreground/50 mt-6">Don&apos;t have an account? <Link href="/signup" className="text-hearth-gold-400 font-medium hover:underline">Sign Up</Link></p>
        </Card>
      </motion.div>
    </div>
  );
}