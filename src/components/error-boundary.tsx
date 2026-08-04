"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps { children: React.ReactNode; fallback?: React.ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; errorCount: number; }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false, error: null, errorCount: 0 }; }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> { return { hasError: true, error }; }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState((prev) => ({ errorCount: prev.errorCount + 1 }));
    this.props.onError?.(error, errorInfo);
    if (this.state.errorCount < 3) { this.retryTimeout = setTimeout(() => this.handleRetry(), 2000 * Math.pow(2, this.state.errorCount)); }
  }

  componentWillUnmount(): void { if (this.retryTimeout) clearTimeout(this.retryTimeout); }

  handleRetry = (): void => { this.setState({ hasError: false, error: null }); };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8" role="alert" aria-live="assertive">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10"><AlertTriangle className="h-8 w-8 text-red-400" /></div>
            <h2 className="mb-2 text-xl font-semibold text-hearth-muted-foreground">Something went wrong</h2>
            <p className="mb-2 text-sm text-hearth-muted-foreground/60">{this.state.error?.message || "An unexpected error occurred"}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="luxury" onClick={this.handleRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>Try Again</Button>
              <Button variant="secondary" onClick={() => (window.location.href = "/")} leftIcon={<Home className="h-4 w-4" />}>Go Home</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}