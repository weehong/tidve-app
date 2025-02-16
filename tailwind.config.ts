import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        canela: ["Canela Text"],
        roobert: ["Roobert"],
        bricolage: ["Bricolage Grotesque"],
        instrument: ["Instrument Sans"],
      },
    },
  },
  plugins: [],
} satisfies Config;
