import React, { useState, useEffect } from 'react'

// 🎨 Статичные бейджи — вынесены за компонент
const LEVEL_BADGES = {
  'Новичок': { color: 'bg-gray-500', icon: '🎯' },
  'Специалист': { color: 'bg-blue-500', icon: '⭐' },
  'Эксперт': { color: 'bg-purple-500', icon: '🚀' },
  'Лидер': { color: 'bg-yellow-500', icon: '👑' } // Изменён c gold на yellow — Tailwind читает
}

export const AnimatedProgress = ({
  progress = 65,
  module = 'СРО',
  points = 1250,
  level = 'Специалист',
  animated = true
}) => {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentPoints, setCurrentPoints] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress)
        setCurrentPoints(points)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setCurrentProgress(progress)
      setCurrentPoints(points)
    }
  }, [progress, points, animated])

  const getProgressColor = (value) => {
    if (value >= 80) return 'from-emerald-500 to-green-600'
    if (value >= 60) return 'from-blue-500 to-indigo-600'
    if (value >= 40) return 'from-amber-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const badge = LEVEL_BADGES[level] || LEVEL_BADGES['Новичок']

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 shadow-2xl border border-slate-700 max-w-md mx-auto">
      {/* Модуль */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">{module}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Модуль {module}</h3>
            <p className="text-slate-400 text-sm">Саморегулируемые организации</p>
          </div>
        </div>

        {/* Уровень */}
        <div className={`${badge.color} px-3 py-1 rounded-full flex items-center space-x-1`}>
          <span className="text-xs">{badge.icon}</span>
          <span className="text-white text-xs font-medium">{level}</span>
        </div>
      </div>

      {/* Прогресс */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 text-sm font-medium">Прогресс модуля</span>
          <span className="text-white font-bold">{currentProgress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden relative">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-1000 ease-out relative`}
            style={{ width: `${currentProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
          <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Баллы</div>
          <div className="text-white font-bold text-xl">
            {currentPoints.toLocaleString('ru-RU')}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
          <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Рейтинг</div>
          <div className="text-white font-bold text-xl flex items-center">
            #12<span className="text-green-400 text-sm ml-1">↗</span>
          </div>
        </div>
      </div>

      {/* Действие */}
      <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
        {progress >= 100 ? '✅ Пройти тест' : '📚 Продолжить обучение'}
      </button>

      {/* Мотивация */}
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-xs">
          {progress >= 80
            ? '🔥 Отличная работа! Вы почти у цели!'
            : progress >= 50
            ? '💪 Хороший темп! Продолжайте в том же духе!'
            : '🎯 Начните прямо сейчас и покажите результат!'}
        </p>
      </div>
    </div>
  )
}
