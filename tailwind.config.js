/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#1A3F22',  // Primary dark green
          700: '#14301a',
          800: '#0D1B0F',  // Very dark green
          900: '#0a150c',
        },
        'secondary-olive-green': '#58761B',
        'gold-accent': '#D99201',
        'bronze-support': '#905A01',
        'neutral-white': '#FFFFFF',
        'light-gray': '#FFFFFF',
        'light-olive': '#E9F0E1',
        'muted-olive-gray': '#A0A89B',
        // Dark mode specific colors
        'dark': {
          bg: '#0D1B0F',
          surface: '#1A2E1D',
          'surface-variant': '#243B28',
          card: '#2A3F2E',
          text: '#E8F5E8',
          'text-secondary': '#A8C4A8',
          'text-muted': '#7A9A7A',
          border: '#2D4A32',
          'border-light': '#3A5A3F',
        }
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
