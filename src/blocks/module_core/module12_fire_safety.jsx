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

const Module12FireSafety = () => { // ✅ ПРАВИЛЬНОЕ название для Fire Safety
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
        const parsedModuleId = parseInt(moduleId) || 12
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
        moduleId: parseInt(moduleId) || 12,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Пожарная безопасность изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-red-200">Подготавливаем материалы по пожарной безопасности</p>
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
              🔥 Модуль 12: Пожарная безопасность
            </h1>
            <p className="text-red-200 text-lg mb-4">
              Обеспечение пожарной безопасности объектов и обучение персонала
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-red-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-red-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-red-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-red-300 mb-6">
              {currentSectionData.title || 'Основы пожарной безопасности'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое пожарная безопасность?</h3>
              <p>
                Пожарная безопасность — комплекс мер по предотвращению пожаров 
                и обеспечению безопасности людей при их возникновении. 
                Включает обучение персонала, разработку планов эвакуации, 
                обеспечение первичными средствами пожаротушения и соблюдение противопожарного режима.
              </p>
              
              <h4>📋 Законодательная база:</h4>
              <ul>
                <li>Федеральный закон от 21.12.1994 №69-ФЗ "О пожарной безопасности"</li>
                <li>Постановление Правительства РФ от 16.09.2020 №1479 "Об утверждении Правил противопожарного режима в РФ"</li>
                <li>Приказ МЧС России от 05.04.2017 №167 "Об утверждении Порядка организации и проведения учений и тренировок по гражданской обороне"</li>
                <li>Федеральный закон от 22.07.2008 №123-ФЗ "Технический регламент о требованиях пожарной безопасности"</li>
              </ul>

              <h4>⚠️ Виды обучения по пожарной безопасности:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Категория персонала</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Вид обучения</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Периодичность</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Продолжительность</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Руководители организаций</td>
                      <td className="px-4 py-4 text-sm text-white">Пожарно-технический минимум</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в 3 года</td>
                      <td className="px-4 py-4 text-sm text-white">72 часа</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Ответственные за пожарную безопасность</td>
                      <td className="px-4 py-4 text-sm text-white">Специальная программа</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в 3 года</td>
                      <td className="px-4 py-4 text-sm text-white">40 часов</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Работники организаций</td>
                      <td className="px-4 py-4 text-sm text-white">Противопожарный инструктаж</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в год</td>
                      <td className="px-4 py-4 text-sm text-white">2-8 часов</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white">Работники взрывопожароопасных производств</td>
                      <td className="px-4 py-4 text-sm text-white">Специальная подготовка</td>
                      <td className="px-4 py-4 text-sm text-white">1 раз в год</td>
                      <td className="px-4 py-4 text-sm text-white">28 часов</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>🔥 Основные требования пожарной безопасности:</h4>
              <ul>
                <li>Обеспечение свободных путей эвакуации</li>
                <li>Наличие и исправность первичных средств пожаротушения</li>
                <li>Система пожарной сигнализации и оповещения</li>
                <li>Планы эвакуации на каждом этаже</li>
                <li>Регулярные тренировки по эвакуации</li>
                <li>Соблюдение противопожарного режима</li>
              </ul>

              <h4>🚨 Кто контролирует соблюдение:</h4>
              <ul>
                <li>МЧС России (государственный пожарный надзор)</li>
                <li>Территориальные подразделения МЧС</li>
                <li>Прокуратура (надзор за соблюдением законодательства)</li>
                <li>Трудовая инспекция (в рамках охраны труда)</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💡</span> Важно помнить:
            </h3>
            <p className="text-white leading-relaxed">
              В офисах тоже случаются пожары — короткое замыкание в электропроводке, 
              перегрузка сети, неисправность оргтехники. В офисных зданиях обычно работает много людей, 
              и при пожаре важно правильно организовать эвакуацию. МЧС не делает скидку 
              на "безопасные" офисы — требования и штрафы одинаковы для всех.
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
              <li>• Отсутствие обучения по пожарной безопасности: до 200 000 руб.</li>
              <li>• Нарушение требований пожарной безопасности: до 400 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
              <li>• При пожаре с жертвами: уголовная ответственность</li>
              <li>• Блокировка путей эвакуации: до 150 000 руб.</li>
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
              Пожарная безопасность — это не область, где стоит экономить. 
              Цена ошибки слишком высока — человеческие жизни, уничтожение бизнеса, уголовная ответственность. 
              За стоимость одного штрафа МЧС мы обеспечиваем полную пожарную безопасность 
              вашего объекта на несколько лет вперед. Это не расход, а защита самого ценного — 
              жизни людей и результатов вашего труда.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-red-300 border-red-300 hover:bg-red-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-red-300 border-red-300 hover:bg-red-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module12FireSafety // ✅ ПРАВИЛЬНЫЙ экспорт для Fire Safety