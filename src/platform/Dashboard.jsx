// Dashboard.jsx - Главная панель управления с модулями
// Путь: src/platform/Dashboard.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import contentApi from '../api/mockContentApi.js'
import progressApi from '../api/mockProgressApi.js'

const Dashboard = ({ userData, userProgress, onLogout, onUpdateProgress }) => {
  const navigate = useNavigate()
  const [availableModules, setAvailableModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    completedModules: 0,
    totalScore: 0,
    level: 1,
    badges: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [userData])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Загружаем доступные модули
      const modules = await contentApi.fetchAvailableModules()
      setAvailableModules(modules)
      
      // Загружаем прогресс пользователя
      if (userData?.id) {
        const progress = await progressApi.fetchUserProgress(userData.id)
        setStats({
          completedModules: progress.completedModules?.length || 0,
          totalScore: progress.totalScore || 0,
          level: progress.level || 1,
          badges: progress.badges?.length || 0
        })
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных панели:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModuleClick = (moduleId) => {
    navigate(`/module/${moduleId}`)
  }

  const handleQuizClick = (moduleId) => {
    navigate(`/quiz/${moduleId}`)
  }

  const getModuleProgress = (moduleId) => {
    return userProgress?.moduleProgress?.[moduleId]?.percentage || 0
  }

  const isModuleCompleted = (moduleId) => {
    return userProgress?.completedModules?.includes(moduleId) || false
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Доброе утро'
    if (hour < 18) return 'Добрый день'
    return 'Добрый вечер'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏗️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка панели управления...</h2>
          <div className="mt-6">
            <div className="w-48 h-2 bg-white/20 rounded-full mx-auto">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      
      {/* Хедер */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Логотип и приветствие */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white">
                🏗️ ГК БИЗНЕС РЕШЕНИЕ
              </div>
              <div className="hidden md:block">
                <p className="text-blue-200">
                  {getGreeting()}, {userData?.fullName || 'Пользователь'}!
                </p>
              </div>
            </div>

            {/* Действия пользователя */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-white font-bold">{stats.totalScore}</div>
                  <div className="text-blue-200">баллов</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">Ур. {stats.level}</div>
                  <div className="text-blue-200">уровень</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">{stats.badges}</div>
                  <div className="text-blue-200">значков</div>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Статистика пользователя */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-white">{stats.completedModules}</div>
              <div className="text-blue-200 text-sm">Модулей завершено</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.totalScore}</div>
              <div className="text-blue-200 text-sm">Общий счет</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-purple-400">Ур. {stats.level}</div>
              <div className="text-blue-200 text-sm">Текущий уровень</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-orange-400">{stats.badges}</div>
              <div className="text-blue-200 text-sm">Достижений</div>
            </div>
          </div>
        </section>

        {/* Доступные модули */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Модули обучения</h2>
            <div className="text-blue-200 text-sm">
              {availableModules.length} модулей доступно
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => {
              const progress = getModuleProgress(module.id)
              const completed = isModuleCompleted(module.id)
              
              return (
                <div
                  key={module.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                >
                  
                  {/* Хедер модуля */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">
                      {module.id === 1 ? '📋' : module.id === 2 ? '👥' : '✅'}
                    </div>
                    {completed && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Завершен
                      </div>
                    )}
                  </div>

                  {/* Информация о модуле */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {module.title}
                  </h3>
                  
                  <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Метаданные */}
                  <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
                    <span className="bg-blue-500/20 px-2 py-1 rounded-full">
                      {module.difficulty}
                    </span>
                    <span>⏱️ {module.estimatedTime}</span>
                  </div>

                  {/* Прогресс */}
                  {progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-blue-200 mb-2">
                        <span>Прогресс</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Действия */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleModuleClick(module.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {progress > 0 ? 'Продолжить' : 'Начать изучение'}
                    </button>
                    
                    <button
                      onClick={() => handleQuizClick(module.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      🧠 Пройти тест
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Быстрые действия */}
        <section className="mt-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Быстрые действия</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/module/1')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              >
                📋 Изучить СРО
              </button>
              
              <button
                onClick={() => navigate('/quiz/1')}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              >
                🧠 Быстрый тест
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              >
                🔄 Обновить данные
              </button>
            </div>
          </div>
        </section>

        {/* Футер с информацией */}
        <footer className="mt-12 text-center text-blue-300 text-sm">
          <p>
            ГК БИЗНЕС РЕШЕНИЕ © 2025 • Платформа обучения и сертификации
          </p>
          <p className="mt-2">
            Пользователь: {userData?.fullName} • Роль: {userData?.role} • 
            Последний вход: {new Date().toLocaleString()}
          </p>
        </footer>
      </main>
    </div>
  )
}

export default Dashboard