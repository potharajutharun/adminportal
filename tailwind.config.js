/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGradientFrom: "#1e3a8a",
        brandGradientTo: "#3b82f6",
      },
    },
  },
  plugins: [],
};
