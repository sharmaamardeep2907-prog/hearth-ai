/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react", "framer-motion",
      "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu",
    ],
  },
};
module.exports = nextConfig;