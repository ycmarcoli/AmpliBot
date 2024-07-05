import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': {
          DEFAULT: '#353A5F',
          dark: '#252741',
        },
        'secondary': {
          DEFAULT: '#ECCA73',
          light: '#F1D898'
        },
        'offwhite': {
          DEFAULT: '#ECDEC3',
        },
      },
    },
  },
  plugins: [],
};
export default config;
