// InteractiveElements.jsx - Полные премиальные интерактивные элементы
// Путь: src/components/premium/InteractiveElements.jsx

import React, { useState, useEffect, useRef } from 'react'
import { GlassEffect, GlowEffect } from './VisualEffects'

// 🎯 ИНТЕРАКТИВНАЯ КАРТОЧКА
export const InteractiveCard = ({ 
  children,
  variant = 'glass', // glass, solid, gradient, neon
  hover = 'lift', // lift, glow, scale, tilt
  onClick,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const variants = {
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
    solid: 'bg-gray-800 border border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-400/30',
    neon: 'bg-black border-2 border-cyan-400 shadow-lg shadow-cyan-400/50'
  }

  const hoverEffects = {
    lift: 'hover:transform hover:-translate-y-2 hover:shadow-2xl',
    glow: 'hover:shadow-lg hover:shadow-blue-500/50',
    scale: 'hover:scale-105',
    tilt: ''
  }

  const handleMouseMove = (e) => {
    if (hover === 'tilt' && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 10
      const rotateY = (centerX - e.clientX) / 10
      
      setTilt({ x: rotateX, y: rotateY })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`
        ${variants[variant]}
        ${hoverEffects[hover]}
        rounded-2xl p-6 transition-all duration-300 cursor-pointer
        ${className}
      `}
      style={hover === 'tilt' ? {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      } : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
}

// 🌊 RIPPLE BUTTON
export const RippleButton = ({ 
  children,
  variant = 'primary', // primary, secondary, accent, ghost, danger
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    ghost: 'bg-transparent border-2 border-white/30 hover:bg-white/10 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  const handleClick = (e) => {
    if (disabled || loading) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    }

    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    if (onClick) onClick(e)
  }

  return (
    <button
      ref={buttonRef}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        relative overflow-hidden rounded-lg font-semibold
        transition-all duration-200 transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style>
    </button>
  )
}

// 🎭 АНИМИРОВАННЫЙ МОДАЛ
export const AnimatedModal = ({ 
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium', // small, medium, large, fullscreen
  animation = 'slide-up', // slide-up, slide-down, scale, fade
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullscreen: 'max-w-none w-full h-full m-0 rounded-none'
  }

  const animations = {
    'slide-up': {
      enter: 'animate-slide-in-up',
      exit: 'animate-slide-out-down'
    },
    'slide-down': {
      enter: 'animate-slide-in-down', 
      exit: 'animate-slide-out-up'
    },
    scale: {
      enter: 'animate-scale-in',
      exit: 'animate-scale-out'
    },
    fade: {
      enter: 'animate-fade-in',
      exit: 'animate-fade-out'
    }
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}
      `}
      {...props}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div 
        className={`
          relative ${sizes[size]} w-full
          ${isOpen ? animations[animation].enter : animations[animation].exit}
          ${className}
        `}
      >
        <GlassEffect className="overflow-hidden">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              {title && (
                <h3 className="text-xl font-bold text-white">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </GlassEffect>
      </div>

      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-out-down {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(100px);
          }
        }
        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-out-up {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scale-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-slide-in-up { animation: slide-in-up 0.3s ease-out; }
        .animate-slide-out-down { animation: slide-out-down 0.3s ease-in; }
        .animate-slide-in-down { animation: slide-in-down 0.3s ease-out; }
        .animate-slide-out-up { animation: slide-out-up 0.3s ease-in; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-scale-out { animation: scale-out 0.3s ease-in; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-fade-out { animation: fade-out 0.3s ease-in; }
      `}</style>
    </div>
  )
}

