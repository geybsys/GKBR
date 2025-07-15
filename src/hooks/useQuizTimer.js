// useQuizTimer.js - Хук для управления таймером квизов
// Путь: src/hooks/useQuizTimer.js

import { useState, useEffect, useRef } from 'react'

export const useQuizTimer = (initialSeconds = 1800) => { // 30 минут по умолчанию
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pausedTimeRef = useRef(0)

  // ✅ СТАРТ ТАЙМЕРА
  const startTimer = () => {
    if (!isRunning && !isPaused) {
      setIsRunning(true)
      startTimeRef.current = Date.now()
    } else if (isPaused) {
      setIsRunning(true)
      setIsPaused(false)
      // Корректируем стартовое время на время паузы
      startTimeRef.current = Date.now() - pausedTimeRef.current
    }
  }

  // ✅ ПАУЗА ТАЙМЕРА
  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      setIsPaused(true)
      pausedTimeRef.current = Date.now() - startTimeRef.current
    }
  }

  // ✅ ОСТАНОВКА ТАЙМЕРА
  const stopTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // ✅ СБРОС ТАЙМЕРА
  const resetTimer = (newTime = initialSeconds) => {
    stopTimer()
    setTimeLeft(newTime)
    pausedTimeRef.current = 0
  }

  // ✅ ДОБАВИТЬ ВРЕМЯ
  const addTime = (seconds) => {
    setTimeLeft(prev => prev + seconds)
  }

  // ✅ ПОЛУЧИТЬ ПРОШЕДШЕЕ ВРЕМЯ
  const getElapsedTime = () => {
    if (!startTimeRef.current) return 0
    
    if (isRunning) {
      return Math.floor((Date.now() - startTimeRef.current) / 1000)
    } else if (isPaused) {
      return Math.floor(pausedTimeRef.current / 1000)
    }
    
    return 0
  }

  // ✅ ПОЛУЧИТЬ ПРОГРЕСС В ПРОЦЕНТАХ
  const getProgress = () => {
    return ((initialSeconds - timeLeft) / initialSeconds) * 100
  }

  // ✅ ПРОВЕРКА КРИТИЧЕСКОГО ВРЕМЕНИ
  const isCriticalTime = () => {
    return timeLeft <= 300 // Последние 5 минут
  }

  const isWarningTime = () => {
    return timeLeft <= 600 // Последние 10 минут
  }

  // ✅ ОСНОВНОЙ ЭФФЕКТ ТАЙМЕРА
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Очистка при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // ✅ ЭФФЕКТ ДЛЯ ПРЕДУПРЕЖДЕНИЙ
  useEffect(() => {
    // Можно добавить звуковые уведомления или другие эффекты
    if (timeLeft === 300) {
      console.log('⚠️ Осталось 5 минут!')
    } else if (timeLeft === 60) {
      console.log('🚨 Осталось 1 минута!')
    } else if (timeLeft === 0) {
      console.log('⏰ Время вышло!')
    }
  }, [timeLeft])

  return {
    // Основное состояние
    timeLeft,
    isRunning,
    isPaused,
    
    // Методы управления
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    addTime,
    
    // Вспомогательные методы
    getElapsedTime,
    getProgress,
    isCriticalTime,
    isWarningTime,
    
    // Состояния для UI
    isTimeUp: timeLeft === 0,
    progressPercentage: getProgress()
  }
}

export default useQuizTimer