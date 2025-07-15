import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ✅ ПРАВИЛЬНЫЕ импорты премиальных компонентов
import { PremiumPage, PremiumCard, RippleButton, AnimatedProgress } from '../../components/premium/PremiumUI.jsx'
import { useSounds } from '../../components/premium/SoundSystem.jsx'

// ✅ UI компоненты
import ProgressBar from '../../components/ProgressBar.jsx'
import BadgeMeter from '../../components/BadgeMeter.jsx'
import { notify } from '../../components/NotificationPanel.jsx'

// ✅ API
import { contentApi } from '../../api/mockContentApi.js'
import { progressApi } from '../../api/mockProgressApi.js'

const Module6UPK = () => { // ✅ ПРАВИЛЬНОЕ название для UPK (Уголовный Процессуальный Кодекс)
  const navigate = useNavigate()
  const { moduleId } = useParams()
  const { sounds } = useSounds() // ✅ Звуки подключены
  
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState([])
  const [readingTime, setReadingTime] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [moduleData, setModuleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка данных модуля из API
  useEffect(() => {
    const fetchModuleContent = async () => {
      setIsLoading(true)
      try {
        const parsedModuleId = parseInt(moduleId) || 6
        if (isNaN(parsedModuleId)) {
          throw new Error('Некорректный ID модуля.')
        }
        const data = await contentApi.fetchModuleContent(parsedModuleId)
        setModuleData(data)
        
        // Загружаем прогресс пользователя
        const userProgress = await progressApi.fetchUserProgress()
        if (userProgress.completedModules) {
          const moduleProgress = userProgress.moduleProgress?.[parsedModuleId] || {}
          setCompletedSections(moduleProgress.completedSections || [])
        }
        
        sounds.success()
      } catch (error) {
        console.error('Ошибка загрузки контента модуля:', error)
        notify.error('Ошибка загрузки', error.message || 'Не удалось загрузить контент модуля.')
        sounds.error()
        navigate('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchModuleContent()
  }, [moduleId, navigate, sounds])

  // Таймер чтения
  useEffect(() => {
    if (isReading) {
      const timer = setInterval(() => {
        setReadingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isReading])

  useEffect(() => {
    setIsReading(true)
    setReadingTime(0)
    return () => setIsReading(false)
  }, [currentSection])

  const nextSection = useCallback(() => {
    if (!moduleData) return
    if (currentSection < moduleData.sections.length - 1) {
      setCurrentSection(currentSection + 1)
      sounds.success()
    } else {
      completeModule()
    }
  }, [currentSection, moduleData, sounds])

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      sounds.click()
    }
  }, [currentSection, sounds])

  const completeModule = async () => {
    try {
      await progressApi.updateModuleProgress({
        moduleId: parseInt(moduleId) || 6,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'УПК - Уголовно-процессуальные аспекты изучены успешно!')
      sounds.achievement()
      navigate(`/module/${moduleId}/quiz`)
    } catch (error) {
      console.error('Ошибка завершения модуля:', error)
      notify.error('Ошибка', error.message || 'Не удалось завершить модуль.')
      sounds.error()
    }
  }

  const backToDashboard = () => {
    sounds.click()
    navigate('/dashboard')
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Загрузочный экран
  if (isLoading || !moduleData) {
    return (
      <PremiumPage background="matrix" className="min-h-screen flex items-center justify-center">
        <PremiumCard variant="glow" className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-indigo-200">Подготавливаем материалы УПК</p>
        </PremiumCard>
      </PremiumPage>
    )
  }

  const currentSectionData = moduleData.sections[currentSection]
  const progress = Math.round(((currentSection + 1) / moduleData.sections.length) * 100)

  return (
    <PremiumPage background="neural" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Заголовок модуля */}
        <PremiumCard variant="glow" className="mb-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              ⚖️ Модуль 6: УПК
            </h1>
            <p className="text-indigo-200 text-lg mb-4">
              Уголовно-процессуальные аспекты строительной деятельности
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-indigo-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-indigo-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-indigo-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-indigo-300 mb-6">
              {currentSectionData.title || 'Основы УПК в строительстве'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 УПК в строительной сфере</h3>
              <p>
                Уголовно-процессуальный кодекс регламентирует процедуры расследования 
                преступлений в строительной сфере, включая нарушения требований безопасности, 
                некачественное строительство и превышение полномочий должностными лицами.
              </p>
              
              <h4>⚠️ Основные преступления в строительстве:</h4>
              <ul>
                <li><strong>Статья 238 УК РФ:</strong> Производство товаров, не отвечающих требованиям безопасности</li>
                <li><strong>Статья 293 УК РФ:</strong> Халатность должностных лиц</li>
                <li><strong>Статья 216 УК РФ:</strong> Нарушение правил безопасности при ведении работ</li>
                <li><strong>Статья 217 УК РФ:</strong> Нарушение правил безопасности на взрывоопасных объектах</li>
                <li><strong>Статья 286 УК РФ:</strong> Превышение должностных полномочий</li>
              </ul>

              <h4>📋 Ответственные лица:</h4>
              <ul>
                <li>Руководители строительных организаций</li>
                <li>Технические директора и главные инженеры</li>
                <li>Производители работ и мастера</li>
                <li>Ответственные за безопасность производства работ</li>
                <li>Должностные лица контролирующих органов</li>
              </ul>

              <h4>🔍 Процедуры расследования:</h4>
              <ul>
                <li>Возбуждение уголовного дела</li>
                <li>Предварительное расследование</li>
                <li>Производство экспертиз</li>
                <li>Допросы свидетелей и обвиняемых</li>
                <li>Судебное разбирательство</li>
              </ul>

              <h4>💼 Права и обязанности при расследовании:</h4>
              <ul>
                <li>Право на защитника с момента задержания</li>
                <li>Право не свидетельствовать против себя</li>
                <li>Обязанность предоставлять документы по требованию следствия</li>
                <li>Право на обжалование решений следственных органов</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-red-500/10 border border-red-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">🚨</span> Критически важно:
            </h3>
            <p className="text-white leading-relaxed">
              При несчастных случаях на строительстве с тяжелыми последствиями 
              автоматически возбуждается уголовное дело. Знание процедур УПК 
              помогает правильно действовать при взаимодействии со следственными органами.
            </p>
          </div>
        </PremiumCard>

        {/* Практические советы */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💡</span> Практические советы:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Ведите подробную документацию всех работ</li>
              <li>• Обеспечьте страхование профессиональной ответственности</li>
              <li>• Имейте постоянную юридическую поддержку</li>
              <li>• Регулярно обучайте персонал требованиям безопасности</li>
              <li>• Проводите внутренние проверки соблюдения норм</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-indigo-300 border-indigo-300 hover:bg-indigo-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-indigo-300 border-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module6UPK // ✅ ПРАВИЛЬНЫЙ экспорт для UPK