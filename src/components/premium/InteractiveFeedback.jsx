// InteractiveFeedback.jsx - Система интерактивных уведомлений и обратной связи
// Путь: src/components/premium/InteractiveFeedback.jsx

import React, { useState, useEffect, createContext, useContext } from 'react'

// 🎯 КОНТЕКСТ ДЛЯ УВЕДОМЛЕНИЙ
const FeedbackContext = createContext()

// 🎨 ТИПЫ УВЕДОМЛЕНИЙ
const NOTIFICATION_TYPES = {
  success: {
    icon: '✅',
    color: 'green',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    iconClass: 'text-green-600'
  },
  error: {
    icon: '❌',
    color: 'red', 
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    iconClass: 'text-red-600'
  },
  warning: {
    icon: '⚠️',
    color: 'yellow',
    bgClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-800',
    iconClass: 'text-yellow-600'
  },
  info: {
    icon: 'ℹ️',
    color: 'blue',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    iconClass: 'text-blue-600'
  },
  loading: {
    icon: '⏳',
    color: 'gray',
    bgClass: 'bg-gray-50 border-gray-200',
    textClass: 'text-gray-800',
    iconClass: 'text-gray-600'
  }
}

// 🔔 ПРОВАЙДЕР УВЕДОМЛЕНИЙ
export const FeedbackProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // 📝 Добавление уведомления
  const addNotification = (message, type = 'info', options = {}) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const notification = {
      id,
      message,
      type,
      timestamp: new Date(),
      autoHide: options.autoHide !== false,
      duration: options.duration || 5000,
      persistent: options.persistent || false,
      actions: options.actions || []
    }

    setNotifications(prev => [...prev, notification])

    // Автоскрытие
    if (notification.autoHide && !notification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  // 🗑️ Удаление уведомления
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // 🧹 Очистка всех уведомлений
  const clearAll = () => {
    setNotifications([])
  }

  // 🎯 Специализированные методы
  const showSuccess = (message, options) => addNotification(message, 'success', options)
  const showError = (message, options) => addNotification(message, 'error', options)
  const showWarning = (message, options) => addNotification(message, 'warning', options)
  const showInfo = (message, options) => addNotification(message, 'info', options)
  const showLoading = (message, options) => addNotification(message, 'loading', { 
    autoHide: false, 
    persistent: true, 
    ...options 
  })

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </FeedbackContext.Provider>
  )
}

// 📦 КОНТЕЙНЕР УВЕДОМЛЕНИЙ
const NotificationContainer = () => {
  const { notifications } = useContext(FeedbackContext)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

// 🎴 ЭЛЕМЕНТ УВЕДОМЛЕНИЯ
const NotificationItem = ({ notification }) => {
  const { removeNotification } = useContext(FeedbackContext)
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.info

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeNotification(notification.id)
    }, 300)
  }

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${isRemoving ? 'translate-x-full opacity-0 scale-95' : ''}
    `}>
      <div className={`
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        ${typeConfig.bgClass}
        hover:shadow-xl transition-shadow duration-200
      `}>
        <div className="flex items-start">
          {/* Иконка */}
          <div className={`flex-shrink-0 mr-3 ${typeConfig.iconClass}`}>
            {notification.type === 'loading' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <span className="text-lg">{typeConfig.icon}</span>
            )}
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${typeConfig.textClass}`}>
              {notification.message}
            </p>
            
            {/* Действия */}
            {notification.actions.length > 0 && (
              <div className="mt-2 space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.handler}
                    className={`
                      text-xs px-2 py-1 rounded
                      bg-white bg-opacity-80 hover:bg-opacity-100
                      ${typeConfig.textClass} border border-current border-opacity-30
                      transition-all duration-200
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка закрытия */}
          {!notification.persistent && (
            <button
              onClick={handleRemove}
              className={`
                flex-shrink-0 ml-2 ${typeConfig.textClass} 
                hover:opacity-75 transition-opacity duration-200
              `}
            >
              <span className="sr-only">Закрыть</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Прогресс-бар для автоскрытия */}
        {notification.autoHide && !notification.persistent && (
          <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1">
            <div 
              className={`h-1 bg-current rounded-full transition-all ease-linear ${typeConfig.iconClass}`}
              style={{
                animation: `shrink ${notification.duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// 🎯 ХУК ДЛЯ ИСПОЛЬЗОВАНИЯ УВЕДОМЛЕНИЙ
export const useFeedback = () => {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}

// 🎊 КОМПОНЕНТ КОНФЕТТИ
export const ConfettiEffect = ({ active, onComplete }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      createConfetti()
      const timer = setTimeout(() => {
        setParticles([])
        if (onComplete) onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  const createConfetti = () => {
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][Math.floor(Math.random() * 6)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      })
    }
    setParticles(newParticles)
  }

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 opacity-80"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall 3s linear forwards`
          }}
        />
      ))}
    </div>
  )
}

// 💫 АНИМИРОВАННЫЙ ПРОГРЕСС-ИНДИКАТОР
export const AnimatedProgress = ({ 
  progress, 
  showValue = true, 
  animated = true,
  color = 'blue',
  size = 'medium' 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

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

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4', 
    large: 'h-6'
  }

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <div className="w-full">
      <div className={`
        w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}
      `}>
        <div 
          className={`
            ${sizeClasses[size]} bg-gradient-to-r ${colorClasses[color]}
            transition-all duration-500 ease-out rounded-full
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ 
            width: `${Math.min(100, Math.max(0, animatedProgress))}%`,
            boxShadow: animated ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
          }}
        />
      </div>
      {showValue && (
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}

// 🎯 ИНТЕРАКТИВНЫЕ КНОПКИ С FEEDBACK
export const FeedbackButton = ({ 
  children, 
  onClick, 
  feedbackMessage,
  feedbackType = 'success',
  ...props 
}) => {
  const { addNotification } = useFeedback()

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    if (feedbackMessage) {
      addNotification(feedbackMessage, feedbackType, { duration: 2000 })
    }
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

// 🎨 CSS АНИМАЦИИ
const styles = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`

// Вставляем стили
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default {
  FeedbackProvider,
  useFeedback,
  ConfettiEffect,
  AnimatedProgress,
  FeedbackButton
}