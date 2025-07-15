// ModuleFooter.jsx - Единая навигация для всех модулей
// Путь: src/blocks/module_core/_shared/ModuleFooter.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  RippleButton, 
  AnimatedModal,
  FloatingActionButton
} from '../../../components/premium/InteractiveElements.jsx'

import { GlowEffect, GlassEffect } from '../../../components/premium/VisualEffects.jsx'
import { AnimatedCounter, PulseElement } from '../../../components/premium/AnimatedComponents.jsx'
import { useSounds } from '../../../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../../../components/premium/DesignSystem.jsx'

// Компоненты
import { notify } from '../../../components/NotificationPanel.jsx'

const ModuleFooter = ({
  moduleId,
  currentSection = 0,
  totalSections = 1,
  completedSections = [],
  sectionTitles = [],
  readingTime = 0,
  estimatedTime = '45 мин',
  onPrevSection,
  onNextSection,
  onSectionComplete,
  onModuleComplete,
  onGoToSection,
  onBackToDashboard,
  onStartQuiz,
  showQuizButton = true,
  showProgress = true,
  showReadingTime = true,
  variant = 'default', // default, compact, detailed
  className = ''
}) => {
  // ✅ ХУКИ
  const navigate = useNavigate()
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()

  // ✅ СОСТОЯНИЕ
  const [mounted, setMounted] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showSectionList, setShowSectionList] = useState(false)

  // ✅ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ ВЫЧИСЛЕНИЯ
  const progress = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0
  const isFirstSection = currentSection === 0
  const isLastSection = currentSection === totalSections - 1
  const isCurrentSectionCompleted = completedSections.includes(currentSection)
  const isModuleCompleted = progress === 100

  // ✅ ФОРМАТИРОВАНИЕ ВРЕМЕНИ
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // ✅ ОБРАБОТЧИКИ СОБЫТИЙ
  const handlePrevSection = () => {
    if (!isFirstSection && onPrevSection) {
      sounds.click()
      onPrevSection()
    }
  }

  const handleNextSection = async () => {
    sounds.click()
    
    // Отмечаем текущий раздел как завершенный
    if (!isCurrentSectionCompleted && onSectionComplete) {
      await onSectionComplete(currentSection)
    }
    
    if (isLastSection) {
      // Последний раздел - показываем модал завершения
      setShowCompletionModal(true)
    } else if (onNextSection) {
      // Переходим к следующему разделу
      onNextSection()
    }
  }

  const handleCompleteModule = async () => {
    sounds.achievement()
    setShowCompletionModal(false)
    
    if (onModuleComplete) {
      await onModuleComplete()
    } else {
      notify.success('Модуль завершен!', `Модуль ${moduleId} успешно изучен`)
      navigate(`/module/${moduleId}/quiz`)
    }
  }

  const handleStartQuiz = () => {
    sounds.click()
    if (onStartQuiz) {
      onStartQuiz()
    } else {
      navigate(`/module/${moduleId}/quiz`)
    }
  }

  const handleBackToDashboard = () => {
    sounds.click()
    if (onBackToDashboard) {
      onBackToDashboard()
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoToSection = (sectionIndex) => {
    sounds.whoosh()
    if (onGoToSection) {
      onGoToSection(sectionIndex)
    }
    setShowSectionList(false)
  }

  // ✅ РЕНДЕР КОМПАКТНОЙ ВЕРСИИ
  const renderCompact = () => (
    <GlassEffect className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        
        {/* Кнопка назад */}
        <RippleButton
          variant="ghost"
          size="small"
          onClick={handlePrevSection}
          disabled={isFirstSection}
          className="text-white/70 hover:text-white disabled:opacity-50"
        >
          ← Назад
        </RippleButton>

        {/* Прогресс */}
        <div className="flex items-center space-x-3">
          <span className="text-white/70 text-sm">
            {currentSection + 1}/{totalSections}
          </span>
          {showProgress && (
            <div className="w-32">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Кнопка вперед */}
        <RippleButton
          variant="glow"
          size="small"
          onClick={handleNextSection}
        >
          {isLastSection ? 'Завершить' : 'Далее'} →
        </RippleButton>
      </div>
    </GlassEffect>
  )

  // ✅ РЕНДЕР ДЕТАЛЬНОЙ ВЕРСИИ
  const renderDetailed = () => (
    <div className={`space-y-6 ${className}`}>
      
      {/* Прогресс и статистика */}
      {showProgress && (
        <GlowEffect color="primary" intensity="low">
          <InteractiveCard variant="premium" className="p-6">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Прогресс изучения</h3>
              <span className="text-primary-400 font-medium">{progress}%</span>
            </div>

            {/* Прогресс-бар */}
            <div className="mb-6">
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-1000 ease-out ${!reducedMotion ? 'animate-pulse' : ''}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                <span>{completedSections.length} завершено</span>
                <span>{totalSections - completedSections.length} осталось</span>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4">
              
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

              {/* Время чтения */}
              {showReadingTime && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-1">
                    <AnimatedCounter to={Math.floor(readingTime / 60)} />
                  </div>
                  <div className="text-white/70 text-sm">Минут</div>
                </div>
              )}
            </div>
          </InteractiveCard>
        </GlowEffect>
      )}

      {/* Основная навигация */}
      <GlassEffect className="p-6">
        <div className="flex items-center justify-between">
          
          {/* Левая часть - кнопка назад */}
          <div className="flex items-center space-x-4">
            <RippleButton
              variant="ghost"
              size="medium"
              onClick={handleBackToDashboard}
              className="text-white/70 hover:text-white"
            >
              🏠 К модулям
            </RippleButton>

            <RippleButton
              variant="secondary"
              size="medium"
              onClick={handlePrevSection}
              disabled={isFirstSection}
              className="disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>
          </div>

          {/* Центр - информация о разделе */}
          <div className="text-center">
            <div className="text-white font-medium mb-1">
              Раздел {currentSection + 1} из {totalSections}
            </div>
            {sectionTitles[currentSection] && (
              <div className="text-white/70 text-sm">
                {sectionTitles[currentSection]}
              </div>
            )}
          </div>

          {/* Правая часть - кнопки действий */}
          <div className="flex items-center space-x-4">
            {totalSections > 3 && (
              <RippleButton
                variant="ghost"
                size="medium"
                onClick={() => setShowSectionList(true)}
                className="text-white/70 hover:text-white"
              >
                📋 Разделы
              </RippleButton>
            )}

            <RippleButton
              variant="glow"
              size="medium"
              onClick={handleNextSection}
              className="px-6"
            >
              {isLastSection ? (
                <>
                  <span className="mr-2">🎉</span>
                  Завершить модуль
                </>
              ) : (
                <>
                  Следующий
                  <span className="ml-2">→</span>
                </>
              )}
            </RippleButton>
          </div>
        </div>
      </GlassEffect>

      {/* Дополнительные действия */}
      {(showQuizButton || isModuleCompleted) && (
        <GlassEffect className="p-4">
          <div className="flex items-center justify-center space-x-4">
            
            {showQuizButton && (
              <RippleButton
                variant="secondary"
                size="medium"
                onClick={handleStartQuiz}
                className="px-6"
              >
                🎯 Пройти тест
              </RippleButton>
            )}

            {isModuleCompleted && (
              <PulseElement>
                <RippleButton
                  variant="success"
                  size="medium"
                  onClick={handleStartQuiz}
                  className="px-6"
                >
                  ✅ Модуль завершен - к тесту!
                </RippleButton>
              </PulseElement>
            )}
          </div>
        </GlassEffect>
      )}
    </div>
  )

  // ✅ РЕНДЕР КОМПОНЕНТА
  if (!mounted) {
    return <div className="opacity-0" />
  }

  return (
    <>
      {variant === 'compact' ? renderCompact() : renderDetailed()}

      {/* ✅ МОДАЛ ЗАВЕРШЕНИЯ МОДУЛЯ */}
      <AnimatedModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Модуль завершен!"
        size="medium"
      >
        <div className="text-center">
          
          {/* Иконка успеха */}
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            Поздравляем!
          </h3>

          <p className="text-white/90 mb-6 leading-relaxed">
            Вы успешно изучили модуль {moduleId}. Теперь вы можете пройти тест 
            для проверки полученных знаний и получения баллов.
          </p>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-primary-400 mb-1">
                {totalSections}
              </div>
              <div className="text-white/70 text-sm">Разделов изучено</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-accent-400 mb-1">
                {formatTime(readingTime)}
              </div>
              <div className="text-white/70 text-sm">Времени потрачено</div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RippleButton
              variant="glow"
              size="large"
              onClick={handleCompleteModule}
              className="px-8"
            >
              🎯 Пройти тест
            </RippleButton>
            
            <RippleButton
              variant="secondary"
              size="large"
              onClick={() => {
                setShowCompletionModal(false)
                handleBackToDashboard()
              }}
              className="px-8"
            >
              🏠 К модулям
            </RippleButton>
          </div>
        </div>
      </AnimatedModal>

      {/* ✅ МОДАЛ СПИСКА РАЗДЕЛОВ */}
      <AnimatedModal
        isOpen={showSectionList}
        onClose={() => setShowSectionList(false)}
        title="Разделы модуля"
        size="large"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sectionTitles.map((title, index) => {
            const isCompleted = completedSections.includes(index)
            const isCurrent = index === currentSection
            
            return (
              <InteractiveCard
                key={index}
                variant={isCurrent ? 'glow' : 'glass'}
                className={`p-4 cursor-pointer transition-all duration-300 ${isCurrent ? 'ring-2 ring-primary-400' : ''}`}
                onClick={() => handleGoToSection(index)}
              >
                <div className="flex items-center space-x-4">
                  
                  {/* Номер и иконка */}
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center font-bold
                    ${isCurrent 
                      ? 'bg-primary-500 text-white' 
                      : isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-white/70'
                    }
                  `}>
                    {isCompleted ? '✅' : index + 1}
                  </div>

                  {/* Информация */}
                  <div className="flex-1">
                    <h4 className={`font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/90'}`}>
                      {title}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {isCompleted ? 'Завершен' : isCurrent ? 'Изучается' : 'Не изучен'}
                    </p>
                  </div>

                  {/* Статус */}
                  <div className="text-lg">
                    {isCurrent ? '📖' : isCompleted ? '✅' : '⏳'}
                  </div>
                </div>
              </InteractiveCard>
            )
          })}
        </div>
      </AnimatedModal>

      {/* ✅ ПЛАВАЮЩИЕ КНОПКИ */}
      <FloatingActionButton
        icon="📋"
        position="bottom-left"
        tooltip="Список разделов"
        onClick={() => setShowSectionList(true)}
      />

      {showReadingTime && (
        <FloatingActionButton
          icon="⏱️"
          position="bottom-right"
          tooltip={`Время чтения: ${formatTime(readingTime)}`}
          onClick={() => {
            sounds.click()
            notify.info('Время чтения', `Потрачено: ${formatTime(readingTime)}`)
          }}
        />
      )}
    </>
  )
}

export default ModuleFooter