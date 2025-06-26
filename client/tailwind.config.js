/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Mana colors for the school theme
        mana: {
          blue: '#0066CC',     // Math - Blue
          red: '#CC3333',      // German - Red  
          black: '#1A1A1A',    // English - Black
          green: '#009933',    // French/Latin - Green
          white: '#F5F5F5',    // Differentiation - White
        },
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'game': ['Inter', 'sans-serif'],
      },
      animation: {
        'card-hover': 'cardHover 0.3s ease-in-out',
        'card-play': 'cardPlay 0.5s ease-out',
        'phase-transition': 'phaseTransition 0.4s ease-in-out',
      },
      keyframes: {
        cardHover: {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '100%': { transform: 'translateY(-8px) scale(1.05)' },
        },
        cardPlay: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(5deg)', opacity: '0.8' },
          '100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.6' },
        },
        phaseTransition: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0px)' },
        }
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
        'mana': '0 2px 4px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
