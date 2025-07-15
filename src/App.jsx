// App.jsx - Исправленная версия с роутами для квизов
// Путь: src/App.jsx

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// 🏗️ ОСНОВНЫЕ КОМПОНЕНТЫ ПЛАТФОРМЫ
import LoginScreen from './platform/LoginScreen'
import Dashboard from './platform/Dashboard'
import ModuleRoutes from './platform/ModuleRoutes'
import QuizScreen from './components/QuizScreen' // Импортируем QuizScreen

// 🎯 ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ
const App = () => {
  // 📊 СОСТОЯНИЕ ПРИЛОЖЕНИЯ
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [userProgress, setUserProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // 🔐 ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setIsLoading(true)
      
      // Проверяем существующую сессию
      const savedUser = localStorage.getItem('gkbr_user_data')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          if (user?.isLoggedIn) {
            setUserData(user)
            setIsAuthenticated(true)
            
            // Загружаем прогресс пользователя
            const savedProgress = localStorage.getItem(`gkbr_user_progress`)
            if (savedProgress) {
              setUserProgress(JSON.parse(savedProgress))
            }
          }
        } catch (error) {
          console.error('Ошибка парсинга данных пользователя:', error)
          localStorage.removeItem('gkbr_user_data')
        }
      }
      
      // Имитируем загрузку приложения
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.error('Ошибка инициализации приложения:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 🔑 ОБРАБОТКА ВХОДА
  const handleLogin = (user) => {
    setUserData(user)
    setIsAuthenticated(true)
    
    // Загружаем прогресс пользователя
    const savedProgress = localStorage.getItem('gkbr_user_progress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
    
    console.log('✅ Пользователь вошел в систему:', user)
  }

  // 🚪 ОБРАБОТКА ВЫХОДА
  const handleLogout = () => {
    setUserData(null)
    setIsAuthenticated(false)
    setUserProgress({})
    localStorage.removeItem('gkbr_user_data')
    console.log('👋 Пользователь вышел из системы')
  }

  // 📊 ОБНОВЛЕНИЕ ПРОГРЕССА
  const updateUserProgress = (moduleId, progressData) => {
    const newProgress = {
      ...userProgress,
      [moduleId]: progressData
    }
    
    setUserProgress(newProgress)
    
    // Сохраняем в localStorage
    localStorage.setItem('gkbr_user_progress', JSON.stringify(newProgress))
  }

  // 📱 ЭКРАН ЗАГРУЗКИ
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏗️</div>
          <h1 className="text-2xl font-bold text-white mb-2">GKBR Platform</h1>
          <p className="text-blue-200">Загрузка премиальной платформы обучения...</p>
          <div className="mt-6">
            <div className="w-48 h-2 bg-white/20 rounded-full mx-auto">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* 🔑 ЭКРАН ВХОДА */}
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <LoginScreen onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        {/* 🏠 ГЛАВНАЯ ПАНЕЛЬ */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard 
                userData={userData}
                userProgress={userProgress}
                onLogout={handleLogout}
                onUpdateProgress={updateUserProgress}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* 📚 МОДУЛИ ОБУЧЕНИЯ */}
        <Route 
          path="/module/*" 
          element={
            isAuthenticated ? (
              <ModuleRoutes 
                userData={userData}
                userProgress={userProgress}
                onUpdateProgress={updateUserProgress}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* 🧠 КВИЗЫ (НОВЫЙ РОУТ) */}
        <Route 
          path="/quiz/:moduleId" 
          element={
            isAuthenticated ? (
              <QuizScreen 
                userData={userData}
                userProgress={userProgress}
                onUpdateProgress={updateUserProgress}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* 🔄 ПЕРЕНАПРАВЛЕНИЯ */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </div>
  )
}

export default App

// 🔧 ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ

// Проверка состояния аутентификации
export const isUserAuthenticated = () => {
  try {
    const savedUser = localStorage.getItem('gkbr_user_data')
    if (!savedUser) return false
    
    const user = JSON.parse(savedUser)
    return user?.isLoggedIn === true
  } catch (error) {
    console.error('Ошибка проверки аутентификации:', error)
    return false
  }
}

// Получение данных текущего пользователя
export const getCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem('gkbr_user_data')
    if (!savedUser) return null
    
    const user = JSON.parse(savedUser)
    return user?.isLoggedIn ? user : null
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error)
    return null
  }
}

// Очистка всех данных пользователя
export const clearUserData = () => {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('gkbr_')) {
      localStorage.removeItem(key)
    }
  })
}

// Экспорт для использования в других компонентах
export { App }