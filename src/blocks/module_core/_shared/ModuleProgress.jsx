// ModuleProgress.jsx - Премиальный компонент прогресса для модулей
// Путь: src/blocks/module_core/_shared/ModuleProgress.jsx

import React, { useState, useEffect } from 'react'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  AnimatedProgress
} from '../../../components/premium/InteractiveElements.jsx'

import { GlowEffect, GlassEffect } from '../../../components/premium/VisualEffects.jsx'
import { AnimatedCounter, PulseElement } from '../../../components/premium/AnimatedComponents.jsx'
import { useSounds } from '../../../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../../../components/premium/DesignSystem.jsx'

const ModuleProgress = ({
  currentSection = 0,
  totalSections = 1,
  completedSections = [],
  sectionTitles = [],
  readingTime = 0,
  estimatedTime = '45 мин',
  onSectionClick,
  variant = 'default', // default, compact, detailed, sidebar
  showReadingTime = true,
  showSectionList = true,
  showStats = true,
  animated = true,
  className = ''
}) => {
  // ✅ ХУКИ
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()

  // ✅ СОСТОЯНИЕ
  const [mounted, setMounted] = useState(false)
  const [hoveredSection, setHoveredSection] = useState(null)

  // ✅ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ ВЫЧИСЛЕНИЯ
  const progress = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0
  const isCompleted = progress === 100
  const remainingSections = totalSections - completedSections.length

  // ✅ ФОРМАТИРОВАНИЕ ВРЕМЕНИ
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // ✅ ПОЛУЧЕНИЕ ИКОНКИ РАЗДЕЛА
  const getSectionIcon = (index, type = 'default') => {
    const isCompleted = completedSections.includes(index)
    const isCurrent = index === currentSection
    
    if (isCompleted) return '✅'
    if (isCurrent) return '📖'
    
    // Базовые иконки по типам разделов
    const typeIcons = {
      intro: '🎯',
      theory: '📚',
      practical: '⚙️',
      case_study: '💼',
      quiz: '🎯',
      summary: '📋'
    }
    
    return typeIcons[type] || '📄'
  }

  // ✅ ОБРАБОТЧИК КЛИКА ПО РАЗДЕЛУ
  const handleSectionClick = (sectionIndex) => {
    if (onSectionClick) {
      sounds.click()
      onSectionClick(sectionIndex)
    }
  }

  // ✅ ВАРИАНТЫ ОТОБРАЖЕНИЯ
  const renderCompact = () => (
    <GlassEffect className={`p-4 rounded-xl ${className}`}>
      <div className="flex items-center space-x-4">
        
        {/* Круговой прогресс */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className={!reducedMotion ? 'transition-all duration-1000 ease-out' : ''}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <AnimatedCounter to={progress} suffix="%" />
            </span>
          </div>
        </div>

        {/* Информация */}
        <div className="flex-1">
          <div className="text-white font-medium mb-1">
            Раздел {currentSection + 1} из {totalSections}
          </div>
          <div className="text-white/70 text-sm">
            {completedSections.length} завершено • {remainingSections} осталось
          </div>
          {showReadingTime && (
            <div className="text-white/60 text-xs mt-1">
              Время: {formatTime(readingTime)}
            </div>
          )}
        </div>
      </div>
    </GlassEffect>
  )

  const renderDetailed = () => (
    <GlowEffect color="primary" intensity="low">
      <InteractiveCard variant="premium" className={`p-6 ${className}`}>
        
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Прогресс изучения</h3>
          {isCompleted && (
            <PulseElement>
              <span className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-400/50 rounded-full text-green-200 text-sm font-medium">
                <span className="mr-1">🎉</span>
                Завершено!
              </span>
            </PulseElement>
          )}
        </div>

        {/* Основной прогресс-бар */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 font-medium">Общий прогресс</span>
            <span className="text-white/70 text-sm">{progress}%</span>
          </div>
          
          <AnimatedProgress 
            value={progress} 
            variant="primary"
            size="large"
            animated={animated}
            showPercentage={false}
            className="mb-2"
          />
          
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{completedSections.length}/{totalSections} разделов</span>
            <span>{remainingSections} осталось</span>
          </div>
        </div>

        {/* Статистика */}
        {showStats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            
            {/* Текущий раздел */}
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">
                <AnimatedCounter to={currentSection + 1} />
              </div>
              <div className="text-white/70 text-sm">Текущий</div>
            </div>

            {/* Завершено */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                <AnimatedCounter to={completedSections.length} />
              </div>
              <div className="text-white/70 text-sm">Завершено</div>
            </div>

            {/* Время */}
            {showReadingTime && (
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-400 mb-1">
                  <AnimatedCounter to={Math.floor(readingTime / 60)} />
                </div>
                <div className="text-white/70 text-sm">Минут</div>
              </div>
            )}
          </div>
        )}

        {/* Список разделов */}
        {showSectionList && sectionTitles.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-3">Разделы модуля</h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sectionTitles.map((title, index) => {
                const isCompleted = completedSections.includes(index)
                const isCurrent = index === currentSection
                const isHovered = hoveredSection === index
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSectionClick(index)}
                    onMouseEnter={() => setHoveredSection(index)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-300
                      ${isCurrent 
                        ? 'bg-primary-500/20 border border-primary-400/50' 
                        : isCompleted
                          ? 'bg-green-500/10 border border-green-400/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                      }
                      ${isHovered && !reducedMotion ? 'scale-[1.02] shadow-lg' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      
                      {/* Иконка раздела */}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm
                        ${isCurrent 
                          ? 'bg-primary-500 text-white' 
                          : isCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/10 text-white/70'
                        }
                      `}>
                        {getSectionIcon(index)}
                      </div>
                      
                      {/* Информация о разделе */}
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/90'}`}>
                          {index + 1}. {title}
                        </div>
                        <div className="text-xs text-white/60">
                          {isCompleted ? 'Завершен' : isCurrent ? 'Изучается' : 'Не изучен'}
                        </div>
                      </div>
                      
                      {/* Статус */}
                      <div className="text-lg">
                        {isCompleted ? '✅' : isCurrent ? '📖' : '⏳'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </InteractiveCard>
    </GlowEffect>
  )

  const renderSidebar = () => (
    <div className={`space-y-4 ${className}`}>
      
      {/* Мини прогресс */}
      <GlassEffect className="p-4 rounded-xl">
        <div className="text-white font-medium mb-3 text-sm">Прогресс</div>
        
        <AnimatedProgress 
          value={progress} 
          variant="primary"
          size="small"
          animated={animated}
          showPercentage={true}
          className="mb-2"
        />
        
        <div className="text-xs text-white/60">
          {currentSection + 1} из {totalSections}
        </div>
      </GlassEffect>

      {/* Навигация по разделам */}
      {sectionTitles.length > 0 && (
        <GlassEffect className="p-4 rounded-xl">
          <div className="text-white font-medium mb-3 text-sm">Разделы</div>
          
          <div className="space-y-2">
            {sectionTitles.slice(0, 5).map((title, index) => {
              const isCompleted = completedSections.includes(index)
              const isCurrent = index === currentSection
              
              return (
                <div
                  key={index}
                  onClick={() => handleSectionClick(index)}
                  className={`
                    p-2 rounded-lg cursor-pointer text-sm transition-all duration-300
                    ${isCurrent 
                      ? 'bg-primary-500/20 text-white border border-primary-400/50' 
                      : isCompleted
                        ? 'bg-green-500/10 text-green-300 border border-green-400/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">{getSectionIcon(index)}</span>
                    <span className="truncate">{index + 1}. {title}</span>
                  </div>
                </div>
              )
            })}
            
            {sectionTitles.length > 5 && (
              <div className="text-xs text-white/60 text-center pt-2">
                +{sectionTitles.length - 5} разделов
              </div>
            )}
          </div>
        </GlassEffect>
      )}

      {/* Время чтения */}
      {showReadingTime && (
        <GlassEffect className="p-4 rounded-xl">
          <div className="text-white font-medium mb-2 text-sm">Время</div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-accent-400 mb-1">
              {formatTime(readingTime)}
            </div>
            <div className="text-xs text-white/60">потрачено</div>
          </div>
        </GlassEffect>
      )}
    </div>
  )

  // ✅ РЕНДЕР КОМПОНЕНТА
  if (!mounted) {
    return <div className="opacity-0" />
  }

  switch (variant) {
    case 'compact':
      return renderCompact()
    case 'detailed':
      return renderDetailed()
    case 'sidebar':
      return renderSidebar()
    default:
      return renderDetailed()
  }
}

export default ModuleProgress