/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f0fe',
          100: '#c6dafc',
          200: '#93bafc',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#0b5394',
          800: '#073984',
          900: '#041e5a'
        },
        eco: {
          green: '#0b8043',
          'green-light': '#e6f4ea',
          'green-mid': '#41ab5d',
          blue: '#1565c0',
          'blue-light': '#e8f0fe',
          'blue-mid': '#6baed6'
        },
        surface: {
          DEFAULT: '#f8f9fa',
          card: '#ffffff',
          border: '#e0e0e0'
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)'
      }
    }
  },
  plugins: []
};
