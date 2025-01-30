import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        "roboto-mono": ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
