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
         * Strict three-hue earthy triad.
         *
         *   Deep forest green  → ink-*    (#16201a primary, with ramps)
         *   Warm linen         → sand-*   (#ece8e1 primary, with ramps)
         *   Rich espresso      → accent-* (#4a3728 + muted)
         *
         * Nothing else is permitted in components — no terracotta, no
         * sage, no peach.  All shade variants are derived from the three
         * base hues, mixed with white or black for depth.
         */
        ink: {
          950: '#0d130f',
          900: '#111814',
          800: '#16201a', //  ⟵  PRIMARY DARK BG
          700: '#1d2a22',
          600: '#27392d',
          500: '#3d513f',
        },
        accent: {
          DEFAULT: '#4a3728', //  ⟵  ESPRESSO ACCENT
          muted: '#3a2b20',
        },
        sand: {
          DEFAULT: '#ece8e1',
          50: '#f5f2ec',
          100: '#ece8e1', //  ⟵  PRIMARY LIGHT BG
          200: '#dcd5c5',
          300: '#c2b699',
          ink: '#4a3728', //  text-on-sand → same espresso for cohesion
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
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74,55,40,0.10), transparent 70%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
