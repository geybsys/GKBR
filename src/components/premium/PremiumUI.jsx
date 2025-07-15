// PremiumUI.jsx - Завершенный главный файл премиального UI системы
// Путь: src/components/premium/PremiumUI.jsx

import React from 'react'

// 🎨 ИМПОРТ ВСЕХ ПРЕМИАЛЬНЫХ КОМПОНЕНТОВ

// Базовые системы
import { 
  ThemeProvider, 
  useTheme, 
  PremiumCard, 
  PremiumButton, 
  PremiumInput, 
  ThemeSelector, 
  AnimationToggle 
} from './PremiumTheme'

import { 
  SoundProvider, 
  useSounds, 
  SoundSettings, 
  useSoundOnMount, 
  useSoundOnChange, 
  SoundTrigger 
} from './SoundSystem'

import { 
  DesignSystemProvider, 
  useDesignSystem 
} from './DesignSystem'

// Визуальные эффекты
import { 
  GlowEffect, 
  GlassEffect, 
  GradientBackground, 
  ShimmerEffect, 
  WaveEffect, 
  ParallaxEffect, 
  ParticleCursor 
} from './VisualEffects'

// Анимированные компоненты
import { 
  AnimatedCounter, 
  TypewriterEffect, 
  MagneticElement, 
  PulseElement, 
  ParticleSystem, 
  WaveAnimation, 
  SpinningLoader, 
  AnimatedProgressLine 
} from './AnimatedComponents'

// Интерактивные элементы
import { 
  InteractiveCard, 
  RippleButton, 
  AnimatedModal, 
  AnimatedToggle, 
  AnimatedProgress, 
  FloatingActionButton, 
  AnimatedAvatar 
} from './InteractiveElements'

// Состояния загрузки
import { 
  GradientSpinner, 
  AnimatedProgressBar, 
  DotsLoader, 
  WaveLoader, 
  PulseLoader, 
  SkeletonLoader, 
  CardSkeleton, 
  LoadingOverlay, 
  StepLoader 
} from './LoadingStates'

// Анимированные фоны
import AnimatedBackground, { 
  ParticleBackground, 
  WaveBackground, 
  MatrixBackground, 
  NeuralBackground, 
  GeometricBackground, 
  StarBackground, 
  BackgroundSelector 
} from './AnimatedBackground'

// Микроанимации
import {
  ScrollReveal,
  HoverEffect,
  StaggeredReveal,
  RippleEffect,
  AnimatedNumber,
  ContentLoader,
  MorphTransition,
  ShakeAnimation,
  AttentionPulse
} from './MicroAnimations'

// 🎯 ГЛАВНЫЙ ПРОВАЙДЕР ПРЕМИАЛЬНОГО UI
export const PremiumUIProvider = ({ children }) => {
  return (
    <DesignSystemProvider>
      <SoundProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </SoundProvider>
    </DesignSystemProvider>
  )
}

