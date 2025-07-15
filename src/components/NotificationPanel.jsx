// NotificationPanel.jsx - Премиальная система уведомлений
// Путь: src/components/NotificationPanel.jsx

import React, { useState, useEffect, createContext, useContext } from 'react'
import { GlassEffect } from './premium/VisualEffects'
import { RippleButton } from './premium/InteractiveElements'
import { useSounds } from './premium/SoundSystem'

// 🔔 КОНТЕКСТ УВЕДОМЛЕНИЙ
const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// 🏗️ ПРОВАЙДЕР УВЕДОМЛЕНИЙ
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const { sounds } = useSounds()

  // Добавление уведомления
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Воспроизведение звука
    if (sounds) {
      switch (notification.type) {
        case 'success':
          sounds.success?.()
          break
        case 'error':
          sounds.error?.()
          break
        case 'achievement':
          sounds.badge?.()
          break
        default:
          sounds.notification?.()
      }
    }

    // Автоудаление уведомления
    if (notification.autoClose !== false) {
      const duration = notification.duration || 5000
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  // Удаление уведомления
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Очистка всех уведомлений
  const clearAll = () => {
    setNotifications([])
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

// 📦 КОНТЕЙНЕР УВЕДОМЛЕНИЙ
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

// 🎯 ЭЛЕМЕНТ УВЕДОМЛЕНИЯ
const NotificationItem = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Появление с анимацией
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 300)
  }

  const typeStyles = {
    success: {
      gradient: 'from-green-500/90 to-emerald-600/90',
      border: 'border-green-400/50',
      icon: '✅',
      iconBg: 'bg-green-500'
    },
    error: {
      gradient: 'from-red-500/90 to-red-600/90',
      border: 'border-red-400/50',
      icon: '❌',
      iconBg: 'bg-red-500'
    },
    warning: {
      gradient: 'from-yellow-500/90 to-orange-600/90',
      border: 'border-yellow-400/50',
      icon: '⚠️',
      iconBg: 'bg-yellow-500'
    },
    info: {
      gradient: 'from-blue-500/90 to-blue-600/90',
      border: 'border-blue-400/50',
      icon: 'ℹ️',
      iconBg: 'bg-blue-500'
    },
    achievement: {
      gradient: 'from-purple-500/90 to-pink-600/90',
      border: 'border-purple-400/50',
      icon: '🏆',
      iconBg: 'bg-purple-500'
    }
  }

  const style = typeStyles[notification.type] || typeStyles.info

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <GlassEffect className={`
        bg-gradient-to-r ${style.gradient} border ${style.border}
        rounded-xl p-4 shadow-lg max-w-sm
      `}>
        <div className="flex items-start space-x-3">
          {/* Иконка */}
          <div className={`
            w-8 h-8 ${style.iconBg} rounded-full 
            flex items-center justify-center text-white text-sm
            flex-shrink-0
          `}>
            {style.icon}
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className="font-bold text-white text-sm mb-1">
                {notification.title}
              </h4>
            )}
            
            <p className="text-white/90 text-sm leading-relaxed">
              {notification.message}
            </p>

            {notification.actions && (
              <div className="flex space-x-2 mt-3">
                {notification.actions.map((action, index) => (
                  <RippleButton
                    key={index}
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      action.handler()
                      handleClose()
                    }}
                    className="text-xs"
                  >
                    {action.label}
                  </RippleButton>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={handleClose}
            className="
              p-1 text-white/60 hover:text-white hover:bg-white/10 
              rounded transition-colors flex-shrink-0
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Индикатор времени */}
        {notification.autoClose !== false && (
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/50 rounded-full animate-shrink"
              style={{
                animationDuration: `${notification.duration || 5000}ms`
              }}
            />
          </div>
        )}
      </GlassEffect>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink linear;
        }
      `}</style>
    </div>
  )
}

// 🎯 ГЛОБАЛЬНЫЙ ОБЪЕКТ ДЛЯ ПРОСТОГО ИСПОЛЬЗОВАНИЯ
export const notify = {
  success: (title, message, options = {}) => {
    if (typeof title === 'string' && !message) {
      // Упрощенное использование: notify.success('Сообщение')
      message = title
      title = 'Успех'
    }
    return window.gkbrNotify?.addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  },

  error: (title, message, options = {}) => {
    if (typeof title === 'string' && !message) {
      message = title
      title = 'Ошибка'
    }
    return window.gkbrNotify?.addNotification({
      type: 'error',
      title,
      message,
      autoClose: false, // Ошибки не закрываются автоматически
      ...options
    })
  },

  warning: (title, message, options = {}) => {
    if (typeof title === 'string' && !message) {
      message = title
      title = 'Предупреждение'
    }
    return window.gkbrNotify?.addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  },

  info: (title, message, options = {}) => {
    if (typeof title === 'string' && !message) {
      message = title
      title = 'Информация'
    }
    return window.gkbrNotify?.addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  },

  achievement: (title, message, options = {}) => {
    return window.gkbrNotify?.addNotification({
      type: 'achievement',
      title: title || 'Достижение получено!',
      message,
      duration: 7000, // Достижения показываются дольше
      ...options
    })
  },

  custom: (notification) => {
    return window.gkbrNotify?.addNotification(notification)
  }
}

// 🔧 КОМПОНЕНТ ДОСТИЖЕНИЯ
export const AchievementNotification = ({ badge, onClose }) => {
  return (
    <GlassEffect className="bg-gradient-to-r from-purple-500/90 to-pink-600/90 border border-purple-400/50 rounded-xl p-6 max-w-sm">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">
          {badge.icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Достижение получено!
        </h3>
        
        <h4 className="text-lg font-semibold text-purple-200 mb-3">
          {badge.name}
        </h4>
        
        <p className="text-white/90 text-sm mb-4">
          {badge.description}
        </p>

        <RippleButton
          variant="ghost"
          onClick={onClose}
          className="w-full"
        >
          Продолжить
        </RippleButton>
      </div>
    </GlassEffect>
  )
}

// 🎯 HOC для автоматического подключения уведомлений
export const withNotifications = (Component) => {
  return function WrappedComponent(props) {
    useEffect(() => {
      // Регистрируем глобальный объект для notify
      const context = useContext(NotificationContext)
      if (context) {
        window.gkbrNotify = context
      }
    }, [])

    return <Component {...props} />
  }
}

export default NotificationProvider