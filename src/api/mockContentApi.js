// mockContentApi.js - Полное Mock API для управления контентом модулей
// Путь: src/api/mockContentApi.js

// ✅ ТЕСТОВЫЕ ДАННЫЕ МОДУЛЕЙ
const mockModuleContent = {
  1: {
    id: 1,
    title: 'SRO - Саморегулируемые организации',
    description: 'Основы работы с саморегулируемыми организациями в строительстве',
    category: 'regulatory',
    difficulty: 'Средний',
    estimatedTime: '45 мин',
    totalSections: 5,
    sections: [
      {
        id: 0,
        title: 'Введение в SRO',
        type: 'theory',
        estimatedTime: '10 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Что такое SRO?' },
            { type: 'paragraph', text: 'Саморегулируемая организация (SRO) - это некоммерческая организация, объединяющая субъектов предпринимательской или профессиональной деятельности.' },
            { type: 'list', items: ['Контроль качества работ', 'Повышение квалификации', 'Защита интересов участников'] },
            { type: 'image', src: '/images/sro-intro.jpg', alt: 'SRO структура' }
          ]
        }
      },
      {
        id: 1,
        title: 'Виды SRO',
        type: 'theory',
        estimatedTime: '12 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Основные виды SRO' },
            { type: 'paragraph', text: 'Существует несколько типов саморегулируемых организаций в зависимости от сферы деятельности.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 5,
      timeLimit: 600,
      passingScore: 70
    }
  },

  2: {
    id: 2,
    title: 'NRS - Национальный реестр специалистов',
    description: 'Работа с национальным реестром специалистов в строительной отрасли',
    category: 'regulatory',
    difficulty: 'Сложный',
    estimatedTime: '60 мин',
    totalSections: 6,
    sections: [
      {
        id: 0,
        title: 'Основы NRS',
        type: 'theory',
        estimatedTime: '15 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Национальный реестр специалистов' },
            { type: 'paragraph', text: 'NRS - единая система учёта специалистов в области строительства, проектирования и инженерных изысканий.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 6,
      timeLimit: 900,
      passingScore: 75
    }
  },

  3: {
    id: 3,
    title: 'NOK - Независимая оценка квалификации',
    description: 'Процедуры независимой оценки квалификации специалистов',
    category: 'certification',
    difficulty: 'Средний',
    estimatedTime: '50 мин',
    totalSections: 4,
    sections: [
      {
        id: 0,
        title: 'Что такое NOK',
        type: 'theory',
        estimatedTime: '12 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Независимая оценка квалификации' },
            { type: 'paragraph', text: 'NOK - процедура подтверждения соответствия квалификации соискателя положениям профессионального стандарта.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 4,
      timeLimit: 480,
      passingScore: 75
    }
  },

  4: {
    id: 4,
    title: 'URS - Управление регулируемыми системами',
    description: 'Основы управления регулируемыми системами в строительстве',
    category: 'management',
    difficulty: 'Сложный',
    estimatedTime: '70 мин',
    totalSections: 7,
    sections: [
      {
        id: 0,
        title: 'Введение в URS',
        type: 'theory',
        estimatedTime: '10 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Управление регулируемыми системами' },
            { type: 'paragraph', text: 'URS включает методы и принципы управления сложными техническими системами в строительной отрасли.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 7,
      timeLimit: 1200,
      passingScore: 80
    }
  },

  14: {
    id: 14,
    title: 'NAKS - Национальное агентство контроля сварки',
    description: 'Система аттестации сварочного производства и специалистов',
    category: 'certification',
    difficulty: 'Сложный',
    estimatedTime: '80 мин',
    totalSections: 8,
    sections: [
      {
        id: 0,
        title: 'Основы NAKS',
        type: 'theory',
        estimatedTime: '15 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Национальное агентство контроля сварки' },
            { type: 'paragraph', text: 'NAKS осуществляет аттестацию сварочного производства, сварщиков и специалистов сварочного производства.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 8,
      timeLimit: 1500,
      passingScore: 85
    }
  },

  15: {
    id: 15,
    title: 'VIK - Всероссийский институт качества',
    description: 'Система менеджмента качества в строительстве',
    category: 'quality',
    difficulty: 'Средний',
    estimatedTime: '55 мин',
    totalSections: 5,
    sections: [
      {
        id: 0,
        title: 'Основы VIK',
        type: 'theory',
        estimatedTime: '12 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Всероссийский институт качества' },
            { type: 'paragraph', text: 'VIK занимается развитием систем менеджмента качества и стандартизацией в строительной отрасли.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 5,
      timeLimit: 750,
      passingScore: 75
    }
  },

  20: {
    id: 20,
    title: 'Честный знак - Система маркировки',
    description: 'Цифровая маркировка товаров и система "Честный знак"',
    category: 'digital',
    difficulty: 'Средний',
    estimatedTime: '40 мин',
    totalSections: 4,
    sections: [
      {
        id: 0,
        title: 'Введение в систему маркировки',
        type: 'theory',
        estimatedTime: '10 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Система "Честный знак"' },
            { type: 'paragraph', text: 'Национальная система цифровой маркировки и прослеживаемости товаров.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 4,
      timeLimit: 600,
      passingScore: 70
    }
  },

  21: {
    id: 21,
    title: 'Лидерство и управление командой',
    description: 'Развитие лидерских качеств и эффективное управление командой',
    category: 'leadership',
    difficulty: 'Средний',
    estimatedTime: '65 мин',
    totalSections: 6,
    sections: [
      {
        id: 0,
        title: 'Основы лидерства',
        type: 'theory',
        estimatedTime: '15 мин',
        content: {
          blocks: [
            { type: 'heading', level: 2, text: 'Что такое лидерство?' },
            { type: 'paragraph', text: 'Лидерство - это способность влиять на других людей для достижения общих целей.' }
          ]
        }
      }
    ],
    quiz: {
      totalQuestions: 6,
      timeLimit: 900,
      passingScore: 75
    }
  }
}

// ✅ ТЕСТОВЫЕ ДАННЫЕ КВИЗОВ
const mockQuizData = {
  1: {
    moduleId: 1,
    title: 'Квиз: SRO - Саморегулируемые организации',
    timeLimit: 600,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: 'single',
        question: 'Что означает аббревиатура SRO?',
        options: [
          'Саморегулируемая организация',
          'Строительная регулируемая организация', 
          'Система регулирования объектов',
          'Специальная рабочая организация'
        ],
        correctAnswer: 0,
        explanation: 'SRO расшифровывается как Саморегулируемая организация - некоммерческая организация, основанная на членстве.',
        points: 20
      },
      {
        id: 2,
        type: 'multiple',
        question: 'Какие функции выполняют SRO? (выберите все правильные)',
        options: [
          'Контроль качества работ членов организации',
          'Ведение реестра членов',
          'Установление цен на строительные работы',
          'Разработка стандартов и правил',
          'Страхование ответственности'
        ],
        correctAnswers: [0, 1, 3, 4],
        explanation: 'SRO не устанавливают цены, но выполняют все остальные перечисленные функции.',
        points: 25
      },
      {
        id: 3,
        type: 'single',
        question: 'Минимальное количество членов для создания SRO в области строительства:',
        options: ['25', '50', '100', '200'],
        correctAnswer: 2,
        explanation: 'Для создания SRO в строительстве требуется минимум 100 индивидуальных предпринимателей или 50 юридических лиц.',
        points: 15
      },
      {
        id: 4,
        type: 'true_false',
        question: 'Членство в SRO является добровольным для всех строительных организаций.',
        correctAnswer: false,
        explanation: 'Для выполнения работ, которые влияют на безопасность объектов капитального строительства, членство в SRO обязательно.',
        points: 20
      },
      {
        id: 5,
        type: 'single',
        question: 'Какой орган осуществляет государственный контроль за деятельностью SRO?',
        options: [
          'Минэкономразвития России',
          'Ростехнадзор',
          'Росстройнадзор',
          'Минстрой России'
        ],
        correctAnswer: 3,
        explanation: 'Минстрой России является федеральным органом, осуществляющим контроль за деятельностью SRO в строительстве.',
        points: 20
      }
    ]
  },

  2: {
    moduleId: 2,
    title: 'Квиз: NRS - Национальный реестр специалистов',
    timeLimit: 900,
    passingScore: 75,
    questions: [
      {
        id: 1,
        type: 'single',
        question: 'Что такое Национальный реестр специалистов (NRS)?',
        options: [
          'База данных всех работников строительной отрасли',
          'Информационная система учета специалистов в области строительства',
          'Список сертифицированных инженеров',
          'Реестр строительных компаний'
        ],
        correctAnswer: 1,
        explanation: 'NRS - это информационная система, обеспечивающая ведение единого учета специалистов.',
        points: 15
      },
      {
        id: 2,
        type: 'multiple',
        question: 'Кто может быть включен в NRS? (выберите все правильные)',
        options: [
          'Главные инженеры проектов',
          'Главные архитекторы проектов', 
          'Лица, осуществляющие строительный контроль',
          'Обычные рабочие',
          'Специалисты по организации архитектурно-строительного проектирования'
        ],
        correctAnswers: [0, 1, 2, 4],
        explanation: 'В NRS включаются только специалисты определенных категорий, имеющие соответствующую квалификацию.',
        points: 25
      }
    ]
  },

  3: {
    moduleId: 3,
    title: 'Квиз: NOK - Независимая оценка квалификации',
    timeLimit: 480,
    passingScore: 75,
    questions: [
      {
        id: 1,
        type: 'single',
        question: 'Что такое независимая оценка квалификации (NOK)?',
        options: [
          'Процедура аттестации работников предприятия',
          'Подтверждение соответствия квалификации профессиональному стандарту',
          'Система оценки качества образования',
          'Процедура лицензирования деятельности'
        ],
        correctAnswer: 1,
        explanation: 'NOK - это процедура подтверждения соответствия квалификации соискателя требованиям профессионального стандарта.',
        points: 25
      }
    ]
  }
}

// ✅ ЭКСПОРТ API
const contentApi = {
  // Получить квиз для модуля
  fetchQuizQuestions: async (moduleId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const quizData = mockQuizData[moduleId]
        if (quizData) {
          console.log(`✅ Загружены вопросы для модуля ${moduleId}:`, quizData.questions.length, 'вопросов')
          resolve(quizData)
        } else {
          console.log(`❌ Квиз для модуля ${moduleId} не найден`)
          reject(new Error(`Квиз для модуля ${moduleId} не найден`))
        }
      }, 500) // Имитация сетевой задержки
    })
  },

  // Получить контент модуля
  fetchModuleContent: async (moduleId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const moduleData = mockModuleContent[moduleId]
        if (moduleData) {
          console.log(`✅ Загружен контент модуля ${moduleId}:`, moduleData.title)
          resolve(moduleData)
        } else {
          console.log(`❌ Модуль ${moduleId} не найден`)
          reject(new Error(`Модуль ${moduleId} не найден`))
        }
      }, 300)
    })
  },

  // Получить список всех доступных модулей
  fetchAvailableModules: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const modules = Object.values(mockModuleContent).map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          category: module.category,
          difficulty: module.difficulty,
          estimatedTime: module.estimatedTime,
          totalSections: module.totalSections
        }))
        console.log('✅ Загружен список модулей:', modules.length, 'модулей')
        resolve(modules)
      }, 200)
    })
  },

  // Поиск модулей по категории
  fetchModulesByCategory: async (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const modules = Object.values(mockModuleContent)
          .filter(module => module.category === category)
          .map(module => ({
            id: module.id,
            title: module.title,
            description: module.description,
            category: module.category,
            difficulty: module.difficulty,
            estimatedTime: module.estimatedTime
          }))
        console.log(`✅ Найдено модулей в категории ${category}:`, modules.length)
        resolve(modules)
      }, 200)
    })
  },

  // Поиск модулей по сложности
  fetchModulesByDifficulty: async (difficulty) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const modules = Object.values(mockModuleContent)
          .filter(module => module.difficulty === difficulty)
        console.log(`✅ Найдено модулей сложности ${difficulty}:`, modules.length)
        resolve(modules)
      }, 200)
    })
  },

  // Получить популярные модули
  fetchPopularModules: async (limit = 5) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Имитируем популярность
        const popularIds = [1, 2, 21, 3, 14]
        const modules = popularIds.slice(0, limit).map(id => mockModuleContent[id]).filter(Boolean)
        console.log(`✅ Загружено популярных модулей:`, modules.length)
        resolve(modules)
      }, 300)
    })
  },

  // Поиск модулей по тексту
  searchModules: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchQuery = query.toLowerCase()
        const modules = Object.values(mockModuleContent)
          .filter(module => 
            module.title.toLowerCase().includes(searchQuery) ||
            module.description.toLowerCase().includes(searchQuery)
          )
        console.log(`✅ Найдено модулей по запросу "${query}":`, modules.length)
        resolve(modules)
      }, 300)
    })
  },

  // Получить рекомендуемые модули для пользователя
  fetchRecommendedModules: async (userId, completedModules = []) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Простая логика рекомендаций
        let recommended = []
        
        if (completedModules.includes(1) && !completedModules.includes(2)) {
          recommended.push(mockModuleContent[2]) // После SRO рекомендуем NRS
        }
        
        if (completedModules.includes(2) && !completedModules.includes(3)) {
          recommended.push(mockModuleContent[3]) // После NRS рекомендуем NOK
        }
        
        if (completedModules.length >= 3 && !completedModules.includes(21)) {
          recommended.push(mockModuleContent[21]) // Лидерство для опытных
        }
        
        // Если рекомендаций мало, добавляем популярные
        if (recommended.length < 3) {
          const popular = [1, 2, 3].filter(id => !completedModules.includes(id))
          popular.forEach(id => {
            if (mockModuleContent[id] && !recommended.find(m => m.id === id)) {
              recommended.push(mockModuleContent[id])
            }
          })
        }
        
        console.log(`✅ Рекомендовано модулей для пользователя ${userId}:`, recommended.length)
        resolve(recommended.slice(0, 5))
      }, 400)
    })
  }
}

// Экспорт данных для разработки
export { mockModuleContent, mockQuizData }
export const contentApi = {
  fetchAvailableModules: async () => {
    // твоя логика
  },
  // другие методы
}
