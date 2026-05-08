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
         * Rich warm blacks ramp + earthy walnut accent + linen highlight.
         * The previous forest-green ink-* values are replaced with near-blacks
         * tinted slightly warm so the accent walnut reads as earthy rather
         * than out-of-palette.  All component classes (`bg-ink-800`, etc.)
         * inherit the new tone without being rewritten.
         */
        ink: {
          950: '#070605',
          900: '#0d0a08',
          800: '#14110d', // ⟵ PRIMARY DARK BG
          700: '#1d1812',
          600: '#2a221a',
          500: '#3d3326',
        },
        accent: {
          DEFAULT: '#a4845a', // ⟵ warm walnut/caramel — earthy, NOT orange
          muted: '#7d6240',
          deep: '#4a3728', // espresso, for borders & rare backgrounds
        },
        sand: {
          DEFAULT: '#ece8e1',
          50: '#f5f2ec',
          100: '#ece8e1', // ⟵ PRIMARY LIGHT BG
          200: '#dcd5c5',
          300: '#c2b699',
          ink: '#2a221a',
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
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(164,132,90,0.10), transparent 70%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        /**
         * Subtle Persian/Iranian rug geometric motif: nested diamonds, a
         * cross at centre, four cardinal-edge dots and a soft centre dot.
         * Tiles every 80px.  Stroke is the walnut accent #a4845a — apply
         * with a low opacity (0.03–0.06) on the parent element.
         */
        'persian':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' fill='none' stroke='%23a4845a' stroke-width='0.7'%3E%3Cpath d='M40 4 L76 40 L40 76 L4 40 Z'/%3E%3Cpath d='M40 18 L62 40 L40 62 L18 40 Z'/%3E%3Cpath d='M40 28 L40 52 M28 40 L52 40'/%3E%3Ccircle cx='40' cy='4' r='1.1' fill='%23a4845a' stroke='none'/%3E%3Ccircle cx='76' cy='40' r='1.1' fill='%23a4845a' stroke='none'/%3E%3Ccircle cx='40' cy='76' r='1.1' fill='%23a4845a' stroke='none'/%3E%3Ccircle cx='4' cy='40' r='1.1' fill='%23a4845a' stroke='none'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23a4845a' stroke='none' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
