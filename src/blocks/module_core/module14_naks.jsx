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

const Module14NAKS = () => { // ✅ ПРАВИЛЬНОЕ название для NAKS
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
        const parsedModuleId = parseInt(moduleId) || 14
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
        moduleId: parseInt(moduleId) || 14,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'НАКС - Национальное агентство контроля сварки изучено успешно!')
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
          <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-purple-200">Подготавливаем материалы по НАКС</p>
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
              🔥 Модуль 14: НАКС
            </h1>
            <p className="text-purple-200 text-lg mb-4">
              Национальное агентство контроля сварки - аттестация сварщиков
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-purple-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-purple-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-purple-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">
              {currentSectionData.title || 'Основы аттестации НАКС'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое НАКС?</h3>
              <p>
                Национальное агентство контроля сварки (НАКС) — некоммерческая организация, 
                осуществляющая аттестацию сварщиков и специалистов сварочного производства, 
                аттестацию технологий сварки, а также сертификацию сварочных материалов 
                и оборудования в России.
              </p>
              
              <h4>📋 Виды аттестации в НАКС:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Тип аттестации</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Кто проходит</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Срок действия</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Стоимость</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Аттестация сварщиков</td>
                      <td className="px-4 py-4 text-sm text-white">Сварщики ручной и механизированной сварки</td>
                      <td className="px-4 py-4 text-sm text-white">2 года</td>
                      <td className="px-4 py-4 text-sm text-white">15-25 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Аттестация специалистов</td>
                      <td className="px-4 py-4 text-sm text-white">Инженеры-сварщики, мастера, контролеры</td>
                      <td className="px-4 py-4 text-sm text-white">5 лет</td>
                      <td className="px-4 py-4 text-sm text-white">25-50 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Аттестация технологий</td>
                      <td className="px-4 py-4 text-sm text-white">Предприятия для конкретных изделий</td>
                      <td className="px-4 py-4 text-sm text-white">Без ограничений</td>
                      <td className="px-4 py-4 text-sm text-white">100-500 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Аттестация лабораторий</td>
                      <td className="px-4 py-4 text-sm text-white">Лаборатории неразрушающего контроля</td>
                      <td className="px-4 py-4 text-sm text-white">3 года</td>
                      <td className="px-4 py-4 text-sm text-white">200-800 тыс. руб.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Области применения аттестации НАКС:</h4>
              <ul>
                <li>Магистральные нефте-, газо- и продуктопроводы</li>
                <li>Объекты атомной энергетики</li>
                <li>Тепловые электростанции</li>
                <li>Металлургические предприятия</li>
                <li>Химические и нефтехимические производства</li>
                <li>Судостроение и судоремонт</li>
                <li>Мостостроение</li>
                <li>Производство подъемных сооружений</li>
              </ul>

              <h4>🛡️ Уровни аттестации сварщиков:</h4>
              <ul>
                <li><strong>I уровень:</strong> Сварка в нижнем положении простых швов</li>
                <li><strong>II уровень:</strong> Сварка в нижнем и вертикальном положениях</li>
                <li><strong>III уровень:</strong> Сварка во всех пространственных положениях</li>
                <li><strong>IV уровень:</strong> Сварка особо ответственных конструкций</li>
              </ul>

              <h4>📋 Методы сварки в НАКС:</h4>
              <ul>
                <li><strong>Ручная дуговая сварка (РД):</strong> Покрытыми электродами</li>
                <li><strong>Аргонодуговая сварка (АД):</strong> Неплавящимся электродом в защитном газе</li>
                <li><strong>Полуавтоматическая сварка (ПА):</strong> Плавящимся электродом в защитном газе</li>
                <li><strong>Автоматическая сварка (АС):</strong> Под флюсом</li>
                <li><strong>Электрошлаковая сварка (ЭШС):</strong> Для толстостенных конструкций</li>
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
              Аттестация НАКС является обязательной для работы на особо опасных 
              и технически сложных объектах. Многие крупные заказчики требуют 
              наличие аттестации НАКС у сварочного персонала в обязательном порядке.
            </p>
          </div>
        </PremiumCard>

        {/* Преимущества */}
        <PremiumCard variant="default" className="mb-8 bg-emerald-500/10 border border-emerald-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-emerald-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">✅</span> Преимущества аттестации НАКС:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Доступ к работе на крупных промышленных объектах</li>
              <li>• Повышение квалификации и заработной платы сварщиков</li>
              <li>• Признание квалификации на федеральном уровне</li>
              <li>• Участие в тендерах крупных компаний</li>
              <li>• Повышение репутации предприятия</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Продажный аргумент */}
        <PremiumCard variant="default" className="mb-8 bg-purple-500/10 border border-purple-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💰</span> Продажный аргумент:
            </h3>
            <p className="text-white leading-relaxed italic">
              Аттестация сварщика в НАКС стоит 15-25 тысяч рублей на 2 года, 
              но открывает доступ к контрактам стоимостью в миллионы рублей. 
              Аттестованный сварщик получает зарплату на 30-50% выше, 
              а предприятие с аттестованным персоналом может участвовать 
              в тендерах Газпрома, Роснефти, Росатома и других крупных заказчиков.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-purple-300 border-purple-300 hover:bg-purple-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-purple-300 border-purple-300 hover:bg-purple-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module14NAKS // ✅ ПРАВИЛЬНЫЙ экспорт для NAKS