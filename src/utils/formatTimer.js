// formatTimer.js - Утилита для форматирования времени
// Путь: src/utils/formatTimer.js

/**
 * Форматирует время в секундах в читаемый формат
 * @param {number} seconds - Время в секундах
 * @param {Object} options - Опции форматирования
 * @returns {string} - Отформатированное время
 */
export const formatTimer = (seconds, options = {}) => {
  const {
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    separator = ':',
    padZeros = true,
    shortFormat = false
  } = options

  if (typeof seconds !== 'number' || seconds < 0) {
    return '00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []

  // Добавляем часы
  if (showHours && (hours > 0 || !shortFormat)) {
    parts.push(padZeros ? hours.toString().padStart(2, '0') : hours.toString())
  }

  // Добавляем минуты
  if (showMinutes) {
    parts.push(padZeros ? minutes.toString().padStart(2, '0') : minutes.toString())
  }

  // Добавляем секунды
  if (showSeconds) {
    parts.push(padZeros ? secs.toString().padStart(2, '0') : secs.toString())
  }

  return parts.join(separator)
}

/**
 * Форматирует время в естественном формате (например, "5 мин 30 сек")
 * @param {number} seconds - Время в секундах
 * @param {string} language - Язык ('ru' или 'en')
 * @returns {string} - Время в естественном формате
 */
export const formatTimeNatural = (seconds, language = 'ru') => {
  if (typeof seconds !== 'number' || seconds < 0) {
    return language === 'ru' ? '0 сек' : '0 sec'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const labels = {
    ru: {
      hours: ['час', 'часа', 'часов'],
      minutes: ['мин', 'мин', 'мин'],
      seconds: ['сек', 'сек', 'сек']
    },
    en: {
      hours: ['hour', 'hours', 'hours'],
      minutes: ['min', 'mins', 'mins'],
      seconds: ['sec', 'secs', 'secs']
    }
  }

  const getLabelForm = (num, forms) => {
    if (language === 'ru') {
      if (num % 10 === 1 && num % 100 !== 11) return forms[0]
      if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) return forms[1]
      return forms[2]
    }
    return num === 1 ? forms[0] : forms[1]
  }

  const parts = []
  const currentLabels = labels[language] || labels.ru

  if (hours > 0) {
    parts.push(`${hours} ${getLabelForm(hours, currentLabels.hours)}`)
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${getLabelForm(minutes, currentLabels.minutes)}`)
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} ${getLabelForm(secs, currentLabels.seconds)}`)
  }

  return parts.join(' ')
}

/**
 * Преобразует время из формата MM:SS или HH:MM:SS в секунды
 * @param {string} timeString - Строка времени
 * @returns {number} - Время в секундах
 */
export const parseTimeToSeconds = (timeString) => {
  if (typeof timeString !== 'string') return 0

  const parts = timeString.split(':').map(part => parseInt(part, 10) || 0)
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  
  return 0
}

/**
 * Получает цвет для таймера в зависимости от оставшегося времени
 * @param {number} timeLeft - Оставшееся время в секундах
 * @param {number} totalTime - Общее время в секундах
 * @returns {string} - CSS класс или цвет
 */
export const getTimerColor = (timeLeft, totalTime) => {
  const percentage = (timeLeft / totalTime) * 100
  
  if (percentage <= 10) return 'text-red-400' // Критическое время
  if (percentage <= 25) return 'text-orange-400' // Мало времени
  if (percentage <= 50) return 'text-yellow-400' // Среднее время
  return 'text-green-400' // Достаточно времени
}

/**
 * Проверяет, является ли время критичным
 * @param {number} timeLeft - Оставшееся время в секундах
 * @param {number} criticalThreshold - Порог критического времени в секундах
 * @returns {boolean} - true, если время критично
 */
export const isCriticalTime = (timeLeft, criticalThreshold = 300) => {
  return timeLeft <= criticalThreshold && timeLeft > 0
}

/**
 * Форматирует продолжительность для отображения в UI
 * @param {number} seconds - Время в секундах
 * @returns {Object} - Объект с отформатированными значениями
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return {
    hours,
    minutes,
    seconds: secs,
    formatted: formatTimer(seconds),
    natural: formatTimeNatural(seconds),
    short: hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м ${secs}с`
  }
}

export default formatTimer