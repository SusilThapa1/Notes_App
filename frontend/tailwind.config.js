/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "screen-minus-64": "calc(100vh - 64px)",
        "screen-minus-50": "calc(100vh - 48px)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #f43f5e, #14b8a6, #fb923c)",
      },
      screens: {
        "3xl": "1600px", // Custom breakpoint for greater than 2xl
      },
    },
  },
  plugins: [],
};
