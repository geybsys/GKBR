// MicroAnimations.jsx - Премиальные микроанимации для улучшения UX
// Путь: src/components/premium/MicroAnimations.jsx

import React, { useState, useEffect, useRef } from 'react'
import { useDesignSystem } from './DesignSystem'

// 🎯 АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
export const ScrollReveal = ({ 
  children, 
  delay = 0,
  direction = 'up', // up, down, left, right, scale, fade
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          if (triggerOnce) observer.disconnect()
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay, threshold, triggerOnce])

  const animations = {
    up: {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    down: {
      initial: 'opacity-0 -translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    left: {
      initial: 'opacity-0 translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    right: {
      initial: 'opacity-0 -translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    scale: {
      initial: 'opacity-0 scale-90',
      animate: 'opacity-100 scale-100'
    },
    fade: {
      initial: 'opacity-0',
      animate: 'opacity-100'
    }
  }

  const animation = animations[direction]

  return (
    <div
      ref={ref}
      className={`
        ${reducedMotion ? '' : 'transition-all duration-700 ease-out'}
        ${isVisible || reducedMotion ? animation.animate : animation.initial}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// ✨ АНИМАЦИЯ HOVER ЭФФЕКТОВ
export const HoverEffect = ({ 
  children, 
  effect = 'lift', // lift, glow, scale, tilt, bounce, float
  intensity = 'medium', // low, medium, high
  className = '',
  ...props 
}) => {
  const { reducedMotion } = useDesignSystem()

  const effects = {
    lift: {
      low: 'hover:transform hover:-translate-y-1',
      medium: 'hover:transform hover:-translate-y-2',
      high: 'hover:transform hover:-translate-y-4'
    },
    glow: {
      low: 'hover:shadow-lg hover:shadow-blue-500/25',
      medium: 'hover:shadow-xl hover:shadow-blue-500/50',
      high: 'hover:shadow-2xl hover:shadow-blue-500/75'
    },
    scale: {
      low: 'hover:scale-105',
      medium: 'hover:scale-110',
      high: 'hover:scale-125'
    },
    tilt: {
      low: 'hover:rotate-1',
      medium: 'hover:rotate-2',
      high: 'hover:rotate-3'
    },
    bounce: {
      low: 'hover:animate-bounce-subtle',
      medium: 'hover:animate-bounce',
      high: 'hover:animate-bounce-high'
    },
    float: {
      low: 'hover:animate-float-subtle',
      medium: 'hover:animate-float',
      high: 'hover:animate-float-high'
    }
  }

  return (
    <div
      className={`
        ${reducedMotion ? '' : `transition-all duration-300 ease-out ${effects[effect][intensity]}`}
        ${className}
      `}
      {...props}
    >
      {children}

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -5px, 0); }
          70% { transform: translate3d(0, -3px, 0); }
          90% { transform: translate3d(0, -1px, 0); }
        }
        @keyframes bounce-high {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -20px, 0); }
          70% { transform: translate3d(0, -10px, 0); }
          90% { transform: translate3d(0, -3px, 0); }
        }
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float-high {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .hover\\:animate-bounce-subtle:hover { animation: bounce-subtle 1s infinite; }
        .hover\\:animate-bounce-high:hover { animation: bounce-high 1s infinite; }
        .hover\\:animate-float-subtle:hover { animation: float-subtle 2s ease-in-out infinite; }
        .hover\\:animate-float:hover { animation: float 2s ease-in-out infinite; }
        .hover\\:animate-float-high:hover { animation: float-high 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// 🎬 ПОСЛЕДОВАТЕЛЬНАЯ АНИМАЦИЯ ДЕТЕЙ
export const StaggeredReveal = ({ 
  children, 
  staggerDelay = 100,
  direction = 'up',
  className = '',
  ...props 
}) => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const ref = useRef(null)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reducedMotion) {
          const childElements = Array.from(entry.target.children)
          childElements.forEach((child, index) => {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]))
            }, index * staggerDelay)
          })
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [staggerDelay, reducedMotion])

  const animations = {
    up: {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    down: {
      initial: 'opacity-0 -translate-y-8',
      animate: 'opacity-100 translate-y-0'
    },
    left: {
      initial: 'opacity-0 translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    right: {
      initial: 'opacity-0 -translate-x-8',
      animate: 'opacity-100 translate-x-0'
    },
    scale: {
      initial: 'opacity-0 scale-90',
      animate: 'opacity-100 scale-100'
    }
  }

  const animation = animations[direction]

  return (
    <div ref={ref} className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <div
          className={`
            ${reducedMotion ? '' : 'transition-all duration-500 ease-out'}
            ${visibleItems.has(index) || reducedMotion ? animation.animate : animation.initial}
          `}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// 🌊 RIPPLE ЭФФЕКТ
export const RippleEffect = ({ 
  children, 
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 600,
  className = '',
  onClick,
  ...props 
}) => {
  const [ripples, setRipples] = useState([])
  const ref = useRef(null)
  const { reducedMotion } = useDesignSystem()

  const handleClick = (e) => {
    if (reducedMotion) {
      if (onClick) onClick(e)
      return
    }

    const rect = ref.current.getBoundingClientRect()
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
    }, duration)

    if (onClick) onClick(e)
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple-expand"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ripple-expand {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple-expand {
          animation: ripple-expand linear;
        }
      `}</style>
    </div>
  )
}

