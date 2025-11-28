import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        roomingkos: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C33C3C',
          600: '#B53535',
          700: '#9A2E2E',
          800: '#7F2626',
          900: '#651F1F',
          950: '#450A0A',
        },
      },
    },
  },
  plugins: [],
}
export default config
