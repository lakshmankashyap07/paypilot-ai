/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fk: {
          blue: '#2874F0',
          blueDark: '#1E5FD0',
          yellow: '#FFCA28',
          yellowBright: '#FFE500',
          orange: '#FF9F00',
          bg: '#F1F3F6',
          surface: '#FFFFFF',
          text: '#212121',
          muted: '#666666',
          subtle: '#878787',
          border: '#E0E0E0',
          borderLight: '#F0F0F0',
          green: '#388E3C',
          red: '#D32F2F'
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#2874F0',
          600: '#1E5FD0',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          accent: '#FFCA28',
          dark: '#212121',
          card: '#FFFFFF',
          surface: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