// 🔄 АНИМИРОВАННЫЙ TOGGLE
export const AnimatedToggle = ({ 
  checked = false,
  onChange,
  size = 'medium', // small, medium, large
  color = 'blue',
  disabled = false,
  label,
  description,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: { container: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    medium: { container: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6' },
    large: { container: 'w-16 h-8', thumb: 'w-7 h-7', translate: 'translate-x-8' }
  }

  const colors = {
    blue: checked ? 'bg-blue-500' : 'bg-gray-600',
    green: checked ? 'bg-green-500' : 'bg-gray-600',
    purple: checked ? 'bg-purple-500' : 'bg-gray-600',
    pink: checked ? 'bg-pink-500' : 'bg-gray-600'
  }

  const sizeConfig = sizes[size]

  return (
    <div className={`flex items-center space-x-3 ${className}`} {...props}>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          ${sizeConfig.container} ${colors[color]}
          relative rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <div
          className={`
            ${sizeConfig.thumb} bg-white rounded-full shadow-md
            transform transition-transform duration-300 ease-in-out
            ${checked ? sizeConfig.translate : 'translate-x-0'}
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="text-white font-medium">
              {label}
            </div>
          )}
          {description && (
            <div className="text-gray-400 text-sm">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 📊 АНИМИРОВАННЫЙ ПРОГРЕСС
export const AnimatedProgress = ({ 
  value = 0,
  max = 100,
  size = 'medium', // small, medium, large
  variant = 'linear', // linear, circular
  color = 'blue',
  showValue = true,
  label,
  animated = true,
  className = '',
  ...props 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0)

  const colors = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    purple: 'stroke-purple-500',
    pink: 'stroke-pink-500'
  }

  const sizes = {
    small: { linear: 'h-2', circular: '64' },
    medium: { linear: 'h-4', circular: '80' },
    large: { linear: 'h-6', circular: '96' }
  }

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedValue(value)
    }
  }, [value, animated])

  const percentage = Math.round((animatedValue / max) * 100)

  if (variant === 'circular') {
    const size = parseInt(sizes[size].circular)
    const radius = (size - 16) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className={`relative ${className}`} {...props}>
        {label && (
          <div className="text-center mb-2">
            <span className="text-white font-medium">{label}</span>
          </div>
        )}
        
        <div className="relative">
          <svg 
            width={size} 
            height={size}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={colors[color]}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold">
                {percentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">{label}</span>
          {showValue && (
            <span className="text-blue-200 text-sm">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-white/20 rounded-full ${sizes[size].linear}`}>
        <div
          className={`${sizes[size].linear} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// 🎈 FLOATING ACTION BUTTON
export const FloatingActionButton = ({ 
  icon,
  onClick,
  position = 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  variant = 'primary',
  size = 'medium',
  tooltip,
  className = '',
  ...props 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6', 
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
  }

  const sizes = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-14 h-14 text-xl',
    large: 'w-16 h-16 text-2xl'
  }

  return (
    <div className={`fixed z-50 ${positions[position]} ${className}`} {...props}>
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${variants[variant]} ${sizes[size]}
          text-white rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300 transform hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
        `}
      >
        {icon}
      </button>
      
      {tooltip && showTooltip && (
        <div className={`
          absolute ${position.includes('right') ? 'right-full mr-3' : 'left-full ml-3'}
          ${position.includes('bottom') ? 'bottom-0' : 'top-0'}
          bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap
          animate-fade-in
        `}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

// 👤 АНИМИРОВАННЫЙ АВАТАР
export const AnimatedAvatar = ({ 
  src,
  name = '',
  size = 'medium', // small, medium, large
  status, // online, offline, away, busy
  onClick,
  showStatus = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className={`relative ${className}`} {...props}>
      <div
        onClick={onClick}
        className={`
          ${sizes[size]} rounded-full overflow-hidden
          transition-all duration-300 transform hover:scale-110
          ${onClick ? 'cursor-pointer' : ''}
          ${src ? '' : 'bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold'}
        `}
      >
        {src ? (
          <img 
            src={src} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'}>
            {getInitials(name)}
          </span>
        )}
      </div>
      
      {showStatus && status && (
        <div 
          className={`
            absolute -bottom-1 -right-1 w-4 h-4 
            ${statusColors[status]} rounded-full border-2 border-white
            ${status === 'online' ? 'animate-pulse' : ''}
          `}
        />
      )}
    </div>
  )
}

// 🎨 ОСНОВНОЙ ЭКСПОРТ
const InteractiveElements = {
  InteractiveCard,
  RippleButton,
  AnimatedModal,
  AnimatedToggle,
  AnimatedProgress,
  FloatingActionButton,
  AnimatedAvatar
}

export default InteractiveElements