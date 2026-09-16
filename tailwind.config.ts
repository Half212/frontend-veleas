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
        // Nova Paleta Nobre: Preto & Verde (Psicologia de Confiança, Elegância e Credibilidade)
        "brand-green": {
          50: "#F2F7F4",
          100: "#E3ECE7",
          200: "#C5D8CE",
          300: "#A1C1B0",
          400: "#6B9F83",
          500: "#467D62",
          600: "#34664F",
          700: "#27503D",
          800: "#1C3C2D",
          900: "#142E22",
          950: "#0C1D15",
        },
        "brand-dark": {
          950: "#0A0E0C",
          900: "#111614",
          800: "#1C2420",
          700: "#2B3731",
          600: "#44544D",
          500: "#63776F",
          400: "#8B9E96",
          300: "#BAC6C0",
          200: "#DFE5E2",
          100: "#F0F4F2",
          50: "#F7FAF8",
        },
        "accent-gold": {
          DEFAULT: "#C89D42",
          hover: "#B38934",
          light: "#F5ECD7",
        },
        // Tokens semânticos alinhados
        "primary": "#142E22",
        "primary-hover": "#1C3C2D",
        "primary-light": "#E3ECE7",
        "primary-container": "#1C3C2D",
        "on-background": "#111614",
        "background": "#F7FAF8",
        "surface": "#FFFFFF",
        "surface-container": "#F0F4F2",
        "surface-container-high": "#E3ECE7",
        "on-surface-variant": "#44544D",
        // Mapeamento retrocompatível para garantir consistência estética total
        "heritage-red": "#142E22",
        "golden-honey": "#34664F",
        "wax-cream": "#FFFFFF",
        "deep-earth": "#111614",
        "saojoao": "#142E22",
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