// mockProgressApi.js - Полное Mock API для управления прогрессом пользователей
// Путь: src/api/mockProgressApi.js

// ✅ СИСТЕМА ЗНАЧКОВ И ДОСТИЖЕНИЙ
const badgeSystem = {
  // Значки за завершение модулей
  first_module: {
    id: 'first_module',
    name: 'Первые шаги',
    description: 'Завершен первый модуль обучения',
    icon: '🎯',
    rarity: 'common',
    category: 'progress'
  },
  
  speed_demon: {
    id: 'speed_demon',
    name: 'Скоростной демон',
    description: 'Завершен модуль менее чем за 30 минут',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'performance'
  },
  
  perfectionist: {
    id: 'perfectionist',
    name: 'Перфекционист',
    description: 'Получен результат 100% в квизе',
    icon: '💎',
    rarity: 'rare',
    category: 'excellence'
  },
  
  expert: {
    id: 'expert',
    name: 'Эксперт',
    description: 'Завершено 3 модуля с результатом выше 85%',
    icon: '⭐',
    rarity: 'epic',
    category: 'expertise'
  },
  
  leader: {
    id: 'leader',
    name: 'Лидер',
    description: 'Завершен модуль по лидерству',
    icon: '👑',
    rarity: 'rare',
    category: 'leadership'
  },
  
  night_owl: {
    id: 'night_owl',
    name: 'Полуночник',
    description: 'Завершен модуль в период с 23:00 до 06:00',
    icon: '🦉',
    rarity: 'uncommon',
    category: 'timing'
  },
  
  early_bird: {
    id: 'early_bird',
    name: 'Ранняя пташка',
    description: 'Завершен модуль в период с 06:00 до 09:00',
    icon: '🐦',
    rarity: 'uncommon',
    category: 'timing'
  },
  
  marathon_runner: {
    id: 'marathon_runner',
    name: 'Марафонец',
    description: 'Завершено 5 модулей подряд за один день',
    icon: '🏃',
    rarity: 'epic',
    category: 'endurance'
  },
  
  comeback_king: {
    id: 'comeback_king',
    name: 'Король возвращения',
    description: 'Улучшен результат модуля при повторном прохождении',
    icon: '🔄',
    rarity: 'rare',
    category: 'improvement'
  },
  
  legendary_master: {
    id: 'legendary_master',
    name: 'Легендарный мастер',
    description: 'Завершены все доступные модули с результатом выше 90%',
    icon: '🏆',
    rarity: 'legendary',
    category: 'mastery'
  }
}

