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

const Module13MChSLicense = () => { // ✅ ПРАВИЛЬНОЕ название для MChS License
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
        const parsedModuleId = parseInt(moduleId) || 13
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
        moduleId: parseInt(moduleId) || 13,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Лицензия МЧС изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-orange-200">Подготавливаем материалы по лицензии МЧС</p>
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
              🚒 Модуль 13: Лицензия МЧС
            </h1>
            <p className="text-orange-200 text-lg mb-4">
              Лицензирование работ в области пожарной безопасности
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-orange-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-orange-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-orange-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-orange-300 mb-6">
              {currentSectionData.title || 'Основы лицензирования МЧС'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое лицензия МЧС?</h3>
              <p>
                Лицензия МЧС — официальное разрешение от Министерства по чрезвычайным ситуациям, 
                которое дает право компании выполнять работы, связанные с пожарной безопасностью: 
                монтаж пожарной сигнализации, установку систем пожаротушения, 
                огнезащитную обработку и другие специализированные работы.
              </p>
              
              <h4>📋 Виды работ, требующих лицензии МЧС:</h4>
              <ul>
                <li>Монтаж, техническое обслуживание и ремонт средств обеспечения пожарной безопасности зданий и сооружений</li>
                <li>Выполнение работ по огнезащитной обработке материалов, изделий и конструкций</li>
                <li>Производство работ по тушению пожаров в населенных пунктах, на производственных объектах и объектах инфраструктуры</li>
                <li>Обслуживание и ремонт технических средств, предназначенных для предупреждения и тушения пожаров</li>
                <li>Производство пожарно-технической продукции</li>
              </ul>

              <h4>⚠️ Лицензионные требования:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Требование</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Описание</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Документы</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Наличие специалистов</td>
                      <td className="px-4 py-4 text-sm text-white">Квалифицированные кадры с соответствующим образованием</td>
                      <td className="px-4 py-4 text-sm text-white">Дипломы, удостоверения</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Материально-техническая база</td>
                      <td className="px-4 py-4 text-sm text-white">Оборудование и инструменты для выполнения работ</td>
                      <td className="px-4 py-4 text-sm text-white">Паспорта, сертификаты</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Страхование</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательное страхование ответственности</td>
                      <td className="px-4 py-4 text-sm text-white">Страховой полис</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Система качества</td>
                      <td className="px-4 py-4 text-sm text-white">Процедуры контроля качества работ</td>
                      <td className="px-4 py-4 text-sm text-white">Регламенты, инструкции</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>📅 Процедура получения лицензии:</h4>
              <ul>
                <li><strong>Шаг 1:</strong> Подготовка документов и соответствие лицензионным требованиям</li>
                <li><strong>Шаг 2:</strong> Подача заявления в территориальный орган МЧС России</li>
                <li><strong>Шаг 3:</strong> Проведение документарной проверки (45 рабочих дней)</li>
                <li><strong>Шаг 4:</strong> Выездная проверка материально-технической базы</li>
                <li><strong>Шаг 5:</strong> Принятие решения о выдаче или об отказе в выдаче лицензии</li>
                <li><strong>Шаг 6:</strong> Получение лицензии (бессрочно действующей)</li>
              </ul>

              <h4>💰 Стоимость и сроки:</h4>
              <ul>
                <li>Государственная пошлина: 7 500 рублей</li>
                <li>Срок рассмотрения: 45 рабочих дней</li>
                <li>Срок действия: бессрочно</li>
                <li>Переоформление при изменениях: 15 рабочих дней</li>
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
              Выполнение работ по пожарной безопасности без лицензии МЧС является 
              административным правонарушением и влечет штрафы до 200 000 рублей 
              для юридических лиц. При этом все выполненные работы могут быть 
              признаны недействительными.
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
              <li>• Работы без лицензии: до 200 000 руб. для юридических лиц</li>
              <li>• Нарушение лицензионных требований: до 100 000 руб.</li>
              <li>• Приостановка деятельности: до 90 суток</li>
              <li>• Аннулирование лицензии при грубых нарушениях</li>
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
              Лицензия МЧС открывает доступ к многомиллиардному рынку работ по пожарной безопасности. 
              Стоимость получения лицензии составляет 200-500 тысяч рублей, 
              а средний контракт на оборудование объекта системами пожарной безопасности — 
              от 1 до 10 миллионов рублей. Лицензия окупается уже с первого крупного заказа.
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-orange-300 border-orange-300 hover:bg-orange-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-orange-300 border-orange-300 hover:bg-orange-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-orange-600 hover:bg-orange-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module13MChSLicense // ✅ ПРАВИЛЬНЫЙ экспорт для MChS License