// module1_sro.jsx - Модуль "Саморегулируемые организации"
// Путь: src/blocks/module_core/module1_sro.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contentApi } from '../../api/mockContentApi.js'

const Module1SRO = ({ userData, userProgress, onUpdateProgress }) => {
  const navigate = useNavigate()
  const [moduleData, setModuleData] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sectionProgress, setSectionProgress] = useState({})

  useEffect(() => {
    loadModuleData()
  }, [])

  const loadModuleData = async () => {
    try {
      setIsLoading(true)
      const data = await contentApi.fetchModuleContent(1)
      setModuleData(data)
      
      // Восстанавливаем прогресс
      const moduleProgress = userProgress?.moduleProgress?.[1]
      if (moduleProgress?.currentSection) {
        setCurrentSection(moduleProgress.currentSection)
      }
    } catch (error) {
      console.error('Ошибка загрузки модуля СРО:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const completeSection = (sectionIndex) => {
    const newProgress = {
      ...sectionProgress,
      [sectionIndex]: true
    }
    setSectionProgress(newProgress)
    
    // Сохраняем прогресс
    if (onUpdateProgress) {
      onUpdateProgress(1, {
        currentSection: sectionIndex + 1,
        completedSections: Object.keys(newProgress).map(Number),
        lastAccessedAt: new Date().toISOString()
      })
    }
  }

  const startQuiz = () => {
    navigate('/quiz/1')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📋</div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля СРО...</h2>
        </div>
      </div>
    )
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Модуль недоступен</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      
      {/* Хедер модуля */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{moduleData.title}</h1>
              <p className="text-blue-200">{moduleData.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="text-white font-semibold">Раздел {currentSection + 1}</div>
                <div className="text-blue-200">из {moduleData.sections.length}</div>
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                ← Выход
              </button>
            </div>
          </div>
          
          {/* Прогресс-бар */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection) / moduleData.sections.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Контент модуля */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Текущий раздел */}
        {moduleData.sections[currentSection] && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">
                {moduleData.sections[currentSection].type === 'theory' ? '📖' : '💡'}
              </span>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {moduleData.sections[currentSection].title}
                </h2>
                <p className="text-blue-200 mt-2">
                  ⏱️ {moduleData.sections[currentSection].estimatedTime} • 
                  {moduleData.sections[currentSection].type === 'theory' ? ' Теория' : ' Практика'}
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-gray-200 text-lg leading-relaxed">
                {moduleData.sections[currentSection].content}
              </div>
              
              {/* Дополнительный контент для СРО */}
              {currentSection === 0 && (
                <div className="mt-8 bg-blue-500/20 border border-blue-400/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">🎯 Ключевые понятия</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• <strong>СРО</strong> - некоммерческая организация для саморегулирования отрасли</li>
                    <li>• <strong>Компенсационный фонд</strong> - финансовые гарантии качества работ</li>
                    <li>• <strong>Стандарты СРО</strong> - требования к выполнению работ</li>
                    <li>• <strong>Контроль</strong> - проверка соблюдения стандартов членами СРО</li>
                  </ul>
                </div>
              )}

              {currentSection === 1 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-green-300 mb-3">✅ Основные функции</h4>
                    <ul className="text-green-100 space-y-1">
                      <li>• Разработка стандартов</li>
                      <li>• Контроль качества</li>
                      <li>• Страхование ответственности</li>
                      <li>• Ведение реестра членов</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-400/50 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-orange-300 mb-3">⚖️ Требования</h4>
                    <ul className="text-orange-100 space-y-1">
                      <li>• Минимум 100 членов</li>
                      <li>• Компенсационный фонд</li>
                      <li>• Система контроля</li>
                      <li>• Стандарты деятельности</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Навигация по разделу */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button 
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                ← Предыдущий раздел
              </button>

              <div className="text-center text-white">
                <button 
                  onClick={() => completeSection(currentSection)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  disabled={sectionProgress[currentSection]}
                >
                  {sectionProgress[currentSection] ? '✅ Завершено' : 'Завершить раздел'}
                </button>
              </div>

              {currentSection < moduleData.sections.length - 1 ? (
                <button 
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Следующий раздел →
                </button>
              ) : (
                <button 
                  onClick={startQuiz}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Пройти тест 🧠
                </button>
              )}
            </div>
          </div>
        )}

        {/* Обзор всех разделов */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📚 Разделы модуля</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moduleData.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  index === currentSection
                    ? 'bg-blue-600/50 border-blue-400 text-white'
                    : sectionProgress[index]
                    ? 'bg-green-600/30 border-green-400 text-green-100'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">
                    {section.type === 'theory' ? '📖' : '💡'}
                  </span>
                  {sectionProgress[index] && <span className="text-green-400">✅</span>}
                  {index === currentSection && <span className="text-blue-400">👁️</span>}
                </div>
                <h4 className="font-semibold mb-1">{section.title}</h4>
                <p className="text-sm opacity-75">{section.estimatedTime}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Module1SRO