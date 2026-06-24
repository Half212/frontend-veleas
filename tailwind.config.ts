import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-background": "#1f1b12",
        "background": "#f5d8b5ff",
        "primary": "#6b0001",
        "heritage-red": "#8C1C13",
        "surface": "#dfcfbcff",
        "golden-honey": "#e29e2fff",
        "surface-container-high": "#f0e7d8",
        "surface-container": "#f6edde",
        "wax-cream": "#FFF6E7",
        "deep-earth": "#412903",
        "on-surface-variant": "#58413e",
        "primary-container": "#8c1c13",
        "saojoao": "#244B2C"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        "gutter": "24px",
        "max-width": "1280px",
      },
      fontFamily: {
        "display-lg": ["var(--font-eb-garamond)", "serif"],
        "headline-md": ["var(--font-eb-garamond)", "serif"],
        "headline-sm": ["var(--font-eb-garamond)", "serif"],
        "body-lg": ["var(--font-source-serif-4)", "serif"],
        "body-md": ["var(--font-source-serif-4)", "serif"],
        "label-lg": ["var(--font-libre-franklin)", "sans-serif"],
        "label-sm": ["var(--font-libre-franklin)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
      }
    },
  },
  plugins: [],
};

export default config;