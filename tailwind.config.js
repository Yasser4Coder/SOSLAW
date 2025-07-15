/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#09142b",
        "brand-gold": "#c8a45e",
        "brand-gold-light": "#e7cfa7",
        "brand-bg": "#faf6f0",
      },
    },
  },
  plugins: [],
};
