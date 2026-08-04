import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { RouteTracker } from "@/components/route-tracker";
import { Toaster } from "sonner";
import { generateOrganizationSchema } from "@/lib/schema";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hearth.ai"),
  title: { default: "Hearth AI — AI-Powered Service Marketplace", template: "%s | Hearth AI" },
  description: "Discover, book, and track trusted professionals for every home and business service. Powered by AI — faster, smarter, premium.",
  keywords: ["service marketplace", "home services", "professional services", "AI booking", "electrician", "plumber", "AC repair", "India"],
  authors: [{ name: "Hearth AI Team" }],
  creator: "Hearth AI",
  publisher: "Hearth AI",
  openGraph: {
    type: "website", locale: "en_IN", url: "https://hearth.ai", siteName: "Hearth AI",
    title: "Hearth AI — AI-Powered Premium Service Marketplace",
    description: "Discover, book, and track trusted professionals for every home and business service. Powered by AI — faster, smarter, premium.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hearth AI — Premium Service Marketplace" }],
  },
  twitter: {
    card: "summary_large_image", site: "@hearthai", creator: "@hearthai",
    title: "Hearth AI — AI-Powered Premium Service Marketplace",
    description: "Discover, book, and track trusted professionals for every home and business service. Powered by AI.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": 200 } },
  alternates: { canonical: "https://hearth.ai" },
  manifest: "/manifest.json",
  category: "Technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
        <link rel="dns-prefetch" href="https://api.hearth.ai" />
      </head>
      <body className="bg-hearth-surface text-hearth-muted-foreground font-body antialiased">
        <AnalyticsProvider ga4Id={ga4Id} clarityId={clarityId}>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col bg-noise">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Suspense fallback={null}><RouteTracker /></Suspense>
              <Toaster position="top-right" toastOptions={{ style: { background: "hsl(30, 12%, 7%)", color: "hsl(30, 10%, 68%)", border: "1px solid hsl(30, 8%, 16%)", borderRadius: "12px" } }} />
            </ErrorBoundary>
          </ThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}