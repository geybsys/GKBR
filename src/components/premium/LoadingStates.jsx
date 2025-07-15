// LoadingStates.jsx - Премиальные состояния загрузки
// Путь: src/components/premium/LoadingStates.jsx

import React, { useState, useEffect } from 'react'
import { GlassEffect, ShimmerEffect } from './VisualEffects'

// 🌀 ГРАДИЕНТНЫЙ СПИННЕР
export const GradientSpinner = ({ 
  size = 40,
  thickness = 4,
  speed = 'normal',
  gradient = 'blue-purple',
  className = '',
  ...props 
}) => {
  const gradients = {
    'blue-purple': 'from-blue-500 to-purple-600',
    'pink-orange': 'from-pink-500 to-orange-500',
    'green-blue': 'from-green-500 to-blue-500',
    'purple-pink': 'from-purple-500 to-pink-500',
    'corporate': 'from-blue-600 to-blue-800'
  }

  const speeds = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  }

  return (
    <div 
      className={`
        ${speeds[speed]} rounded-full
        bg-gradient-to-r ${gradients[gradient]}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        padding: thickness,
        background: `conic-gradient(from 0deg, transparent, ${gradients[gradient]})`
      }}
      {...props}
    >
      <div 
        className="w-full h-full rounded-full bg-gray-900"
        style={{ padding: thickness }}
      />
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 0.5s linear infinite;
        }
      `}</style>
    </div>
  )
}

// 📊 АНИМИРОВАННЫЙ ПРОГРЕСС-БАР
export const AnimatedProgressBar = ({ 
  progress = 0,
  showPercentage = true,
  color = 'blue',
  height = 8,
  label = '',
  animated = true,
  striped = false,
  className = '',
  ...props 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500'
  }

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated])

  return (
    <div className={`w-full ${className}`} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {showPercentage && (
            <span className="text-sm text-blue-200">{Math.round(animatedProgress)}%</span>
          )}
        </div>
      )}
      
      <div 
        className="w-full bg-white/10 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`
            h-full ${colors[color]} transition-all duration-1000 ease-out rounded-full
            ${striped ? 'bg-stripes' : ''}
            ${animated ? 'animate-progress-wave' : ''}
          `}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
      
      <style jsx>{`
        @keyframes progress-wave {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        .animate-progress-wave {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
          );
          background-size: 40px 40px;
          animation: progress-wave 1s linear infinite;
        }
        .bg-stripes {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 75%,
            transparent
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}

