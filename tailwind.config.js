/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hearth: {
          gold: { 50: "#FDF8F0", 100: "#F9EDD8", 200: "#F3D9A8", 300: "#EBC278", 400: "#E2A94A", 500: "#D4952E", 600: "#B87B24", 700: "#96631D", 800: "#7A4F17", 900: "#654014", 950: "#3D270A" },
          copper: { 50: "#FDF5F0", 100: "#FAE5D9", 200: "#F2C7AA", 300: "#E9A278", 400: "#E07D48", 500: "#C7652E", 600: "#A55024", 700: "#83401D", 800: "#6B3418", 900: "#572B14", 950: "#351A0B" },
          surface: { DEFAULT: "#0C0A09", 50: "#FAFAF9", 100: "#F5F0EB", 200: "#E6DED5", 300: "#D1C5B8", 400: "#A89889", 500: "#7C6F64", 600: "#5C524A", 700: "#443C36", 800: "#2D2723", 900: "#1C1815", 950: "#0C0A09" },
          muted: { DEFAULT: "#27221E", foreground: "#8C827A" },
          border: "#292420",
          ring: "#D4952E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "hearth-sm": "0 1px 2px 0 rgb(0 0 0 / 0.3)",
        "hearth-md": "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)",
        "hearth-lg": "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
        "hearth-xl": "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
        "hearth-glow": "0 0 20px 0 rgb(212 149 46 / 0.15), 0 0 40px 0 rgb(212 149 46 / 0.05)",
        "hearth-glow-lg": "0 0 40px 0 rgb(212 149 46 / 0.2), 0 0 80px 0 rgb(212 149 46 / 0.08)",
        "hearth-inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-scale": "fadeScale 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulseGlow 3s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeScale: { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGlow: { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-20px)" } },
      },
    },
  },
  plugins: [],
};