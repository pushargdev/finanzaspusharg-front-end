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
        brand: {
          dark: '#0B0E17',
          surface: '#121827',
          card: '#1B2234',
          border: '#2A344B',
          purple: '#8B5CF6',
          violet: '#7C3AED',
          magenta: '#EC4899',
          pink: '#F43F5E',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-magenta': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glow-combined': '0 0 30px -5px rgba(139, 92, 246, 0.3), 0 0 30px -5px rgba(236, 72, 153, 0.3)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #6D28D9 0%, #DB2777 100%)',
        'glass-card': 'linear-gradient(180deg, rgba(27, 34, 52, 0.7) 0%, rgba(18, 24, 39, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
