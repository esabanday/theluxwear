import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        bone: '#F8F5F0',
        taupe: '#B7A89A',
        umber: '#4A3B32'
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px -35px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
