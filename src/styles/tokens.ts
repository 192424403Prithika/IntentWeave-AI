/**
 * IntentWeave AI Design Tokens & Color Palette
 *
 * Theme Concept: "The Weave"
 * Premium, calm, trustworthy aesthetic (Linear/Notion/Claude grade).
 * Modality-distinct accents:
 * - Text: Indigo/Slate
 * - Voice: Cyan/Teal (frequency, sound waves)
 * - Image: Amber/Emerald (light, vision)
 * Primary Accent: Deep Electric Indigo / Weave Purple
 */

export const designTokens = {
  colors: {
    weave: {
      50: '#f5f7ff',
      100: '#ebf0fe',
      200: '#d6e0fd',
      300: '#b4c8fb',
      400: '#8ba6f7',
      500: '#6380f2',
      600: '#435eeb',
      700: '#3247d4',
      800: '#2a3aad',
      900: '#273489',
      950: '#192055',
    },
    modalities: {
      text: {
        light: '#6366f1', // Indigo
        dark: '#818cf8',
        bg: 'rgba(99, 102, 241, 0.1)',
        border: 'rgba(99, 102, 241, 0.25)',
      },
      voice: {
        light: '#06b6d4', // Cyan
        dark: '#22d3ee',
        bg: 'rgba(6, 182, 212, 0.1)',
        border: 'rgba(6, 182, 212, 0.25)',
      },
      image: {
        light: '#f59e0b', // Amber / Gold
        dark: '#fbbf24',
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.25)',
      },
      mixed: {
        light: '#8b5cf6', // Violet
        dark: '#a78bfa',
        bg: 'rgba(139, 92, 246, 0.1)',
        border: 'rgba(139, 92, 246, 0.25)',
      },
    },
    risk: {
      low: {
        bg: 'rgba(16, 185, 129, 0.12)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)',
      },
      medium: {
        bg: 'rgba(245, 158, 11, 0.12)',
        text: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      high: {
        bg: 'rgba(239, 68, 68, 0.12)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.3)',
      },
    },
    stages: {
      understood: '#06b6d4', // Cyan
      reasoned: '#8b5cf6',   // Purple
      verified: '#f59e0b',   // Amber
      executed: '#10b981',   // Emerald
    }
  },
  typography: {
    fontSans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontDisplay: 'var(--font-display), "Cabinet Grotesk", -apple-system, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '22px',
    full: '9999px',
  },
  shadows: {
    glow: '0 0 25px -5px rgba(99, 102, 241, 0.25)',
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
    elevated: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
  },
  animation: {
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '400ms',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;
