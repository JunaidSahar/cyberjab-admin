/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue", // Include the root Vue file
    "./components/**/*.{vue,js,ts}", // Include components
    "./pages/**/*.{vue,js,ts}", // Include pages
    "./layouts/**/*.{vue,js,ts}", // Include layouts
    "./plugins/**/*.{js,ts}", // Include plugins
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        darkBackground: "#15161A",
        border: "#222637",
        darkForeground: "#1E1F23",
        headingColor: "#E2E2E2",
        primaryBlue: "#0800F7",
        flatWhite: "#FAFAFA",
        lightGray: "#F2F2F2",
      },
    },
  },
  plugins: [],
};
