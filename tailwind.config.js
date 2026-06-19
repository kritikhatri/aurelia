/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plum: {
          light: '#5B2C3F',
          DEFAULT: '#3B1824',
          dark: '#2A0E18',
        },
        gold: {
          light: '#EAD180',
          DEFAULT: '#D4AF37',
          dark: '#B08E22',
        },
        ivory: {
          DEFAULT: '#FAF9F6',
          dark: '#F0EFEA',
        },
        obsidian: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
          dark: '#0A0A0A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
