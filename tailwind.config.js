/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pipeline/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: '#FDFBF7',
          100: '#F8F4EC',
          200: '#EFE6D9',
          300: '#E2D4C0',
          400: '#D4B896',
          500: '#C5A880',
          600: '#A67C52',
          700: '#7E5232',
          800: '#5A3825',
          900: '#4A2E1B',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Coffee wireframe tones
        coffee: {
          cream: '#FDFBF7',
          latte: '#EFE6D9',
          caramel: '#D4B896',
          hazelnut: '#C5A880',
          mocha: '#7E5232',
          espresso: '#5A3825',
          dark: '#382214',
        },
        modality: {
          text: '#5A3825',
          voice: '#A67C52',
          image: '#C5A880',
          mixed: '#7E5232',
        },
      },
      borderRadius: {
        '3xl': '1.75rem',
        '2xl': '1.25rem',
        xl: '1rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        pill: '9999px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      boxShadow: {
        'coffee-soft': '0 4px 20px -2px rgba(90, 56, 37, 0.06), 0 2px 6px -1px rgba(90, 56, 37, 0.03)',
        'coffee-elevated': '0 16px 36px -10px rgba(90, 56, 37, 0.12)',
        'glow-primary': '0 0 20px -3px rgba(126, 82, 50, 0.35)',
        'glow-voice': '0 0 20px -3px rgba(197, 168, 128, 0.35)',
      },
    },
  },
  plugins: [],
}
