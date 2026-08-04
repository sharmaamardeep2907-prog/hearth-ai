"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarsProps {
  rating: number; size?: "sm" | "md" | "lg";
  showValue?: boolean; reviewCount?: number; className?: string;
}

function Stars({ rating, size = "md", showValue = false, reviewCount, className }: StarsProps) {
  const sizeClasses = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(Math.max(rating - star + 1, 0), 1);
          return (
            <div key={star} className="relative">
              <Star className={cn(sizeClasses[size], "text-hearth-muted-foreground/20 fill-hearth-muted-foreground/20")} />
              {fill > 0 && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star className={cn(sizeClasses[size], "text-hearth-gold-400 fill-hearth-gold-400")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && <span className={cn("font-semibold text-hearth-muted-foreground", textSizes[size])}>{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && <span className={cn("text-hearth-muted-foreground/50", textSizes[size])}>({reviewCount})</span>}
    </div>
  );
}

export { Stars };