// 📊 АНИМИРОВАННЫЙ СЧЕТЧИК
export const AnimatedNumber = ({ 
  value, 
  duration = 2000,
  format = 'number', // number, currency, percentage
  prefix = '',
  suffix = '',
  className = '',
  ...props 
}) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    if (reducedMotion) {
      setCurrentValue(value)
      return
    }

    let startTime = null
    const startValue = currentValue
    const endValue = value

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const newValue = startValue + (endValue - startValue) * easeOut
      
      setCurrentValue(Math.floor(newValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, isVisible, reducedMotion])

  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('ru-RU', { 
          style: 'currency', 
          currency: 'RUB' 
        }).format(val)
      case 'percentage':
        return `${val}%`
      default:
        return val.toLocaleString('ru-RU')
    }
  }

  return (
    <span ref={ref} className={className} {...props}>
      {prefix}{formatValue(currentValue)}{suffix}
    </span>
  )
}

// ⚡ АНИМАЦИЯ ЗАГРУЗКИ КОНТЕНТА
export const ContentLoader = ({ 
  isLoading = true,
  children,
  skeleton,
  fadeDuration = 300,
  className = '',
  ...props 
}) => {
  const [showContent, setShowContent] = useState(!isLoading)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    if (!isLoading) {
      if (reducedMotion) {
        setShowContent(true)
      } else {
        setTimeout(() => setShowContent(true), fadeDuration)
      }
    } else {
      setShowContent(false)
    }
  }, [isLoading, fadeDuration, reducedMotion])

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Скелетон */}
      <div
        className={`
          ${reducedMotion ? '' : `transition-opacity duration-${fadeDuration}`}
          ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        {skeleton}
      </div>
      
      {/* Контент */}
      <div
        className={`
          ${showContent ? 'relative' : 'absolute inset-0'}
          ${reducedMotion ? '' : `transition-opacity duration-${fadeDuration}`}
          ${showContent ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {children}
      </div>
    </div>
  )
}

// 🎭 МОРФИНГ МЕЖДУ СОСТОЯНИЯМИ
export const MorphTransition = ({ 
  state, 
  states = {},
  duration = 300,
  className = '',
  ...props 
}) => {
  const [currentState, setCurrentState] = useState(state)
  const [nextState, setNextState] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    if (state !== currentState) {
      if (reducedMotion) {
        setCurrentState(state)
        return
      }

      setNextState(state)
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentState(state)
        setIsTransitioning(false)
        setNextState(null)
      }, duration / 2)
    }
  }, [state, currentState, duration, reducedMotion])

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Текущее состояние */}
      <div
        className={`
          ${reducedMotion ? '' : `transition-all duration-${duration / 2}`}
          ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
        `}
      >
        {states[currentState]}
      </div>
      
      {/* Следующее состояние */}
      {nextState && (
        <div
          className={`
            absolute inset-0
            ${reducedMotion ? '' : `transition-all duration-${duration / 2}`}
            ${isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
        >
          {states[nextState]}
        </div>
      )}
    </div>
  )
}

// 📱 ТРЯСКА ДЛЯ ОШИБОК
export const ShakeAnimation = ({ 
  trigger, 
  children, 
  intensity = 'medium',
  className = '',
  ...props 
}) => {
  const [isShaking, setIsShaking] = useState(false)
  const { reducedMotion } = useDesignSystem()

  useEffect(() => {
    if (trigger && !reducedMotion) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }, [trigger, reducedMotion])

  const intensities = {
    low: 'animate-shake-low',
    medium: 'animate-shake',
    high: 'animate-shake-high'
  }

  return (
    <div
      className={`
        ${isShaking ? intensities[intensity] : ''}
        ${className}
      `}
      {...props}
    >
      {children}

      <style jsx>{`
        @keyframes shake-low {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes shake-high {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake-low { animation: shake-low 0.5s ease-in-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-shake-high { animation: shake-high 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}

// 🎯 ПУЛЬСАЦИЯ ВНИМАНИЯ
export const AttentionPulse = ({ 
  children, 
  active = false,
  color = 'blue',
  intensity = 'medium',
  className = '',
  ...props 
}) => {
  const { reducedMotion } = useDesignSystem()

  const colors = {
    blue: 'shadow-blue-500/50',
    red: 'shadow-red-500/50',
    green: 'shadow-green-500/50',
    yellow: 'shadow-yellow-500/50',
    purple: 'shadow-purple-500/50'
  }

  const intensities = {
    low: 'animate-pulse-slow',
    medium: 'animate-pulse',
    high: 'animate-pulse-fast'
  }

  return (
    <div
      className={`
        ${active && !reducedMotion ? `${intensities[intensity]} ${colors[color]}` : ''}
        ${className}
      `}
      {...props}
    >
      {children}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50% { box-shadow: 0 0 0 10px transparent; }
        }
        @keyframes pulse-fast {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50% { box-shadow: 0 0 0 15px transparent; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 1s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// 🎨 ОСНОВНОЙ ЭКСПОРТ
const MicroAnimations = {
  ScrollReveal,
  HoverEffect,
  StaggeredReveal,
  RippleEffect,
  AnimatedNumber,
  ContentLoader,
  MorphTransition,
  ShakeAnimation,
  AttentionPulse
}

export default MicroAnimations