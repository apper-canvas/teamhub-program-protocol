/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4A5FF7',
          600: '#4338CA',
          700: '#3730A3'
        },
        success: {
          500: '#10B981',
          100: '#D1FAE5'
        },
        warning: {
          500: '#F59E0B',
          100: '#FEF3C7'
        },
        error: {
          500: '#EF4444',
          100: '#FEE2E2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}