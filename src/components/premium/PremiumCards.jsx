// PremiumCards.jsx - Премиальные карточки модулей
// Путь: src/components/premium/PremiumCards.jsx

import React, { useState, useRef, useEffect } from 'react'
import { useDesignSystem } from './DesignSystem.jsx'
import { GlowEffect, HolographicEffect } from './VisualEffects.jsx'
import { AnimatedCounter, MagneticElement } from './AnimatedComponents.jsx'

// 🎯 ПРЕМИАЛЬНАЯ КАРТОЧКА МОДУЛЯ
export const PremiumModuleCard = ({ 
  module,
  completed = false,
  score = 0,
  progress = 0,
  variant = 'default',
  interactive = true,
  onStart,
  onQuiz,
  className = '' 
}) => {
  const { colors, reducedMotion } = useDesignSystem()
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  // Отслеживание позиции мыши для эффектов
  useEffect(() => {
    if (!interactive || reducedMotion) return

    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    }

    card.addEventListener('mousemove', handleMouseMove)
    return () => card.removeEventListener('mousemove', handleMouseMove)
  }, [interactive, reducedMotion])

  const variants = {
    default: 'bg-white/10 backdrop-blur-lg border border-white/20',
    premium: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-primary-400/30',
    luxury: 'bg-gradient-to-br from-purple-500/10 to-gold-500/10 backdrop-blur-xl border border-gold-400/30',
    completed: 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl border border-green-400/40'
  }

  const cardVariant = completed ? 'completed' : variant

  const transformStyle = !reducedMotion && isHovered ? {
    transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.1}deg) rotateX(${(50 - mousePosition.y) * 0.1}deg) translateZ(10px)`,
    transition: 'transform 0.2s ease-out'
  } : {}

  return (
    <MagneticElement 
      strength={interactive ? 0.2 : 0} 
      disabled={!interactive}
      className={className}
    >
      <div
        ref={cardRef}
        className={`
          relative rounded-2xl p-6 group cursor-pointer
          ${variants[cardVariant]}
          ${interactive ? 'hover:shadow-2xl' : ''}
          transition-all duration-300 overflow-hidden
        `}
        style={transformStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={completed ? onQuiz : onStart}
      >
        {/* Holographic overlay */}
        {interactive && !reducedMotion && (
          <HolographicEffect 
            intensity="low" 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          />
        )}

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {completed ? (
            <GlowEffect color="success" intensity="medium">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </GlowEffect>
          ) : (
            <div className="w-8 h-8 bg-blue-500/20 border border-blue-400/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Module icon/emoji */}
        <div className="text-4xl mb-4">
          {module.icon || getModuleIcon(module.category)}
        </div>

        {/* Module info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
              {module.title}
            </h3>
            <p className="text-neutral-400 text-sm line-clamp-2">
              {module.description}
            </p>
          </div>

          {/* Progress bar (if in progress) */}
          {progress > 0 && progress < 100 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-400">Прогресс</span>
                <span className="text-xs text-white font-medium">
                  <AnimatedCounter to={progress} suffix="%" />
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Score (if completed) */}
          {completed && score > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Баллы</span>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-bold text-yellow-400">
                  <AnimatedCounter to={score} />
                </span>
                <span className="text-xs text-yellow-500">★</span>
              </div>
            </div>
          )}

          {/* Module metadata */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="capitalize">{module.category}</span>
            <span>{module.duration || '45-60 мин'}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex space-x-2">
          {completed ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onQuiz?.()
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                Повторить тест
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStart?.()
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300"
              >
                📚
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStart?.()
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {progress > 0 ? 'Продолжить' : 'Начать изучение'}
            </button>
          )}
        </div>

        {/* Hover glow effect */}
        {interactive && !reducedMotion && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
          </div>
        )}
      </div>
    </MagneticElement>
  )
}

// 📊 СТАТИСТИЧЕСКАЯ КАРТОЧКА
export const StatsCard = ({ 
  title,
  value,
  change,
  icon,
  color = 'primary',
  variant = 'default',
  className = '' 
}) => {
  const { colors } = useDesignSystem()

  const variants = {
    default: 'bg-white/10 backdrop-blur-lg border border-white/20',
    minimal: 'bg-white/5 backdrop-blur-md',
    prominent: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-primary-400/30'
  }

  const colorClasses = {
    primary: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    accent: 'text-purple-400'
  }

  return (
    <div className={`${variants[variant]} rounded-2xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-neutral-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      
      <div>
        <div className="text-3xl font-bold text-white mb-1">
          <AnimatedCounter to={value} />
        </div>
        <div className="text-neutral-400 text-sm">
          {title}
        </div>
      </div>
    </div>
  )
}

// 🏆 КАРТОЧКА ДОСТИЖЕНИЯ
export const AchievementCard = ({ 
  achievement,
  unlocked = false,
  progress = 0,
  className = '' 
}) => {
  return (
    <div className={`
      relative rounded-2xl p-6 transition-all duration-300
      ${unlocked 
        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-400/40' 
        : 'bg-white/5 border border-white/10'
      }
      ${className}
    `}>
      {/* Glow effect for unlocked achievements */}
      {unlocked && (
        <GlowEffect color="warning" intensity="medium" className="absolute inset-0 rounded-2xl" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          <div className={`text-4xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
            {achievement.icon}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${unlocked ? 'text-yellow-300' : 'text-neutral-400'}`}>
              {achievement.title}
            </h3>
            <p className={`text-sm ${unlocked ? 'text-white' : 'text-neutral-500'}`}>
              {achievement.description}
            </p>
            
            {!unlocked && progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-500">Прогресс</span>
                  <span className="text-xs text-neutral-400">{progress}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {unlocked && (
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium">
              Разблокировано!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// 📝 КАРТОЧКА УВЕДОМЛЕНИЯ
export const NotificationCard = ({ 
  notification,
  onDismiss,
  className = '' 
}) => {
  const typeStyles = {
    success: 'from-green-500/20 to-emerald-500/10 border-green-400/40',
    error: 'from-red-500/20 to-red-500/10 border-red-400/40',
    warning: 'from-yellow-500/20 to-orange-500/10 border-yellow-400/40',
    info: 'from-blue-500/20 to-blue-500/10 border-blue-400/40'
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div className={`
      bg-gradient-to-r ${typeStyles[notification.type]} 
      backdrop-blur-lg border rounded-2xl p-4 animate-slide-in
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        <div className="text-xl">
          {icons[notification.type]}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-white/90">
            {notification.message}
          </p>
          
          {notification.timestamp && (
            <div className="text-xs text-white/60 mt-2">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// 🎯 УТИЛИТАРНЫЕ ФУНКЦИИ
const getModuleIcon = (category) => {
  const icons = {
    regulatory: '📋',
    training: '🎓',
    licensing: '📜',
    certification: '🏆',
    compliance: '✅',
    technical: '⚙️',
    legal: '⚖️'
  }
  return icons[category] || '📚'
}

// 📱 АДАПТИВНАЯ КАРТОЧНАЯ СЕТКА
export const ResponsiveCardGrid = ({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className = '' 
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={`
      grid 
      grid-cols-${columns.sm} 
      md:grid-cols-${columns.md} 
      lg:grid-cols-${columns.lg} 
      xl:grid-cols-${columns.xl}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default {
  PremiumModuleCard,
  StatsCard,
  AchievementCard,
  NotificationCard,
  ResponsiveCardGrid
}