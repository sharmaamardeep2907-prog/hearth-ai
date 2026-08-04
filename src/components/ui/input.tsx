"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
  label?: string; error?: string; hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, label, error, hint, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-hearth-muted-foreground/80">{label}</label>}
        <div className="relative group">
          {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-hearth-muted-foreground/50 group-focus-within:text-hearth-gold-400 transition-colors">{leftIcon}</div>}
          <input id={inputId} type={type} className={cn(
            "flex h-11 w-full rounded-xl border bg-hearth-surface-800 px-4 text-sm text-hearth-muted-foreground placeholder:text-hearth-muted-foreground/30 transition-all duration-200",
            "border-hearth-border hover:border-hearth-muted-foreground/30 focus:border-hearth-gold-500/50 focus:ring-2 focus:ring-hearth-gold-500/20 focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            leftIcon && "pl-10", rightIcon && "pr-10",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            className
          )} ref={ref} {...props} />
          {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-hearth-muted-foreground/50">{rightIcon}</div>}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-hearth-muted-foreground/50">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };