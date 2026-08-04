"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: { xs: "h-6 w-6 text-[10px]", sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base", xl: "h-14 w-14 text-lg", "2xl": "h-16 w-16 text-xl", "3xl": "h-20 w-20 text-2xl" },
  },
  defaultVariants: { size: "md" },
});

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string; alt?: string; fallback?: string;
}

function Avatar({ className, size, src, alt = "", fallback, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !error ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setError(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-hearth-gold-500/20 to-hearth-copper-500/20 text-hearth-gold-400 font-medium">
          {fallback?.slice(0, 2).toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };