// DesignSystem.jsx - Завершенная премиальная система дизайна
// Путь: src/components/premium/DesignSystem.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'

// 🎨 ЦВЕТОВАЯ ПАЛИТРА
export const colors = {
  // Основные цвета
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
    900: '#1e3a8a'
  },
  
  // Акцентные цвета
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75'
  },
  
  // Нейтральные
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
    900: '#0f172a'
  },
  
  // Семантические цвета
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
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
    900: '#78350f'
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
    900: '#7f1d1d'
  }
}

// 🎭 ТИПОГРАФИКА
export const typography = {
  fontFamilies: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    display: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },
  
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
}

// 🌟 ЭФФЕКТЫ И ТЕНИ
export const effects = {
  // Тени
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    glowAccent: '0 0 20px rgba(251, 191, 36, 0.5)',
    premium: '0 0 40px rgba(147, 51, 234, 0.3)'
  },
  
  // Радиусы скругления
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Непрозрачность
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1'
  }
}

// 🎭 АНИМАЦИИ И ПЕРЕХОДЫ
export const animations = {
  // Длительности анимаций
  duration: {
    fastest: '75ms',
    faster: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms'
  },
  
  // Timing functions
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
  },
  
  // Готовые анимации
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 }
    },
    slideUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    slideDown: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    slideLeft: {
      from: { opacity: 0, transform: 'translateX(20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    slideRight: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' }
    },
    scaleOut: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0, transform: 'scale(0.95)' }
    },
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
      '70%': { transform: 'translate3d(0, -15px, 0)' },
      '90%': { transform: 'translate3d(0, -4px, 0)' }
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    },
    ping: {
      '75%, 100%': { transform: 'scale(2)', opacity: 0 }
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(-3deg)' },
      '50%': { transform: 'rotate(3deg)' }
    }
  }
}

// 📱 БРЕЙКПОИНТЫ
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// 📏 ПРОСТРАНСТВО И РАЗМЕРЫ
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
}

// 🎨 КОНТЕКСТ ДИЗАЙН-СИСТЕМЫ
const DesignSystemContext = createContext()

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext)
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider')
  }
  return context
}

// 🏗️ ПРОВАЙДЕР ДИЗАЙН-СИСТЕМЫ
export const DesignSystemProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('corporate')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Проверка системных настроек
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    setReducedMotion(prefersReducedMotion)
    setIsDarkMode(prefersDarkMode)

    // Загрузка настроек из localStorage
    const savedTheme = localStorage.getItem('gkbr_design_theme')
    const savedMotion = localStorage.getItem('gkbr_reduced_motion')
    const savedDarkMode = localStorage.getItem('gkbr_dark_mode')

    if (savedTheme) setCurrentTheme(savedTheme)
    if (savedMotion !== null) setReducedMotion(savedMotion === 'true')
    if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true')
  }, [])

  // Сохранение настроек
  useEffect(() => {
    localStorage.setItem('gkbr_design_theme', currentTheme)
    localStorage.setItem('gkbr_reduced_motion', reducedMotion.toString())
    localStorage.setItem('gkbr_dark_mode', isDarkMode.toString())
  }, [currentTheme, reducedMotion, isDarkMode])

  // Функции управления
  const setTheme = (theme) => setCurrentTheme(theme)
  const toggleReducedMotion = () => setReducedMotion(prev => !prev)
  const toggleDarkMode = () => setIsDarkMode(prev => !prev)

  // Утилиты для работы с брейкпоинтами
  const responsive = (base, sm, md, lg, xl) => {
    return {
      [`${base}`]: base,
      [`sm:${sm}`]: sm,
      [`md:${md}`]: md,
      [`lg:${lg}`]: lg,
      [`xl:${xl}`]: xl
    }
  }

  const value = {
    colors,
    typography,
    effects,
    animations,
    breakpoints,
    spacing,
    currentTheme,
    reducedMotion,
    isDarkMode,
    setTheme,
    toggleReducedMotion,
    toggleDarkMode,
    responsive
  }

  return (
    <DesignSystemContext.Provider value={value}>
      <div 
        className={`
          ${isDarkMode ? 'dark' : ''} 
          ${reducedMotion ? 'motion-reduce' : ''}
        `}
        data-theme={currentTheme}
      >
        {children}
      </div>
    </DesignSystemContext.Provider>
  )
}

