// ProgressBar.jsx - Завершенный премиальный компонент прогресса
// Путь: src/components/ProgressBar.jsx

import React, { useState, useEffect, useRef } from 'react'

const ProgressBar = ({ 
  value = 0,
  maximum = 100,
  variant = 'default', // default, success, warning, danger, premium, gold
  size = 'medium', // small, medium, large
  label = '',
  showNumbers = false,
  showPercentage = true,
  animated = true,
  striped = false,
  glow = false,
  className = '',
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  // Intersection Observer для анимации при появлении
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  // Анимация значения
  useEffect(() => {
    if (!isVisible || !animated) {
      setDisplayValue(value)
      return
    }

    let startTime = null
    const startValue = displayValue
    const endValue = Math.min(value, maximum)
    const duration = 1500

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, maximum, isVisible, animated])

  // Вычисления
  const percentage = Math.min((displayValue / maximum) * 100, 100)
  const isComplete = percentage >= 100

  // Стили вариантов
  const variantClasses = {
    default: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
      glow: 'rgba(59, 130, 246, 0.5)'
    },
    success: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-green-500 to-emerald-600',
      glow: 'rgba(34, 197, 94, 0.5)'
    },
    warning: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      glow: 'rgba(251, 191, 36, 0.5)'
    },
    danger: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-red-500 to-red-600',
      glow: 'rgba(239, 68, 68, 0.5)'
    },
    premium: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600',
      glow: 'rgba(147, 51, 234, 0.5)'
    },
    gold: {
      bg: 'bg-white/20',
      fill: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
      glow: 'rgba(251, 191, 36, 0.8)'
    }
  }

  // Размеры
  const sizeClasses = {
    small: { height: 'h-2', text: 'text-xs' },
    medium: { height: 'h-4', text: 'text-sm' },
    large: { height: 'h-6', text: 'text-base' }
  }

  const variantClass = variantClasses[variant]
  const sizeClass = sizeClasses[size]

  // Определение цвета процента
  const getPercentageColor = () => {
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    if (percentage >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {/* Заголовок и статистика */}
      {(label || showNumbers || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={`text-white font-medium ${sizeClass.text}`}>{label}</span>
          )}
          <div className={`flex items-center space-x-3 ${sizeClass.text}`}>
            {showNumbers && (
              <span className="text-blue-200">
                {Math.round(displayValue)}/{maximum}
              </span>
            )}
            {showPercentage && (
              <span className={`font-bold ${getPercentageColor()}`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Основная полоса прогресса */}
      <div className={`relative overflow-hidden rounded-full ${variantClass.bg} ${sizeClass.height}`}>
        {/* Фоновая анимация (мерцание) */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 animate-pulse"></div>
        )}
        
        {/* Основная полоса заполнения */}
        <div
          className={`
            ${sizeClass.height} ${variantClass.fill} rounded-full 
            transition-all duration-1000 ease-out relative overflow-hidden
            ${striped ? 'progress-striped' : ''}
          `}
          style={{ 
            width: `${isVisible ? percentage : 0}%`,
            boxShadow: percentage > 0 && glow ? `0 0 20px ${variantClass.glow}` : 'none'
          }}
        >
          {/* Анимированная полоса света */}
          {animated && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer"></div>
          )}
          
          {/* Блики на полосе */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
        </div>

        {/* Дополнительные детали для премиального вида */}
        {variant === 'premium' && percentage > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        )}

        {/* Золотые частицы для gold варианта */}
        {variant === 'gold' && percentage > 0 && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-80 animate-float-1" style={{ left: '10%', animationDelay: '0s' }}></div>
            <div className="absolute w-1 h-1 bg-yellow-200 rounded-full opacity-60 animate-float-2" style={{ left: '30%', animationDelay: '0.5s' }}></div>
            <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-70 animate-float-3" style={{ left: '60%', animationDelay: '1s' }}></div>
          </div>
        )}
      </div>

      {/* Дополнительная информация */}
      {(variant === 'premium' || variant === 'gold') && percentage > 0 && (
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full animate-pulse ${variant === 'premium' ? 'bg-purple-400' : 'bg-yellow-400'}`}></div>
          <span className={`font-medium ${variant === 'premium' ? 'text-purple-300' : 'text-yellow-300'}`}>
            {variant === 'premium' ? 'Премиальный прогресс' : 'Золотой уровень'}
          </span>
        </div>
      )}

      {/* Индикатор завершения */}
      {isComplete && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="text-2xl animate-bounce">🎉</div>
          <span className="text-green-400 font-bold">Завершено!</span>
        </div>
      )}

      {/* CSS стили */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(120deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(240deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 2.5s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 3.5s ease-in-out infinite;
        }
        
        .progress-striped {
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
          background-size: 1rem 1rem;
          animation: progress-bar-stripes 1s linear infinite;
        }
        
        @keyframes progress-bar-stripes {
          0% { background-position: 1rem 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  )
}

// 🎯 КОМПОНЕНТ КРУГОВОГО ПРОГРЕССА
export const CircularProgress = ({ 
  value = 0, 
  maximum = 100,
  size = 80,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  showValue = true,
  label = '',
  animated = true,
  className = '',
  ...props 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((value / maximum) * 100, 100)

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  // Анимация
  useEffect(() => {
    if (!isVisible || !animated) {
      setAnimatedValue(percentage)
      return
    }

    let startTime = null
    const startValue = animatedValue
    const endValue = percentage
    const duration = 1500

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut
      
      setAnimatedValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [percentage, isVisible, animated])

  const strokeDashoffset = circumference - (animatedValue / 100) * circumference

  return (
    <div ref={ref} className={`flex flex-col items-center ${className}`} {...props}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Фоновый круг */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Прогресс */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none'
            }}
          />
        </svg>
        
        {/* Значение в центре */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {Math.round(animatedValue)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Подпись */}
      {label && (
        <span className="text-white text-sm mt-2 text-center">{label}</span>
      )}
    </div>
  )
}

// 🎯 МУЛЬТИ-ПРОГРЕСС (несколько полос)
export const MultiProgress = ({ 
  items = [], // [{ label: '', value: 0, maximum: 100, color: '', percentage: 0 }]
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {items.map((item, index) => (
        <ProgressBar
          key={index}
          label={item.label}
          value={item.value}
          maximum={item.maximum}
          variant={item.variant || 'default'}
          showPercentage={true}
          animated={true}
        />
      ))}
    </div>
  )
}

export default ProgressBar