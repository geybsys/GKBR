/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🎨 Корпоративные цвета ГК БИЗНЕС РЕШЕНИЕ
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      
      // 🎯 Премиальные градиенты
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-accent': 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
        'gradient-premium': 'linear-gradient(135deg, #3b82f6 0%, #fbbf24 50%, #2563eb 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
      
      // 🌟 Премиальные тени
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium': '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(251, 191, 36, 0.5)',
        'corporate': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      
      // 🎭 Анимации
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideInUp': 'slideInUp 0.4s ease-out',
        'slideInDown': 'slideInDown 0.4s ease-out',
        'slideInLeft': 'slideInLeft 0.4s ease-out',
        'slideInRight': 'slideInRight 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'glowPulse': 'glowPulse 1.5s ease-in-out infinite',
        'shine': 'shine 2s infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
        'spinSlow': 'spin 3s linear infinite',
        'spinFast': 'spin 0.5s linear infinite',
      },
      
      // 🔤 Типографика
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      
      // 📐 Размеры
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 📱 Breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // 🎯 Aspect ratios
      aspectRatio: {
        'square': '1 / 1',
        'video': '16 / 9',
        'photo': '4 / 3',
        'wide': '21 / 9',
      },
      
      // 🎨 Backdrop filters
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      // 🔄 Transitions
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      // 📊 Z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // 🎪 Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [
    // 🎯 Плагин для премиальных утилит
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        '.text-glow': {
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        },
        '.interactive-scale': {
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
        '.interactive-lift': {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
        },
        '.brand-gradient': {
          background: 'linear-gradient(135deg, #3b82f6 0%, #fbbf24 50%, #2563eb 100%)',
        },
        '.brand-text-gradient': {
          background: 'linear-gradient(135deg, #3b82f6 0%, #fbbf24 50%, #2563eb 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
    
    // 🎨 Плагин для кастомных селекторов
    function({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)')
      addVariant('not-first', '&:not(:first-child)')
      addVariant('group-hover-focus', '.group:hover &, .group:focus &')
      addVariant('safari-only', '@supports (-webkit-appearance: none)')
      addVariant('firefox-only', '@-moz-document url-prefix()')
      addVariant('ios-only', '@supports (-webkit-touch-callout: none)')
    },
  ],
  
  // 🎯 Режим разработки
  mode: 'jit',
  
  // 📱 Важные настройки
  important: false,
  
  // 🌙 Поддержка тёмной темы
  darkMode: 'class',
  
  // 🔧 Настройки для production
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // 🎨 Кастомные CSS переменные
  corePlugins: {
    preflight: true,
  },
}