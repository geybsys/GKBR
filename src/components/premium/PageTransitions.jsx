// PageTransitions.jsx - Система плавных переходов между страницами
// Путь: src/components/premium/PageTransitions.jsx

import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// 🎭 ТИПЫ ПЕРЕХОДОВ
const TRANSITION_TYPES = {
  fade: {
    enter: 'opacity-0',
    enterActive: 'opacity-100 transition-opacity duration-300 ease-in-out',
    exit: 'opacity-100', 
    exitActive: 'opacity-0 transition-opacity duration-300 ease-in-out'
  },
  slide: {
    enter: 'transform translate-x-full',
    enterActive: 'transform translate-x-0 transition-transform duration-500 ease-in-out',
    exit: 'transform translate-x-0',
    exitActive: 'transform -translate-x-full transition-transform duration-500 ease-in-out'
  },
  slideUp: {
    enter: 'transform translate-y-full',
    enterActive: 'transform translate-y-0 transition-transform duration-400 ease-out',
    exit: 'transform translate-y-0',
    exitActive: 'transform -translate-y-full transition-transform duration-400 ease-in'
  },
  zoom: {
    enter: 'transform scale-95 opacity-0',
    enterActive: 'transform scale-100 opacity-100 transition-all duration-300 ease-out',
    exit: 'transform scale-100 opacity-100',
    exitActive: 'transform scale-105 opacity-0 transition-all duration-300 ease-in'
  },
  flip: {
    enter: 'transform rotateY-90 opacity-0',
    enterActive: 'transform rotateY-0 opacity-100 transition-all duration-500 ease-out',
    exit: 'transform rotateY-0 opacity-100',
    exitActive: 'transform rotateY-90 opacity-0 transition-all duration-500 ease-in'
  }
}

// 🎬 ГЛАВНЫЙ КОМПОНЕНТ ПЕРЕХОДОВ
export const PageTransition = ({ 
  children, 
  type = 'fade',
  duration = 300,
  className = '',
  onEnter,
  onExit,
  disabled = false
}) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('entered')
  const timeoutRef = useRef(null)

  const transition = TRANSITION_TYPES[type] || TRANSITION_TYPES.fade

  useEffect(() => {
    if (disabled) {
      setDisplayLocation(location)
      return
    }

    if (location !== displayLocation) {
      // Начинаем выход
      setTransitionStage('exiting')
      if (onExit) onExit()

      // Через половину времени переходим к новой странице
      timeoutRef.current = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('entering')
        if (onEnter) onEnter()

        // Завершаем переход
        timeoutRef.current = setTimeout(() => {
          setTransitionStage('entered')
        }, duration / 2)
      }, duration / 2)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [location, displayLocation, duration, disabled, onEnter, onExit])

  const getTransitionClass = () => {
    switch (transitionStage) {
      case 'entering':
        return `${transition.enter} ${transition.enterActive}`
      case 'exiting':
        return `${transition.exit} ${transition.exitActive}`
      case 'entered':
      default:
        return transition.enterActive.replace(/transition-\w+ duration-\d+ ease-\w+/, '')
    }
  }

  return (
    <div className={`${getTransitionClass()} ${className}`}>
      {React.cloneElement(children, { key: displayLocation.pathname })}
    </div>
  )
}