// 💫 DOTS LOADER
export const DotsLoader = ({ 
  size = 'medium',
  color = 'blue',
  count = 3,
  spacing = 'normal',
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  }

  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
    white: 'bg-white'
  }

  const spacings = {
    tight: 'space-x-1',
    normal: 'space-x-2',
    wide: 'space-x-3'
  }

  return (
    <div className={`flex items-center ${spacings[spacing]} ${className}`} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`
            ${sizes[size]} ${colors[color]} rounded-full
            animate-bounce
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  )
}

// 🌊 WAVE LOADER
export const WaveLoader = ({ 
  color = '#3b82f6',
  height = 40,
  width = 60,
  bars = 5,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`flex items-end justify-center ${className}`}
      style={{ height, width }}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="mx-1 rounded-t animate-wave"
          style={{
            backgroundColor: color,
            width: `${width / bars - 4}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes wave {
          0%, 40%, 100% {
            height: 20%;
          }
          20% {
            height: 100%;
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// 🎯 PULSE LOADER
export const PulseLoader = ({ 
  size = 60,
  color = '#3b82f6',
  rings = 3,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {Array.from({ length: rings }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 animate-pulse-ring"
          style={{
            borderColor: color,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: ${size}px;
            height: ${size}px;
            opacity: 0;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
      `}</style>
    </div>
  )
}

// 📱 SKELETON LOADER
export const SkeletonLoader = ({ 
  lines = 3,
  showAvatar = false,
  showImage = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`animate-pulse ${className}`} {...props}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-12 h-12 bg-white/20 rounded-full" />
        )}
        
        <div className="flex-1 space-y-3">
          {showImage && (
            <div className="w-full h-48 bg-white/20 rounded-lg" />
          )}
          
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className="h-4 bg-white/20 rounded-lg"
              style={{
                width: i === lines - 1 ? '75%' : '100%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 🎪 CARD SKELETON
export const CardSkeleton = ({ 
  showHeader = true,
  showImage = false,
  lines = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className={`animate-pulse ${className}`} {...props}>
      <GlassEffect className="p-6 space-y-4">
        {showHeader && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/20 rounded w-1/2" />
            </div>
          </div>
        )}
        
        {showImage && (
          <div className="w-full h-48 bg-white/20 rounded-lg" />
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className="h-4 bg-white/20 rounded"
              style={{
                width: i === lines - 1 ? '60%' : '100%'
              }}
            />
          ))}
        </div>
      </GlassEffect>
    </div>
  )
}

// 🔄 LOADING OVERLAY
export const LoadingOverlay = ({ 
  isVisible = false,
  message = 'Загрузка...',
  spinner = 'gradient',
  backdrop = true,
  className = '',
  children,
  ...props 
}) => {
  const spinners = {
    gradient: <GradientSpinner size={50} />,
    dots: <DotsLoader size="large" />,
    wave: <WaveLoader />,
    pulse: <PulseLoader />
  }

  if (!isVisible) return children

  return (
    <div className={`relative ${className}`} {...props}>
      {children}
      
      <div className={`
        absolute inset-0 z-50 flex flex-col items-center justify-center
        ${backdrop ? 'bg-black/50 backdrop-blur-sm' : ''}
      `}>
        {spinners[spinner]}
        
        {message && (
          <p className="mt-4 text-white font-medium text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// 📈 STEP LOADER (с этапами)
export const StepLoader = ({ 
  steps = [],
  currentStep = 0,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${index < currentStep ? 'bg-green-500 text-white' : 
              index === currentStep ? 'bg-blue-500 text-white animate-pulse' :
              'bg-white/20 text-gray-400'}
          `}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          
          <div className="flex-1">
            <div className={`
              font-medium
              ${index <= currentStep ? 'text-white' : 'text-gray-400'}
            `}>
              {step.title}
            </div>
            
            {step.description && (
              <div className={`
                text-sm
                ${index <= currentStep ? 'text-blue-200' : 'text-gray-500'}
              `}>
                {step.description}
              </div>
            )}
          </div>
          
          {index === currentStep && (
            <GradientSpinner size={20} />
          )}
        </div>
      ))}
    </div>
  )
}

// 🎭 ТИПЫ ЗАГРУЗОК
const loadingTypes = {
  module: {
    title: 'Загрузка модуля...',
    subtitle: 'Подготавливаем обучающий контент',
    spinner: 'gradient'
  },
  quiz: {
    title: 'Генерация вопросов...',
    subtitle: 'Готовим тестовые задания',
    spinner: 'dots'
  },
  certification: {
    title: 'Создание сертификата...',
    subtitle: 'Формируем документ об окончании',
    spinner: 'pulse'
  },
  analytics: {
    title: 'Анализ данных...',
    subtitle: 'Обрабатываем статистику',
    spinner: 'wave'
  }
}

// 🎯 ГЛАВНЫЙ КОМПОНЕНТ ЗАГРУЗКИ
export const LoadingStates = ({ 
  type = 'module', 
  progress = null, 
  customTitle = null,
  customSubtitle = null,
  showProgress = false,
  steps = null,
  currentStep = 0
}) => {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [displayText, setDisplayText] = useState('')
  
  const config = loadingTypes[type] || loadingTypes.module
  const title = customTitle || config.title
  const subtitle = customSubtitle || config.subtitle

  // 🎭 ЭФФЕКТ ПЕЧАТАЮЩЕГОСЯ ТЕКСТА
  useEffect(() => {
    if (!title) return
    
    let i = 0
    const typeText = () => {
      if (i < title.length) {
        setDisplayText(title.slice(0, i + 1))
        i++
        setTimeout(typeText, 100)
      }
    }
    
    typeText()
  }, [title])

  // 📊 АНИМАЦИЯ ПРОГРЕССА
  useEffect(() => {
    if (progress !== null) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10">
        <GlassEffect className="p-8 max-w-md mx-auto text-center">
          {/* Спиннер */}
          <div className="mb-6 flex justify-center">
            {config.spinner === 'gradient' && <GradientSpinner size={60} />}
            {config.spinner === 'dots' && <DotsLoader size="large" color="blue" />}
            {config.spinner === 'pulse' && <PulseLoader size={80} />}
            {config.spinner === 'wave' && <WaveLoader width={80} height={50} />}
          </div>
          
          {/* Заголовок */}
          <h3 className="text-xl font-bold text-white mb-2">
            {displayText}
          </h3>
          
          {/* Подзаголовок */}
          <p className="text-blue-200 text-sm mb-6">
            {subtitle}
          </p>
          
          {/* Прогресс */}
          {showProgress && progress !== null && (
            <AnimatedProgressBar
              progress={currentProgress}
              showPercentage={true}
              animated={true}
              className="mb-4"
            />
          )}
          
          {/* Этапы */}
          {steps && (
            <StepLoader
              steps={steps}
              currentStep={currentStep}
              className="text-left"
            />
          )}
        </GlassEffect>
      </div>
    </div>
  )
}

