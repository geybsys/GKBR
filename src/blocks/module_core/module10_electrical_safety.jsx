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

const Module10ElectricalSafety = () => { // ✅ ПРАВИЛЬНОЕ название для Electrical Safety
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
        const parsedModuleId = parseInt(moduleId) || 10
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
        moduleId: parseInt(moduleId) || 10,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Электробезопасность изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-blue-200">Подготавливаем материалы по электробезопасности</p>
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
              ⚡ Модуль 10: Электробезопасность
            </h1>
            <p className="text-blue-200 text-lg mb-4">
              Группы по электробезопасности и требования Ростехнадзора
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-blue-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-blue-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-blue-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">
              {currentSectionData.title || 'Основы электробезопасности'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое электробезопасность?</h3>
              <p>
                Электробезопасность — система организационных и технических мероприятий, 
                направленных на защиту людей от вредного и опасного воздействия 
                электрического тока, электрической дуги, электромагнитного поля и статического электричества.
              </p>
              
              <h4>📋 Группы по электробезопасности:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Группа</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Кто получает</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Требования</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Переаттестация</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">I группа</td>
                      <td className="px-4 py-4 text-sm text-white">Неэлектротехнический персонал</td>
                      <td className="px-4 py-4 text-sm text-white">Инструктаж по электробезопасности</td>
                      <td className="px-4 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">II группа</td>
                      <td className="px-4 py-4 text-sm text-white">Электротехнический персонал</td>
                      <td className="px-4 py-4 text-sm text-white">Базовые знания электротехники</td>
                      <td className="px-4 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">III группа</td>
                      <td className="px-4 py-4 text-sm text-white">Электромонтеры, техники</td>
                      <td className="px-4 py-4 text-sm text-white">Среднее профессиональное образование</td>
                      <td className="px-4 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">IV группа</td>
                      <td className="px-4 py-4 text-sm text-white">Инженеры, мастера</td>
                      <td className="px-4 py-4 text-sm text-white">Высшее образование + стаж</td>
                      <td className="px-4 py-4 text-sm text-white">Каждые 3 года</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">V группа</td>
                      <td className="px-4 py-4 text-sm text-white">Ответственные за электрохозяйство</td>
                      <td className="px-4 py-4 text-sm text-white">Высшее образование + большой стаж</td>
                      <td className="px-4 py-4 text-sm text-white">Ежегодно</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Кто контролирует процесс:</h4>
              <ul>
                <li>Ростехнадзор (контролирует соблюдение требований электробезопасности)</li>
                <li>ГИТ (проверяет наличие групп по электробезопасности у работников)</li>
                <li>Энергонадзор Ростехнадзора (специализированный контроль электроустановок)</li>
                <li>Минэнерго России (общее регулирование в сфере электроэнергетики)</li>
              </ul>

              <h4>📋 Законодательная база:</h4>
              <ul>
                <li>Приказ Минтруда России от 15.12.2020 №903н "Об утверждении Правил по охране труда при эксплуатации электроустановок"</li>
                <li>Правила технической эксплуатации электроустановок потребителей (ПТЭЭП)</li>
                <li>Правила устройства электроустановок (ПУЭ)</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💡</span> Важные факты:
            </h3>
            <p className="text-white leading-relaxed">
              Электротравмы составляют только три процента от общего числа производственных травм, 
              но на них приходится двенадцать процентов смертельных случаев. 
              Это означает, что электричество представляет особую опасность, 
              требующую специальной подготовки персонала.
            </p>
          </div>
        </PremiumCard>

        {/* Штрафы */}
        <PremiumCard variant="default" className="mb-8 bg-red-500/10 border border-red-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💰</span> Штрафы за нарушения:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Отсутствие групп по электробезопасности: до 130 000 руб.</li>
              <li>• Допуск работника без группы: до 130 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
              <li>• Отключение электроснабжения при нарушениях</li>
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
              За 2500 рублей и 2-3 дня вы получаете официальные документы от Ростехнадзора, 
              которые действуют три года и полностью защищают от штрафов. 
              Это меньше, чем стоимость одного рабочего дня простоя предприятия 
              при приостановке деятельности из-за отсутствия документов по электробезопасности.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-blue-300 border-blue-300 hover:bg-blue-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-blue-300 border-blue-300 hover:bg-blue-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module10ElectricalSafety // ✅ ПРАВИЛЬНЫЙ экспорт для Electrical Safety