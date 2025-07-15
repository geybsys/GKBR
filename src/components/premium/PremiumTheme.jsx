// PremiumTheme.jsx - Завершенная система премиальных тем
// Путь: src/components/premium/PremiumTheme.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'

// 🎨 ПРЕМИАЛЬНЫЕ ТЕМЫ
const PREMIUM_THEMES = {
  corporate: {
    id: 'corporate',
    name: 'Корпоративная',
    description: 'Строгий и профессиональный стиль',
    background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    primary: 'from-blue-600 to-blue-800',
    secondary: 'from-gray-600 to-gray-800',
    accent: 'from-blue-400 to-blue-600',
    text: 'text-blue-100',
    border: 'border-blue-400/30',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-blue-200',
        muted: 'text-blue-300'
      },
      glass: 'bg-white/10 backdrop-blur-lg border border-white/20'
    }
  },
  
  ocean: {
    id: 'ocean',
    name: 'Океан',
    description: 'Глубокие синие оттенки',
    background: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-blue-950',
    primary: 'from-cyan-500 to-blue-600',
    secondary: 'from-blue-600 to-blue-800',
    accent: 'from-cyan-400 to-cyan-600',
    text: 'text-cyan-100',
    border: 'border-cyan-400/30',
    glass: 'bg-cyan-500/10 backdrop-blur-lg border border-cyan-400/20',
    colors: {
      primary: '#0891b2',
      secondary: '#1e40af',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-cyan-200',
        muted: 'text-cyan-300'
      },
      glass: 'bg-cyan-500/10 backdrop-blur-lg border border-cyan-400/20'
    }
  },
  
  sunset: {
    id: 'sunset',
    name: 'Закат',
    description: 'Теплые оранжевые тона',
    background: 'bg-gradient-to-br from-orange-950 via-red-950 to-orange-950',
    primary: 'from-orange-500 to-red-600',
    secondary: 'from-red-600 to-red-800',
    accent: 'from-yellow-400 to-orange-500',
    text: 'text-orange-100',
    border: 'border-orange-400/30',
    glass: 'bg-orange-500/10 backdrop-blur-lg border border-orange-400/20',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f97316',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-orange-200',
        muted: 'text-orange-300'
      },
      glass: 'bg-orange-500/10 backdrop-blur-lg border border-orange-400/20'
    }
  },
  
  forest: {
    id: 'forest',
    name: 'Лес',
    description: 'Природные зеленые оттенки',
    background: 'bg-gradient-to-br from-green-950 via-emerald-950 to-green-950',
    primary: 'from-green-500 to-emerald-600',
    secondary: 'from-emerald-600 to-emerald-800',
    accent: 'from-lime-400 to-green-500',
    text: 'text-green-100',
    border: 'border-green-400/30',
    glass: 'bg-green-500/10 backdrop-blur-lg border border-green-400/20',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-green-200',
        muted: 'text-green-300'
      },
      glass: 'bg-green-500/10 backdrop-blur-lg border border-green-400/20'
    }
  },
  
  galaxy: {
    id: 'galaxy',
    name: 'Галактика',
    description: 'Космические фиолетовые тона',
    background: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950',
    primary: 'from-purple-500 to-indigo-600',
    secondary: 'from-indigo-600 to-indigo-800',
    accent: 'from-violet-400 to-purple-500',
    text: 'text-purple-100',
    border: 'border-purple-400/30',
    glass: 'bg-purple-500/10 backdrop-blur-lg border border-purple-400/20',
    colors: {
      primary: '#7c3aed',
      secondary: '#4338ca',
      accent: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-purple-200',
        muted: 'text-purple-300'
      },
      glass: 'bg-purple-500/10 backdrop-blur-lg border border-purple-400/20'
    }
  },
  
  midnight: {
    id: 'midnight',
    name: 'Полночь',
    description: 'Элегантные темные тона',
    background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900',
    primary: 'from-gray-600 to-gray-800',
    secondary: 'from-slate-600 to-slate-800',
    accent: 'from-white to-gray-200',
    text: 'text-gray-100',
    border: 'border-gray-400/30',
    glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
    colors: {
      primary: '#4b5563',
      secondary: '#374151',
      accent: '#f3f4f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-200',
        muted: 'text-gray-300'
      },
      glass: 'bg-white/5 backdrop-blur-lg border border-white/10'
    }
  }
}

