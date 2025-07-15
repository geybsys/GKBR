// SecurityGate.jsx - Компонент защиты маршрутов от неавторизованного доступа
// Путь: src/components/SecurityGate.jsx

import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { sessionValidator } from '../utils/sessionValidator'
import { auditLogger } from '../utils/auditLogger'

// 🛡️ КОМПОНЕНТ ЗАЩИТЫ МАРШРУТОВ
const SecurityGate = ({ 
  children, 
  isAuthenticated, 
  userData, 
  onLogout,
  redirectTo = '/login' 
}) => {
  const [isValidating, setIsValidating] = useState(true)
  const [securityCheck, setSecurityCheck] = useState(null)
  const location = useLocation()

  // 🔍 Валидация при изменении состояния
  useEffect(() => {
    validateSecurity()
  }, [isAuthenticated, userData, location.pathname])

  // 🔐 Основная функция валидации безопасности
  const validateSecurity = async () => {
    try {
      setIsValidating(true)

      // Базовая проверка аутентификации
      if (!isAuthenticated) {
        setSecurityCheck('not_authenticated')
        setIsValidating(false)
        return
      }

      // Проверка валидности сессии
      if (userData) {
        const isValidSession = await sessionValidator.validate(userData)
        
        if (!isValidSession) {
          // Логируем нарушение безопасности
          auditLogger.logSecurityViolation('invalid_session', {
            reason: 'Session validation failed',
            userId: userData.id,
            path: location.pathname
          })

          // Принудительный выход
          if (onLogout) {
            onLogout()
          }
          
          setSecurityCheck('invalid_session')
          setIsValidating(false)
          return
        }

        // Обновляем время последней активности
        sessionValidator.updateLastActivity(userData)
      }

      // Проверка подозрительной активности
      if (detectSuspiciousActivity(userData)) {
        auditLogger.logSecurityViolation('suspicious_activity', {
          userId: userData?.id,
          path: location.pathname,
          userAgent: navigator.userAgent
        })
        
        setSecurityCheck('suspicious_activity')
        setIsValidating(false)
        return
      }

      // Все проверки пройдены
      setSecurityCheck('valid')
      setIsValidating(false)

    } catch (error) {
      console.error('Ошибка валидации безопасности:', error)
      auditLogger.logError(error, { 
        context: 'SecurityGate validation',
        path: location.pathname 
      })
      
      setSecurityCheck('error')
      setIsValidating(false)
    }
  }

  // 🚨 Обнаружение подозрительной активности
  const detectSuspiciousActivity = (userData) => {
    try {
      // Проверка на множественные сессии
      if (detectMultipleSessions(userData)) {
        return true
      }

      // Проверка на слишком быстрые переходы
      if (detectRapidNavigation()) {
        return true
      }

      // Проверка на аномальное поведение
      if (detectAnomalousPatterns(userData)) {
        return true
      }

      return false
    } catch (error) {
      console.error('Ошибка детекции подозрительной активности:', error)
      return false
    }
  }

  // 👥 Обнаружение множественных сессий
  const detectMultipleSessions = (userData) => {
    // Простая проверка на основе времени создания сессии
    // В реальном приложении здесь была бы проверка с сервером
    const sessionAge = Date.now() - new Date(userData?.loginTime).getTime()
    const maxSessionAge = 24 * 60 * 60 * 1000 // 24 часа
    
    return sessionAge > maxSessionAge
  }

  // ⚡ Обнаружение слишком быстрой навигации
  const detectRapidNavigation = () => {
    const lastNavigationTime = sessionStorage.getItem('last_navigation_time')
    const currentTime = Date.now()
    
    if (lastNavigationTime) {
      const timeDiff = currentTime - parseInt(lastNavigationTime)
      sessionStorage.setItem('last_navigation_time', currentTime.toString())
      
      // Если переходы слишком быстрые (менее 100мс)
      return timeDiff < 100
    }
    
    sessionStorage.setItem('last_navigation_time', currentTime.toString())
    return false
  }

  // 🤖 Обнаружение аномальных паттернов
  const detectAnomalousPatterns = (userData) => {
    // Проверка на bot-подобное поведение
    const userAgent = navigator.userAgent.toLowerCase()
    const suspiciousAgents = ['bot', 'crawler', 'spider', 'scraper']
    
    return suspiciousAgents.some(agent => userAgent.includes(agent))
  }

  // 🔄 Обработчик принудительного выхода
  const handleForceLogout = () => {
    sessionValidator.destroySession()
    if (onLogout) {
      onLogout()
    }
  }

  // 🎬 РЕНДЕРИНГ ЭКРАНОВ БЕЗОПАСНОСТИ

  // Экран загрузки валидации
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-800">Проверка безопасности...</h2>
          <p className="text-gray-600 text-sm">Валидация доступа</p>
        </div>
      </div>
    )
  }

  // Экран нарушения безопасности
  if (securityCheck === 'suspicious_activity') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">Подозрительная активность</h1>
          <p className="text-red-600 mb-6">
            Обнаружена необычная активность в вашей сессии. 
            Для безопасности доступ был ограничен.
          </p>
          <button 
            onClick={handleForceLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
          >
            Войти заново
          </button>
        </div>
      </div>
    )
  }

  // Экран невалидной сессии
  if (securityCheck === 'invalid_session') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-orange-800 mb-4">Сессия истекла</h1>
          <p className="text-orange-600 mb-6">
            Ваша сессия истекла или стала невалидной. 
            Пожалуйста, войдите в систему заново.
          </p>
          <button 
            onClick={handleForceLogout}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all"
          >
            Войти заново
          </button>
        </div>
      </div>
    )
  }

  // Экран ошибки
  if (securityCheck === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка системы безопасности</h1>
          <p className="text-gray-600 mb-6">
            Произошла ошибка при проверке безопасности. 
            Попробуйте перезагрузить страницу.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all"
            >
              Перезагрузить
            </button>
            <button 
              onClick={handleForceLogout}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Войти заново
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Редирект для неаутентифицированных пользователей
  if (securityCheck === 'not_authenticated') {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  // Успешная валидация - показываем контент
  if (securityCheck === 'valid') {
    return <>{children}</>
  }

  // Fallback
  return <Navigate to={redirectTo} replace />
}

export default SecurityGate