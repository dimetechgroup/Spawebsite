/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.ts',
    './seo/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#207D40',
          'green-alt': '#2E8B35',
          'green-dark': '#1a6333',
          'green-light': '#A8C5A0',
          amber: '#F7A300',
          'amber-alt': '#F5A800',
          'amber-dark': '#d98f00',
          'amber-light': '#F9D98C',
          dark: '#0d1f0d',
          ink: '#111827',
          cream: '#FDFAF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
}
