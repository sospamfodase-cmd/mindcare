/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff', // Generated Lightest Blue
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#6598b5', // Sky Blue (Palette)
          500: '#6387ab', // Muted Blue (Palette)
          600: '#3a6e99', // Medium Blue (Palette)
          700: '#00355f', // Deep Blue (Palette)
          800: '#112b42', // Dark Blue (Palette)
          900: '#0b1c2d', // Generated Darker
          950: '#06101a',
        },
        secondary: {
           50: '#fdf8f3',
           100: '#f9f0e6',
           200: '#f0e3da', // Beige (Palette) - moved to 200 for background use
           300: '#e0cbb4',
           400: '#d0b08d',
           500: '#bd8c48', // Gold (Palette)
           600: '#a07236',
           700: '#835a29',
           800: '#684521',
           900: '#4e3218',
        },
        mindcare: {
          gold: '#bd8c48',
          dark: '#112b42',
          beige: '#f0e3da',
          deep: '#00355f',
          muted: '#6387ab',
          sky: '#6598b5',
          med: '#3a6e99',
        }
      },
      fontFamily: {
        // Use system fonts to evitar downloads de woff2 na cadeia crítica
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
