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

const Module11ElectricalLaboratory = () => { // ✅ ПРАВИЛЬНОЕ название для Electrical Laboratory
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
        const parsedModuleId = parseInt(moduleId) || 11
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
        moduleId: parseInt(moduleId) || 11,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Электролаборатория изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-teal-200">Подготавливаем материалы по электролаборатории</p>
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
              🔬 Модуль 11: Электролаборатория
            </h1>
            <p className="text-teal-200 text-lg mb-4">
              Электроизмерительная лаборатория - аккредитация и область применения
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-teal-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-teal-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-teal-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-teal-300 mb-6">
              {currentSectionData.title || 'Основы электролаборатории'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое электролаборатория?</h3>
              <p>
                Электроизмерительная лаборатория — аккредитованная организация, 
                выполняющая электрические измерения и испытания электрооборудования, 
                электроустановок и средств защиты с выдачей протоколов установленной формы.
              </p>
              
              <h4>📋 Основные виды измерений:</h4>
              <ul>
                <li>Измерение сопротивления изоляции электроустановок</li>
                <li>Проверка целостности цепей заземления и зануления</li>
                <li>Измерение сопротивления заземляющих устройств</li>
                <li>Проверка автоматических выключателей и УЗО</li>
                <li>Испытание средств индивидуальной защиты</li>
                <li>Измерение освещенности рабочих мест</li>
              </ul>

              <h4>⚠️ Кому необходимы услуги электролаборатории:</h4>
              <ul>
                <li>Промышленные предприятия</li>
                <li>Офисные и торговые центры</li>
                <li>Жилые дома и ТСЖ</li>
                <li>Строительные организации</li>
                <li>Энергетические компании</li>
                <li>Медицинские учреждения</li>
              </ul>

              <h4>📅 Периодичность измерений:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-teal-200 uppercase tracking-wider">Объект</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-teal-200 uppercase tracking-wider">Периодичность</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-teal-200 uppercase tracking-wider">Нормативный документ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Электроустановки до 1000 В</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в 3 года</td>
                      <td className="px-4 py-4 text-sm text-white">ПТЭЭП</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Электроустановки выше 1000 В</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в год</td>
                      <td className="px-4 py-4 text-sm text-white">ПТЭЭП</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Средства защиты</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в 6 месяцев</td>
                      <td className="px-4 py-4 text-sm text-white">Межотраслевые правила</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Передвижные установки</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в год</td>
                      <td className="px-4 py-4 text-sm text-white">ПОТ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>🔍 Требования к лаборатории:</h4>
              <ul>
                <li>Аккредитация в национальной системе аккредитации</li>
                <li>Поверенные средства измерений</li>
                <li>Квалифицированный персонал с аттестацией</li>
                <li>Соблюдение методик измерений</li>
                <li>Система менеджмента качества</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💡</span> Важно знать:
            </h3>
            <p className="text-white leading-relaxed">
              Протоколы измерений от неаккредитованных лабораторий не принимаются 
              контролирующими органами. Только аккредитованная электролаборатория 
              может выдать протоколы, имеющие юридическую силу.
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
              <li>• Отсутствие протоколов измерений: до 200 000 руб.</li>
              <li>• Просроченные измерения: до 130 000 руб.</li>
              <li>• Эксплуатация неисправного оборудования: до 200 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
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
              Измерения электролаборатории стоят 15-50 тысяч рублей раз в 1-3 года 
              в зависимости от объекта. Штраф за отсутствие протоколов — 200 000 рублей. 
              При пожаре или несчастном случае из-за неисправности электрооборудования 
              ответственность несет руководитель предприятия. Это не расходы, а страховка безопасности.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-teal-300 border-teal-300 hover:bg-teal-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-teal-300 border-teal-300 hover:bg-teal-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module11ElectricalLaboratory // ✅ ПРАВИЛЬНЫЙ экспорт для Electrical Laboratory