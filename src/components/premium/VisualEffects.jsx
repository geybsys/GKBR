// VisualEffects.jsx - Премиальные визуальные эффекты
// Путь: src/components/premium/VisualEffects.jsx

import React, { useEffect, useRef, useState } from 'react'

// 🌟 ЭФФЕКТ СВЕЧЕНИЯ
export const GlowEffect = ({ 
  children, 
  color = 'blue', 
  intensity = 'medium',
  className = '',
  trigger = 'hover', // hover, focus, always, none
  ...props 
}) => {
  const intensities = {
    low: '0 0 10px',
    medium: '0 0 20px',
    high: '0 0 30px',
    extreme: '0 0 40px'
  }

  const colors = {
    blue: 'rgba(59, 130, 246, 0.5)',
    purple: 'rgba(147, 51, 234, 0.5)',
    pink: 'rgba(236, 72, 153, 0.5)',
    green: 'rgba(34, 197, 94, 0.5)',
    yellow: 'rgba(251, 191, 36, 0.5)',
    red: 'rgba(239, 68, 68, 0.5)',
    white: 'rgba(255, 255, 255, 0.3)'
  }

  const glowStyle = {
    boxShadow: trigger === 'always' ? `${intensities[intensity]} ${colors[color]}` : undefined,
    transition: 'box-shadow 0.3s ease-in-out'
  }

  const triggerClass = trigger === 'hover' ? 'hover:glow-effect' : 
                     trigger === 'focus' ? 'focus:glow-effect' : ''

  return (
    <div 
      className={`${triggerClass} ${className}`}
      style={glowStyle}
      {...props}
    >
      {children}
      <style jsx>{`
        .hover\\:glow-effect:hover {
          box-shadow: ${intensities[intensity]} ${colors[color]} !important;
        }
        .focus\\:glow-effect:focus {
          box-shadow: ${intensities[intensity]} ${colors[color]} !important;
        }
      `}</style>
    </div>
  )
}

// 🥃 СТЕКЛЯННЫЙ ЭФФЕКТ (GLASSMORPHISM)
export const GlassEffect = ({ 
  children, 
  opacity = 0.1,
  blur = 'lg',
  className = '',
  tint = 'white',
  ...props 
}) => {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const tints = {
    white: `bg-white/${Math.round(opacity * 100)}`,
    black: `bg-black/${Math.round(opacity * 100)}`,
    blue: `bg-blue-500/${Math.round(opacity * 100)}`,
    purple: `bg-purple-500/${Math.round(opacity * 100)}`
  }

  return (
    <div 
      className={`
        ${tints[tint]} ${blurValues[blur]} 
        border border-white/20 rounded-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// 🎭 ГРАДИЕНТНЫЙ ФОН
export const GradientBackground = ({ 
  variant = 'corporate',
  overlay = false,
  children,
  className = '',
  ...props 
}) => {
  const variants = {
    corporate: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    ocean: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-blue-950',
    sunset: 'bg-gradient-to-br from-orange-950 via-red-950 to-purple-950',
    forest: 'bg-gradient-to-br from-green-950 via-emerald-950 to-green-950',
    galaxy: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-pink-950',
    midnight: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
  }

  return (
    <div 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// ✨ ЭФФЕКТ МЕРЦАНИЯ
export const ShimmerEffect = ({ 
  children,
  speed = 'normal',
  direction = 'left-to-right',
  className = '',
  ...props 
}) => {
  const speeds = {
    slow: 'animate-pulse',
    normal: 'animate-shimmer-2s',
    fast: 'animate-shimmer-1s'
  }

  return (
    <div 
      className={`
        relative overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
      <div className={`
        absolute inset-0 -skew-x-12 bg-gradient-to-r 
        from-transparent via-white/20 to-transparent
        ${speeds[speed]}
      `} />
      
      <style jsx>{`
        @keyframes shimmer-2s {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes shimmer-1s {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer-2s {
          animation: shimmer-2s 2s infinite;
        }
        .animate-shimmer-1s {
          animation: shimmer-1s 1s infinite;
        }
      `}</style>
    </div>
  )
}

// 🌊 ВОЛНОВОЙ ЭФФЕКТ
export const WaveEffect = ({ 
  children,
  color = 'blue',
  className = '',
  ...props 
}) => {
  const colors = {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    green: '#10b981'
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {children}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          className="relative block w-full h-16"
        >
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill={colors[color]}
            opacity="0.2"
          />
        </svg>
      </div>
    </div>
  )
}

// 🎯 PARALLAX ЭФФЕКТ
export const ParallaxEffect = ({ 
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  ...props 
}) => {
  const [offset, setOffset] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * speed
        
        if (direction === 'up') {
          setOffset(-rate)
        } else if (direction === 'down') {
          setOffset(rate)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return (
    <div 
      ref={ref}
      className={`${className}`}
      style={{ transform: `translateY(${offset}px)` }}
      {...props}
    >
      {children}
    </div>
  )
}

// 💫 PARTICLE CURSOR ЭФФЕКТ
export const ParticleCursor = ({ color = '#3b82f6', size = 4 }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = particlesRef.current

    // Инициализация canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Обработка движения мыши
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Создаем новые частицы
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * size + 1,
          alpha: 1,
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          }
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Анимация частиц
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle, index) => {
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y
        particle.alpha -= 0.02
        particle.size *= 0.98

        if (particle.alpha <= 0 || particle.size <= 0.1) {
          particles.splice(index, 1)
          return
        }

        ctx.save()
        ctx.globalAlpha = particle.alpha
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
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [color, size])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

// 🎨 ОСНОВНОЙ ЭКСПОРТ
const VisualEffects = {
  GlowEffect,
  GlassEffect,
  GradientBackground,
  ShimmerEffect,
  WaveEffect,
  ParallaxEffect,
  ParticleCursor
}

export default VisualEffects