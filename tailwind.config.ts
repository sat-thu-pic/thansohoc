import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        advisor: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#c7d6ff',
          300: '#a1b8ff',
          400: '#718cff',
          500: '#475fff',
          600: '#2e39ff',
          700: '#2429ff',
          800: '#1b1ec4',
          900: '#1d219a',
          950: '#11135c',
        },
      },
    },
  },
  plugins: [],
};
export default config;
