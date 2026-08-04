export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hearth AI", url: "https://hearth.ai", logo: "https://hearth.ai/logo.png",
    description: "AI-powered marketplace connecting you with verified professionals across 20+ service categories.",
    foundingDate: "2024",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "support@hearth.ai" },
    sameAs: ["https://twitter.com/hearthai", "https://linkedin.com/company/hearthai", "https://instagram.com/hearthai"],
    address: { "@type": "PostalAddress", addressCountry: "IN", addressLocality: "Mumbai" },
  };
}

export function generateServiceSchema(category: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    provider: { "@type": "Organization", name: "Hearth AI" },
    areaServed: { "@type": "Country", name: "India" },
    category,
    serviceType: "Professional Services",
  };
}