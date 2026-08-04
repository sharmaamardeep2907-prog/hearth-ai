"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: { (...args: unknown[]): void; q: unknown[] };
    dataLayer?: unknown[];
  }
}

export const Analytics = {
  init(ga4Id?: string, clarityId?: string): void {
    if (ga4Id && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      script.async = true;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) { window.dataLayer?.push(args); };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id, { send_page_view: true, anonymize_ip: true });
    }
    if (clarityId && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`;
      document.head.appendChild(script);
    }
  },
  pageView(url: string, title?: string): void {
    if (window.gtag) window.gtag("event", "page_view", { page_title: title || document.title, page_location: url });
  },
  event(action: string, params?: Record<string, unknown>): void {
    if (window.gtag) window.gtag("event", action, params);
    if (window.clarity) window.clarity("event", action, JSON.stringify(params || {}));
  },
  conversion(type: string, value?: number): void {
    this.event("conversion", { conversion_type: type, value: value || 0, currency: "INR" });
  },
  error(error: Error, context?: string): void {
    this.event("exception", { description: `${context || "unknown"}: ${error.message}`, fatal: false });
  },
  aiUsage(feature: string, tokens?: number, latencyMs?: number): void {
    this.event("ai_usage", { feature, tokens, latency_ms: latencyMs });
  },
  journey(step: string, from?: string): void {
    this.event("user_journey", { step, from: from || document.referrer || "direct" });
  },
  search(query: string, resultsCount?: number): void {
    this.event("search", { search_term: query, results_count: resultsCount || 0 });
  },
  bookingFunnel(step: "viewed" | "searched" | "selected" | "booked" | "paid", details?: Record<string, unknown>): void {
    this.event("booking_funnel", { step, ...details });
  },
};