// 🎨 ГОТОВЫЕ УТИЛИТЫ ДЛЯ КОМПОНЕНТОВ
export const designTokens = {
  // Готовые классы для карточек
  cards: {
    base: 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg',
    elevated: 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300',
    premium: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-accent-400/30 rounded-2xl shadow-xl',
    glass: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl',
    solid: 'bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg',
    gradient: 'bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-primary-400/30 rounded-2xl'
  },
  
  // Готовые классы для кнопок
  buttons: {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    accent: 'bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    error: 'bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl',
    ghost: 'bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30',
    outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300'
  },
  
  // Готовые классы для текста
  text: {
    display: 'text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight',
    heading1: 'text-3xl md:text-5xl font-bold text-white leading-tight',
    heading2: 'text-2xl md:text-4xl font-bold text-white leading-tight',
    heading3: 'text-xl md:text-3xl font-semibold text-white leading-tight',
    heading4: 'text-lg md:text-2xl font-semibold text-white leading-tight',
    heading5: 'text-base md:text-xl font-semibold text-white leading-tight',
    heading6: 'text-sm md:text-lg font-semibold text-white leading-tight',
    body: 'text-base text-neutral-200 leading-relaxed',
    bodyLarge: 'text-lg text-neutral-200 leading-relaxed',
    bodySmall: 'text-sm text-neutral-300 leading-relaxed',
    caption: 'text-xs text-neutral-400 leading-relaxed',
    overline: 'text-xs text-neutral-400 uppercase tracking-wider leading-relaxed',
    accent: 'text-accent-400 font-semibold',
    muted: 'text-neutral-500',
    link: 'text-primary-400 hover:text-primary-300 underline transition-colors',
    code: 'font-mono text-sm bg-neutral-800 px-2 py-1 rounded text-accent-300'
  },
  
  // Готовые классы для интерактивных состояний
  interactive: {
    hover: 'hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
    focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900',
    active: 'active:transform active:scale-95 transition-transform duration-100',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    loading: 'cursor-wait opacity-75'
  },
  
  // Готовые классы для layout
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-12 md:py-16 lg:py-20',
    grid: 'grid gap-6 md:gap-8',
    flex: 'flex items-center justify-between',
    center: 'flex items-center justify-center',
    stack: 'space-y-4'
  },
  
  // Готовые классы для форм
  forms: {
    input: 'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200',
    textarea: 'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 resize-none',
    select: 'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200',
    checkbox: 'w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2',
    radio: 'w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500/50 focus:ring-2'
  }
}

// 🎯 КОМПОНЕНТ ПРЕДПРОСМОТРА ДИЗАЙН-СИСТЕМЫ
export const DesignSystemPreview = () => {
  const { colors, typography, effects, animations, currentTheme } = useDesignSystem()

  return (
    <div className="space-y-8 p-8">
      <h1 className={designTokens.text.heading1}>Дизайн-система GKBR</h1>
      
      {/* Цвета */}
      <section>
        <h2 className={designTokens.text.heading3}>Цветовая палитра</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(colors).map(([colorName, colorValues]) => (
            <div key={colorName} className="space-y-2">
              <h3 className="text-white font-semibold capitalize">{colorName}</h3>
              <div className="grid gap-1">
                {Object.entries(colorValues).map(([shade, value]) => (
                  <div
                    key={shade}
                    className="h-8 rounded flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: value }}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Типографика */}
      <section>
        <h2 className={designTokens.text.heading3}>Типографика</h2>
        <div className="space-y-4 mt-4">
          <div className={designTokens.text.display}>Display Text</div>
          <div className={designTokens.text.heading1}>Heading 1</div>
          <div className={designTokens.text.heading2}>Heading 2</div>
          <div className={designTokens.text.heading3}>Heading 3</div>
          <div className={designTokens.text.body}>Body text with normal weight</div>
          <div className={designTokens.text.caption}>Caption text</div>
        </div>
      </section>
      
      {/* Кнопки */}
      <section>
        <h2 className={designTokens.text.heading3}>Кнопки</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <button className={designTokens.buttons.primary}>Primary</button>
          <button className={designTokens.buttons.secondary}>Secondary</button>
          <button className={designTokens.buttons.accent}>Accent</button>
          <button className={designTokens.buttons.success}>Success</button>
          <button className={designTokens.buttons.warning}>Warning</button>
          <button className={designTokens.buttons.error}>Error</button>
          <button className={designTokens.buttons.ghost}>Ghost</button>
          <button className={designTokens.buttons.outline}>Outline</button>
        </div>
      </section>
      
      {/* Карточки */}
      <section>
        <h2 className={designTokens.text.heading3}>Карточки</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className={designTokens.cards.base}>
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">Base Card</h3>
              <p className="text-neutral-300 text-sm">Базовая карточка с прозрачностью</p>
            </div>
          </div>
          <div className={designTokens.cards.premium}>
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">Premium Card</h3>
              <p className="text-neutral-300 text-sm">Премиальная карточка с градиентом</p>
            </div>
          </div>
          <div className={designTokens.cards.glass}>
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">Glass Card</h3>
              <p className="text-neutral-300 text-sm">Стеклянная карточка с эффектом blur</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Формы */}
      <section>
        <h2 className={designTokens.text.heading3}>Элементы форм</h2>
        <div className="space-y-4 mt-4 max-w-md">
          <input 
            className={designTokens.forms.input}
            placeholder="Введите текст"
          />
          <textarea 
            className={designTokens.forms.textarea}
            placeholder="Многострочный текст"
            rows="3"
          />
          <select className={designTokens.forms.select}>
            <option>Выберите опцию</option>
            <option>Опция 1</option>
            <option>Опция 2</option>
          </select>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              className={designTokens.forms.checkbox}
            />
            <label className="text-white">Чекбокс</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio"
              className={designTokens.forms.radio}
              name="radio"
            />
            <label className="text-white">Радио кнопка</label>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DesignSystemProvider