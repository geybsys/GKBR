// QuizScreen.jsx - Премиальная система квизов с таймером и геймификацией
// Путь: src/components/QuizScreen.jsx

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Хуки и утилиты
import { useQuizTimer } from '../hooks/useQuizTimer.js'
import { shuffleArray } from '../utils/shuffleArray.js'
import { formatTimer } from '../utils/formatTimer.js'

// API (заглушки)
import { contentApi } from '../api/mockContentApi.js'
import { progressApi } from '../api/mockProgressApi.js'

const QuizScreen = ({ userData, userProgress, onUpdateProgress }) => {
  // ✅ ПАРАМЕТРЫ И НАВИГАЦИЯ
  const { moduleId } = useParams()
  const navigate = useNavigate()
  
  // ✅ СОСТОЯНИЕ КВИЗА
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [error, setError] = useState(null)
  
  // ✅ РЕЗУЛЬТАТЫ И СТАТИСТИКА
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState([])
  
  // ✅ ТАЙМЕР И ИНТЕРАКТИВНОСТЬ
  const { timeLeft, startTimer, stopTimer, resetTimer } = useQuizTimer(30 * 60) // 30 минут
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [totalQuizTime, setTotalQuizTime] = useState(0)
  
  // ✅ ССЫЛКИ
  const questionRef = useRef(null)

  // ✅ ИНИЦИАЛИЗАЦИЯ КВИЗА
  useEffect(() => {
    if (moduleId) {
      loadQuizData()
    }
  }, [moduleId])

  // ✅ AUTO-SUBMIT ПРИ ОКОНЧАНИИ ВРЕМЕНИ
  useEffect(() => {
    if (timeLeft === 0 && quizStarted && !showResults) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizStarted, showResults])

  // ✅ ЗАГРУЗКА ДАННЫХ КВИЗА
  const loadQuizData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Загружаем вопросы для модуля
      const quizData = await contentApi.fetchQuizQuestions(moduleId)
      
      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error(`Вопросы для модуля ${moduleId} не найдены`)
      }
      
      // Перемешиваем вопросы и варианты ответов
      const shuffledQuestions = shuffleArray(quizData.questions).map(question => ({
        ...question,
        options: shuffleArray(question.options || [])
      }))
      
      setQuestions(shuffledQuestions)
      
      console.log(`✅ Загружено ${shuffledQuestions.length} вопросов для модуля ${moduleId}`)
      
    } catch (error) {
      console.error('Ошибка загрузки квиза:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ СТАРТ КВИЗА
  const startQuiz = () => {
    setQuizStarted(true)
    setQuestionStartTime(Date.now())
    startTimer()
    
    // Плавный скролл к первому вопросу
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ✅ ОБРАБОТКА ОТВЕТА
  const handleAnswer = (questionId, selectedOption) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        selected: selectedOption,
        timeSpent: Date.now() - questionStartTime,
        timestamp: Date.now()
      }
    }
    
    setAnswers(newAnswers)
    
    // Автоматически переходим к следующему вопросу через 1 секунду
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        nextQuestion()
      } else {
        // Последний вопрос - показываем кнопку завершения
        setCurrentQuestion(questions.length)
      }
    }, 1000)
  }

  // ✅ СЛЕДУЮЩИЙ ВОПРОС
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setQuestionStartTime(Date.now())
      
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // ✅ ПРЕДЫДУЩИЙ ВОПРОС
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setQuestionStartTime(Date.now())
      
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // ✅ ПОДСЧЕТ РЕЗУЛЬТАТОВ
  const calculateResults = () => {
    let correct = 0
    let totalScore = 0
    const maxScore = questions.length * 100 // 100 баллов за правильный ответ
    
    questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer && userAnswer.selected === question.correctAnswer) {
        correct++
        
        // Бонус за скорость (если ответил быстро)
        const timeBonus = userAnswer.timeSpent < 10000 ? 20 : 0 // Бонус за ответ менее 10 сек
        totalScore += 100 + timeBonus
      }
    })
    
    return {
      correct,
      total: questions.length,
      score: totalScore,
      maxScore,
      percentage: Math.round((correct / questions.length) * 100)
    }
  }

  // ✅ ОПРЕДЕЛЕНИЕ ЗАРАБОТАННЫХ ЗНАЧКОВ
  const calculateEarnedBadges = (results) => {
    const badges = []
    
    if (results.percentage >= 90) {
      badges.push({ id: 'perfect', name: 'Мастер', icon: '🏆', description: 'Результат 90%+' })
    } else if (results.percentage >= 80) {
      badges.push({ id: 'excellent', name: 'Эксперт', icon: '⭐', description: 'Результат 80%+' })
    } else if (results.percentage >= 70) {
      badges.push({ id: 'good', name: 'Знаток', icon: '✅', description: 'Результат 70%+' })
    }
    
    // Бонусный значок за скорость
    const totalTime = Object.values(answers).reduce((sum, answer) => sum + answer.timeSpent, 0)
    if (totalTime < questions.length * 15000) { // Менее 15 сек на вопрос в среднем
      badges.push({ id: 'speed', name: 'Скорость', icon: '⚡', description: 'Быстрые ответы' })
    }
    
    return badges
  }

  // ✅ ЗАВЕРШЕНИЕ КВИЗА
  const handleSubmitQuiz = async () => {
    stopTimer()
    
    const results = calculateResults()
    const badges = calculateEarnedBadges(results)
    
    setScore(results.score)
    setCorrectAnswers(results.correct)
    setEarnedBadges(badges)
    setTotalQuizTime(30 * 60 - timeLeft) // Общее время прохождения
    setShowResults(true)
    
    // Сохраняем прогресс
    try {
      const newProgress = {
        moduleId: parseInt(moduleId),
        completed: true,
        score: results.score,
        percentage: results.percentage,
        correctAnswers: results.correct,
        totalQuestions: questions.length,
        timeSpent: totalQuizTime,
        earnedBadges: badges,
        completedAt: new Date().toISOString(),
        answers: answers
      }
      
      await progressApi.saveQuizProgress(userData.id, newProgress)
      
      if (onUpdateProgress) {
        onUpdateProgress(moduleId, newProgress)
      }
      
      console.log('✅ Прогресс квиза сохранен:', newProgress)
      
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error)
    }
  }

  // ✅ ВОЗВРАТ К МОДУЛЮ
  const backToModule = () => {
    navigate(`/module/${moduleId}`)
  }

  // ✅ ПОВТОРИТЬ КВИЗ
  const retakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setScore(0)
    setCorrectAnswers(0)
    setEarnedBadges([])
    resetTimer()
    loadQuizData()
  }

  // ✅ ЭКРАН ЗАГРУЗКИ
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-2">Подготовка квиза...</h2>
          <p className="text-blue-200">Загружаем вопросы для модуля {moduleId}</p>
          <div className="mt-6">
            <div className="w-48 h-2 bg-white/20 rounded-full mx-auto">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ ЭКРАН ОШИБКИ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => loadQuizData()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ ЭКРАН РЕЗУЛЬТАТОВ
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Заголовок результатов */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-white mb-2">Квиз завершен!</h1>
            <p className="text-green-200">Модуль {moduleId} успешно пройден</p>
          </div>

          {/* Основные результаты */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Счет */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{score}</div>
              <div className="text-white text-lg">Баллов набрано</div>
              <div className="text-green-200 text-sm mt-1">
                {Math.round((score / (questions.length * 100)) * 100)}% от максимума
              </div>
            </div>

            {/* Правильные ответы */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-white text-lg">Правильно</div>
              <div className="text-green-200 text-sm mt-1">
                {Math.round((correctAnswers / questions.length) * 100)}% точность
              </div>
            </div>

            {/* Время */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatTimer(totalQuizTime)}
              </div>
              <div className="text-white text-lg">Времени потрачено</div>
              <div className="text-green-200 text-sm mt-1">
                {Math.round(totalQuizTime / questions.length / 1000)} сек/вопрос
              </div>
            </div>
          </div>

          {/* Заработанные значки */}
          {earnedBadges.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                🏆 Заработанные достижения
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <div className="text-white font-semibold">{badge.name}</div>
                      <div className="text-gray-300 text-sm">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={backToModule}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Вернуться к модулю
            </button>
            <button 
              onClick={retakeQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Пройти заново
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ ЭКРАН СТАРТА КВИЗА
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Квиз по модулю {moduleId}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
                <div className="text-blue-200 text-sm">вопросов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">30</div>
                <div className="text-green-200 text-sm">минут</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">100</div>
                <div className="text-yellow-200 text-sm">баллов/вопрос</div>
              </div>
            </div>

            <div className="text-gray-300 mb-8 space-y-2">
              <p>• Внимательно прочитайте каждый вопрос</p>
              <p>• Выберите один правильный ответ</p>
              <p>• За быстрые ответы даются бонусные баллы</p>
              <p>• Можно вернуться к предыдущим вопросам</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                🚀 Начать квиз
              </button>
              
              <button 
                onClick={() => navigate(`/module/${moduleId}`)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Вернуться к модулю
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ ОСНОВНОЙ ЭКРАН КВИЗА
  const currentQuestionData = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Хедер с прогрессом и таймером */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              <h1 className="text-xl font-bold">Модуль {moduleId}</h1>
              <p className="text-blue-200">Вопрос {currentQuestion + 1} из {questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">{formatTimer(timeLeft)}</div>
              <div className="text-blue-200 text-sm">времени осталось</div>
            </div>
          </div>
          
          {/* Прогресс-бар */}
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Вопрос */}
        <div ref={questionRef} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestionData?.question}
          </h2>
          
          {/* Варианты ответов */}
          <div className="space-y-4">
            {currentQuestionData?.options?.map((option, index) => {
              const isSelected = answers[currentQuestionData.id]?.selected === option
              const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestionData.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-600/50 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center font-bold ${
                      isSelected ? 'bg-blue-400 text-white' : 'bg-white/20 text-gray-300'
                    }`}>
                      {optionLetter}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Назад
          </button>

          <div className="text-center text-white">
            <div className="text-sm text-blue-200">
              Отвечено: {Object.keys(answers).length} из {questions.length}
            </div>
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button 
              onClick={nextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Далее →
            </button>
          ) : (
            <button 
              onClick={handleSubmitQuiz}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Завершить 🏁
            </button>
          )}
        </div>

        {/* Индикатор ответов */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                answers[questions[index]?.id]
                  ? 'bg-green-500 text-white'
                  : index === currentQuestion
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizScreen