import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from './PremiumTheme'

const AnimatedBackground = ({ 
  variant = 'particles', 
  intensity = 'medium',
  className = '',
  children 
}) => {
  const { theme, animationsEnabled } = useTheme()
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || !animationsEnabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let particles = []
    
    // Инициализация частиц в зависимости от варианта
    if (variant === 'particles') {
      initParticles()
    } else if (variant === 'waves') {
      initWaves()
    } else if (variant === 'matrix') {
      initMatrix()
    } else if (variant === 'neural') {
      initNeuralNetwork()
    }

    function initParticles() {
      particles = []
      const particleCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 150
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2
        })
      }
    }

    function initWaves() {
      particles = []
      for (let i = 0; i < 3; i++) {
        particles.push({
          amplitude: 50 + i * 20,
          frequency: 0.01 + i * 0.005,
          phase: i * Math.PI / 3,
          speed: 0.02 + i * 0.01,
          opacity: 0.1 - i * 0.02
        })
      }
    }

    function initMatrix() {
      particles = []
      const columns = Math.floor(canvas.width / 20)
      
      for (let i = 0; i < columns; i++) {
        particles.push({
          x: i * 20,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1,
          chars: '01',
          charIndex: 0
        })
      }
    }

    function initNeuralNetwork() {
      particles = []
      const nodeCount = intensity === 'low' ? 20 : intensity === 'medium' ? 40 : 60
      
      // Создаем узлы
      for (let i = 0; i < nodeCount; i++) {
        particles.push({
          type: 'node',
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 4 + 2,
          connections: [],
          pulse: Math.random() * Math.PI * 2
        })
      }
      
      // Создаем связи между близкими узлами
      particles.forEach((node, i) => {
        particles.forEach((other, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
            )
            if (distance < 150 && Math.random() > 0.7) {
              node.connections.push(j)
            }
          }
        })
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (variant === 'particles') {
        animateParticles()
      } else if (variant === 'waves') {
        animateWaves()
      } else if (variant === 'matrix') {
        animateMatrix()
      } else if (variant === 'neural') {
        animateNeuralNetwork()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    function animateParticles() {
      particles.forEach(particle => {
        // Обновляем позицию
        particle.x += particle.vx
        particle.y += particle.vy
        particle.pulse += 0.02

        // Границы экрана
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Рисуем частицу с пульсацией
        const alpha = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse))
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.fill()

        // Соединяем близкие частицы
        particles.forEach(other => {
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          )
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
    }

    function animateWaves() {
      particles.forEach((wave, index) => {
        wave.phase += wave.speed
        
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + 
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude
          ctx.lineTo(x, y)
        }
        
        ctx.strokeStyle = `rgba(59, 130, 246, ${wave.opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    function animateMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(column => {
        const char = column.chars[Math.floor(Math.random() * column.chars.length)]
        
        ctx.fillStyle = '#00ff41'
        ctx.font = '14px monospace'
        ctx.fillText(char, column.x, column.y)
        
        column.y += column.speed
        
        if (column.y > canvas.height && Math.random() > 0.99) {
          column.y = 0
        }
      })
    }

    function animateNeuralNetwork() {
      particles.forEach(node => {
        // Обновляем позицию узла
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.03

        // Границы экрана
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Рисуем связи
        node.connections.forEach(connectionIndex => {
          const other = particles[connectionIndex]
          if (other) {
            const distance = Math.sqrt(
              Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
            )
            
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })

        // Рисуем узел
        const alpha = 0.6 + 0.4 * Math.sin(node.pulse)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`
        ctx.fill()
        
        // Обводка узла
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size + 2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [variant, intensity, animationsEnabled, mounted, theme])

  const getStaticBackground = () => {
    const patterns = {
      particles: (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full"></div>
        </div>
      ),
      waves: (
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600">
            <path d="M0,300 Q300,200 600,300 T1200,300" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M0,320 Q300,220 600,320 T1200,320" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ),
      matrix: (
        <div className="absolute inset-0 opacity-5 font-mono text-green-400">
          <div className="absolute top-10 left-10">01010101</div>
          <div className="absolute top-20 right-20">11001100</div>
          <div className="absolute bottom-20 left-20">10101010</div>
        </div>
      ),
      neural: (
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            <circle cx="200" cy="150" r="4" fill="currentColor" />
            <circle cx="400" cy="100" r="3" fill="currentColor" />
            <circle cx="600" cy="200" r="4" fill="currentColor" />
            <line x1="200" y1="150" x2="400" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="400" y1="100" x2="600" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      )
    }
    return patterns[variant] || patterns.particles
  }

  return (
    <div className={`relative ${className}`}>
      {/* Статический фон для случаев без анимации */}
      {!animationsEnabled && getStaticBackground()}
      
      {/* Анимированный canvas */}
      {animationsEnabled && mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}
      
      {/* Контент поверх фона */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Предустановленные варианты фонов
export const ParticleBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="particles" {...props}>
    {children}
  </AnimatedBackground>
)

export const WaveBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="waves" {...props}>
    {children}
  </AnimatedBackground>
)

export const MatrixBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="matrix" {...props}>
    {children}
  </AnimatedBackground>
)

export const NeuralBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="neural" {...props}>
    {children}
  </AnimatedBackground>
)

// Геометрический фон
export const GeometricBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="geometric" {...props}>
    {children}
  </AnimatedBackground>
)

// Звездный фон
export const StarBackground = ({ children, ...props }) => (
  <AnimatedBackground variant="stars" {...props}>
    {children}
  </AnimatedBackground>
)

// Компонент для выбора фона
export const BackgroundSelector = ({ currentBackground, onBackgroundChange, className = '' }) => {
  const backgrounds = [
    { key: 'particles', name: 'Частицы', icon: '✨' },
    { key: 'waves', name: 'Волны', icon: '🌊' },
    { key: 'matrix', name: 'Матрица', icon: '💻' },
    { key: 'neural', name: 'Нейросеть', icon: '🧠' }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-white">Анимированный фон</h4>
      <div className="grid grid-cols-2 gap-2">
        {backgrounds.map(bg => (
          <button
            key={bg.key}
            onClick={() => onBackgroundChange(bg.key)}
            className={`
              p-3 rounded-lg text-xs transition-all duration-300
              ${currentBackground === bg.key 
                ? 'bg-blue-500/30 border border-blue-400/50 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-blue-200'
              }
            `}
          >
            <div className="text-lg mb-1">{bg.icon}</div>
            <div>{bg.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnimatedBackground