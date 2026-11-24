/**
 * IntentWeave AI Design Tokens & Color Palette
 *
 * Theme Concept: "Warm Coffee & Cream / Caramel Latte"
 * Inspired by mobile minimalist wireframes with organic warmth:
 * - Espresso / Dark Roast: #4A2E1B, #5A3825, #382214
 * - Warm Caramel / Roasted Latte: #C5A880, #D4B896, #A67C52
 * - Cream / Steamed Foam / Milk: #FDFBF7, #F8F4EC, #EFE6D9
 * - Surface Accents: Soft rounded pill geometry, organic curves
 */

export const designTokens = {
  colors: {
    coffee: {
      50: '#FDFBF7',  // Fresh cream
      100: '#F8F4EC', // Steamed milk
      200: '#EFE6D9', // Light latte
      300: '#E2D4C0', // Warm foam
      400: '#D4B896', // Caramel latte
      500: '#C5A880', // Roasted hazelnut
      600: '#A67C52', // Warm mocha
      700: '#7E5232', // Rich espresso
      800: '#5A3825', // Dark roast
      900: '#4A2E1B', // Deep espresso
      950: '#2A180E', // Charcoal roast
    },
    modalities: {
      text: {
        light: '#5A3825',
        dark: '#D4B896',
        bg: 'rgba(90, 56, 37, 0.08)',
        border: 'rgba(90, 56, 37, 0.2)',
      },
      voice: {
        light: '#A67C52',
        dark: '#E2D4C0',
        bg: 'rgba(166, 124, 82, 0.12)',
        border: 'rgba(166, 124, 82, 0.25)',
      },
      image: {
        light: '#C5A880',
        dark: '#D4B896',
        bg: 'rgba(197, 168, 128, 0.15)',
        border: 'rgba(197, 168, 128, 0.3)',
      },
      mixed: {
        light: '#7E5232',
        dark: '#EFE6D9',
        bg: 'rgba(126, 82, 50, 0.12)',
        border: 'rgba(126, 82, 50, 0.25)',
      },
    },
    risk: {
      low: {
        bg: 'rgba(111, 143, 114, 0.14)',
        text: '#446849',
        border: 'rgba(111, 143, 114, 0.3)',
      },
      medium: {
        bg: 'rgba(197, 168, 128, 0.18)',
        text: '#8F6636',
        border: 'rgba(197, 168, 128, 0.4)',
      },
      high: {
        bg: 'rgba(180, 85, 65, 0.14)',
        text: '#A63E26',
        border: 'rgba(180, 85, 65, 0.35)',
      },
    },
    stages: {
      understood: '#A67C52',
      reasoned: '#7E5232',
      verified: '#C5A880',
      executed: '#5A3825',
    },
  },
  typography: {
    fontSans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontDisplay: 'var(--font-display), "Cabinet Grotesk", -apple-system, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    pill: '9999px',
  },
  shadows: {
    soft: '0 4px 20px -2px rgba(74, 46, 27, 0.06), 0 2px 6px -1px rgba(74, 46, 27, 0.03)',
    elevated: '0 16px 36px -10px rgba(74, 46, 27, 0.12)',
    glow: '0 0 25px -5px rgba(197, 168, 128, 0.35)',
  },
} as const;
