/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Modern Core Colors
        primary: {
          50: 'var(--primary-blue-50)',
          100: 'var(--primary-blue-100)',
          200: 'var(--primary-blue-200)',
          300: 'var(--primary-blue-300)',
          400: 'var(--primary-blue-400)',
          500: 'var(--primary-blue-500)',
          600: 'var(--primary-blue-600)',
          700: 'var(--primary-blue-700)',
          800: 'var(--primary-blue-800)',
          900: 'var(--primary-blue-900)',
        },
        accent: {
          50: 'var(--accent-purple-50)',
          100: 'var(--accent-purple-100)',
          200: 'var(--accent-purple-200)',
          300: 'var(--accent-purple-300)',
          400: 'var(--accent-purple-400)',
          500: 'var(--accent-purple-500)',
          600: 'var(--accent-purple-600)',
          700: 'var(--accent-purple-700)',
          800: 'var(--accent-purple-800)',
          900: 'var(--accent-purple-900)',
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
        // Text Colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-gradient': 'var(--text-gradient)',
        // Glass & Depth
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
        'glass-strong': 'var(--glass-strong)',
        'glass-card': 'var(--glass-card)',
        'glass-input': 'var(--glass-input)',
        'glass-button': 'var(--glass-button)',
        // Shadows
        'shadow-primary': 'var(--shadow-primary)',
        'shadow-glass': 'var(--shadow-glass)',
        'shadow-strong': 'var(--shadow-strong)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-modern': 'var(--gradient-modern)',
        'gradient-glass': 'var(--gradient-glass)',
        'gradient-shimmer': 'var(--gradient-shimmer)',
      },
      boxShadow: {
        'modern': 'var(--shadow-modern)',
        'glass': 'var(--shadow-glass)',
        'strong': 'var(--shadow-strong)',
      },
      animation: {
        'pulse-modern': 'pulse-modern 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-modern': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px var(--primary-blue-500)' },
          '100%': { boxShadow: '0 0 30px var(--primary-blue-500), 0 0 40px var(--accent-purple-500)' },
        },
      },
      borderRadius: {
        '3xl': '16px',
        '4xl': '24px',
        '5xl': '32px',
      },
    },
  },
  plugins: [],
}

