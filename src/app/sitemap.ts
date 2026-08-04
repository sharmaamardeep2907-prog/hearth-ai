import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hearth.ai";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
  const categories = ["electrician","plumber","ac-repair","carpenter","painter","cleaning","salon-spa","tutor","photographer","mechanic","interior-designer","appliances","event-planner","pest-control","movers-packers","laptop-repair","mobile-repair","doctors","lawyers","consultants"];
  const catRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({ url: `${baseUrl}/services/${slug}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 }));
  return [...staticRoutes, ...catRoutes];
}