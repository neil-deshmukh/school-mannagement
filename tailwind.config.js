/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neue: "#C3EBFA",
        neuelight: "#EDF9FD",
        nele: "#CFCEFF",
        nelelight: "#F1F0FF",
        neow: "#FAE27C",
        neowlight: "#FEFCE8"
      }
    },
  },
  plugins: [],
};
