/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px', // Full HD Resolution (1920x1080)
        '4xl': '2560px', // 4K Resolution (3840x2160)

      },
    },
  },
  plugins: [],
}