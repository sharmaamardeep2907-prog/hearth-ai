"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  open: boolean; onClose: () => void;
  title?: string; description?: string; children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full"; className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, children, size = "md", className }) => {
  React.useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; } else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", full: "max-w-[90vw] max-h-[90vh]" };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("relative z-10 w-full rounded-2xl border border-hearth-border bg-hearth-surface-800 shadow-hearth-xl overflow-hidden", sizes[size], className)}>
            {(title || description) && (
              <div className="flex items-start justify-between p-6 pb-4 border-b border-hearth-border">
                <div>
                  {title && <h2 className="text-lg font-semibold text-hearth-muted-foreground">{title}</h2>}
                  {description && <p className="text-sm text-hearth-muted-foreground/60 mt-1">{description}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -mr-1 -mt-1"><X className="h-4 w-4" /></Button>
              </div>
            )}
            <div className={cn(!title && !description ? "p-6" : "p-6")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
export type { ModalProps };