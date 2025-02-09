/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Nunito"],
      },
      transitionDuration: {
        0: "0ms",
        1500: "1500ms",
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
