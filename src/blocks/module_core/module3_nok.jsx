// module3_nok.jsx - Модуль "Национальная оценка квалификаций"
// Путь: src/blocks/module_core/module3_nok.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contentApi } from '../../api/mockContentApi.js'

const Module3NOK = ({ userData, userProgress, onUpdateProgress }) => {
  const navigate = useNavigate()
  const [moduleData, setModuleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModuleData()
  }, [])

  const loadModuleData = async () => {
    try {
      setIsLoading(true)
      const data = await contentApi.fetchModuleContent(3)
      setModuleData(data)
    } catch (error) {
      console.error('Ошибка загрузки модуля НОК:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка модуля НОК...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">Модуль НОК</h1>
          <p className="text-purple-200 mb-8">Национальная оценка квалификаций</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">🎯 Основы НОК</h3>
              <ul className="text-purple-100 space-y-2 text-left">
                <li>• Система оценки квалификаций</li>
                <li>• Профессиональные стандарты</li>
                <li>• Независимая оценка</li>
                <li>• Сертификация специалистов</li>
              </ul>
            </div>
            
            <div className="bg-pink-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-300 mb-3">📋 Процедуры</h3>
              <ul className="text-pink-100 space-y-2 text-left">
                <li>• Подача заявления</li>
                <li>• Прохождение оценки</li>
                <li>• Получение свидетельства</li>
                <li>• Подтверждение квалификации</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">⚠️ Важно знать</h3>
            <p className="text-yellow-100 leading-relaxed">
              НОК обеспечивает единые подходы к оценке квалификации независимо от способа ее получения. 
              Система позволяет подтверждать профессиональные компетенции и повышать качество кадрового потенциала.
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/quiz/3')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              🧠 Пройти тест по НОК
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

export default Module3NOK