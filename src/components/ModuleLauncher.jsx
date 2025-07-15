// Premium ModuleLauncher.jsx - Премиальный запуск модулей с превью
// Путь: src/components/ModuleLauncher.jsx

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА ФАЗЫ 2
import { 
  InteractiveCard, 
  RippleButton, 
  AnimatedModal,
  AnimatedProgress,
  FloatingActionButton,
  AnimatedAvatar
} from '../components/premium/InteractiveElements.jsx'

import { GradientSpinner, AnimatedProgressBar } from '../components/premium/LoadingStates.jsx'
import { GlowEffect, GlassEffect, ParallaxEffect } from '../components/premium/VisualEffects.jsx'
import { AnimatedCounter, MagneticElement, TypewriterEffect, ParticleSystem } from '../components/premium/AnimatedComponents.jsx'
import { PremiumContainer, HeroSection, StatsSection } from '../components/premium/PremiumLayouts.jsx'
import { useSounds } from '../components/premium/SoundSystem.jsx'
import { useDesignSystem } from '../components/premium/DesignSystem.jsx'

// Компоненты
import ProgressBar from '../components/ProgressBar.jsx'
import BadgeMeter from '../components/BadgeMeter.jsx'
import { notify } from '../components/NotificationPanel.jsx'

// API
import { contentApi } from '../api/mockContentApi.js'
import { progressApi } from '../api/mockProgressApi.js'

