/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#123B7A',
        midnight: '#123B7A',
        royal: '#123B7A',
        secondary: '#0D2D5E',
        footer: '#0D2D5E',
        pearl: '#FFFDF7',
        cream: '#FFFDF7',
        light: '#F1F5F9',
        input: '#FFFFFF',
        card: '#FFFFFF',
        gold: '#123B7A',
        copper: '#123B7A',
        'warm-gold': '#123B7A',
        'gold-hover': '#0D2D5E',
        ink: '#14243A',
        paragraph: '#526477',
        muted: '#94A3B8',
        primary: '#123B7A',
        accent: '#00B8D9',
        hero: '#FFFFFF',
        'card-border': '#E2E8F0',
        'input-border': '#CBD5E1',
        'focus-border': '#D97841',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
