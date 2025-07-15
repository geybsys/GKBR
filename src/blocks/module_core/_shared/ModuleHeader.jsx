// ModuleHeader.jsx - Единый премиальный заголовок для всех модулей
// Путь: src/blocks/module_core/_shared/ModuleHeader.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  RippleButton, 
  AnimatedProgress,
  FloatingActionButton,
  AnimatedAvatar
} from '../../../components/premium/InteractiveElements.jsx'

import { GlowEffect, GlassEffect } from '../../../components/premium/VisualEffects.jsx'
import { AnimatedCounter, MagneticElement, TypewriterEffect } from '../../../components/premium/AnimatedComponents.jsx'
import { useSounds } from '../../../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../../../components/premium/DesignSystem.jsx'

// Компоненты
import { notify } from '../../../components/NotificationPanel.jsx'

const ModuleHeader = ({ 
  moduleId,
  title,
  subtitle,
  category = 'regulatory',
  difficulty = 'Средний',
  currentSection = 0,
  totalSections = 1,
  completedSections = [],
  readingTime = 0,
  estimatedTime = '45 мин',
  onBackClick,
  onSettingsClick,
  showReadingTimer = true,
  showProgress = true,
  compact = false
}) => {
  // ✅ ХУКИ
  const navigate = useNavigate()
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()

  // ✅ СОСТОЯНИЕ
  const [mounted, setMounted] = useState(false)
  const [showDetails, setShowDetails] = useState(!compact)

  // ✅ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ ВЫЧИСЛЕНИЯ
  const progress = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0
  const isCompleted = progress === 100

  // ✅ КАТЕГОРИИ И СТИЛИ
  const getCategoryGradient = (category) => {
    const gradients = {
      regulatory: 'from-blue-600 via-blue-700 to-indigo-800',
      technical: 'from-green-600 via-emerald-700 to-teal-800',
      construction: 'from-orange-600 via-amber-700 to-yellow-800',
      quality: 'from-purple-600 via-violet-700 to-purple-800',
      measurement: 'from-pink-600 via-rose-700 to-pink-800',
      accreditation: 'from-indigo-600 via-blue-700 to-indigo-800',
      expertise: 'from-red-600 via-red-700 to-red-800',
      audit: 'from-yellow-600 via-amber-700 to-orange-800',
      management: 'from-teal-600 via-cyan-700 to-teal-800',
      hr: 'from-cyan-600 via-blue-700 to-cyan-800',
      soft_skills: 'from-rose-600 via-pink-700 to-rose-800'
    }
    return gradients[category] || 'from-gray-600 via-gray-700 to-gray-800'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      regulatory: '📋',
      technical: '⚙️',
      construction: '🏗️',
      quality: '✅',
      measurement: '📏',
      accreditation: '🎓',
      expertise: '🔬',
      audit: '📊',
      management: '💼',
      hr: '👥',
      soft_skills: '🧠'
    }
    return icons[category] || '📚'
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Базовый': 'text-green-400 bg-green-500/20 border-green-400/50',
      'Средний': 'text-yellow-400 bg-yellow-500/20 border-yellow-400/50',
      'Продвинутый': 'text-red-400 bg-red-500/20 border-red-400/50'
    }
    return colors[difficulty] || 'text-blue-400 bg-blue-500/20 border-blue-400/50'
  }

  // ✅ ФОРМАТИРОВАНИЕ ВРЕМЕНИ
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // ✅ ОБРАБОТЧИКИ СОБЫТИЙ
  const handleBackClick = () => {
    sounds.click()
    if (onBackClick) {
      onBackClick()
    } else {
      navigate('/dashboard')
    }
  }

  const handleSettingsClick = () => {
    sounds.click()
    if (onSettingsClick) {
      onSettingsClick()
    } else {
      window.dispatchEvent(new CustomEvent('open-settings-modal'))
    }
  }

  const toggleDetails = () => {
    sounds.click()
    setShowDetails(!showDetails)
  }

  const categoryGradient = getCategoryGradient(category)
  const categoryIcon = getCategoryIcon(category)

  return (
    <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* ✅ ОСНОВНОЙ ХЕДЕР */}
      <GlowEffect color="primary" intensity="medium">
        <InteractiveCard 
          variant="premium" 
          className={`mb-6 overflow-hidden ${compact ? 'p-4' : 'p-6'}`}
        >
          {/* Фоновый градиент */}
          <div className={`absolute inset-0 bg-gradient-to-r ${categoryGradient} opacity-10`} />
          
          {/* Основное содержимое */}
          <div className="relative z-10">
            
            {/* Верхняя строка */}
            <div className="flex items-center justify-between mb-4">
              
              {/* Левая часть - навигация и иконка */}
              <div className="flex items-center space-x-4">
                <RippleButton
                  variant="ghost"
                  size="medium"
                  onClick={handleBackClick}
                  className="backdrop-blur-lg bg-white/10 border border-white/20"
                >
                  ← Назад
                </RippleButton>

                {!compact && (
                  <MagneticElement strength={0.2}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
                      <span className="text-3xl">{categoryIcon}</span>
                    </div>
                  </MagneticElement>
                )}
              </div>

              {/* Правая часть - действия */}
              <div className="flex items-center space-x-3">
                {!compact && (
                  <RippleButton
                    variant="ghost"
                    size="small"
                    onClick={toggleDetails}
                    className="backdrop-blur-lg bg-white/10 border border-white/20"
                  >
                    {showDetails ? '🔼' : '🔽'}
                  </RippleButton>
                )}

                <RippleButton
                  variant="ghost"
                  size="small"
                  onClick={handleSettingsClick}
                  className="backdrop-blur-lg bg-white/10 border border-white/20"
                >
                  ⚙️
                </RippleButton>
              </div>
            </div>

            {/* Информация о модуле */}
            <div className="mb-6">
              
              {/* Номер модуля */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm font-medium border border-white/30">
                  Модуль {moduleId}
                </span>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>

                {isCompleted && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 backdrop-blur-lg border border-green-400/50 rounded-full text-green-200 text-xs font-medium">
                    <span className="mr-1">✅</span>
                    Завершен
                  </span>
                )}
              </div>

              {/* Заголовок */}
              <h1 className={`font-bold text-white leading-tight mb-2 ${compact ? 'text-xl' : 'text-3xl'}`}>
                {title}
              </h1>

              {/* Подзаголовок */}
              {subtitle && (
                <p className={`text-white/90 ${compact ? 'text-sm' : 'text-lg'}`}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Детальная информация */}
            {showDetails && (
              <div className={`space-y-4 ${!reducedMotion ? 'animate-slide-down' : ''}`}>
                
                {/* Прогресс обучения */}
                {showProgress && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/90 text-sm font-medium">Прогресс изучения</span>
                      <span className="text-white/70 text-sm">
                        {currentSection + 1} из {totalSections}
                      </span>
                    </div>
                    
                    <AnimatedProgress 
                      value={progress} 
                      variant="primary"
                      size="medium"
                      animated={true}
                      showPercentage={true}
                      className="mb-2"
                    />
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{completedSections.length} разделов завершено</span>
                      <span>{totalSections - completedSections.length} осталось</span>
                    </div>
                  </div>
                )}

                {/* Статистика времени */}
                {showReadingTimer && (
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Время чтения */}
                    <div className="text-center">
                      <div className="text-white/90 text-sm font-medium mb-1">Время чтения</div>
                      <div className="text-2xl font-bold text-primary-400">
                        <AnimatedCounter to={Math.floor(readingTime / 60)} suffix=" мин" />
                      </div>
                      <div className="text-xs text-white/60">{formatTime(readingTime)}</div>
                    </div>

                    {/* Примерное время */}
                    <div className="text-center">
                      <div className="text-white/90 text-sm font-medium mb-1">Примерно</div>
                      <div className="text-2xl font-bold text-accent-400">
                        {estimatedTime}
                      </div>
                      <div className="text-xs text-white/60">для изучения</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </InteractiveCard>
      </GlowEffect>

      {/* ✅ КОМПАКТНАЯ НАВИГАЦИЯ ПО РАЗДЕЛАМ (если много разделов) */}
      {totalSections > 5 && showDetails && (
        <GlassEffect className="mb-6 p-4 rounded-2xl">
          <h3 className="text-white font-medium mb-3 text-sm">Быстрая навигация</h3>
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalSections }, (_, index) => {
              const sectionNumber = index + 1
              const isCurrentSection = index === currentSection
              const isCompleted = completedSections.includes(index)
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    sounds.click()
                    // Dispatch custom event для навигации
                    window.dispatchEvent(new CustomEvent('navigate-to-section', { 
                      detail: { sectionIndex: index } 
                    }))
                  }}
                  className={`
                    w-8 h-8 rounded-lg text-xs font-medium transition-all duration-300
                    ${isCurrentSection 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                      : isCompleted
                        ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  {sectionNumber}
                </button>
              )
            })}
          </div>
        </GlassEffect>
      )}
    </div>
  )
}

export default ModuleHeader