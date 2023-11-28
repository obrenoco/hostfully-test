/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D2AA5",
        secondary: "#40CAA1",
        "tertiary-yellow": "#FFC454",
        "tertiary-purple": "#8A5BDA",
        "tertiary-orange": "#FF7254",
        "tertiary-text": "#3C3A46",
        "tertiary-text-dark": "#19172A",
        background: "#F3F3F7",
        "light-grey": "#dcdcdc",
      },
    },
  },
  plugins: [],
};
