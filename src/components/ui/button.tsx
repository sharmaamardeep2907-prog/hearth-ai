"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hearth-ring focus-visible:ring-offset-2 focus-visible:ring-offset-hearth-surface disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-hearth-gold-400 to-hearth-copper-500 text-white shadow-hearth-glow hover:shadow-hearth-glow-lg hover:from-hearth-gold-500 hover:to-hearth-copper-600",
        secondary: "bg-hearth-surface-800 text-hearth-muted-foreground border border-hearth-border hover:bg-hearth-surface-700 hover:border-hearth-gold-500/30 hover:text-white",
        outline: "border border-hearth-gold-500/30 text-hearth-gold-400 hover:bg-hearth-gold-500/10 hover:border-hearth-gold-500/50",
        ghost: "text-hearth-muted-foreground hover:bg-hearth-surface-700 hover:text-white",
        destructive: "bg-red-900/20 text-red-400 border border-red-500/20 hover:bg-red-900/40 hover:border-red-500/40",
        link: "text-hearth-gold-400 underline-offset-4 hover:underline",
        luxury: "relative overflow-hidden bg-hearth-surface-800 border border-hearth-gold-500/20 text-white hover:border-hearth-gold-500/50 hover:shadow-hearth-glow group",
      },
      size: { sm: "h-9 px-4 text-sm gap-2 rounded-lg", md: "h-11 px-6 text-sm gap-2", lg: "h-13 px-8 text-base gap-3 rounded-2xl", xl: "h-14 px-10 text-lg gap-3 rounded-2xl", icon: "h-10 w-10 rounded-xl" },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, fullWidth, className }))} ref={ref} disabled={disabled || loading} {...props}>
        {loading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
        {variant === "luxury" && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };