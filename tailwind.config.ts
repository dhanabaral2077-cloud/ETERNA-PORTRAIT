import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-playfair-display)', 'serif'],
      },
      lineHeight: {
        'extra-loose': '1.6',
       },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 16px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fade-in-slow': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up-slow': {
            'from': { opacity: '0', transform: 'translateY(20px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
            'from': { transform: 'translateY(-100%)' },
            'to': { transform: 'translateY(0)' },
        },
        'slide-up': {
            'from': { transform: 'translateY(0)' },
            'to': { transform: 'translateY(-100%)' },
        },
        'fade-in-left': {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translateY(0)', transformOrigin: 'center center' },
          '100%': { transform: 'scale(1.1) translateY(-15px)', transformOrigin: 'center center' },
        },
        'zoom-out': {
          'from': { transform: 'scale(1.06)' },
          'to': { transform: 'scale(1)' },
        },
        'draw-in': {
          'from': { 'stroke-dashoffset': '1000' },
          'to': { 'stroke-dashoffset': '0' },
        },
        'pulse-glow': {
          '0%, 100%': { borderColor: 'hsl(var(--primary))', boxShadow: '0 0 0 0 hsl(var(--primary) / 0.4)' },
          '50%': { borderColor: 'hsl(var(--primary))', boxShadow: '0 0 12px 3px hsl(var(--primary) / 0.4)' },
        },
        'star-animation': {
            '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
            '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '0.7' },
            '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 700ms ease-out forwards',
        'fade-in-slow': 'fade-in 1.2s ease-out forwards',
        'slide-up-slow': 'fade-in-up 0.8s 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 700ms ease-out forwards',
        'fade-in-left': 'fade-in-left 700ms ease-out forwards',
        'slide-down': 'slide-down 0.5s ease-in-out',
        'slide-up': 'slide-up 0.5s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'ken-burns': 'ken-burns 10s linear infinite alternate',
        'zoom-out': 'zoom-out 700ms ease-out forwards',
        'draw-in': 'draw-in 1.5s ease-in-out forwards',
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
        'star-animation': 'star-animation 0.5s ease-in-out forwards',
      },
      transitionDuration: {
        'fast': '120ms',
        'medium': '240ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      },
      transform: {
        'scale-102': 'scale(1.02)',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
