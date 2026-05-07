import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /**
         * Organic forest palette. The `ink-*` names are kept for backwards
         * compatibility — they no longer represent blacks but a deep forest /
         * olive scale.  Components that referenced ink-950, ink-900, … remap
         * cleanly to the new tone without needing to be rewritten.
         */
        ink: {
          950: '#0e1612',
          900: '#141e18',
          800: '#1b241e', // primary section bg
          700: '#243228',
          600: '#2f4035',
          500: '#475c4d',
        },
        /** Warm earthy terracotta replaces the previous champagne gold. */
        accent: {
          DEFAULT: '#c16b50',
          muted: '#a25840',
          soft: '#e3a489',
        },
        /** Linen / sand for warm contrast sections (carousel, etc.). */
        sand: {
          DEFAULT: '#f4f1ea',
          50: '#faf7ef',
          100: '#f4f1ea',
          200: '#ebe5d6',
          300: '#dcd2bb',
          400: '#c2b599',
          ink: '#3a3327', // text-on-sand
        },
        /** Sage helpers for subtle UI elements. */
        sage: {
          DEFAULT: '#8aa593',
          muted: '#6c8676',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tightest-2': '-0.04em',
      },
      animation: {
        'fade-in': 'fade-in 800ms ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(193,107,80,0.12), transparent 70%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
