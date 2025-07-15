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

const Module9IndustrialSafety = () => { // ✅ ПРАВИЛЬНОЕ название для Industrial Safety
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
        const parsedModuleId = parseInt(moduleId) || 9
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
        moduleId: parseInt(moduleId) || 9,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Промышленная безопасность изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-cyan-200">Подготавливаем материалы по промышленной безопасности</p>
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
              ⚡ Модуль 9: Промышленная безопасность
            </h1>
            <p className="text-cyan-200 text-lg mb-4">
              Аттестация по промышленной безопасности Ростехнадзора
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-cyan-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-cyan-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-cyan-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">
              {currentSectionData.title || 'Основы промышленной безопасности'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое промышленная безопасность?</h3>
              <p>
                Промышленная безопасность — состояние защищенности жизненно важных интересов 
                личности и общества от аварий на опасных производственных объектах (ОПО) 
                и последствий указанных аварий.
              </p>
              
              <h4>📋 Области аттестации Ростехнадзора:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Индекс</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Область аттестации</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-cyan-200 uppercase tracking-wider">Для кого обязательна</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">А.1</td>
                      <td className="px-4 py-4 text-sm text-white">Общие требования промышленной безопасности</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательна для всех</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Б.8</td>
                      <td className="px-4 py-4 text-sm text-white">Оборудование, работающее под давлением</td>
                      <td className="px-4 py-4 text-sm text-white">Котлы, сосуды, трубопроводы</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Б.9</td>
                      <td className="px-4 py-4 text-sm text-white">Подъемные сооружения</td>
                      <td className="px-4 py-4 text-sm text-white">Краны, лифты, подъемники</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Б.7</td>
                      <td className="px-4 py-4 text-sm text-white">Газораспределение и газопотребление</td>
                      <td className="px-4 py-4 text-sm text-white">Газовые сети, котельные</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Кто подлежит аттестации:</h4>
              <ul>
                <li>Руководители организаций, эксплуатирующих ОПО</li>
                <li>Заместители руководителей по производству</li>
                <li>Главные инженеры и технические директора</li>
                <li>Начальники производственных подразделений</li>
                <li>Специалисты служб по надзору за безопасной эксплуатацией ОПО</li>
              </ul>

              <h4>📅 Сроки аттестации:</h4>
              <ul>
                <li>Периодичность: каждые 5 лет</li>
                <li>Внеочередная: при изменении нормативных требований</li>
                <li>После назначения на должность: в течение 1 месяца</li>
                <li>Действие удостоверения: до указанной даты</li>
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
              На любые узкие направления необходимо сначала аттестоваться по направлению 
              "А1 – общие правила". Без действующей аттестации на "общие правила" 
              другие аттестации по промышленной безопасности будут недействительны.
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
              <li>• Отсутствие аттестации: 200 000 - 400 000 руб.</li>
              <li>• Допуск неаттестованного специалиста: 400 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
              <li>• При аварии: уголовная ответственность руководителя</li>
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
              Аттестация по промышленной безопасности стоит 10-15 тысяч рублей на 5 лет. 
              Штраф за отсутствие аттестации — 400 000 рублей. Одна авария на ОПО 
              может привести к многомиллионным убыткам и уголовной ответственности. 
              По статистике Ростехнадзора, более 70% аварий происходят из-за человеческого фактора.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-cyan-300 border-cyan-300 hover:bg-cyan-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-cyan-300 border-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module9IndustrialSafety // ✅ ПРАВИЛЬНЫЙ экспорт для Industrial Safety