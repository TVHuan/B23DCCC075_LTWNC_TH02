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
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary
          700: '#4338CA', // Primary Hover
          800: '#3730A3',
          900: '#312E81',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtle: '#F1F5F9',
        },
        content: {
          heading: '#0F172A',
          body: '#475569',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        status: {
          pending: '#3B82F6',
          warning: '#F59E0B',
          overdue: '#EF4444',
          completed: '#10B981',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 10px 38px -10px rgba(22, 23, 24, 0.15), 0 10px 20px -15px rgba(22, 23, 24, 0.1)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
