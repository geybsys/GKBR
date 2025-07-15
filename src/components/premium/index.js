// index.js - Финальный экспорт всех премиальных компонентов GKBR Platform
// Путь: src/components/premium/index.js

// 🎨 БАЗОВЫЕ СИСТЕМЫ
export { 
  default as PremiumTheme, 
  ThemeProvider, 
  useTheme, 
  PremiumCard, 
  PremiumButton, 
  PremiumInput, 
  ThemeSelector, 
  AnimationToggle,
  PREMIUM_THEMES 
} from './PremiumTheme'

export { 
  default as DesignSystem,
  DesignSystemProvider, 
  useDesignSystem,
  colors,
  typography,
  effects,
  animations,
  breakpoints,
  spacing,
  designTokens,
  DesignSystemPreview
} from './DesignSystem'

export { 
  default as SoundSystem,
  SoundProvider, 
  useSounds, 
  SoundSettings,
  useSoundOnMount,
  useSoundOnChange,
  SoundTrigger 
} from './SoundSystem'

// 🎯 ВИЗУАЛЬНЫЕ ЭФФЕКТЫ
export { 
  default as VisualEffects,
  GlowEffect, 
  GlassEffect, 
  GradientBackground, 
  ShimmerEffect, 
  WaveEffect, 
  ParallaxEffect, 
  ParticleCursor 
} from './VisualEffects'

// 🎭 АНИМИРОВАННЫЕ КОМПОНЕНТЫ
export { 
  default as AnimatedComponents,
  AnimatedCounter, 
  TypewriterEffect, 
  MagneticElement, 
  PulseElement, 
  ParticleSystem, 
  WaveAnimation, 
  SpinningLoader, 
  AnimatedProgressLine 
} from './AnimatedComponents'

// 🎯 ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
export { 
  default as InteractiveElements,
  InteractiveCard, 
  RippleButton, 
  AnimatedModal, 
  AnimatedToggle, 
  AnimatedProgress, 
  FloatingActionButton, 
  AnimatedAvatar 
} from './InteractiveElements'

// 🔄 СОСТОЯНИЯ ЗАГРУЗКИ
export { 
  default as LoadingStates,
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

// 🌌 АНИМИРОВАННЫЕ ФОНЫ
export { 
  default as AnimatedBackground,
  ParticleBackground, 
  WaveBackground, 
  MatrixBackground, 
  NeuralBackground, 
  GeometricBackground, 
  StarBackground, 
  BackgroundSelector 
} from './AnimatedBackground'

// ✨ МИКРОАНИМАЦИИ
export { 
  default as MicroAnimations,
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

// 🎪 ГЛАВНЫЙ ПРЕМИАЛЬНЫЙ UI
export { 
  default as PremiumUI,
  PremiumUIProvider,
  PremiumPage,
  PremiumLoginForm,
  PremiumHeader,
  PremiumFooter,
  PremiumNotification,
  PremiumSettingsButton,
  PremiumSettingsModal,
  NotificationSystem
} from './PremiumUI'

// 🎯 ГОТОВЫЕ КОМБИНАЦИИ И ХУКИ

// Комбинированный хук для всех премиальных систем
export const usePremiumSystems = () => {
  const theme = useTheme()
  const sounds = useSounds()
  const design = useDesignSystem()
  
  return {
    theme,
    sounds,
    design,
    // Утилиты
    playSound: (soundName) => sounds?.[soundName]?.(),
    changeTheme: (themeName) => theme?.changeTheme?.(themeName),
    toggleAnimations: () => design?.toggleReducedMotion?.(),
    // Комплексные действия
    successFeedback: () => {
      sounds?.success?.()
      // Можно добавить визуальную обратную связь
    },
    errorFeedback: () => {
      sounds?.error?.()
      // Можно добавить встряхивание элемента
    },
    achievementFeedback: () => {
      sounds?.achievement?.()
      // Можно добавить конфетти или другие эффекты
    }
  }
}

// 🎨 ГОТОВЫЕ ПРЕМИАЛЬНЫЕ КОМБИНАЦИИ

// Готовая карточка модуля с анимациями
export const PremiumModuleCard = ({ 
  title, 
  description, 
  progress = 0, 
  onClick,
  className = '',
  ...props 
}) => {
  const { sounds } = useSounds()
  
  return (
    <HoverEffect effect="lift" intensity="medium">
      <InteractiveCard
        variant="glass"
        hover="glow"
        onClick={() => {
          sounds?.click()
          onClick?.()
        }}
        className={`p-6 ${className}`}
        {...props}
      >
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-blue-200 text-sm">{description}</p>
          
          {progress > 0 && (
            <AnimatedProgress
              value={progress}
              color="blue"
              showValue={true}
              animated={true}
            />
          )}
        </div>
      </InteractiveCard>
    </HoverEffect>
  )
}

// Готовая кнопка с звуком и эффектами
export const PremiumActionButton = ({ 
  children, 
  variant = 'primary',
  soundType = 'click',
  glowEffect = false,
  className = '',
  onClick,
  ...props 
}) => {
  const { sounds } = useSounds()
  
  const handleClick = (e) => {
    sounds?.[soundType]?.()
    onClick?.(e)
  }
  
  const ButtonComponent = (
    <RippleButton
      variant={variant}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </RippleButton>
  )
  
  return glowEffect ? (
    <GlowEffect color="blue" intensity="medium" trigger="hover">
      {ButtonComponent}
    </GlowEffect>
  ) : ButtonComponent
}

// Готовая форма входа
export const PremiumLoginCard = ({ onSubmit, ...props }) => {
  return (
    <PremiumPage background="particles" showFloatingSettings={true}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <PremiumLoginForm onSubmit={onSubmit} {...props} />
      </div>
    </PremiumPage>
  )
}

// Готовая страница с хедером и футером
export const PremiumLayoutPage = ({ 
  title,
  subtitle,
  user,
  onLogout,
  children,
  background = 'particles',
  ...props 
}) => {
  return (
    <PremiumPage background={background} {...props}>
      <div className="min-h-screen flex flex-col">
        <PremiumHeader
          title={title}
          subtitle={subtitle}
          user={user}
          onLogout={onLogout}
        />
        
        <main className="flex-1">
          {children}
        </main>
        
        <PremiumFooter />
      </div>
    </PremiumPage>
  )
}

// 🛠️ УТИЛИТЫ ДЛЯ РАЗРАБОТЧИКОВ

// Функция для быстрого уведомления
export const notify = (type, title, message) => {
  window.dispatchEvent(new CustomEvent('gkbr:notify', {
    detail: { type, title, message }
  }))
}

// Функция для воспроизведения звука событий
export const playEventSound = (eventType) => {
  const eventMap = {
    'success': 'gkbr:success',
    'error': 'gkbr:error', 
    'achievement': 'gkbr:achievement',
    'levelup': 'gkbr:levelup',
    'module-complete': 'gkbr:module-complete'
  }
  
  if (eventMap[eventType]) {
    window.dispatchEvent(new Event(eventMap[eventType]))
  }
}

// Функция для создания анимированного появления
export const createRevealAnimation = (elements, options = {}) => {
  const {
    direction = 'up',
    staggerDelay = 100,
    threshold = 0.1
  } = options
  
  elements.forEach((element, index) => {
    if (element) {
      element.style.opacity = '0'
      element.style.transform = direction === 'up' ? 'translateY(20px)' : 
                               direction === 'down' ? 'translateY(-20px)' :
                               direction === 'left' ? 'translateX(20px)' :
                               'translateX(-20px)'
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out'
        element.style.opacity = '1'
        element.style.transform = 'translate(0, 0)'
      }, index * staggerDelay)
    }
  })
}

