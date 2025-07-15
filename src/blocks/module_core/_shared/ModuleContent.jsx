// ModuleContent.jsx - Стандартный компонент контента для всех модулей
// Путь: src/blocks/module_core/_shared/ModuleContent.jsx

import React, { useState, useEffect } from 'react'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  RippleButton,
  AnimatedModal
} from '../../../components/premium/InteractiveElements.jsx'

import { GlowEffect, GlassEffect } from '../../../components/premium/VisualEffects.jsx'
import { AnimatedCounter, TypewriterEffect, PulseElement } from '../../../components/premium/AnimatedComponents.jsx'
import { useSounds } from '../../../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../../../components/premium/DesignSystem.jsx'

const ModuleContent = ({
  section,
  moduleId,
  sectionIndex = 0,
  readingTime = 0,
  onReadingTimeUpdate,
  showReadingTimer = true,
  variant = 'default', // default, minimal, interactive
  className = ''
}) => {
  // ✅ ХУКИ
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()

  // ✅ СОСТОЯНИЕ
  const [mounted, setMounted] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [currentReadingTime, setCurrentReadingTime] = useState(readingTime)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [expandedItems, setExpandedItems] = useState(new Set())

  // ✅ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    setMounted(true)
    setIsReading(true)
    
    return () => setIsReading(false)
  }, [sectionIndex])

  // ✅ ТАЙМЕР ЧТЕНИЯ
  useEffect(() => {
    let timer
    if (isReading && showReadingTimer) {
      timer = setInterval(() => {
        setCurrentReadingTime(prev => {
          const newTime = prev + 1
          onReadingTimeUpdate?.(newTime)
          return newTime
        })
      }, 1000)
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isReading, showReadingTimer, onReadingTimeUpdate])

  // ✅ ПОЛУЧЕНИЕ ИКОНКИ ТИПА КОНТЕНТА
  const getContentIcon = (type) => {
    const icons = {
      intro: '🎯',
      theory: '📚',
      practical: '⚙️',
      case_study: '💼',
      salesArgument: '💰',
      note: '💡',
      requirements: '✅',
      steps: '➡️',
      documents: '📄',
      consequences: '❌',
      fines: '💸',
      costs: '💲',
      tips: '💡',
      warning: '⚠️',
      important: '🔥',
      example: '📋'
    }
    return icons[type] || '📄'
  }

  // ✅ РЕНДЕР БЛОКОВ КОНТЕНТА
  const renderContentBlock = (block, index) => {
    if (!block) return null

    const { type, text, content, level, items, image, title } = block

    switch (type) {
      case 'heading':
        const HeadingTag = `h${Math.min(level || 2, 6)}`
        const headingClasses = {
          1: 'text-4xl font-bold text-white mb-8',
          2: 'text-3xl font-bold text-white mb-6',
          3: 'text-2xl font-bold text-primary-400 mb-4',
          4: 'text-xl font-semibold text-white mb-3',
          5: 'text-lg font-semibold text-white mb-2',
          6: 'text-base font-semibold text-white mb-2'
        }
        
        return (
          <HeadingTag 
            key={index} 
            className={`${headingClasses[level || 2]} ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {text || content}
          </HeadingTag>
        )

      case 'paragraph':
        return (
          <p 
            key={index} 
            className={`text-white/90 leading-relaxed mb-6 text-lg ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {text || content}
          </p>
        )

      case 'list':
      case 'ul':
        return (
          <ul 
            key={index} 
            className={`list-disc list-inside text-white/90 mb-6 space-y-3 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {(items || []).map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {typeof item === 'string' ? item : item.text || item.content}
              </li>
            ))}
          </ul>
        )

      case 'ordered_list':
      case 'ol':
        return (
          <ol 
            key={index} 
            className={`list-decimal list-inside text-white/90 mb-6 space-y-3 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {(items || []).map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {typeof item === 'string' ? item : item.text || item.content}
              </li>
            ))}
          </ol>
        )

      case 'callout':
      case 'note':
      case 'warning':
      case 'important':
        const calloutStyles = {
          note: 'bg-blue-500/20 border-blue-400/50 text-blue-200',
          warning: 'bg-yellow-500/20 border-yellow-400/50 text-yellow-200',
          important: 'bg-red-500/20 border-red-400/50 text-red-200',
          callout: 'bg-purple-500/20 border-purple-400/50 text-purple-200'
        }
        
        return (
          <GlassEffect
            key={index}
            className={`p-6 rounded-xl mb-6 border ${calloutStyles[type] || calloutStyles.callout} ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl flex-shrink-0">
                {getContentIcon(type)}
              </div>
              <div className="flex-1">
                {title && (
                  <h4 className="font-semibold mb-2">{title}</h4>
                )}
                <div className="leading-relaxed">
                  {text || content}
                </div>
              </div>
            </div>
          </GlassEffect>
        )

      case 'quote':
        return (
          <blockquote 
            key={index} 
            className={`border-l-4 border-accent-400 pl-6 py-4 mb-6 bg-white/5 rounded-r-lg ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-white/90 italic text-lg leading-relaxed">
              "{text || content}"
            </p>
          </blockquote>
        )

      case 'code':
        return (
          <div 
            key={index} 
            className={`bg-black/40 rounded-xl p-4 mb-6 border border-white/10 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <pre className="text-green-300 font-mono text-sm overflow-x-auto">
              <code>{text || content}</code>
            </pre>
          </div>
        )

      case 'image':
        return (
          <div 
            key={index} 
            className={`mb-6 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <InteractiveCard 
              variant="glass" 
              className="p-4 cursor-pointer"
              onClick={() => {
                sounds.click()
                setSelectedImage(image || content)
                setShowImageModal(true)
              }}
            >
              <img 
                src={image || content} 
                alt={title || text || 'Изображение модуля'}
                className="w-full h-auto rounded-lg"
              />
              {(title || text) && (
                <p className="text-white/70 text-sm mt-3 text-center">
                  {title || text}
                </p>
              )}
            </InteractiveCard>
          </div>
        )

      case 'accordion':
      case 'expandable':
        const isExpanded = expandedItems.has(index)
        
        return (
          <div 
            key={index} 
            className={`mb-6 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <InteractiveCard variant="glass" className="overflow-hidden">
              <button
                onClick={() => {
                  sounds.click()
                  const newExpanded = new Set(expandedItems)
                  if (isExpanded) {
                    newExpanded.delete(index)
                  } else {
                    newExpanded.add(index)
                  }
                  setExpandedItems(newExpanded)
                }}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
              >
                <h4 className="text-white font-semibold">{title || 'Подробнее'}</h4>
                <span className={`text-white/70 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {isExpanded && (
                <div className={`px-4 pb-4 ${!reducedMotion ? 'animate-slide-down' : ''}`}>
                  <div className="text-white/90 leading-relaxed">
                    {text || content}
                  </div>
                </div>
              )}
            </InteractiveCard>
          </div>
        )

      case 'stats':
      case 'metrics':
        return (
          <div 
            key={index} 
            className={`mb-6 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GlowEffect color="primary" intensity="low">
              <InteractiveCard variant="premium" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(items || []).map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div className="text-3xl font-bold text-primary-400 mb-2">
                        <AnimatedCounter to={stat.value || 0} suffix={stat.suffix || ''} />
                      </div>
                      <div className="text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </InteractiveCard>
            </GlowEffect>
          </div>
        )

      default:
        return (
          <div 
            key={index} 
            className={`text-white/90 mb-6 ${!reducedMotion ? 'animate-slide-up' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {text || content || JSON.stringify(block)}
          </div>
        )
    }
  }

  // ✅ РЕНДЕР КОМПОНЕНТА
  if (!section || !mounted) {
    return (
      <div className="text-center py-12">
        <div className="text-white/50">Загрузка контента...</div>
      </div>
    )
  }

  return (
    <div className={className}>
      
      {/* ✅ ТАЙМЕР ЧТЕНИЯ */}
      {showReadingTimer && (
        <div className="fixed top-4 right-4 z-30">
          <GlassEffect className="px-4 py-2 rounded-full">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-white/70">⏱️</span>
              <span className="text-white font-medium">
                {Math.floor(currentReadingTime / 60)}:{(currentReadingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </GlassEffect>
        </div>
      )}

      {/* ✅ ОСНОВНОЙ КОНТЕНТ */}
      <GlowEffect color="primary" intensity="low">
        <InteractiveCard variant="premium" className="p-8">
          
          {/* Заголовок раздела */}
          {section.title && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">{getContentIcon(section.type)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                  {section.estimatedTime && (
                    <p className="text-white/70 text-sm">
                      Примерное время: {section.estimatedTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Контент раздела */}
          <div className="prose prose-invert max-w-none">
            {section.content?.blocks ? (
              section.content.blocks.map((block, index) => renderContentBlock(block, index))
            ) : section.content ? (
              <div className="text-white/90 leading-relaxed">
                {typeof section.content === 'string' ? (
                  <p>{section.content}</p>
                ) : (
                  renderContentBlock(section.content, 0)
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                Контент не найден
              </div>
            )}
          </div>
        </InteractiveCard>
      </GlowEffect>

      {/* ✅ МОДАЛ ДЛЯ ИЗОБРАЖЕНИЙ */}
      <AnimatedModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="large"
        title="Изображение"
      >
        {selectedImage && (
          <div className="text-center">
            <img 
              src={selectedImage} 
              alt="Увеличенное изображение"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </AnimatedModal>
    </div>
  )
}

export default ModuleContent