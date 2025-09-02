/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* subtle warm border */
        input: "var(--color-input)", /* subtle warm gray */
        ring: "var(--color-ring)", /* deep emerald green */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* rich near-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep emerald green */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* sophisticated blue-gray */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* earthy reddish-brown */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* subtle warm gray */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* warm golden bronze */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* warm off-white */
          foreground: "var(--color-popover-foreground)", /* rich near-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* subtle warm gray */
          foreground: "var(--color-card-foreground)", /* rich near-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* deep emerald green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* warm sandy tone */
          foreground: "var(--color-warning-foreground)", /* rich near-black */
        },
        error: {
          DEFAULT: "var(--color-error)", /* earthy reddish-brown */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Source Sans Pro', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "fade-out": "fadeOut 200ms ease-out",
        "slide-up": "slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "blur-in": "blurIn 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blurIn: {
          "0%": { filter: "blur(4px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
      },
      backdropBlur: {
        'luxury': '8px',
      },
      boxShadow: {
        'luxury': '0 2px 8px rgba(45, 90, 61, 0.08)',
        'luxury-md': '0 4px 12px rgba(45, 90, 61, 0.12)',
        'luxury-lg': '0 8px 24px rgba(45, 90, 61, 0.16)',
        'luxury-xl': '0 16px 48px rgba(45, 90, 61, 0.20)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}