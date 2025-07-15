import React, { useState, useEffect } from 'react'
import { useTheme } from './PremiumTheme'

const PremiumLoader = ({ 
  variant = 'pulse', 
  size = 'medium', 
  text = 'Загрузка...', 
  progress = null,
  className = '',
  showLogo = true,
  fullscreen = false
}) => {
  const { theme, animationsEnabled } = useTheme()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-sm' },
    medium: { container: 'w-12 h-12', text: 'text-base' },
    large: { container: 'w-16 h-16', text: 'text-lg' },
    xl: { container: 'w-24 h-24', text: 'text-xl' }
  }

  const sizeConfig = sizes[size]

  const loaderVariants = {
    pulse: (
      <div className={`${sizeConfig.container} relative`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.colors.accent} rounded-full animate-ping opacity-75`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.colors.accent} rounded-full animate-pulse`}></div>
      </div>
    ),

    spin: (
      <div className={`${sizeConfig.container} relative`}>
        <div className={`w-full h-full border-4 border-gray-300/20 border-t-blue-500 rounded-full animate-spin`}></div>
      </div>
    ),

    bounce: (
      <div className="flex space-x-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-3 h-3 bg-gradient-to-r ${theme.colors.accent} rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    ),

    wave: (
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2 h-8 bg-gradient-to-t ${theme.colors.accent} rounded-full animate-pulse`}
            style={{ 
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    ),

    orbit: (
      <div className={`${sizeConfig.container} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-300/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-r-purple-500 animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
      </div>
    ),

    matrix: (
      <div className="font-mono text-green-400 text-sm">
        <div className="animate-pulse">{'>'} Инициализация системы{dots}</div>
        <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>{'>'} Загрузка модулей{dots}</div>
        <div className="animate-pulse" style={{ animationDelay: '1s' }}>{'>'} Подключение к серверу{dots}</div>
      </div>
    ),

    premium: (
      <div className="relative">
        <div className={`${sizeConfig.container} relative`}>
          {/* Внешнее кольцо */}
          <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
          
          {/* Анимированное кольцо */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
          
          {/* Внутренний пульс */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          
          {/* Центральная точка */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
        
        {/* Частицы вокруг */}
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{
              top: `${50 + 30 * Math.sin(i * Math.PI / 2)}%`,
              left: `${50 + 30 * Math.cos(i * Math.PI / 2)}%`,
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>
    ),

    neural: (
      <div className="relative w-16 h-16">
        {/* Центральный узел */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        
        {/* Связанные узлы */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i * 60) * Math.PI / 180
          const radius = 25
          const x = 50 + radius * Math.cos(angle)
          const y = 50 + radius * Math.sin(angle)
          
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          )
        })}
        
        {/* Связи */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[0, 1, 2, 3, 4, 5].map(i => {
            const angle = (i * 60) * Math.PI / 180
            const radius = 25
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)
            
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  const LoaderContent = () => (
    <div className={`flex flex-col items-center space-y-6 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
      {/* Логотип */}
      {showLogo && (
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            GKBR
          </h1>
          <p className={`${theme.colors.text.secondary} text-sm`}>
            Премиальная платформа обучения
          </p>
        </div>
      )}

      {/* Загрузчик */}
      <div className="flex justify-center">
        {loaderVariants[variant]}
      </div>

      {/* Текст загрузки */}
      <div className="text-center">
        <p className={`${theme.colors.text.primary} ${sizeConfig.text} font-medium`}>
          {text}{variant !== 'matrix' && dots}
        </p>
        
        {/* Прогресс-бар */}
        {progress !== null && (
          <div className="mt-4 w-64">
            <div className={`w-full bg-gray-300/20 rounded-full h-2 overflow-hidden`}>
              <div 
                className={`h-full bg-gradient-to-r ${theme.colors.accent} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
            <p className={`${theme.colors.text.secondary} text-xs mt-2`}>
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.colors.primary} z-50 flex items-center justify-center ${className}`}>
        <LoaderContent />
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoaderContent />
    </div>
  )
}

// Специализированные загрузчики
export const ModuleLoader = ({ moduleName, progress, ...props }) => (
  <PremiumLoader
    variant="premium"
    text={`Загрузка модуля ${moduleName}`}
    progress={progress}
    {...props}
  />
)

export const QuizLoader = ({ questionCount, ...props }) => (
  <PremiumLoader
    variant="neural"
    text={`Подготовка теста (${questionCount} вопросов)`}
    {...props}
  />
)

export const LoginLoader = ({ ...props }) => (
  <PremiumLoader
    variant="orbit"
    text="Авторизация"
    showLogo={true}
    {...props}
  />
)

export const SystemLoader = ({ ...props }) => (
  <PremiumLoader
    variant="matrix"
    text="Инициализация системы"
    size="large"
    {...props}
  />
)

// Компонент с таймером автозагрузки
export const TimedLoader = ({ 
  duration = 3000, 
  onComplete, 
  steps = [],
  ...props 
}) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100))
        
        // Обновляем текущий шаг
        if (steps.length > 0) {
          const stepIndex = Math.floor((newProgress / 100) * steps.length)
          setCurrentStep(Math.min(stepIndex, steps.length - 1))
        }
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete && onComplete(), 500)
          return 100
        }
        
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, onComplete, steps.length])

  return (
    <PremiumLoader
      progress={progress}
      text={steps.length > 0 ? steps[currentStep] : undefined}
      {...props}
    />
  )
}

// HOC для добавления загрузочного состояния к компонентам
export const withLoader = (WrappedComponent, loaderProps = {}) => {
  return ({ isLoading, loadingText, ...props }) => {
    if (isLoading) {
      return (
        <PremiumLoader
          text={loadingText}
          {...loaderProps}
        />
      )
    }
    return <WrappedComponent {...props} />
  }
}

// Хук для управления состоянием загрузки
export const useLoader = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingText, setLoadingText] = useState('Загрузка...')
  const [progress, setProgress] = useState(null)

  const startLoading = (text = 'Загрузка...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setProgress(null)
  }

  const updateProgress = (value) => {
    setProgress(value)
  }

  const updateText = (text) => {
    setLoadingText(text)
  }

  return {
    isLoading,
    loadingText,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    updateText
  }
}

export default PremiumLoader