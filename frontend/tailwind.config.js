/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        canvas: '#6B8266',       // Sage outer frame
        surface: '#EEF3EE',      // Mint page background
        card: '#FFFFFF',         // Cards & wrappers
        brand: {
          900: '#0A4D2E',        // Forest green primary
          700: '#0F6B3F',        // Hover / secondary green
          100: '#E5F4E4',        // Mint highlight badge
        },
        ink: {
          900: '#111613',        // Dark headings
          600: '#5B665F',        // Muted body
          400: '#8A948D',        // Light captions
        },
        sell: '#0A7A3B',         // "Sell Now" status
        wait: '#F59E0B',         // "Wait" status
        'info-bg': '#E7F1FB',    // Info banner
        'success-bg': '#E5F4E4', // Success banner
        'chart-hist': '#1D4ED8', // History blue
        'chart-fcst': '#DC2626', // Forecast red
        'chart-neutral': '#B8C4BA'
      },
      borderRadius: {
        '20': '20px',
        '28': '28px',
        '32': '32px'
      },
      boxShadow: {
        'agfarm': '0 8px 24px rgba(16, 24, 20, 0.06)',
        'agfarm-sm': '0 2px 8px rgba(16, 24, 20, 0.04)',
        'agfarm-glass': '0 12px 32px rgba(10, 77, 46, 0.12)',
      }
    },
  },
  plugins: [],
}
