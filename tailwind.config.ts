import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Regional.fit brand colors
        'rf-navy': {
          DEFAULT: '#2b3b82',
          50: '#f0f2f9',
          100: '#d9dff0',
          200: '#b3bfe1',
          300: '#8da0d2',
          400: '#6780c3',
          500: '#4160b4',
          600: '#2b3b82',
          700: '#232f68',
          800: '#1a234e',
          900: '#121734',
        },
        'rf-lime': {
          DEFAULT: '#daff47',
          50: '#f8ffe6',
          100: '#f0ffcc',
          200: '#e5ff99',
          300: '#daff47',
          400: '#c5eb3d',
          500: '#a8cc2a',
          600: '#8aad17',
          700: '#6d8e04',
          800: '#516f00',
          900: '#345000',
        },
        'rf-bg': '#f5f7fa',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