// 🎨 КОНТЕКСТ ТЕМЫ
const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 🏗️ ПРОВАЙДЕР ТЕМЫ
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('corporate')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Инициализация темы из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gkbr_theme')
    const savedAnimations = localStorage.getItem('gkbr_animations_enabled')
    
    if (savedTheme && PREMIUM_THEMES[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    
    if (savedAnimations !== null) {
      setAnimationsEnabled(savedAnimations === 'true')
    }
    
    // Проверка системных настроек анимации
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setAnimationsEnabled(false)
    }
  }, [])

  // Сохранение изменений в localStorage
  useEffect(() => {
    localStorage.setItem('gkbr_theme', currentTheme)
    document.documentElement.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  useEffect(() => {
    localStorage.setItem('gkbr_animations_enabled', animationsEnabled.toString())
    document.documentElement.setAttribute('data-animations', animationsEnabled.toString())
  }, [animationsEnabled])

  const changeTheme = (themeId) => {
    if (PREMIUM_THEMES[themeId]) {
      setCurrentTheme(themeId)
    }
  }

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev)
  }

  const theme = PREMIUM_THEMES[currentTheme]

  const value = {
    currentTheme,
    theme,
    themes: PREMIUM_THEMES,
    changeTheme,
    animationsEnabled,
    toggleAnimations
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={`min-h-screen transition-all duration-500 ${theme.background}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// 🎯 ПРЕМИАЛЬНАЯ КАРТОЧКА
export const PremiumCard = ({ 
  children, 
  variant = 'glass', // glass, solid, gradient
  hover = true,
  className = '',
  ...props 
}) => {
  const { theme, animationsEnabled } = useTheme()

  const variants = {
    glass: theme.glass,
    solid: 'bg-gray-800 border border-gray-700',
    gradient: `bg-gradient-to-br ${theme.primary} border ${theme.border}`
  }

  return (
    <div 
      className={`
        ${variants[variant]} rounded-2xl p-6
        ${hover && animationsEnabled ? 'hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// 🔲 ПРЕМИАЛЬНАЯ КНОПКА
export const PremiumButton = ({ 
  children, 
  variant = 'primary', // primary, secondary, accent, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const { theme, animationsEnabled } = useTheme()

  const variants = {
    primary: `bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white`,
    secondary: `bg-gradient-to-r ${theme.secondary} hover:opacity-90 text-white`,
    accent: `bg-gradient-to-r ${theme.accent} hover:opacity-90 text-white`,
    ghost: `${theme.glass} hover:bg-white/20 ${theme.text}`
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-semibold
        ${animationsEnabled ? 'transition-all duration-200 transform active:scale-95' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка...
        </div>
      ) : children}
    </button>
  )
}

// 📝 ПРЕМИАЛЬНЫЙ INPUT
export const PremiumInput = ({ 
  label,
  icon,
  error,
  variant = 'default', // default, accent
  className = '',
  ...props 
}) => {
  const { theme } = useTheme()

  const variants = {
    default: `${theme.glass} focus:ring-2 focus:ring-blue-500/50`,
    accent: `${theme.glass} focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium ${theme.text}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-3 rounded-lg
            ${icon ? 'pl-10' : ''}
            ${variants[variant]}
            ${theme.text} placeholder-gray-400
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}

// 🎨 СЕЛЕКТОР ТЕМ
export const ThemeSelector = ({ className = '' }) => {
  const { currentTheme, themes, changeTheme } = useTheme()

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white">Выбор темы</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(themes).map(theme => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${currentTheme === theme.id ? 
                'border-blue-400 bg-blue-500/20' : 
                'border-white/20 hover:border-white/40 bg-white/5'
              }
            `}
          >
            <div className={`w-full h-8 rounded-lg ${theme.background} mb-3`} />
            <div className="text-white font-medium text-sm">{theme.name}</div>
            <div className="text-gray-400 text-xs">{theme.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// 🎭 ПЕРЕКЛЮЧАТЕЛЬ АНИМАЦИЙ
export const AnimationToggle = ({ className = '' }) => {
  const { animationsEnabled, toggleAnimations } = useTheme()

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <div className="text-white font-medium">Анимации</div>
        <div className="text-gray-400 text-sm">Включить плавные переходы</div>
      </div>
      
      <button
        onClick={toggleAnimations}
        className={`
          w-12 h-6 rounded-full relative transition-colors duration-300
          ${animationsEnabled ? 'bg-blue-500' : 'bg-gray-600'}
        `}
      >
        <div
          className={`
            w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
            ${animationsEnabled ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  )
}

