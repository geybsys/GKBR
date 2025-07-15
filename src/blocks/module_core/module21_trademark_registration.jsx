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

const Module21TrademarkRegistration = () => { // ✅ ПРАВИЛЬНОЕ название для Trademark Registration
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
        const parsedModuleId = parseInt(moduleId) || 21
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
        moduleId: parseInt(moduleId) || 21,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Регистрация товарного знака изучена успешно!')
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
          <div className="w-20 h-20 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля...</h2>
          <p className="text-pink-200">Подготавливаем материалы по товарным знакам</p>
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
              ™️ Модуль 21: Товарный знак
            </h1>
            <p className="text-pink-200 text-lg mb-4">
              Регистрация товарного знака - защита интеллектуальной собственности
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-pink-300">
                Раздел {currentSection + 1} из {moduleData.sections?.length || 1}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-pink-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-right text-white">
              <div className="text-sm text-pink-200">Время изучения:</div>
              <div className="font-semibold">{formatTime(readingTime)}</div>
            </div>
          </div>
        </PremiumCard>

        {/* Контент модуля */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-pink-300 mb-6">
              {currentSectionData.title || 'Основы регистрации товарного знака'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое товарный знак?</h3>
              <p>
                Товарный знак — уникальное обозначение (логотип, название, символ), 
                которое отличает товары и услуги одной компании от других на рынке. 
                По сути, это "документ на собственность" вашего бренда, 
                который защищает от копирования и подделок.
              </p>
              
              <h4>📋 Виды товарных знаков:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Тип товарного знака</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Что защищает</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Примеры</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-pink-200 uppercase tracking-wider">Потери без защиты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Словесный</td>
                      <td className="px-4 py-4 text-sm text-white">Название бренда, слоганы</td>
                      <td className="px-4 py-4 text-sm text-white">"Coca-Cola", "Just Do It"</td>
                      <td className="px-4 py-4 text-sm text-white">Потеря уникальности названия</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Изобразительный</td>
                      <td className="px-4 py-4 text-sm text-white">Логотип, графические элементы</td>
                      <td className="px-4 py-4 text-sm text-white">Логотип Apple, Nike</td>
                      <td className="px-4 py-4 text-sm text-white">Копирование дизайна</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Комбинированный</td>
                      <td className="px-4 py-4 text-sm text-white">Название + логотип</td>
                      <td className="px-4 py-4 text-sm text-white">McDonald's с арками</td>
                      <td className="px-4 py-4 text-sm text-white">Полная потеря бренда</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Звуковой</td>
                      <td className="px-4 py-4 text-sm text-white">Мелодии, джинглы</td>
                      <td className="px-4 py-4 text-sm text-white">Рингтон Nokia</td>
                      <td className="px-4 py-4 text-sm text-white">Использование чужих мелодий</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Кто контролирует процесс:</h4>
              <ul>
                <li>Роспатент (регистрирует товарные знаки и ведет государственный реестр)</li>
                <li>ФИПС (проводит экспертизу заявок на товарные знаки)</li>
                <li>Суды по интеллектуальным правам (рассматривают споры о товарных знаках)</li>
                <li>ФТС России (контролирует ввоз товаров с нарушением прав на товарные знаки)</li>
              </ul>

              <h4>📅 Процедура регистрации товарного знака:</h4>
              <ul>
                <li><strong>Шаг 1:</strong> Поиск аналогичных товарных знаков (1-3 дня)</li>
                <li><strong>Шаг 2:</strong> Подготовка заявки и уплата пошлины (2-5 дней)</li>
                <li><strong>Шаг 3:</strong> Подача заявки в Роспатент</li>
                <li><strong>Шаг 4:</strong> Формальная экспертиза (1 месяц)</li>
                <li><strong>Шаг 5:</strong> Экспертиза по существу (6-12 месяцев)</li>
                <li><strong>Шаг 6:</strong> Публикация в бюллетене (3 месяца)</li>
                <li><strong>Шаг 7:</strong> Получение свидетельства</li>
              </ul>

              <h4>💰 Стоимость и сроки:</h4>
              <ul>
                <li>Государственная пошлина: 3 500 + 2 050 за каждый класс МКТУ</li>
                <li>Общий срок регистрации: 12-18 месяцев</li>
                <li>Срок действия: 10 лет с возможностью продления</li>
                <li>Стоимость "под ключ": 50 000 - 200 000 рублей</li>
              </ul>
            </div>
          </div>
        </PremiumCard>

        {/* Важная информация */}
        <PremiumCard variant="default" className="mb-8 bg-red-500/10 border border-red-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-red-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">⚠️</span> Последствия нарушения чужих товарных знаков:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Административная ответственность: штраф до 40 000 руб. (КоАП 14.10)</li>
              <li>• Гражданско-правовая ответственность: компенсация от 10 000 до 5 млн руб.</li>
              <li>• Уголовная ответственность при крупном ущербе: до 2 лет лишения свободы</li>
              <li>• Конфискация контрафактной продукции</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Реальные потери */}
        <PremiumCard variant="default" className="mb-8 bg-yellow-500/10 border border-yellow-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">💸</span> Реальные потери от отсутствия товарного знака:
            </h3>
            <ul className="text-white space-y-2">
              <li>• <strong>Конкурент зарегистрировал ваше название:</strong> Полный ребрендинг: 2-10 млн руб.</li>
              <li>• <strong>Подделка продукции под ваш бренд:</strong> Потеря 20-60% продаж</li>
              <li>• <strong>Невозможность выйти на новые рынки:</strong> Упущенная выгода: 10-100 млн руб.</li>
              <li>• <strong>Снижение стоимости при продаже бизнеса:</strong> Уменьшение цены на 30-50%</li>
            </ul>
          </div>
        </PremiumCard>

        {/* Преимущества */}
        <PremiumCard variant="default" className="mb-8 bg-green-500/10 border border-green-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">✅</span> Преимущества регистрации товарного знака:
            </h3>
            <ul className="text-white space-y-2">
              <li>• Исключительное право на использование обозначения</li>
              <li>• Защита от недобросовестной конкуренции</li>
              <li>• Возможность лицензирования и франчайзинга</li>
              <li>• Увеличение стоимости бизнеса при продаже</li>
              <li>• Право на возмещение ущерба при нарушениях</li>
              <li>• Защита при регистрации доменных имен</li>
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
              Товарный знак — это не расходы, а инвестиция в будущее вашего бренда. 
              Компании с зарегистрированными товарными знаками продаются на 30-50% дороже 
              аналогичных без защиты интеллектуальной собственности. Это единственный способ 
              превратить ваши маркетинговые вложения в защищенный актив, который будет 
              приносить прибыль десятилетиями. Соотношение затрат и рисков — 1:50!
            </p>
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-pink-300 border-pink-300 hover:bg-pink-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-pink-300 border-pink-300 hover:bg-pink-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-pink-600 hover:bg-pink-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module21TrademarkRegistration // ✅ ПРАВИЛЬНЫЙ экспорт для Trademark Registration