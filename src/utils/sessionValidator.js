// sessionValidator.js - Валидация пользовательских сессий
// Путь: src/utils/sessionValidator.js

// 🔐 ВАЛИДАТОР СЕССИЙ
export const sessionValidator = {
  // ✅ Валидация сессии пользователя
  async validate(userData) {
    try {
      // Проверка базовых полей
      if (!userData || !userData.id || !userData.sessionId) {
        return false
      }

      // Проверка времени жизни сессии (24 часа)
      if (userData.loginTime) {
        const loginTime = new Date(userData.loginTime)
        const now = new Date()
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
        
        if (hoursDiff > 24) {
          console.log('Сессия истекла:', hoursDiff, 'часов')
          return false
        }
      }

      // Проверка формата sessionId
      if (!this.isValidSessionId(userData.sessionId)) {
        return false
      }

      // Проверка роли пользователя
      if (!this.isValidRole(userData.role)) {
        return false
      }

      return true
    } catch (error) {
      console.error('Ошибка валидации сессии:', error)
      return false
    }
  },

  // 🆔 Проверка формата session ID
  isValidSessionId(sessionId) {
    // Формат: session_timestamp_randomstring
    const sessionPattern = /^session_\d+_[a-z0-9]+$/
    return sessionPattern.test(sessionId)
  },

  // 👤 Проверка валидности роли
  isValidRole(role) {
    const validRoles = [
      'user',
      'admin', 
      'superadmin_s',
      'moderator',
      'student',
      'instructor'
    ]
    return validRoles.includes(role)
  },

  // 🔄 Обновление времени последней активности
  updateLastActivity(userData) {
    if (userData) {
      userData.lastActivity = new Date().toISOString()
      localStorage.setItem('gkbr_user_data', JSON.stringify(userData))
    }
  },

  // 📊 Получение информации о сессии
  getSessionInfo(userData) {
    if (!userData) return null

    const loginTime = new Date(userData.loginTime)
    const now = new Date()
    const sessionDuration = now - loginTime
    const hoursActive = Math.floor(sessionDuration / (1000 * 60 * 60))
    const minutesActive = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60))

    return {
      isValid: this.validate(userData),
      sessionId: userData.sessionId,
      loginTime: userData.loginTime,
      lastActivity: userData.lastActivity,
      hoursActive,
      minutesActive,
      role: userData.role,
      userId: userData.id
    }
  },

  // 🧹 Очистка истекших сессий
  clearExpiredSessions() {
    try {
      const userData = localStorage.getItem('gkbr_user_data')
      if (userData) {
        const parsed = JSON.parse(userData)
        if (!this.validate(parsed)) {
          localStorage.removeItem('gkbr_user_data')
          localStorage.removeItem('gkbr_user_progress')
          localStorage.removeItem('gkbr_theme')
          console.log('Очищены истекшие данные сессии')
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Ошибка очистки сессий:', error)
      return false
    }
  },

  // 🔒 Создание новой сессии
  createSession(userCredentials) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sessionData = {
      id: userCredentials.username || userCredentials.id,
      name: userCredentials.name || userCredentials.username,
      role: userCredentials.role || 'user',
      sessionId: sessionId,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }

    return sessionData
  },

  // 🚪 Завершение сессии
  destroySession() {
    try {
      localStorage.removeItem('gkbr_user_data')
      localStorage.removeItem('gkbr_user_progress')
      // Оставляем настройки темы и звука
      console.log('Сессия завершена')
      return true
    } catch (error) {
      console.error('Ошибка завершения сессии:', error)
      return false
    }
  }
}

export default sessionValidator