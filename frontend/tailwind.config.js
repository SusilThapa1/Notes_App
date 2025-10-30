/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "screen-minus-64": "calc(100vh - 64px)",
        "screen-minus-50": "calc(100vh - 50px)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #f43f5e, #14b8a6, #fb923c)",
      },
      screens: {
        "3xl": "1600px", // Custom breakpoint for greater than 2xl
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    colors: {
        // Main heading text theme
        lightGreen: "#5CAC54",
        darkGreen: "#4A9549",

        // Button colors
        addNormal: "#5CAC54",
        addHover: "#4A9549",

        editNormal: "#3B82F6",
        editHover: "#2563EB",

        deleteNormal: "#EF4444",
        deleteHover: "#DC2626",

        // Outlined button text colors
        addOutlineText: "#5CAC54",
        editOutlineText: "#3B82F6",
        deleteOutlineText: "#EF4444",

        // Outlined button backgrounds
        addOutlineHover: "#4A9549",
        editOutlineHover: "#2563EB",
        deleteOutlineHover: "#DC2626",

        // Subtext
        subTextLight: "#6B7280",
        subTextDark: "#9CA3AF",

        // Backgrounds
        light: "#e5e5e5",
        dark: "#0d1117",

        // Text
        textLight: "#111",
        textDark: "#d6e6e6",
      },

      keyframes: {
        bgchange: {
          "0%,20%": {
            "background-image":
              "url('https://plus.unsplash.com/premium_photo-1713296254777-0a89f05dcb60?auto=format&fit=crop&w=1930&q=80')",
          },
          "50%": {
            "background-image":
              "url('https://plus.unsplash.com/premium_photo-1683749808307-e5597ac69f1e?auto=format&fit=crop&w=2070&q=80')",
          },
          "80%,100%": {
            "background-image":
              "url('https://png.pngtree.com/thumb_back/fw800/background/20250728/pngtree-cozy-study-room-with-an-open-book-green-plants-and-a-image_17654821.webp')",
          },
        },
      },
      animation: {
        "bg-slide": "bgchange 15s ease-in-out infinite",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant(
        "hover-supported",
        "@media (hover: hover) and (pointer: fine)"
      );
    },
  ],
};
