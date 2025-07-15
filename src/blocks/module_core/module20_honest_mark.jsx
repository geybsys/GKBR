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

const Module20HonestMark = () => { // ✅ ПРАВИЛЬНОЕ название для Honest Mark
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
        const parsedModuleId = parseInt(moduleId) || 20
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
        moduleId: parseInt(moduleId) || 20,
        completedSections: completedSections
      })
      notify.success('Модуль завершен', 'Честный знак - система маркировки изучена успешно!')
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
          <p className="text-blue-200">Подготавливаем материалы по Честному знаку</p>
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
              🏷️ Модуль 20: Честный знак
            </h1>
            <p className="text-blue-200 text-lg mb-4">
              Национальная система маркировки товаров - подключение и работа
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
              {currentSectionData.title || 'Основы системы "Честный знак"'}
            </h2>
            
            <div className="prose prose-invert max-w-none text-white">
              <h3>🎯 Что такое "Честный знак"?</h3>
              <p>
                Система "Честный знак" — национальная система маркировки товаров специальными 
                кодами, которые позволяют отслеживать движение продукции от производителя 
                до покупателя. По сути, это "паспорт" для каждого товара, который защищает 
                от подделок и обеспечивает прозрачность торговли.
              </p>
              
              <h4>📋 Товарные группы, подлежащие обязательной маркировке:</h4>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Товарная группа</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Дата введения</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Статус</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Штраф за нарушение</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Табачная продукция</td>
                      <td className="px-4 py-4 text-sm text-white">01.03.2019</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательно</td>
                      <td className="px-4 py-4 text-sm text-white">До 1 млн руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Обувь</td>
                      <td className="px-4 py-4 text-sm text-white">01.07.2020</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательно</td>
                      <td className="px-4 py-4 text-sm text-white">До 500 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Парфюмерия</td>
                      <td className="px-4 py-4 text-sm text-white">01.10.2021</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательно</td>
                      <td className="px-4 py-4 text-sm text-white">До 500 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Молочная продукция</td>
                      <td className="px-4 py-4 text-sm text-white">01.09.2021</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательно</td>
                      <td className="px-4 py-4 text-sm text-white">До 300 тыс. руб.</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-4 text-sm text-white font-semibold">Лекарственные препараты</td>
                      <td className="px-4 py-4 text-sm text-white">01.01.2020</td>
                      <td className="px-4 py-4 text-sm text-white">Обязательно</td>
                      <td className="px-4 py-4 text-sm text-white">До 1 млн руб.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4>⚠️ Кто контролирует процесс:</h4>
              <ul>
                <li>ЦРПТ (оператор системы маркировки "Честный знак")</li>
                <li>ФНС России (контролирует участников оборота маркированных товаров)</li>
                <li>Росаккредитация (аккредитует эмитентов кодов маркировки)</li>
                <li>Роспотребнадзор (контролирует качество и безопасность маркированных товаров)</li>
              </ul>

              <h4>🔄 Схема движения товара в системе маркировки:</h4>
              <ul>
                <li><strong>Этап 1:</strong> Производитель заказывает коды маркировки</li>
                <li><strong>Этап 2:</strong> Нанесение кодов на товары (производство/импорт)</li>
                <li><strong>Этап 3:</strong> Ввод в оборот через информационную систему</li>
                <li><strong>Этап 4:</strong> Оптовая торговля с передачей данных</li>
                <li><strong>Этап 5:</strong> Розничная продажа с фискализацией</li>
                <li><strong>Этап 6:</strong> Вывод из оборота при продаже покупателю</li>
              </ul>

              <h4>💻 Минимальные технические требования:</h4>
              <ul>
                <li>Касса с поддержкой ФФД 1.05 и 2D-сканером</li>
                <li>Сканер штрих-кодов (ручной или стационарный)</li>
                <li>Программное обеспечение для работы с маркировкой</li>
                <li>Стабильное интернет-соединение</li>
                <li>Принтер этикеток (для производителей и оптовиков)</li>
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
              Без подключения к системе "Честный знак" нельзя продавать маркированные товары. 
              Нарушение требований маркировки влечет штрафы до 1 млн рублей 
              и конфискацию товаров. Система контролируется автоматически — 
              каждая операция фиксируется в режиме реального времени.
            </p>
          </div>
        </PremiumCard>

        {/* Этапы подключения */}
        <PremiumCard variant="default" className="mb-8 bg-green-500/10 border border-green-400/30">
          <div className="text-white">
            <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">🚀</span> Этапы технического подключения:
            </h3>
            <ul className="text-white space-y-2">
              <li>• <strong>Регистрация в ЦРПТ:</strong> Подача заявки, получение доступа (3-10 дней)</li>
              <li>• <strong>Настройка оборудования:</strong> Программирование касс и сканеров (1-5 дней)</li>
              <li>• <strong>Интеграция с ИС:</strong> Подключение к информационной системе (2-14 дней)</li>
              <li>• <strong>Тестирование:</strong> Проверка работы в тестовой среде (1-3 дня)</li>
              <li>• <strong>Обучение персонала:</strong> Подготовка сотрудников к работе (1-2 дня)</li>
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
              Подключение к системе "Честный знак" стоит 50-200 тысяч рублей в зависимости от сложности, 
              но позволяет продолжать легальную торговлю маркированными товарами. 
              Штраф за отсутствие подключения — до 1 млн рублей плюс конфискация всего товара. 
              Один день работы без системы может стоить больше, чем полное техническое подключение.
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

export default Module20HonestMark // ✅ ПРАВИЛЬНЫЙ экспорт для Honest Mark