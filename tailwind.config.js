import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/App.tsx', 
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './src/modules/core/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/core/design-system/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/payment/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/auth/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}', 
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
}