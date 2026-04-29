/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        obsidian: '#050505',
        ink: '#0a0a0a',
        silver: '#c9cdd4',
        surface: {
          0: '#050505',
          1: '#0a0a0a',
          2: '#111418',
          3: '#1a1e24',
        },
      },
      letterSpacing: {
        tightest: '-0.07em',
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(255,255,255,0.18)',
        'glow-lg': '0 20px 80px -20px rgba(255,255,255,0.24)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
