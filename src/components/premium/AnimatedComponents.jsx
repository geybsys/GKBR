// AnimatedComponents.jsx - Премиальные анимированные компоненты
// Путь: src/components/premium/AnimatedComponents.jsx

import React, { useState, useEffect, useRef } from 'react'

// 🔢 АНИМИРОВАННЫЙ СЧЕТЧИК
export const AnimatedCounter = ({ 
  value = 0, 
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  format = 'number', // number, percentage, currency
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    const startValue = displayValue
    const endValue = value

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(Math.floor(currentValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, isVisible])

  const formatValue = (val) => {
    switch (format) {
      case 'percentage':
        return `${val}%`
      case 'currency':
        return new Intl.NumberFormat('ru-RU', { 
          style: 'currency', 
          currency: 'RUB' 
        }).format(val)
      default:
        return val.toLocaleString('ru-RU')
    }
  }

  return (
    <span 
      ref={ref}
      className={`font-bold ${className}`}
      {...props}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  )
}

// ✍️ ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ
export const TypewriterEffect = ({ 
  text = '', 
  speed = 50,
  cursor = '|',
  showCursor = true,
  onComplete,
  className = '',
  ...props 
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursorState, setShowCursorState] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    if (!showCursor) return

    const interval = setInterval(() => {
      setShowCursorState(prev => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [showCursor])

  return (
    <span className={className} {...props}>
      {displayText}
      {showCursor && (
        <span className={`${showCursorState ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          {cursor}
        </span>
      )}
    </span>
  )
}

// 🧲 МАГНИТНЫЙ ЭЛЕМЕНТ (реагирует на курсор)
export const MagneticElement = ({ 
  children,
  strength = 0.2,
  className = '',
  ...props 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// 💓 ПУЛЬСИРУЮЩИЙ ЭЛЕМЕНТ
export const PulseElement = ({ 
  children,
  color = 'blue',
  intensity = 'medium',
  speed = 'normal',
  className = '',
  ...props 
}) => {
  const colors = {
    blue: 'shadow-blue-500/50',
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    green: 'shadow-green-500/50',
    red: 'shadow-red-500/50'
  }

  const intensities = {
    low: 'shadow-sm',
    medium: 'shadow-lg',
    high: 'shadow-xl'
  }

  const speeds = {
    slow: 'animate-pulse-slow',
    normal: 'animate-pulse',
    fast: 'animate-pulse-fast'
  }

  return (
    <div 
      className={`
        ${colors[color]} ${intensities[intensity]} ${speeds[speed]}
        ${className}
      `}
      {...props}
    >
      {children}
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 0 0 currentColor;
          }
          50% { 
            opacity: 0.7;
            box-shadow: 0 0 0 10px transparent;
          }
        }
        @keyframes pulse-fast {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 0 0 currentColor;
          }
          50% { 
            opacity: 0.7;
            box-shadow: 0 0 0 10px transparent;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

// ✨ СИСТЕМА ЧАСТИЦ
export const ParticleSystem = ({ 
  particleCount = 50,
  color = '#3b82f6',
  speed = 1,
  size = 2,
  className = '',
  ...props 
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []

    // Инициализация canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Создание частиц
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * size + 1,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    // Анимация частиц
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Отскок от краев
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.speedY *= -1
        }

        // Рисование частицы
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [particleCount, color, speed, size])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      {...props}
    />
  )
}

// 🌊 ВОЛНОВАЯ АНИМАЦИЯ
export const WaveAnimation = ({ 
  height = 60,
  color = '#3b82f6',
  speed = 1,
  amplitude = 20,
  frequency = 0.02,
  className = '',
  ...props 
}) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let phase = 0

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      
      for (let x = 0; x <= canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * frequency + phase) * amplitude
        ctx.lineTo(x, y)
      }
      
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.fillStyle = color
      ctx.fill()
      
      phase += speed * 0.1
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [height, color, speed, amplitude, frequency])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
      {...props}
    />
  )
}

// 🔄 SPINNING LOADER
export const SpinningLoader = ({ 
  size = 40,
  color = '#3b82f6',
  thickness = 4,
  speed = 'normal',
  className = '',
  ...props 
}) => {
  const speeds = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  }

  return (
    <div 
      className={`${speeds[speed]} ${className}`}
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid transparent`,
        borderTop: `${thickness}px solid ${color}`,
        borderRadius: '50%'
      }}
      {...props}
    >
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

// 📈 АНИМИРОВАННАЯ ЛИНИЯ ПРОГРЕССА
export const AnimatedProgressLine = ({ 
  progress = 0,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  height = 8,
  duration = 1000,
  className = '',
  ...props 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div 
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ 
        height: `${height}px`,
        backgroundColor 
      }}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all ease-out"
        style={{
          width: `${animatedProgress}%`,
          backgroundColor: color,
          transitionDuration: `${duration}ms`
        }}
      />
    </div>
  )
}

// 🎨 ОСНОВНОЙ ЭКСПОРТ
const AnimatedComponents = {
  AnimatedCounter,
  TypewriterEffect,
  MagneticElement,
  PulseElement,
  ParticleSystem,
  WaveAnimation,
  SpinningLoader,
  AnimatedProgressLine
}

export default AnimatedComponents