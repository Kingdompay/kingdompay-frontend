/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark-green': '#1A3F22',
        'secondary-olive-green': '#58761B',
        'gold-accent': '#D99201',
        'bronze-support': '#905A01',
        'neutral-white': '#FFFFFF',
        'light-gray': '#F7F7F7',
        'light-olive': '#E9F0E1',
        'muted-olive-gray': '#A0A89B',
      },
      fontFamily: {
        'google-sans': ['Google Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
