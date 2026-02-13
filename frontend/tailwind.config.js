/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'judo-red': '#E60000',
        'judo-dark': '#111111',
        'judo-gray': '#666666',
        'light-gray': '#f9f9f9',
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        'fill-flash': {
          '0%':   { backgroundColor: 'transparent' },
          '30%':  { backgroundColor: 'rgba(230, 0, 0, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'fill-flash': 'fill-flash 500ms ease-out',
      },
    },
  },
  plugins: [],
}