const PremiumModuleLauncher = () => {
  // ✅ ПАРАМЕТРЫ И СОСТОЯНИЕ
  const { moduleId } = useParams()
  const [moduleData, setModuleData] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [mounted, setMounted] = useState(false)
  const [readyToStart, setReadyToStart] = useState(false)
  
  // ✅ ХУКИ
  const navigate = useNavigate()
  const { sounds } = useSounds()
  const { colors, reducedMotion } = useDesignSystem()
  const moduleRef = useRef(null)

  // ✅ ЭФФЕКТ ИНИЦИАЛИЗАЦИИ
  useEffect(() => {
    setMounted(true)
    loadModuleData()
    sounds.pageTransition()
  }, [moduleId, sounds])

  // ✅ ЗАГРУЗКА ДАННЫХ МОДУЛЯ
  const loadModuleData = async () => {
    if (!moduleId) {
      navigate('/dashboard')
      return
    }

    try {
      setLoadingStep('Загрузка модуля...')
      
      // Загружаем данные модуля
      const moduleContent = await contentApi.fetchModuleContent(parseInt(moduleId))
      if (!moduleContent) {
        throw new Error('Модуль не найден')
      }
      
      setLoadingStep('Загрузка прогресса...')
      
      // Загружаем прогресс пользователя
      const progress = await progressApi.fetchUserProgress()
      
      setModuleData(moduleContent)
      setUserProgress(progress)
      
      setLoadingStep('Подготовка интерфейса...')
      
      // Показываем превью через короткое время
      setTimeout(() => {
        setShowPreview(true)
        setReadyToStart(true)
        sounds.success()
      }, 1000)
      
    } catch (error) {
      console.error('Ошибка загрузки модуля:', error)
      sounds.error()
      notify.error('Ошибка загрузки', error.message || 'Не удалось загрузить модуль')
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

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

  // ✅ ПРОВЕРКИ СОСТОЯНИЯ
  const isModuleCompleted = () => {
    return userProgress?.completedModules?.includes(parseInt(moduleId)) || false
  }

  const getModuleScore = () => {
    const scores = userProgress?.moduleScores || {}
    return scores[moduleId] || 0
  }

  // ✅ ОБРАБОТЧИКИ СОБЫТИЙ
  const startModule = () => {
    sounds.whoosh()
    navigate(`/module/${moduleId}/content`)
  }

  const startQuiz = () => {
    sounds.click()
    navigate(`/module/${moduleId}/quiz`)
  }

  const backToDashboard = () => {
    sounds.click()
    navigate('/dashboard')
  }

  // ✅ ЗАГРУЗОЧНЫЙ ЭКРАН
  if (isLoading || !moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 flex items-center justify-center relative overflow-hidden">
        
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          {!reducedMotion && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 animate-gradient-x" />
              <ParticleSystem count={20} color="primary" />
            </>
          )}
        </div>
        
        {/* Загрузочная карточка */}
        <GlowEffect color="primary" intensity="high">
          <InteractiveCard variant="premium" className="text-center p-12 max-w-md mx-4">
            
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📚</span>
              </div>
              
              <TypewriterEffect 
                text="Загрузка модуля..." 
                className="text-2xl font-bold text-white"
                speed={100}
              />
            </div>
            
            <div className="mb-6">
              <GradientSpinner size="lg" color="primary" speed="normal" />
            </div>
            
            <AnimatedProgressBar 
              progress={showPreview ? 100 : 60}
              showPercentage={false}
              label={loadingStep}
              color="primary"
              size="md"
              className="mb-4"
            />
            
            {showPreview && (
              <div className="animate-fade-in">
                <p className="text-blue-200">
                  Модуль готов к изучению!
                </p>
              </div>
            )}
          </InteractiveCard>
        </GlowEffect>
      </div>
    )
  }

  const isCompleted = isModuleCompleted()
  const currentScore = getModuleScore()
  const categoryGradient = getCategoryGradient(moduleData.category)
  const categoryIcon = getCategoryIcon(moduleData.category)

  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      
      {/* ✅ HERO СЕКЦИЯ */}
      <HeroSection 
        background={`bg-gradient-to-br ${categoryGradient}`}
        className="relative overflow-hidden"
      >
        {/* Кнопка назад */}
        <div className="absolute top-8 left-8 z-20">
          <RippleButton
            variant="ghost"
            size="medium"
            onClick={backToDashboard}
            className="backdrop-blur-lg bg-white/10 border border-white/20"
          >
            ← Назад
          </RippleButton>
        </div>

        {/* Основной контент */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          
          {/* Иконка и категория */}
          <div className="mb-8">
            <MagneticElement strength={0.3}>
              <div className="inline-block">
                <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 border border-white/30">
                  <span className="text-6xl">{categoryIcon}</span>
                </div>
                
                <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-full text-lg font-medium border border-white/30">
                  Модуль {moduleId}
                </span>
              </div>
            </MagneticElement>
          </div>

          {/* Заголовок */}
          <TypewriterEffect 
            text={moduleData.title}
            className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            speed={100}
          />
          
          {/* Описание */}
          <p className="text-2xl text-white/90 mb-8 leading-relaxed">
            {moduleData.description}
          </p>

          {/* Статус завершения */}
          {isCompleted && (
            <div className="mb-8 animate-bounce-gentle">
              <span className="inline-flex items-center px-6 py-3 bg-green-500/20 backdrop-blur-lg border border-green-400/50 rounded-full text-green-200 font-medium">
                <span className="mr-2">✅</span>
                Модуль завершен
                <span className="ml-3 px-3 py-1 bg-green-400/30 rounded-full text-xs">
                  {currentScore} баллов
                </span>
              </span>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <RippleButton
              variant="glow"
              size="xl"
              onClick={startModule}
              className="px-12 py-6"
            >
              <span className="mr-3">📖</span>
              {isCompleted ? 'Повторить модуль' : 'Начать изучение'}
            </RippleButton>
            
            <RippleButton
              variant="secondary"
              size="xl"
              onClick={startQuiz}
              className="px-12 py-6 backdrop-blur-lg bg-white/10 border border-white/20"
            >
              <span className="mr-3">🎯</span>
              Пройти тест
            </RippleButton>
          </div>
        </div>

        {/* Анимированные частицы */}
        {!reducedMotion && (
          <div className="absolute inset-0">
            <ParticleSystem count={30} color="white" opacity={0.1} />
          </div>
        )}
      </HeroSection>

      <PremiumContainer variant="wide" className="py-16">
        
        {/* ✅ ИНФОРМАЦИЯ О МОДУЛЕ */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Информация о модуле</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Сложность */}
            <GlowEffect color="warning" intensity="medium">
              <InteractiveCard variant="premium" className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Сложность</h3>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(moduleData.difficulty)}`}>
                  {moduleData.difficulty}
                </span>
              </InteractiveCard>
            </GlowEffect>

            {/* Длительность */}
            <GlowEffect color="info" intensity="medium">
              <InteractiveCard variant="premium" className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Время</h3>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {moduleData.estimatedTime || '45 мин'}
                </div>
                <p className="text-blue-200 text-sm">примерно</p>
              </InteractiveCard>
            </GlowEffect>

            {/* Баллы */}
            <GlowEffect color="accent" intensity="medium">
              <InteractiveCard variant="premium" className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Баллы</h3>
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  <AnimatedCounter to={moduleData.maxScore || 1000} />
                </div>
                <p className="text-blue-200 text-sm">максимум</p>
              </InteractiveCard>
            </GlowEffect>

            {/* Категория */}
            <GlowEffect color="purple" intensity="medium">
              <InteractiveCard variant="premium" className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">{categoryIcon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Категория</h3>
                <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-full text-purple-200 text-sm font-medium">
                  {moduleData.categoryName || 'Базовый'}
                </span>
              </InteractiveCard>
            </GlowEffect>
          </div>
        </div>

        {/* ✅ ПРЕВЬЮ СОДЕРЖАНИЯ */}
        {moduleData.sections && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Содержание модуля</h2>
            
            <div className="max-w-4xl mx-auto">
              {moduleData.sections.slice(0, 5).map((section, index) => (
                <InteractiveCard 
                  key={index} 
                  variant="glass" 
                  className={`mb-4 p-6 ${!reducedMotion ? 'animate-slide-up' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {section.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-blue-200">
                        <span>{section.type === 'theory' ? '📚 Теория' : '🎯 Практика'}</span>
                        <span>⏱️ {section.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {section.type === 'theory' ? '📖' : '💡'}
                    </div>
                  </div>
                </InteractiveCard>
              ))}
              
              {moduleData.sections.length > 5 && (
                <div className="text-center mt-6">
                  <p className="text-blue-200">
                    И еще {moduleData.sections.length - 5} разделов...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ */}
        {userProgress && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Ваш прогресс</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Общий прогресс */}
              <InteractiveCard variant="premium" className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Общий прогресс</h3>
                
                <div className="mb-6">
                  <ProgressBar 
                    value={Math.round((userProgress.completedModules?.length || 0) / 21 * 100)} 
                    className="mb-2"
                  />
                  <div className="text-center text-blue-200 text-sm">
                    {userProgress.completedModules?.length || 0} из 21 модулей завершено
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    <AnimatedCounter to={userProgress.score || 0} />
                  </div>
                  <div className="text-blue-200 text-sm">общий счет</div>
                </div>
              </InteractiveCard>

              {/* Достижения */}
              <InteractiveCard variant="premium" className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Достижения</h3>
                
                <BadgeMeter 
                  earnedBadges={userProgress.badges || []}
                  totalBadges={['beginner', 'expert', 'master', 'champion']}
                  variant="compact"
                />
                
                <div className="text-center mt-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    <AnimatedCounter to={userProgress.badges?.length || 0} />
                  </div>
                  <div className="text-blue-200 text-sm">значков получено</div>
                </div>
              </InteractiveCard>
            </div>
          </div>
        )}

        {/* ✅ ФИНАЛЬНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ */}
        <div className="text-center">
          <GlowEffect color="primary" intensity="high">
            <InteractiveCard variant="premium" className="p-12 max-w-2xl mx-auto">
              
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🚀</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Готовы начать?
                </h2>
                
                <p className="text-blue-200 text-lg">
                  {isCompleted 
                    ? 'Повторите модуль для закрепления знаний или пройдите тест еще раз'
                    : 'Начните изучение модуля прямо сейчас и получите новые знания'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <RippleButton
                  variant="glow"
                  size="large"
                  onClick={startModule}
                  className="px-8 py-4"
                >
                  <span className="mr-2">📖</span>
                  Изучить модуль
                </RippleButton>
                
                <RippleButton
                  variant="secondary"
                  size="large"
                  onClick={startQuiz}
                  className="px-8 py-4"
                >
                  <span className="mr-2">🎯</span>
                  Пройти тест
                </RippleButton>
              </div>
            </InteractiveCard>
          </GlowEffect>
        </div>
      </PremiumContainer>

      {/* ✅ ПЛАВАЮЩИЕ КНОПКИ */}
      <FloatingActionButton
        icon="📋"
        position="bottom-left"
        tooltip="Содержание модуля"
        onClick={() => {
          sounds.click()
          moduleRef.current?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <FloatingActionButton
        icon="📊"
        position="bottom-right"
        tooltip="Мой прогресс"
        onClick={() => {
          sounds.click()
          const progressPercentage = Math.round((userProgress?.completedModules?.length || 0) / 21 * 100)
          notify.info('Прогресс', `Завершено: ${progressPercentage}%`)
        }}
      />
    </div>
  )
}

export default PremiumModuleLauncher