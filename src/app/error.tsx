"use client";

import { ErrorBoundary } from "@/components/error-boundary";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorBoundary fallback={
        <div className="text-center p-8 max-w-md">
          <h1 className="text-4xl font-display font-bold text-hearth-muted-foreground mb-4">Oops!</h1>
          <p className="text-hearth-muted-foreground/60 mb-2">{error.message || "An unexpected error occurred"}</p>
          {error.digest && <p className="text-xs text-hearth-muted-foreground/40 mb-6">Error ID: {error.digest}</p>}
          <button onClick={reset} className="px-6 py-3 bg-hearth-gold-500 text-white rounded-xl font-medium hover:bg-hearth-gold-600 transition-colors">Try Again</button>
        </div>
      }><div /></ErrorBoundary>
    </div>
  );
}