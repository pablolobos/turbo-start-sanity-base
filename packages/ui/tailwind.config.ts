import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";
import { fontFamily } from "tailwindcss/defaultTheme.js";

const config = {
  darkMode: ["class"],
  content: [
    "src/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "../../packages/ui/src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ["var(--font-geist)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        volvo: ["VolvoNovum", ...fontFamily.sans],
      },
      // Add Volvo Typography Scale
      fontSize: {
        // Display
        'display-1': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.02em' }],      // 72px
        'display-2': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.02em' }],  // 60px
        'display-3': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],      // 48px
        // Heading
        'heading-1': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em' }],      // 40px
        'heading-2': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],      // 32px
        'heading-3': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],  // 28px
        'heading-4': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],      // 24px
        'heading-5': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],  // 20px
        'heading-6': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.02em' }],  // 18px
        // Body
        'body-1': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'body-2': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'body-3': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        // Detail
        'detail-1': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],      // 12px
        'detail-2': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }], // 10px
      },
      colors: {
        // Volvo Design System Colors
        volvo: {
          // Primary Colors
          blue: {
            DEFAULT: "#003057",
            light: "#0070CE",
            dark: "#001B34",
          },
          white: "#FFFFFF",
          black: "#161616",
          // Secondary Colors
          grey: {
            DEFAULT: "#707070",
            light: "#F8F8F8",
            dark: "#333333",
          },
          // Accent Colors
          teal: "#00838A",
          green: "#007B63",
          yellow: "#FFAA00",
          red: "#DA291C",
        },
        // Keep existing color tokens for compatibility
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
      },
      spacing: {
        // Volvo spacing scale
        'volvo-1': '0.25rem', // 4px
        'volvo-2': '0.5rem',  // 8px
        'volvo-3': '0.75rem', // 12px
        'volvo-4': '1rem',    // 16px
        'volvo-5': '1.5rem',  // 24px
        'volvo-6': '2rem',    // 32px
        'volvo-7': '2.5rem',  // 40px
        'volvo-8': '3rem',    // 48px
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Volvo border radius
        'volvo-none': '0',
        'volvo-sm': '2px',
        'volvo-md': '4px',
        'volvo-lg': '8px',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;

export default config;
