// auditLogger.js - Система аудита и логирования действий пользователей
// Путь: src/utils/auditLogger.js

// 📝 СИСТЕМА ЛОГИРОВАНИЯ
export const auditLogger = {
  // 📊 Основная функция логирования
  log(action, data = {}) {
    try {
      const logEntry = {
        id: this.generateLogId(),
        timestamp: new Date().toISOString(),
        action: action,
        data: data,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getCurrentSessionId()
      }

      // Сохранение в localStorage
      this.saveToStorage(logEntry)

      // Консольное логирование в режиме разработки
      if (this.isDevMode()) {
        console.log(`[AUDIT] ${action}:`, logEntry)
      }

      // Отправка на сервер (если нужно)
      if (this.shouldSendToServer(action)) {
        this.sendToServer(logEntry)
      }

    } catch (error) {
      console.error('Ошибка логирования:', error)
    }
  },

  // 🆔 Генерация уникального ID лога
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // 🔍 Получение текущего session ID
  getCurrentSessionId() {
    try {
      const userData = localStorage.getItem('gkbr_user_data')
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.sessionId || 'unknown'
      }
    } catch (error) {
      // Игнорируем ошибки
    }
    return 'no_session'
  },

  // 💾 Сохранение в localStorage
  saveToStorage(logEntry) {
    try {
      const existingLogs = this.getLogs()
      existingLogs.push(logEntry)

      // Ограничиваем количество логов (последние 1000)
      const maxLogs = 1000
      if (existingLogs.length > maxLogs) {
        existingLogs.splice(0, existingLogs.length - maxLogs)
      }

      localStorage.setItem('gkbr_audit_logs', JSON.stringify(existingLogs))
    } catch (error) {
      console.error('Ошибка сохранения лога:', error)
    }
  },

  // 📋 Получение всех логов
  getLogs() {
    try {
      const logs = localStorage.getItem('gkbr_audit_logs')
      return logs ? JSON.parse(logs) : []
    } catch (error) {
      console.error('Ошибка чтения логов:', error)
      return []
    }
  },

  // 🔍 Поиск логов по критериям
  searchLogs(criteria = {}) {
    const logs = this.getLogs()
    
    return logs.filter(log => {
      if (criteria.action && log.action !== criteria.action) return false
      if (criteria.userId && log.data.userId !== criteria.userId) return false
      if (criteria.sessionId && log.sessionId !== criteria.sessionId) return false
      if (criteria.dateFrom && new Date(log.timestamp) < new Date(criteria.dateFrom)) return false
      if (criteria.dateTo && new Date(log.timestamp) > new Date(criteria.dateTo)) return false
      return true
    })
  },

  // 📊 Статистика по логам
  getLogStats() {
    const logs = this.getLogs()
    const stats = {
      total: logs.length,
      byAction: {},
      byHour: {},
      lastActivity: null
    }

    logs.forEach(log => {
      // Статистика по действиям
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1

      // Статистика по часам
      const hour = new Date(log.timestamp).getHours()
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1

      // Последняя активность
      if (!stats.lastActivity || new Date(log.timestamp) > new Date(stats.lastActivity)) {
        stats.lastActivity = log.timestamp
      }
    })

    return stats
  },

  // 🧹 Очистка старых логов
  clearOldLogs(daysToKeep = 30) {
    try {
      const logs = this.getLogs()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const filteredLogs = logs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      )

      localStorage.setItem('gkbr_audit_logs', JSON.stringify(filteredLogs))
      
      return logs.length - filteredLogs.length // Количество удаленных
    } catch (error) {
      console.error('Ошибка очистки логов:', error)
      return 0
    }
  },

  // 🚀 Отправка на сервер
  async sendToServer(logEntry) {
    try {
      // Пока что только имитация
      // В реальной реализации здесь будет fetch к API
      if (this.isDevMode()) {
        console.log('[AUDIT] Отправка на сервер:', logEntry)
      }
    } catch (error) {
      console.error('Ошибка отправки лога на сервер:', error)
    }
  },

  // 🔧 Проверка режима разработки
  isDevMode() {
    return import.meta.env.DEV || localStorage.getItem('gkbr_debug_mode') === 'true'
  },

  // 📤 Определение, нужно ли отправлять на сервер
  shouldSendToServer(action) {
    const serverActions = [
      'user_login',
      'user_logout', 
      'module_completed',
      'quiz_completed',
      'certificate_generated',
      'security_violation'
    ]
    return serverActions.includes(action)
  },

  // 📱 Экспорт логов
  exportLogs(format = 'json') {
    const logs = this.getLogs()
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }
    
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Action', 'Session ID', 'User ID', 'URL']
      const rows = logs.map(log => [
        log.id,
        log.timestamp,
        log.action,
        log.sessionId,
        log.data.userId || '',
        log.url
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }

    return logs
  },

  // 🎯 Специализированные методы логирования
  
  // Вход пользователя
  logLogin(userData) {
    this.log('user_login', {
      userId: userData.id,
      role: userData.role,
      sessionId: userData.sessionId
    })
  },

  // Выход пользователя
  logLogout(userData, duration) {
    this.log('user_logout', {
      userId: userData?.id,
      sessionId: userData?.sessionId,
      sessionDuration: duration
    })
  },

  // Завершение модуля
  logModuleCompletion(moduleId, score, timeSpent) {
    this.log('module_completed', {
      moduleId,
      score,
      timeSpent,
      userId: this.getCurrentUserId()
    })
  },

  // Завершение квиза
  logQuizCompletion(moduleId, score, answers) {
    this.log('quiz_completed', {
      moduleId,
      score,
      totalQuestions: answers.length,
      userId: this.getCurrentUserId()
    })
  },

  // Ошибки приложения
  logError(error, context = {}) {
    this.log('app_error', {
      error: error.message || error,
      stack: error.stack,
      context,
      userId: this.getCurrentUserId()
    })
  },

  // Нарушения безопасности
  logSecurityViolation(violation, details = {}) {
    this.log('security_violation', {
      violation,
      details,
      userId: this.getCurrentUserId(),
      urgent: true
    })
  },

  // 👤 Получение текущего user ID
  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('gkbr_user_data')
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.id || 'unknown'
      }
    } catch (error) {
      // Игнорируем ошибки
    }
    return 'anonymous'
  }
}

export default auditLogger