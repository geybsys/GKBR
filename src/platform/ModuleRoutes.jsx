// ModuleRoutes.jsx - Маршрутизация модулей обучения
// Путь: src/platform/ModuleRoutes.jsx

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Основные модули (пока заглушки, будем создавать)
import Module1SRO from '../blocks/module_core/module1_sro.jsx'
import Module2NRS from '../blocks/module_core/module2_nrs.jsx'
import Module3NOK from '../blocks/module_core/module3_nok.jsx'

// Компоненты платформы
import ModuleLauncher from '../components/ModuleLauncher.jsx'
import QuizScreen from '../components/QuizScreen.jsx'

const ModuleRoutes = ({ userData, userProgress, onUpdateProgress }) => {
  
  return (
    <Routes>
      {/* 🚀 ЛАУНЧЕР МОДУЛЯ - превью перед стартом */}
      <Route 
        path="/:moduleId/launch" 
        element={
          <ModuleLauncher 
            userData={userData}
            userProgress={userProgress}
            onUpdateProgress={onUpdateProgress}
          />
        } 
      />

      {/* 🧠 КВИЗ МОДУЛЯ */}
      <Route 
        path="/:moduleId/quiz" 
        element={
          <QuizScreen 
            userData={userData}
            userProgress={userProgress}
            onUpdateProgress={onUpdateProgress}
          />
        } 
      />

      {/* 📚 МОДУЛЬ 1 - СРО */}
      <Route 
        path="/1/*" 
        element={
          <Module1SRO 
            userData={userData}
            userProgress={userProgress}
            onUpdateProgress={onUpdateProgress}
          />
        } 
      />

      {/* 📚 МОДУЛЬ 2 - НРС */}
      <Route 
        path="/2/*" 
        element={
          <Module2NRS 
            userData={userData}
            userProgress={userProgress}
            onUpdateProgress={onUpdateProgress}
          />
        } 
      />

      {/* 📚 МОДУЛЬ 3 - НОК */}
      <Route 
        path="/3/*" 
        element={
          <Module3NOK 
            userData={userData}
            userProgress={userProgress}
            onUpdateProgress={onUpdateProgress}
          />
        } 
      />

      {/* 🔄 РЕДИРЕКТЫ И ОБРАБОТКА */}
      
      {/* Перенаправление с /module/1 на /module/1/launch */}
      <Route 
        path="/1" 
        element={<Navigate to="/module/1/launch" replace />} 
      />
      <Route 
        path="/2" 
        element={<Navigate to="/module/2/launch" replace />} 
      />
      <Route 
        path="/3" 
        element={<Navigate to="/module/3/launch" replace />} 
      />

      {/* Обработка неизвестных модулей */}
      <Route 
        path="/unknown/:moduleId" 
        element={<ModuleNotFound />} 
      />

      {/* Перенаправление на Dashboard если модуль не указан */}
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />

      {/* Все остальные неизвестные пути */}
      <Route 
        path="*" 
        element={<ModuleNotFound />} 
      />
    </Routes>
  )
}

// ✅ КОМПОНЕНТ "МОДУЛЬ НЕ НАЙДЕН"
const ModuleNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-4">Модуль не найден</h1>
        <p className="text-red-200 mb-8">
          Запрашиваемый модуль обучения не существует или временно недоступен.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Вернуться назад
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            На главную страницу
          </button>
        </div>

        <div className="mt-8 text-sm text-red-300">
          <p>Доступные модули:</p>
          <div className="mt-2 space-y-1">
            <a href="/module/1/launch" className="block hover:text-white transition-colors">
              📋 Модуль 1: СРО
            </a>
            <a href="/module/2/launch" className="block hover:text-white transition-colors">
              👥 Модуль 2: НРС
            </a>
            <a href="/module/3/launch" className="block hover:text-white transition-colors">
              ✅ Модуль 3: НОК
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleRoutes