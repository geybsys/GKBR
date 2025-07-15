// module2_nrs.jsx - Модуль "Национальный реестр специалистов"  
// Путь: src/blocks/module_core/module2_nrs.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contentApi } from '../../api/mockContentApi.js'

const Module2NRS = ({ userData, userProgress, onUpdateProgress }) => {
  const navigate = useNavigate()
  const [moduleData, setModuleData] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModuleData()
  }, [])

  const loadModuleData = async () => {
    try {
      setIsLoading(true)
      const data = await contentApi.fetchModuleContent(2)
      setModuleData(data)
    } catch (error) {
      console.error('Ошибка загрузки модуля НРС:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👥</div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля НРС...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-6">👥</div>
          <h1 className="text-3xl font-bold text-white mb-4">Модуль НРС</h1>
          <p className="text-green-200 mb-8">Национальный реестр специалистов</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-300 mb-3">🎯 Что изучим</h3>
              <ul className="text-green-100 space-y-2 text-left">
                <li>• Назначение НРС</li>
                <li>• Требования к специалистам</li>
                <li>• Процедуры включения в реестр</li>
                <li>• Ответственность специалистов</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">📊 Ключевые требования</h3>
              <ul className="text-blue-100 space-y-2 text-left">
                <li>• Образование по профилю</li>
                <li>• Стаж работы от 3 лет</li>
                <li>• Повышение квалификации</li>
                <li>• Сдача квалификационного экзамена</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/quiz/2')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              🧠 Пройти тест по НРС
            </button>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ← Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Module2NRS