// ✅ ТЕСТОВЫЕ ДАННЫЕ ПРОГРЕССА
const mockProgressData = {
  'user_1': {
    userId: 'user_1',
    totalScore: 2450,
    level: 3,
    completedModules: [1, 2, 21],
    moduleProgress: {
      1: {
        moduleId: 1,
        completed: true,
        score: 850,
        percentage: 85,
        correctAnswers: 4,
        totalQuestions: 5,
        timeSpent: 1230, // в секундах
        completedAt: '2025-01-15T10:30:00Z',
        attempts: 1,
        sectionsCompleted: [0, 1, 2, 3, 4],
        currentSection: 5,
        bestScore: 850,
        earnedBadges: ['first_module', 'expert']
      },
      2: {
        moduleId: 2,
        completed: true,
        score: 720,
        percentage: 72,
        correctAnswers: 4,
        totalQuestions: 6,
        timeSpent: 890,
        completedAt: '2025-01-16T14:20:00Z',
        attempts: 2,
        sectionsCompleted: [0, 1, 2, 3, 4, 5],
        currentSection: 6,
        bestScore: 720,
        earnedBadges: []
      },
      21: {
        moduleId: 21,
        completed: true,
        score: 880,
        percentage: 88,
        correctAnswers: 5,
        totalQuestions: 6,
        timeSpent: 1450,
        completedAt: '2025-01-17T16:45:00Z',
        attempts: 1,
        sectionsCompleted: [0, 1, 2, 3, 4, 5],
        currentSection: 6,
        bestScore: 880,
        earnedBadges: ['leader', 'expert']
      },
      3: {
        moduleId: 3,
        completed: false,
        score: 0,
        percentage: 0,
        currentSection: 1,
        timeSpent: 320,
        lastAccessedAt: '2025-01-17T09:15:00Z',
        attempts: 0,
        sectionsCompleted: [0],
        earnedBadges: []
      }
    },
    badges: [
      { 
        ...badgeSystem.first_module, 
        earnedAt: '2025-01-15T10:30:00Z',
        moduleId: 1
      },
      { 
        ...badgeSystem.expert, 
        earnedAt: '2025-01-16T14:20:00Z',
        moduleId: 2
      },
      { 
        ...badgeSystem.leader, 
        earnedAt: '2025-01-17T16:45:00Z',
        moduleId: 21
      }
    ],
    achievements: {
      totalQuizzesPassed: 3,
      totalCorrectAnswers: 13,
      totalQuestions: 17,
      averageScore: 816,
      bestStreak: 3,
      totalTimeSpent: 3570,
      averageTimePerModule: 1190,
      fastestCompletion: 890,
      perfectScores: 0,
      improvementCount: 1
    },
    statistics: {
      studyDays: 3,
      averageSessionTime: 1190,
      preferredStudyTime: 'afternoon', // morning, afternoon, evening, night
      weeklyGoal: 5,
      weeklyCompleted: 3,
      streakDays: 3,
      longestStreak: 3
    },
    lastActiveAt: '2025-01-17T16:45:00Z',
    createdAt: '2025-01-15T08:00:00Z'
  },

  'user_2': {
    userId: 'user_2', 
    totalScore: 450,
    level: 1,
    completedModules: [],
    moduleProgress: {
      1: {
        moduleId: 1,
        completed: false,
        score: 0,
        percentage: 0,
        currentSection: 0,
        timeSpent: 150,
        lastAccessedAt: '2025-01-17T11:00:00Z',
        attempts: 0,
        sectionsCompleted: [],
        earnedBadges: []
      }
    },
    badges: [],
    achievements: {
      totalQuizzesPassed: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0,
      averageScore: 0,
      bestStreak: 0,
      totalTimeSpent: 150,
      averageTimePerModule: 0,
      fastestCompletion: 0,
      perfectScores: 0,
      improvementCount: 0
    },
    statistics: {
      studyDays: 1,
      averageSessionTime: 150,
      preferredStudyTime: 'morning',
      weeklyGoal: 3,
      weeklyCompleted: 0,
      streakDays: 0,
      longestStreak: 0
    },
    lastActiveAt: '2025-01-17T11:00:00Z',
    createdAt: '2025-01-17T10:45:00Z'
  },

  // Добавим более продвинутого пользователя
  'superuser_s': {
    userId: 'superuser_s',
    totalScore: 8750,
    level: 8,
    completedModules: [1, 2, 3, 4, 14, 15, 20, 21],
    moduleProgress: {
      1: { moduleId: 1, completed: true, score: 950, percentage: 95, attempts: 1, earnedBadges: ['first_module', 'perfectionist'] },
      2: { moduleId: 2, completed: true, score: 900, percentage: 90, attempts: 1, earnedBadges: ['speed_demon'] },
      3: { moduleId: 3, completed: true, score: 1000, percentage: 100, attempts: 1, earnedBadges: ['perfectionist'] },
      4: { moduleId: 4, completed: true, score: 920, percentage: 92, attempts: 2, earnedBadges: ['comeback_king'] },
      14: { moduleId: 14, completed: true, score: 950, percentage: 95, attempts: 1, earnedBadges: [] },
      15: { moduleId: 15, completed: true, score: 880, percentage: 88, attempts: 1, earnedBadges: [] },
      20: { moduleId: 20, completed: true, score: 1000, percentage: 100, attempts: 1, earnedBadges: ['perfectionist'] },
      21: { moduleId: 21, completed: true, score: 1150, percentage: 96, attempts: 1, earnedBadges: ['leader', 'marathon_runner'] }
    },
    badges: [
      { ...badgeSystem.first_module, earnedAt: '2025-01-10T10:30:00Z' },
      { ...badgeSystem.perfectionist, earnedAt: '2025-01-10T10:30:00Z' },
      { ...badgeSystem.speed_demon, earnedAt: '2025-01-11T09:15:00Z' },
      { ...badgeSystem.expert, earnedAt: '2025-01-12T15:20:00Z' },
      { ...badgeSystem.leader, earnedAt: '2025-01-15T14:30:00Z' },
      { ...badgeSystem.comeback_king, earnedAt: '2025-01-13T11:45:00Z' },
      { ...badgeSystem.marathon_runner, earnedAt: '2025-01-14T18:20:00Z' },
      { ...badgeSystem.legendary_master, earnedAt: '2025-01-15T16:00:00Z' }
    ],
    achievements: {
      totalQuizzesPassed: 8,
      totalCorrectAnswers: 45,
      totalQuestions: 48,
      averageScore: 968,
      bestStreak: 8,
      totalTimeSpent: 7200,
      averageTimePerModule: 900,
      fastestCompletion: 420,
      perfectScores: 3,
      improvementCount: 2
    },
    statistics: {
      studyDays: 8,
      averageSessionTime: 900,
      preferredStudyTime: 'evening',
      weeklyGoal: 10,
      weeklyCompleted: 8,
      streakDays: 8,
      longestStreak: 8
    },
    lastActiveAt: '2025-01-15T16:00:00Z',
    createdAt: '2025-01-10T08:00:00Z'
  }
}

