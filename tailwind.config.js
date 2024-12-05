/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin"; // Import flowbite plugin

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
      },
      colors: {
        primary: "#192d50", // lighter color
        secondary: "#f0f3fb", // dark color
        ternary: "#FFB404", // darker color
      },
      fontWeight: {
        500: 500,
        300: 300,
        400: 400,
      },
    },
  },
  plugins: [flowbite], // Use the imported plugin
};
