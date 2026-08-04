import type { Viewport } from "next";
import type { Metadata } from "next";

export const viewport: Viewport = { themeColor: "#0C0A09", width: "device-width", initialScale: 1, maximumScale: 1, colorScheme: "dark" };

export default function manifest(): Metadata { return { manifest: "/manifest.json" } as Metadata; }