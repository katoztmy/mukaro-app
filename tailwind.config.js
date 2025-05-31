/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        base: "#F9FAFB",
        text: "#111827",
        "text-secondary": "#4B5563",
        "text-tertiary": "#6B7280",
        "text-placeholder": "#737373",
        orange: "#F97316",
        "gradient-from": "#FB923C",
        "gradient-to": "#EC4899",
        "gradient-purple-from": "#C084FC",
        "gradient-purple-to": "#F472B6",
        error: "#EF4444",
        "yellow-light": "#FEF9C3",
        border: "#E5E5E5",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
