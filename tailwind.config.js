/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#75C928",
        "primary-dark": "#559E1C",
        accent: "#F4C430",
        charcoal: "#171717",
        surface: "#F8FAF7",
      },
    },
  },
  plugins: [],
};