// 📊 ПРЕМИАЛЬНЫЕ МЕТРИКИ

// Конфигурация премиального UI
export const PREMIUM_CONFIG = {
  version: '2.0.0',
  
  themes: {
    count: Object.keys(PREMIUM_THEMES || {}).length,
    default: 'corporate'
  },
  
  animations: {
    reducedMotionSupport: true,
    performance: 'optimized',
    gpuAcceleration: true
  },
  
  sounds: {
    format: 'base64',
    preloaded: true,
    contextualPlayback: true
  },
  
  accessibility: {
    screenReader: true,
    keyboardNavigation: true,
    colorContrast: 'WCAG-AA',
    reducedMotion: true
  },
  
  performance: {
    lazyLoading: true,
    memoryOptimized: true,
    bundleSize: 'optimized'
  }
}

// Типы для TypeScript (если будет использоваться)
export const PREMIUM_TYPES = {
  variants: ['primary', 'secondary', 'accent', 'ghost', 'danger'],
  sizes: ['small', 'medium', 'large'],
  animations: ['fadeIn', 'slideUp', 'slideDown', 'scaleIn', 'bounce'],
  backgrounds: ['particles', 'waves', 'matrix', 'neural', 'geometric', 'stars'],
  themes: ['corporate', 'ocean', 'sunset', 'forest', 'galaxy', 'midnight']
}

// Debugging утилиты (только для development)
export const PremiumDebug = {
  logComponentTree: () => {
    console.log('🎨 Premium UI Component Tree:')
    console.log('├── PremiumUIProvider')
    console.log('│   ├── DesignSystemProvider') 
    console.log('│   ├── SoundProvider')
    console.log('│   └── ThemeProvider')
    console.log('├── Visual Effects')
    console.log('├── Animated Components')
    console.log('├── Interactive Elements')
    console.log('├── Loading States')
    console.log('├── Animated Backgrounds')
    console.log('└── Micro Animations')
  },
  
  validateSetup: () => {
    const checks = {
      theme: !!useTheme,
      sounds: !!useSounds,
      design: !!useDesignSystem
    }
    
    const passed = Object.values(checks).every(Boolean)
    console.log('🔍 Premium UI Setup Validation:', passed ? '✅ PASSED' : '❌ FAILED')
    console.log(checks)
    
    return passed
  },
  
  showPerformanceMetrics: () => {
    if (performance.mark) {
      performance.mark('premium-ui-check')
      const entries = performance.getEntriesByType('navigation')
      console.log('⚡ Performance Metrics:', entries[0])
    }
  }
}

// Главный экспорт для удобства
export default {
  // Провайдеры
  Providers: {
    PremiumUIProvider,
    ThemeProvider,
    SoundProvider,
    DesignSystemProvider
  },
  
  // Компоненты
  Components: {
    VisualEffects,
    AnimatedComponents,
    InteractiveElements,
    LoadingStates,
    AnimatedBackground,
    MicroAnimations
  },
  
  // Хуки
  Hooks: {
    useTheme,
    useSounds,
    useDesignSystem,
    usePremiumSystems
  },
  
  // Утилиты
  Utils: { notify, playEventSound, createRevealAnimation },
  Templates: { PremiumModuleCard, PremiumActionButton, PremiumLoginCard, PremiumLayoutPage },
  Combinations: { usePremiumSystems },
  Config: PREMIUM_CONFIG,
  Debug: PremiumDebug
}