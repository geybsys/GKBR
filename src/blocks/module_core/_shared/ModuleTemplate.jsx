// ModuleTemplate.jsx - Единый премиальный шаблон для всех модулей
// Путь: src/blocks/module_core/_shared/ModuleTemplate.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ✅ SHARED КОМПОНЕНТЫ ФАЗЫ 4
import ModuleHeader from './ModuleHeader.jsx'
import ModuleProgress from './ModuleProgress.jsx'
import ModuleContent from './ModuleContent.jsx'
import ModuleFooter from './ModuleFooter.jsx'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  AnimatedModal,
  FloatingActionButton
} from '../../../components/premium/InteractiveElements.jsx'

import { GradientSpinner } from '../../../components/premium/LoadingStates.jsx'
import { GlowEffect } from '../../../components/premium/VisualEffects.jsx'
import { ParticleSystem } from '../../../components/premium/AnimatedComponents.jsx'
import { useSounds } from '../../../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../../../components/premium/DesignSystem.jsx'

// API и компоненты
import { contentApi } from '../../../api/mockContentApi.js'
import { progressApi } from '../../../api/mockProgressApi.js'
import { notify } from '../../../components/NotificationPanel.jsx'

const ModuleTemplate = ({
  moduleConfig = {},
  customContent = null,
  layoutVariant = 'default', // default, sidebar, fullwidth
  showParticles = true,
  enableSounds = true,
  theme = 'auto' // auto, light, dark
}) => {
  // ✅ ПАРАМЕТРЫ
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()

  // ✅ СОСТОЯНИЕ МОДУЛЯ
  const [moduleData, setModuleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ СОСТОЯНИЕ ОБУЧЕНИЯ
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState([])
  const [readingTime, setReadingTime] = useState(0)
  const [userProgress, setUserProgress] = useState(null)

  // ✅ СОСТОЯНИЕ UI
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // ✅ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    setMounted(true)
    loadModuleData()
    
    if (enableSounds) {
      sounds.pageTransition()
    }
  }, [moduleId, enableSounds, sounds])

  // ✅ СЛУШАТЕЛИ СОБЫТИЙ
  useEffect(() => {
    const handleNavigateToSection = (e) => {
      const { sectionIndex } = e.detail
      if (sectionIndex >= 0 && sectionIndex < (moduleData?.sections?.length || 0)) {
        setCurrentSection(sectionIndex)
      }
    }

    window.addEventListener('navigate-to-section', handleNavigateToSection)
    return () => window.removeEventListener('navigate-to-section', handleNavigateToSection)
  }, [moduleData])

  // ✅ ЗАГРУЗКА ДАННЫХ
  const loadModuleData = async () => {
    if (!moduleId) {
      navigate('/dashboard')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Загружаем контент модуля
      const parsedModuleId = parseInt(moduleId)
      let content

      if (customContent) {
        // Используем кастомный контент, если передан
        content = customContent
      } else if (moduleConfig.content) {
        // Используем контент из конфига
        content = moduleConfig.content
      } else {
        // Загружаем через API
        content = await contentApi.fetchModuleContent(parsedModuleId)
      }

      if (!content) {
        throw new Error(`Модуль ${moduleId} не найден`)
      }

      // Загружаем прогресс пользователя
      const progress = await progressApi.fetchUserProgress()
      const moduleProgress = progress.moduleProgress?.[parsedModuleId] || {}

      setModuleData(content)
      setUserProgress(progress)
      setCompletedSections(moduleProgress.completedSections || [])
      setReadingTime(moduleProgress.readingTime || 0)

      if (enableSounds) {
        sounds.success()
      }

    } catch (error) {
      console.error('Ошибка загрузки модуля:', error)
      setError(error.message)
      
      if (enableSounds) {
        sounds.error()
      }
      
      notify.error('Ошибка загрузки', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ НАВИГАЦИЯ ПО РАЗДЕЛАМ
  const goToSection = useCallback((sectionIndex) => {
    if (sectionIndex >= 0 && sectionIndex < (moduleData?.sections?.length || 0)) {
      setCurrentSection(sectionIndex)
      
      if (enableSounds) {
        sounds.whoosh()
      }
    }
  }, [moduleData, enableSounds, sounds])

  const nextSection = useCallback(() => {
    if (!moduleData) return

    const maxSections = moduleData.sections?.length || 0
    if (currentSection < maxSections - 1) {
      setCurrentSection(currentSection + 1)
      
      if (enableSounds) {
        sounds.success()
      }
    } else {
      completeModule()
    }
  }, [currentSection, moduleData, enableSounds, sounds])

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      
      if (enableSounds) {
        sounds.click()
      }
    }
  }, [currentSection, enableSounds, sounds])

  // ✅ ЗАВЕРШЕНИЕ РАЗДЕЛОВ И МОДУЛЯ
  const markSectionComplete = useCallback(async (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      const newCompletedSections = [...completedSections, sectionId]
      setCompletedSections(newCompletedSections)

      // Сохраняем прогресс
      try {
        await progressApi.updateModuleProgress({
          moduleId: parseInt(moduleId),
          completedSections: newCompletedSections,
          readingTime
        })
      } catch (error) {
        console.error('Ошибка сохранения прогресса:', error)
      }
    }
  }, [completedSections, moduleId, readingTime])

  const completeModule = async () => {
    try {
      await progressApi.updateModuleProgress({
        moduleId: parseInt(moduleId),
        completedSections,
        readingTime,
        completed: true
      })

      notify.success('Модуль завершен!', `${moduleData?.title || `Модуль ${moduleId}`} успешно изучен`)
      
      if (enableSounds) {
        sounds.achievement()
      }

      navigate(`/module/${moduleId}/quiz`)
    } catch (error) {
      console.error('Ошибка завершения модуля:', error)
      notify.error('Ошибка', 'Не удалось завершить модуль')
      
      if (enableSounds) {
        sounds.error()
      }
    }
  }

  // ✅ ОБНОВЛЕНИЕ ВРЕМЕНИ ЧТЕНИЯ
  const updateReadingTime = useCallback((newTime) => {
    setReadingTime(newTime)
  }, [])

  // ✅ ОБРАБОТЧИКИ СОБЫТИЙ
  const handleBackToDashboard = () => {
    if (enableSounds) {
      sounds.click()
    }
    navigate('/dashboard')
  }

  const handleStartQuiz = () => {
    if (enableSounds) {
      sounds.click()
    }
    navigate(`/module/${moduleId}/quiz`)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
    if (enableSounds) {
      sounds.click()
    }
  }

  // ✅ ЗАГРУЗОЧНЫЙ ЭКРАН
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 flex items-center justify-center relative overflow-hidden">
        
        {/* Анимированный фон */}
        {showParticles && !reducedMotion && (
          <div className="absolute inset-0">
            <ParticleSystem count={20} color="primary" />
          </div>
        )}
        
        {/* Загрузочная карточка */}
        <GlowEffect color="primary" intensity="high">
          <InteractiveCard variant="premium" className="text-center p-12 max-w-md mx-4">
            
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📚</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Загрузка модуля {moduleId}
              </h2>
              <p className="text-blue-200">
                Подготавливаем материалы для изучения...
              </p>
            </div>
            
            <GradientSpinner size="lg" color="primary" speed="normal" />
          </InteractiveCard>
        </GlowEffect>
      </div>
    )
  }

  // ✅ ЭКРАН ОШИБКИ
  if (error || !moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 flex items-center justify-center">
        <GlowEffect color="error" intensity="medium">
          <InteractiveCard variant="premium" className="text-center p-12 max-w-md mx-4">
            
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Модуль не найден
            </h1>
            <p className="text-red-200 mb-8">
              {error || `Модуль ${moduleId} не существует или временно недоступен`}
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
              >
                Попробовать снова
              </button>
              
              <button
                onClick={handleBackToDashboard}
                className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
              >
                Вернуться к модулям
              </button>
            </div>
          </InteractiveCard>
        </GlowEffect>
      </div>
    )
  }

  const currentSectionData = moduleData.sections?.[currentSection]
  const sectionTitles = moduleData.sections?.map(section => section.title) || []

  // ✅ РЕНДЕР ОСНОВНОГО ИНТЕРФЕЙСА
  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      
      {/* Анимированный фон */}
      {showParticles && !reducedMotion && (
        <div className="fixed inset-0 pointer-events-none">
          <ParticleSystem count={15} color="primary" opacity={0.3} />
        </div>
      )}

      {/* ✅ ЛЕЙАУТ В ЗАВИСИМОСТИ ОТ ВАРИАНТА */}
      {layoutVariant === 'sidebar' ? (
        // Сайдбар лейаут
        <div className="flex">
          
          {/* Сайдбар */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 border-r border-white/10 bg-black/20 backdrop-blur-lg`}>
            <div className="sticky top-0 h-screen overflow-y-auto">
              
              {/* Кнопка сворачивания */}
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={toggleSidebar}
                  className="w-full flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <span className="text-white">{sidebarCollapsed ? '→' : '←'}</span>
                </button>
              </div>

              {!sidebarCollapsed && (
                <div className="p-4 space-y-6">
                  {/* Компактный хедер */}
                  <ModuleHeader
                    moduleId={moduleId}
                    title={moduleData.title}
                    subtitle={moduleData.description}
                    category={moduleData.category}
                    difficulty={moduleData.difficulty}
                    currentSection={currentSection}
                    totalSections={moduleData.sections?.length || 0}
                    completedSections={completedSections}
                    readingTime={readingTime}
                    estimatedTime={moduleData.estimatedTime}
                    compact={true}
                    onBackClick={handleBackToDashboard}
                  />

                  {/* Сайдбар прогресс */}
                  <ModuleProgress
                    currentSection={currentSection}
                    totalSections={moduleData.sections?.length || 0}
                    completedSections={completedSections}
                    sectionTitles={sectionTitles}
                    readingTime={readingTime}
                    estimatedTime={moduleData.estimatedTime}
                    onSectionClick={goToSection}
                    variant="sidebar"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              
              {/* Контент */}
              <ModuleContent
                section={currentSectionData}
                moduleId={moduleId}
                sectionIndex={currentSection}
                readingTime={readingTime}
                onReadingTimeUpdate={updateReadingTime}
                className="mb-8"
              />

              {/* Компактная навигация */}
              <ModuleFooter
                moduleId={moduleId}
                currentSection={currentSection}
                totalSections={moduleData.sections?.length || 0}
                completedSections={completedSections}
                sectionTitles={sectionTitles}
                readingTime={readingTime}
                estimatedTime={moduleData.estimatedTime}
                onPrevSection={prevSection}
                onNextSection={nextSection}
                onSectionComplete={markSectionComplete}
                onModuleComplete={completeModule}
                onGoToSection={goToSection}
                onBackToDashboard={handleBackToDashboard}
                onStartQuiz={handleStartQuiz}
                variant="compact"
              />
            </div>
          </div>
        </div>
      ) : (
        // Обычный лейаут
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Хедер */}
          <ModuleHeader
            moduleId={moduleId}
            title={moduleData.title}
            subtitle={moduleData.description}
            category={moduleData.category}
            difficulty={moduleData.difficulty}
            currentSection={currentSection}
            totalSections={moduleData.sections?.length || 0}
            completedSections={completedSections}
            readingTime={readingTime}
            estimatedTime={moduleData.estimatedTime}
            onBackClick={handleBackToDashboard}
          />

          {layoutVariant === 'fullwidth' ? (
            // Полноширинный лейаут
            <div className="space-y-8">
              
              {/* Контент */}
              <ModuleContent
                section={currentSectionData}
                moduleId={moduleId}
                sectionIndex={currentSection}
                readingTime={readingTime}
                onReadingTimeUpdate={updateReadingTime}
              />

              {/* Навигация */}
              <ModuleFooter
                moduleId={moduleId}
                currentSection={currentSection}
                totalSections={moduleData.sections?.length || 0}
                completedSections={completedSections}
                sectionTitles={sectionTitles}
                readingTime={readingTime}
                estimatedTime={moduleData.estimatedTime}
                onPrevSection={prevSection}
                onNextSection={nextSection}
                onSectionComplete={markSectionComplete}
                onModuleComplete={completeModule}
                onGoToSection={goToSection}
                onBackToDashboard={handleBackToDashboard}
                onStartQuiz={handleStartQuiz}
              />
            </div>
          ) : (
            // Двухколоночный лейаут (default)
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Основной контент */}
              <div className="lg:col-span-3">
                <ModuleContent
                  section={currentSectionData}
                  moduleId={moduleId}
                  sectionIndex={currentSection}
                  readingTime={readingTime}
                  onReadingTimeUpdate={updateReadingTime}
                  className="mb-8"
                />

                <ModuleFooter
                  moduleId={moduleId}
                  currentSection={currentSection}
                  totalSections={moduleData.sections?.length || 0}
                  completedSections={completedSections}
                  sectionTitles={sectionTitles}
                  readingTime={readingTime}
                  estimatedTime={moduleData.estimatedTime}
                  onPrevSection={prevSection}
                  onNextSection={nextSection}
                  onSectionComplete={markSectionComplete}
                  onModuleComplete={completeModule}
                  onGoToSection={goToSection}
                  onBackToDashboard={handleBackToDashboard}
                  onStartQuiz={handleStartQuiz}
                />
              </div>

              {/* Сайдбар с прогрессом */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <ModuleProgress
                    currentSection={currentSection}
                    totalSections={moduleData.sections?.length || 0}
                    completedSections={completedSections}
                    sectionTitles={sectionTitles}
                    readingTime={readingTime}
                    estimatedTime={moduleData.estimatedTime}
                    onSectionClick={goToSection}
                    variant="sidebar"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ МОДАЛ ПОМОЩИ */}
      <AnimatedModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Помощь по модулю"
        size="large"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Как работать с модулем:</h3>
            <ul className="text-white/90 space-y-2">
              <li>• Читайте материал последовательно по разделам</li>
              <li>• Используйте навигацию для перехода между разделами</li>
              <li>• Ваш прогресс автоматически сохраняется</li>
              <li>• После изучения всех разделов пройдите тест</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Горячие клавиши:</h3>
            <ul className="text-white/90 space-y-2">
              <li>• <kbd className="bg-white/20 px-2 py-1 rounded">←</kbd> Предыдущий раздел</li>
              <li>• <kbd className="bg-white/20 px-2 py-1 rounded">→</kbd> Следующий раздел</li>
              <li>• <kbd className="bg-white/20 px-2 py-1 rounded">Esc</kbd> Вернуться к модулям</li>
            </ul>
          </div>
        </div>
      </AnimatedModal>

      {/* ✅ ПЛАВАЮЩАЯ КНОПКА ПОМОЩИ */}
      <FloatingActionButton
        icon="❓"
        position="top-right"
        tooltip="Помощь"
        onClick={() => setShowHelp(true)}
      />
    </div>
  )
}

export default ModuleTemplate