// ✅ ФУНКЦИИ ВЫЧИСЛЕНИЯ ЗНАЧКОВ
const badgeCalculator = {
  // Проверка заработанных значков после завершения квиза
  calculateEarnedBadges: (quizResult, userProgress, moduleId) => {
    const earnedBadges = []
    const { score, percentage, timeSpent, correctAnswers, totalQuestions } = quizResult
    const currentTime = new Date()
    const hour = currentTime.getHours()

    // Первый модуль
    if (!userProgress.completedModules || userProgress.completedModules.length === 0) {
      earnedBadges.push(badgeSystem.first_module)
    }

    // Перфекционист (100%)
    if (percentage === 100) {
      earnedBadges.push(badgeSystem.perfectionist)
    }

    // Скоростной демон (модуль менее чем за 30 минут)
    if (timeSpent < 1800) {
      earnedBadges.push(badgeSystem.speed_demon)
    }

    // Полуночник (23:00 - 06:00)
    if (hour >= 23 || hour < 6) {
      earnedBadges.push(badgeSystem.night_owl)
    }

    // Ранняя пташка (06:00 - 09:00)
    if (hour >= 6 && hour < 9) {
      earnedBadges.push(badgeSystem.early_bird)
    }

    // Лидер (модуль 21)
    if (moduleId === 21 && percentage >= 75) {
      earnedBadges.push(badgeSystem.leader)
    }

    // Эксперт (3 модуля с результатом выше 85%)
    const highScoreModules = Object.values(userProgress.moduleProgress || {})
      .filter(m => m.completed && m.percentage >= 85)
    if (highScoreModules.length >= 2 && percentage >= 85) { // +1 текущий
      earnedBadges.push(badgeSystem.expert)
    }

    // Король возвращения (улучшение результата)
    const previousResult = userProgress.moduleProgress?.[moduleId]
    if (previousResult && previousResult.bestScore < score) {
      earnedBadges.push(badgeSystem.comeback_king)
    }

    return earnedBadges
  }
}

