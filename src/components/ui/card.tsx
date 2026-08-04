"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "glass" | "golden" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const baseStyles = "rounded-2xl border transition-all duration-300 overflow-hidden";
    const variants = {
      default: "bg-hearth-surface-800 border-hearth-border",
      elevated: "bg-hearth-surface-700 border-hearth-border shadow-hearth-lg",
      glass: "bg-hearth-surface-800/60 backdrop-blur-xl border-hearth-border/50",
      golden: "bg-hearth-surface-800 border-hearth-gold-500/20 shadow-hearth-glow",
      interactive: "bg-hearth-surface-800 border-hearth-border hover:border-hearth-gold-500/30 hover:shadow-hearth-glow cursor-pointer",
    };
    const paddings = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" };
    return (
      <motion.div ref={ref} className={cn(baseStyles, variants[variant], paddings[padding], className)}
        whileHover={variant === "interactive" ? { y: -2 } : undefined} transition={{ duration: 0.2 }} {...props}>
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold text-hearth-muted-foreground tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-hearth-muted-foreground/60", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };