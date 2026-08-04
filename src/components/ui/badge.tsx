"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-hearth-border bg-hearth-surface-700 text-hearth-muted-foreground/80",
        gold: "border-hearth-gold-500/30 bg-hearth-gold-500/10 text-hearth-gold-400",
        copper: "border-hearth-copper-500/30 bg-hearth-copper-500/10 text-hearth-copper-400",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        destructive: "border-red-500/30 bg-red-500/10 text-red-400",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        outline: "text-hearth-muted-foreground/70",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { icon?: React.ReactNode; }

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1.5">{icon}</span>}{children}
    </div>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };