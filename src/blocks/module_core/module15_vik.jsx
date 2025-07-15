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

const Module15VIK = () => { // ✅ ПРАВИЛЬНОЕ название для VIK
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
        const parsedModuleId = parseInt(moduleId) || 15
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
        moduleId: parseInt(moduleId) || 15,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'ВИК - Визуальный и измерительный контроль изучен успешно!')
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
          <div className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-green-200">Подготавливаем материалы по ВИК</p>
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
              🔍 Модуль 15: ВИК
            </h1>
            <p className="text-green-200 text-lg mb-4">
              Визуальный и измерительный контроль - основы неразрушающего контроля
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-green-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-green-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-green-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-green-300 mb-6">
              {currentSectionData.title || 'Основы ВИК'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое ВИК?</h3>
              <p>
                Визуальный и измерительный контроль (ВИК) — базовый метод неразрушающего контроля, 
                заключающийся в осмотре поверхности объекта контроля невооруженным глазом 
                или с применением оптических приборов, а также в определении геометрических 
                размеров изделия с помощью различных измерительных инструментов.
              </p>
              
              <h4>📋 Уровни аттестации специалистов по ВИК:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Уровень</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Квалификация</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Образование/Опыт</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Срок действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">I уровень</td>
                      <td className="px-4 py-4 text-sm text-white">Дефектоскопист</td>
                      <td className="px-4 py-4 text-sm text-white">Среднее профессиональное + 3 месяца практики</td>
                      <td className="px-4 py-4 text-sm text-white">5 лет</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">II уровень</td>
                      <td className="px-4 py-4 text-sm text-white">Специалист</td>
                      <td className="px-4 py-4 text-sm text-white">Высшее образование + 1 год опыта</td>
                      <td className="px-4 py-4 text-sm text-white">5 лет</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">III уровень</td>
                      <td className="px-4 py-4 text-sm text-white">Эксперт</td>
                      <td className="px-4 py-4 text-sm text-white">Высшее образование + 4 года опыта</td>
                      <td className="px-4 py-4 text-sm text-white">5 лет</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Области применения ВИК:</h4>
              <ul>
                <li>Контроль сварных соединений</li>
                <li>Обследование строительных конструкций</li>
                <li>Контроль литых деталей</li>
                <li>Проверка механически обработанных поверхностей</li>
                <li>Контроль покрытий и защитных слоев</li>
                <li>Обследование трубопроводов</li>
                <li>Диагностика оборудования</li>
              </ul>

              <h4>🔍 Основные виды дефектов, выявляемых ВИК:</h4>
              <ul>
                <li><strong>Поверхностные трещины:</strong> Видимые нарушения сплошности материала</li>
                <li><strong>Поры и свищи:</strong> Полости на поверхности или сквозные отверстия</li>
                <li><strong>Непровары:</strong> Недостаточное сплавление металла в сварном шве</li>
                <li><strong>Подрезы:</strong> Углубления в основном металле вдоль границы шва</li>
                <li><strong>Наплывы:</strong> Избыточный металл, натекший на поверхность</li>
                <li><strong>Кратеры:</strong> Углубления в конце сварного шва</li>
                <li><strong>Деформации:</strong> Отклонения от заданной геометрии</li>
              </ul>

              <h4>📏 Измерительные инструменты для ВИК:</h4>
              <ul>
                <li>Штангенциркули и микрометры</li>
                <li>Шаблоны сварщика универсальные</li>
                <li>Линейки и рулетки</li>
                <li>Угломеры и уровни</li>
                <li>Щупы для измерения зазоров</li>
                <li>Лупы и оптические приборы</li>
                <li>Эндоскопы для труднодоступных мест</li>
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
              ВИК является обязательным этапом при контроле качества сварных соединений 
              на всех ответственных объектах. Около 80% дефектов можно выявить 
              именно методом визуального и измерительного контроля, что делает его 
              основополагающим в системе неразрушающего контроля.
            </p>
          </div>
        </PremiumCard>

        {/* Преимущества */}
        <PremiumCard variant="default" className="mb-8 bg-blue-500/10 border border-blue-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">✅</span> Преимущества метода ВИК:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Простота и доступность применения</li>
              <li>• Низкая стоимость проведения контроля</li>
              <li>• Высокая скорость выполнения</li>
              <li>• Возможность контроля в полевых условиях</li>
              <li>• Отсутствие вредного воздействия на персонал</li>
              <li>• Возможность 100% контроля изделий</li>
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
              Аттестация специалиста по ВИК стоит 15-25 тысяч рублей на 5 лет, 
              но дает возможность контролировать качество на всех этапах производства. 
              ВИК является обязательным требованием на объектах нефтегазовой отрасли, 
              атомной энергетики, мостостроения. Отсутствие аттестованных специалистов 
              исключает участие в крупных проектах.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-green-300 border-green-300 hover:bg-green-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-green-300 border-green-300 hover:bg-green-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module15VIK // ✅ ПРАВИЛЬНЫЙ экспорт для VIK