// 🌟 ГОТОВЫЕ ПРЕМИАЛЬНЫЕ СТРАНИЦЫ-ОБЕРТКИ
export const PremiumPage = ({ 
  children, 
  background = 'particles',
  backgroundIntensity = 'medium',
  backgroundInteractive = true,
  showFloatingSettings = false,
  theme = 'auto',
  className = '',
  ...props
}) => {
  const { theme: currentTheme } = useTheme()
  
  return (
    <div className={`min-h-screen ${className}`} {...props}>
      {/* Анимированный фон */}
      <AnimatedBackground
        variant={background}
        intensity={backgroundIntensity}
        interactive={backgroundInteractive}
        color={currentTheme?.colors?.primary || '#3b82f6'}
        className="absolute inset-0"
      />
      
      {/* Содержимое страницы */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
      
      {/* Плавающие настройки */}
      {showFloatingSettings && (
        <PremiumSettingsButton />
      )}
    </div>
  )
}

// 🔧 ПЛАВАЮЩАЯ КНОПКА НАСТРОЕК
export const PremiumSettingsButton = () => {
  const [showSettings, setShowSettings] = React.useState(false)
  const { sounds } = useSounds()

  return (
    <>
      <FloatingActionButton
        icon="⚙️"
        position="bottom-right"
        tooltip="Настройки интерфейса"
        onClick={() => {
          sounds?.click()
          setShowSettings(true)
        }}
      />
      
      <PremiumSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  )
}

// 🎛️ МОДАЛ НАСТРОЕК
export const PremiumSettingsModal = ({ isOpen, onClose }) => {
  const [currentBackground, setCurrentBackground] = React.useState(
    localStorage.getItem('gkbr_background') || 'particles'
  )

  const handleBackgroundChange = (bg) => {
    setCurrentBackground(bg)
    localStorage.setItem('gkbr_background', bg)
    // Уведомляем приложение об изменении фона
    window.dispatchEvent(new CustomEvent('gkbr:background-changed', { detail: bg }))
  }

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Настройки интерфейса"
      size="medium"
    >
      <div className="space-y-8">
        {/* Настройки темы */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">🎨 Тема оформления</h4>
          <ThemeSelector />
        </div>
        
        {/* Настройки фона */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">🌌 Анимированный фон</h4>
          <BackgroundSelector 
            currentBackground={currentBackground}
            onBackgroundChange={handleBackgroundChange}
          />
        </div>
        
        {/* Настройки звука */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">🔊 Звуковые эффекты</h4>
          <SoundSettings />
        </div>
        
        {/* Дополнительные настройки */}
        <PremiumCard>
          <h4 className="text-lg font-semibold text-white mb-4">🎮 Дополнительные настройки</h4>
          
          <div className="space-y-4">
            <AnimationToggle />
            
            <AnimatedToggle
              label="Уведомления"
              description="Показывать уведомления о достижениях"
              checked={localStorage.getItem('gkbr_notifications') !== 'false'}
              onChange={(checked) => {
                localStorage.setItem('gkbr_notifications', checked.toString())
              }}
            />
            
            <AnimatedToggle
              label="Автосохранение"
              description="Автоматически сохранять прогресс"
              checked={localStorage.getItem('gkbr_autosave') !== 'false'}
              onChange={(checked) => {
                localStorage.setItem('gkbr_autosave', checked.toString())
              }}
            />
            
            <AnimatedToggle
              label="Режим фокуса"
              description="Скрывать отвлекающие элементы"
              checked={localStorage.getItem('gkbr_focus_mode') === 'true'}
              onChange={(checked) => {
                localStorage.setItem('gkbr_focus_mode', checked.toString())
              }}
            />

            <AnimatedToggle
              label="Эффект курсора"
              description="Частицы следуют за курсором"
              checked={localStorage.getItem('gkbr_particle_cursor') === 'true'}
              onChange={(checked) => {
                localStorage.setItem('gkbr_particle_cursor', checked.toString())
                if (checked) {
                  window.dispatchEvent(new Event('gkbr:enable-cursor'))
                } else {
                  window.dispatchEvent(new Event('gkbr:disable-cursor'))
                }
              }}
            />
          </div>
        </PremiumCard>
      </div>
    </AnimatedModal>
  )
}

// 💳 ПРЕМИАЛЬНАЯ ФОРМА ВХОДА
export const PremiumLoginForm = ({ 
  onSubmit, 
  isLoading = false, 
  title = 'GKBR Platform',
  subtitle = 'Премиальное обучение',
  className = '' 
}) => {
  const { sounds } = useSounds()
  const [formData, setFormData] = React.useState({ email: '', password: '' })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (sounds) sounds.click()
    if (onSubmit) onSubmit(formData)
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <GlowEffect color="blue" intensity="medium" trigger="always">
        <PremiumCard variant="glass" className="text-center">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              <TypewriterEffect text={title} speed={100} />
            </h1>
            <p className="text-blue-200">{subtitle}</p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <PremiumInput
              label="Email"
              type="email"
              variant="accent"
              icon="📧"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            
            <PremiumInput
              label="Пароль"
              type="password"
              variant="accent"
              icon="🔒"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />

            <RippleButton
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Входим в систему...' : 'Войти в систему'}
            </RippleButton>
          </form>

          {/* Дополнительные ссылки */}
          <div className="mt-6 text-center">
            <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Забыли пароль?
            </button>
          </div>
        </PremiumCard>
      </GlowEffect>
    </div>
  )
}

// 📋 ПРЕМИАЛЬНЫЙ ХЕДЕР
export const PremiumHeader = ({ 
  title, 
  subtitle, 
  user, 
  onSettingsClick, 
  onLogout,
  showUserInfo = true,
  className = '' 
}) => {
  const { sounds } = useSounds()

  return (
    <header className={`bg-black/20 backdrop-blur-lg border-b border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Левая часть - заголовок */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-blue-200 text-sm">{subtitle}</p>}
            </div>
          </div>
          
          {/* Правая часть - пользователь и действия */}
          <div className="flex items-center space-x-4">
            {showUserInfo && user && (
              <div className="flex items-center space-x-3">
                <AnimatedAvatar
                  name={user.fullName}
                  status="online"
                  showStatus={true}
                  onClick={() => sounds?.click()}
                />
                <div className="text-right">
                  <p className="text-white font-semibold">{user.fullName}</p>
                  <p className="text-blue-200 text-sm">{user.department}</p>
                </div>
              </div>
            )}
            
            {onSettingsClick && (
              <RippleButton
                variant="ghost"
                size="small"
                onClick={() => {
                  sounds?.click()
                  onSettingsClick()
                }}
              >
                ⚙️
              </RippleButton>
            )}
            
            {onLogout && (
              <RippleButton
                variant="danger"
                size="small"
                onClick={() => {
                  sounds?.click()
                  onLogout()
                }}
              >
                Выход
              </RippleButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// 🦶 ПРЕМИАЛЬНЫЙ ФУТЕР
export const PremiumFooter = ({ className = '' }) => {
  return (
    <footer className={`bg-black/20 backdrop-blur-lg border-t border-white/10 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-blue-200 text-sm">
          GKBR Platform — Премиальная система обучения и развития
        </p>
        <p className="text-blue-300 text-xs mt-1">
          © 2025 Все права защищены
        </p>
      </div>
    </footer>
  )
}

// 🎉 УВЕДОМЛЕНИЯ С ЗВУКОВЫМИ ЭФФЕКТАМИ
export const PremiumNotification = ({ type, title, message, onClose }) => {
  const { sounds } = useSounds()

  // Воспроизводим звук при появлении уведомления
  React.useEffect(() => {
    if (sounds) {
      switch (type) {
        case 'success':
          sounds.success()
          break
        case 'error':
          sounds.error()
          break
        case 'achievement':
          sounds.badge()
          break
        default:
          sounds.notification()
      }
    }
  }, [type, sounds])

  const typeStyles = {
    success: 'from-green-500/90 to-emerald-600/90 border-green-400/50',
    error: 'from-red-500/90 to-red-600/90 border-red-400/50',
    warning: 'from-yellow-500/90 to-orange-600/90 border-yellow-400/50',
    info: 'from-blue-500/90 to-blue-600/90 border-blue-400/50',
    achievement: 'from-purple-500/90 to-pink-600/90 border-purple-400/50'
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    achievement: '🏆'
  }

  return (
    <PremiumCard className={`bg-gradient-to-r ${typeStyles[type]} border animate-slide-in`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="font-bold text-white">{title}</h4>
          <p className="text-white/90 text-sm">{message}</p>
        </div>
        <RippleButton
          variant="ghost"
          size="small"
          onClick={() => {
            sounds?.click()
            onClose()
          }}
        >
          ✕
        </RippleButton>
      </div>
    </PremiumCard>
  )
}

// 🎯 СИСТЕМА УВЕДОМЛЕНИЙ
export const NotificationSystem = () => {
  const [notifications, setNotifications] = React.useState([])

  React.useEffect(() => {
    const handleNotification = (event) => {
      const notification = {
        id: Date.now(),
        ...event.detail
      }
      
      setNotifications(prev => [...prev, notification])
      
      // Автоматически удаляем уведомление через 5 секунд
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }

    window.addEventListener('gkbr:notify', handleNotification)
    
    return () => {
      window.removeEventListener('gkbr:notify', handleNotification)
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <PremiumNotification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

// 🎯 ЭКСПОРТ ВСЕХ КОМПОНЕНТОВ

// Основные провайдеры
export {
  ThemeProvider,
  SoundProvider,
  DesignSystemProvider,
  useTheme,
  useSounds,
  useDesignSystem
}

// Базовые компоненты
export {
  PremiumCard,
  PremiumButton,
  PremiumInput,
  ThemeSelector,
  AnimationToggle
}

// Интерактивные элементы
export {
  InteractiveCard,
  RippleButton,
  AnimatedModal,
  AnimatedToggle,
  AnimatedProgress,
  FloatingActionButton,
  AnimatedAvatar
}

// Фоны и эффекты
export {
  AnimatedBackground,
  ParticleBackground,
  WaveBackground,
  MatrixBackground,
  NeuralBackground,
  GeometricBackground,
  StarBackground,
  BackgroundSelector,
  GlowEffect,
  GlassEffect,
  GradientBackground,
  ShimmerEffect,
  WaveEffect,
  ParallaxEffect,
  ParticleCursor
}

// Анимированные компоненты
export {
  AnimatedCounter,
  TypewriterEffect,
  MagneticElement,
  PulseElement,
  ParticleSystem,
  WaveAnimation,
  SpinningLoader,
  AnimatedProgressLine
}

// Загрузочные состояния
export {
  GradientSpinner,
  AnimatedProgressBar,
  DotsLoader,
  WaveLoader,
  PulseLoader,
  SkeletonLoader,
  CardSkeleton,
  LoadingOverlay,
  StepLoader
}

// Микроанимации
export {
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

// Звуковая система
export {
  SoundSettings,
  useSoundOnMount,
  useSoundOnChange,
  SoundTrigger
}


// 🎨 ГЛАВНЫЙ ЭКСПОРТ
export default PremiumUIProvider