// 🎯 КОМПОНЕНТ ЛОАДЕРА МЕЖДУ ПЕРЕХОДАМИ
export const TransitionLoader = ({ 
  show, 
  type = 'spinner', 
  message = 'Загрузка...',
  overlay = true 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!isVisible) return null

  const loaderTypes = {
    spinner: (
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    ),
    pulse: (
      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 bg-white rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ),
    bars: (
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-2 bg-white animate-bounce"
            style={{ 
              height: `${20 + Math.sin(i) * 10}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    ),
    progress: (
      <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-progress" />
      </div>
    )
  }

  return (
    <div className={`
      ${overlay ? 'fixed inset-0 z-50' : 'relative'}
      ${overlay ? 'bg-black bg-opacity-50' : ''}
      flex items-center justify-center
      transition-opacity duration-300
      ${show ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className="text-center text-white">
        <div className="mb-4 flex justify-center">
          {loaderTypes[type]}
        </div>
        {message && (
          <p className="text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  )
}

// 🎪 АНИМИРОВАННЫЙ РОУТЕР
export const AnimatedRouter = ({ 
  children, 
  transitionType = 'fade',
  showLoader = true,
  loaderType = 'spinner' 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const prevLocation = useRef(location)

  useEffect(() => {
    if (location.pathname !== prevLocation.current.pathname) {
      if (showLoader) {
        setIsLoading(true)
        const timer = setTimeout(() => setIsLoading(false), 300)
        return () => clearTimeout(timer)
      }
    }
    prevLocation.current = location
  }, [location, showLoader])

  return (
    <>
      <PageTransition 
        type={transitionType}
        onEnter={() => showLoader && setIsLoading(true)}
        onExit={() => showLoader && setIsLoading(false)}
      >
        {children}
      </PageTransition>
      
      <TransitionLoader 
        show={isLoading} 
        type={loaderType}
        message="Загрузка страницы..."
      />
    </>
  )
}

// 🎨 КОМПОНЕНТ ПАРАЛЛАКСА
export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '',
  offset = 0 
}) => {
  const [transform, setTransform] = useState(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const parallax = (scrolled * speed) + offset

      setTransform(parallax)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, offset])

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ transform: `translateY(${transform}px)` }}
    >
      {children}
    </div>
  )
}

// 🌟 ЭФФЕКТ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
export const ScrollReveal = ({ 
  children, 
  direction = 'up',
  distance = 50,
  duration = 600,
  delay = 0,
  className = '',
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  const directions = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay, threshold])

  return (
    <div
      ref={elementRef}
      className={`
        transition-all ease-out ${className}
        ${isVisible ? 'opacity-100 transform translate-x-0 translate-y-0' : 'opacity-0 transform'}
      `}
      style={{
        transform: isVisible ? 'translate(0)' : directions[direction],
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

// 🎭 МУЛЬТИСТАДИЙНАЯ АНИМАЦИЯ
export const StaggeredReveal = ({ 
  children, 
  staggerDelay = 100,
  baseDelay = 0 
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal delay={baseDelay + (index * staggerDelay)}>
          {child}
        </ScrollReveal>
      ))}
    </>
  )
}

// 🎨 МОРФИНГ ПЕРЕХОД
export const MorphTransition = ({ 
  fromElement, 
  toElement, 
  trigger,
  duration = 500 
}) => {
  const [isMorphing, setIsMorphing] = useState(false)
  const [showTo, setShowTo] = useState(false)

  const handleMorph = () => {
    setIsMorphing(true)
    
    setTimeout(() => {
      setShowTo(true)
    }, duration / 2)

    setTimeout(() => {
      setIsMorphing(false)
    }, duration)
  }

  useEffect(() => {
    if (trigger) {
      handleMorph()
    }
  }, [trigger])

  return (
    <div className="relative">
      {/* FROM ELEMENT */}
      <div className={`
        transition-all duration-${duration/2} ease-in-out
        ${isMorphing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${showTo ? 'hidden' : 'block'}
      `}>
        {fromElement}
      </div>

      {/* TO ELEMENT */}
      <div className={`
        transition-all duration-${duration/2} ease-in-out
        ${showTo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'}
      `}>
        {toElement}
      </div>
    </div>
  )
}

// 🎨 CSS ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ
const additionalStyles = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .rotateY-90 {
    transform: rotateY(90deg);
  }
  
  .rotateY-0 {
    transform: rotateY(0deg);
  }
`

// Вставляем дополнительные стили
if (typeof document !== 'undefined') {
  const existingStyle = document.querySelector('#page-transitions-styles')
  if (!existingStyle) {
    const styleSheet = document.createElement('style')
    styleSheet.id = 'page-transitions-styles'
    styleSheet.textContent = additionalStyles
    document.head.appendChild(styleSheet)
  }
}

export default {
  PageTransition,
  TransitionLoader,
  AnimatedRouter,
  ParallaxSection,
  ScrollReveal,
  StaggeredReveal,
  MorphTransition
}