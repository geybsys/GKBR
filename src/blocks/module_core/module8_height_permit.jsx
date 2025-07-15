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

const Module8HeightPermit = () => { // ✅ ПРАВИЛЬНОЕ название для Height Permit
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
        const parsedModuleId = parseInt(moduleId) || 8
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
        moduleId: parseInt(moduleId) || 8,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Допуск на высоту изучен успешно!')
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
          <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-yellow-200">Подготавливаем материалы по работе на высоте</p>
        </PremiumCard>
      </PremiumPage>
    )
  }

  const currentSectionData = moduleData.sections[currentSection]
  const progress = Math.round(((currentSection + 1) / moduleData.sections.length) * 100)

  return (
    <PremiumPage background="particles" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Заголовок модуля */}
        <PremiumCard variant="glow" className="mb-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              🏗️ Модуль 8: Допуск на высоту
            </h1>
            <p className="text-yellow-200 text-lg mb-4">
              Работы на высоте - требования безопасности и обучение
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-yellow-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-yellow-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-yellow-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">
              {currentSectionData.title || 'Основы работы на высоте'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое работы на высоте?</h3>
              <p>
                Работы на высоте — это работы, при выполнении которых работник 
                находится на расстоянии менее 2 м от неогражденных перепадов по высоте 
                1,8 м и более, или работы на площадках на расстоянии менее 2 м 
                от края перепада по высоте более 1,8 м.
              </p>
              
              <h4>📋 Группы безопасности при работе на высоте:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-200 uppercase tracking-wider">Группа</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-200 uppercase tracking-wider">Кто получает</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-200 uppercase tracking-wider">Обучение</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-200 uppercase tracking-wider">Переаттестация</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white font-semibold">1 группа</td>
                      <td className="px-6 py-4 text-sm text-white">Работники в составе бригады</td>
                      <td className="px-6 py-4 text-sm text-white">40 часов + стажировка 2 дня</td>
                      <td className="px-6 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white font-semibold">2 группа</td>
                      <td className="px-6 py-4 text-sm text-white">Бригадиры, мастера, ответственные исполнители</td>
                      <td className="px-6 py-4 text-sm text-white">40 часов + стажировка 2 дня</td>
                      <td className="px-6 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white font-semibold">3 группа</td>
                      <td className="px-6 py-4 text-sm text-white">Ответственные за организацию работ, преподаватели</td>
                      <td className="px-6 py-4 text-sm text-white">72 часа</td>
                      <td className="px-6 py-4 text-sm text-white">Каждые 5 лет</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Виды работ, требующих допуска:</h4>
              <ul>
                <li>Кровельные работы</li>
                <li>Монтаж фасадов и навесных конструкций</li>
                <li>Промышленный альпинизм</li>
                <li>Работы на мачтах и вышках</li>
                <li>Монтажные работы на лестницах свыше 5 метров</li>
                <li>Работы в колодцах и траншеях глубиной более 1,8 м</li>
              </ul>

              <h4>🛡️ Средства индивидуальной защиты:</h4>
              <ul>
                <li>Страховочные привязи (удерживающие, позиционирующие, страховочные)</li>
                <li>Соединительно-амортизирующие подсистемы</li>
                <li>Анкерные устройства</li>
                <li>Каски защитные</li>
                <li>Средства защиты рук и ног</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-red-500/10 border border-red-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">⚠️</span> Критически важно:
            </h3>
            <p className="text-white leading-relaxed">
              Допуск на высоту — это не просто формальность, а защита от штрафов до 200 000 рублей 
              и уголовной ответственности при несчастных случаях. Каждый работник, поднимающийся 
              выше 1,8 метра, должен иметь соответствующую группу безопасности.
            </p>
          </div>
        </PremiumCard>

        {/* Штрафы */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💰</span> Штрафы за нарушения:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Отсутствие обучения: 130 000 - 200 000 руб.</li>
              <li>• Допуск необученного работника: 200 000 руб.</li>
              <li>• Нарушение требований при работе на высоте: до 200 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
              <li>• При несчастном случае: уголовная ответственность</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Продажный аргумент */}
        <PremiumCard variant="default" className="mb-8 bg-emerald-500/10 border border-emerald-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-emerald-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💰</span> Продажный аргумент:
            </h3>
            <p className="text-white leading-relaxed italic">
              Обучение на допуск к работам на высоте стоит 3 000-6 000 рублей на 1-3 года. 
              Штраф за отсутствие допуска — 200 000 рублей за каждого работника. 
              Отсутствие допуска у одного работника может остановить всю стройку 
              и обойтись в миллионы убытков.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-yellow-300 border-yellow-300 hover:bg-yellow-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-yellow-300 border-yellow-300 hover:bg-yellow-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-yellow-600 hover:bg-yellow-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module8HeightPermit // ✅ ПРАВИЛЬНЫЙ экспорт для Height Permit