// ✅ API ПРОГРЕССА
const progressApi = {
  // Получить прогресс пользователя
  fetchUserProgress: async (userId = 'user_1') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Сначала пытаемся загрузить из localStorage
          const localData = localStorage.getItem('gkbr_user_progress')
          if (localData) {
            const parsed = JSON.parse(localData)
            console.log('✅ Загружен прогресс из localStorage для:', userId)
            resolve(parsed)
            return
          }

          // Если нет в localStorage, используем моковые данные
          const userProgress = mockProgressData[userId]
          if (userProgress) {
            console.log(`✅ Загружен прогресс пользователя ${userId}:`, userProgress.totalScore, 'очков')
            resolve(userProgress)
          } else {
            // Создаем нового пользователя
            const newUser = {
              userId,
              totalScore: 0,
              level: 1,
              completedModules: [],
              moduleProgress: {},
              badges: [],
              achievements: {
                totalQuizzesPassed: 0,
                totalCorrectAnswers: 0,
                totalQuestions: 0,
                averageScore: 0,
                bestStreak: 0,
                totalTimeSpent: 0,
                averageTimePerModule: 0,
                fastestCompletion: 0,
                perfectScores: 0,
                improvementCount: 0
              },
              statistics: {
                studyDays: 0,
                averageSessionTime: 0,
                preferredStudyTime: 'afternoon',
                weeklyGoal: 5,
                weeklyCompleted: 0,
                streakDays: 0,
                longestStreak: 0
              },
              lastActiveAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }
            console.log(`✅ Создан новый пользователь ${userId}`)
            resolve(newUser)
          }
        } catch (error) {
          console.error('Ошибка загрузки прогресса:', error)
          reject(error)
        }
      }, 300)
    })
  },

  // Сохранить результат квиза
  saveQuizResult: async (userId, quizData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Загружаем текущий прогресс
          let userProgress = mockProgressData[userId]
          if (!userProgress) {
            // Создаем нового пользователя если не существует
            userProgress = {
              userId,
              totalScore: 0,
              level: 1,
              completedModules: [],
              moduleProgress: {},
              badges: [],
              achievements: {
                totalQuizzesPassed: 0,
                totalCorrectAnswers: 0,
                totalQuestions: 0,
                averageScore: 0,
                bestStreak: 0,
                totalTimeSpent: 0,
                averageTimePerModule: 0,
                fastestCompletion: 0,
                perfectScores: 0,
                improvementCount: 0
              },
              statistics: {
                studyDays: 0,
                averageSessionTime: 0,
                preferredStudyTime: 'afternoon',
                weeklyGoal: 5,
                weeklyCompleted: 0,
                streakDays: 0,
                longestStreak: 0
              },
              lastActiveAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }
            mockProgressData[userId] = userProgress
          }

          // Проверяем заработанные значки
          const earnedBadges = badgeCalculator.calculateEarnedBadges(
            quizData, 
            userProgress, 
            quizData.moduleId
          )

          // Обновляем прогресс модуля
          const oldModuleProgress = userProgress.moduleProgress[quizData.moduleId] || {}
          userProgress.moduleProgress[quizData.moduleId] = {
            ...oldModuleProgress,
            ...quizData,
            earnedBadges: earnedBadges.map(b => b.id),
            bestScore: Math.max(oldModuleProgress.bestScore || 0, quizData.score),
            completedAt: new Date().toISOString()
          }

          // Обновляем общий счет
          const oldModuleScore = oldModuleProgress.score || 0
          userProgress.totalScore = userProgress.totalScore - oldModuleScore + quizData.score

          // Добавляем в завершенные модули
          if (quizData.completed && !userProgress.completedModules.includes(quizData.moduleId)) {
            userProgress.completedModules.push(quizData.moduleId)
          }

          // Добавляем новые значки
          earnedBadges.forEach(badge => {
            if (!userProgress.badges.find(b => b.id === badge.id)) {
              userProgress.badges.push({
                ...badge,
                earnedAt: new Date().toISOString(),
                moduleId: quizData.moduleId
              })
            }
          })

          // Обновляем достижения
          userProgress.achievements.totalQuizzesPassed++
          userProgress.achievements.totalCorrectAnswers += quizData.correctAnswers
          userProgress.achievements.totalQuestions += quizData.totalQuestions
          userProgress.achievements.totalTimeSpent += quizData.timeSpent
          userProgress.achievements.averageScore = Math.round(
            userProgress.totalScore / userProgress.achievements.totalQuizzesPassed
          )
          
          if (quizData.percentage === 100) {
            userProgress.achievements.perfectScores++
          }

          if (oldModuleProgress.score && quizData.score > oldModuleProgress.score) {
            userProgress.achievements.improvementCount++
          }

          // Обновляем уровень (каждые 1000 очков = новый уровень)
          userProgress.level = Math.floor(userProgress.totalScore / 1000) + 1

          // Обновляем статистику
          userProgress.statistics.averageSessionTime = Math.round(
            userProgress.achievements.totalTimeSpent / userProgress.achievements.totalQuizzesPassed
          )

          userProgress.lastActiveAt = new Date().toISOString()

          // Сохраняем в localStorage для персистентности
          localStorage.setItem('gkbr_user_progress', JSON.stringify(userProgress))

          console.log(`✅ Сохранен прогресс квиза для пользователя ${userId}, модуль ${quizData.moduleId}`)
          console.log(`🏆 Заработано значков: ${earnedBadges.length}`)
          
          resolve({
            userProgress,
            earnedBadges
          })
        } catch (error) {
          console.error('Ошибка сохранения прогресса:', error)
          reject(error)
        }
      }, 500)
    })
  },

  // Обновить прогресс модуля (чтение секций)
  updateModuleProgress: async (userId, moduleId, progressData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let userProgress = mockProgressData[userId]
          if (!userProgress) {
            reject(new Error('Пользователь не найден'))
            return
          }

          // Обновляем прогресс модуля
          if (!userProgress.moduleProgress[moduleId]) {
            userProgress.moduleProgress[moduleId] = {
              moduleId,
              completed: false,
              score: 0,
              percentage: 0,
              currentSection: 0,
              timeSpent: 0,
              attempts: 0,
              sectionsCompleted: [],
              earnedBadges: []
            }
          }

          userProgress.moduleProgress[moduleId] = {
            ...userProgress.moduleProgress[moduleId],
            ...progressData,
            lastAccessedAt: new Date().toISOString()
          }

          userProgress.lastActiveAt = new Date().toISOString()

          // Сохраняем в localStorage
          localStorage.setItem('gkbr_user_progress', JSON.stringify(userProgress))

          console.log(`✅ Обновлен прогресс модуля ${moduleId} для пользователя ${userId}`)
          resolve(userProgress)
        } catch (error) {
          console.error('Ошибка обновления прогресса модуля:', error)
          reject(error)
        }
      }, 200)
    })
  },

  // Получить статистику по всем пользователям
  fetchGlobalStatistics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allUsers = Object.values(mockProgressData)
        const stats = {
          totalUsers: allUsers.length,
          totalCompletedModules: allUsers.reduce((sum, user) => sum + user.completedModules.length, 0),
          averageScore: Math.round(
            allUsers.reduce((sum, user) => sum + user.totalScore, 0) / allUsers.length
          ),
          totalBadges: allUsers.reduce((sum, user) => sum + user.badges.length, 0),
          mostPopularModule: 1, // Можно вычислить из данных
          averageCompletionTime: Math.round(
            allUsers.reduce((sum, user) => sum + user.achievements.averageTimePerModule, 0) / allUsers.length
          )
        }
        
        console.log('✅ Загружена глобальная статистика')
        resolve(stats)
      }, 400)
    })
  },

  // Получить топ пользователей
  fetchLeaderboard: async (limit = 10) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaderboard = Object.values(mockProgressData)
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, limit)
          .map((user, index) => ({
            rank: index + 1,
            userId: user.userId,
            totalScore: user.totalScore,
            level: user.level,
            completedModules: user.completedModules.length,
            badges: user.badges.length
          }))
        
        console.log(`✅ Загружен топ ${limit} пользователей`)
        resolve(leaderboard)
      }, 300)
    })
  },

  // Получить доступные значки
  fetchAvailableBadges: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const badges = Object.values(badgeSystem)
        console.log('✅ Загружены доступные значки:', badges.length)
        resolve(badges)
      }, 200)
    })
  },

  // Сброс прогресса пользователя (для разработки)
  resetUserProgress: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        delete mockProgressData[userId]
        localStorage.removeItem('gkbr_user_progress')
        console.log(`✅ Сброшен прогресс пользователя ${userId}`)
        resolve(true)
      }, 100)
    })
  }
}

// Экспорт для разработки
export { mockProgressData, badgeSystem, badgeCalculator }
export default progressApi