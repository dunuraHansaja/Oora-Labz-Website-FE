const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/preline/dist/*.js",
    "./src/assets/libs/*",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "100px",
      },
      screens: {
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },

    extend: {
      colors: {
        primary: {
          light: "#009688",
          dark: "#000000",
        },
        secondary: {
          dark: "#1D2822",
          white: "#FFFFFF",
        },
      },
      screens: {
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      fontSize: {
       
        body1: ["18px", { lineHeight: "26px" }],
        body2: ["16px", { lineHeight: "24px" }],
        body3: ["14px", { lineHeight: "21px" }],
      },
    },
  },
  plugins: [require("preline/plugin")],
};
