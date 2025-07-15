// mockAuthApi.js - Mock API для авторизации и управления пользователями
// Путь: src/api/mockAuthApi.js

// ✅ ТЕСТОВЫЕ ПОЛЬЗОВАТЕЛИ
const mockUsers = {
  'admin@gkbr.ru': {
    id: 'user_1',
    email: 'admin@gkbr.ru',
    password: 'admin123', // В реальном проекте пароли должны быть хешированы
    fullName: 'Администратор GKBR',
    firstName: 'Админ',
    lastName: 'Администратор',
    role: 'superadmin_s',
    department: 'IT Отдел',
    position: 'Системный администратор',
    avatar: null,
    phone: '+7 (999) 123-45-67',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2025-01-10T08:00:00Z',
    permissions: [
      'view_all_modules',
      'edit_content',
      'manage_users',
      'view_analytics',
      'export_data'
    ]
  },
  
  'student@gkbr.ru': {
    id: 'user_2',
    email: 'student@gkbr.ru',
    password: 'student123',
    fullName: 'Студент Иванов',
    firstName: 'Иван',
    lastName: 'Иванов',
    role: 'student',
    department: 'Строительный отдел',
    position: 'Специалист',
    avatar: null,
    phone: '+7 (999) 987-65-43',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2025-01-15T10:30:00Z',
    permissions: [
      'view_modules',
      'take_quizzes',
      'view_progress'
    ]
  },
  
  'manager@gkbr.ru': {
    id: 'user_3',
    email: 'manager@gkbr.ru',
    password: 'manager123',
    fullName: 'Менеджер Петров',
    firstName: 'Петр',
    lastName: 'Петров',
    role: 'manager',
    department: 'Отдел качества',
    position: 'Руководитель проектов',
    avatar: null,
    phone: '+7 (999) 555-33-22',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2025-01-12T14:00:00Z',
    permissions: [
      'view_modules',
      'take_quizzes',
      'view_progress',
      'view_team_analytics'
    ]
  }
}

// ✅ РОЛИ И ПРАВА ДОСТУПА
const rolePermissions = {
  'superadmin_s': {
    name: 'Супер-администратор',
    permissions: [
      'all', // Полный доступ ко всему
      'view_all_modules',
      'edit_content',
      'manage_users',
      'view_analytics',
      'export_data',
      'system_settings'
    ],
    level: 100
  },
  
  'admin': {
    name: 'Администратор',
    permissions: [
      'view_all_modules',
      'edit_content',
      'manage_users',
      'view_analytics',
      'export_data'
    ],
    level: 80
  },
  
  'manager': {
    name: 'Менеджер',
    permissions: [
      'view_modules',
      'take_quizzes',
      'view_progress',
      'view_team_analytics',
      'manage_team'
    ],
    level: 60
  },
  
  'student': {
    name: 'Студент',
    permissions: [
      'view_modules',
      'take_quizzes',
      'view_progress'
    ],
    level: 20
  },
  
  'guest': {
    name: 'Гость',
    permissions: [
      'view_public_content'
    ],
    level: 0
  }
}

// ✅ ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ (состояние)
let currentUser = null

// ✅ AUTH API
export const authApi = {
  
  // Авторизация пользователя
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = mockUsers[email.toLowerCase()]
          
          if (!user) {
            reject(new Error('Пользователь с таким email не найден'))
            return
          }
          
          if (user.password !== password) {
            reject(new Error('Неверный пароль'))
            return
          }
          
          if (!user.isActive) {
            reject(new Error('Аккаунт заблокирован. Обратитесь к администратору'))
            return
          }
          
          // Обновляем время последнего входа
          user.lastLoginAt = new Date().toISOString()
          
          // Создаем безопасную копию пользователя (без пароля)
          const safeUser = {
            ...user,
            password: undefined, // Убираем пароль из ответа
            isLoggedIn: true,
            loginAt: new Date().toISOString()
          }
          
          // Сохраняем в localStorage
          localStorage.setItem('gkbr_user_data', JSON.stringify(safeUser))
          
          currentUser = safeUser
          
          console.log(`✅ Пользователь ${email} успешно авторизован`)
          resolve(safeUser)
          
        } catch (error) {
          console.error('Ошибка авторизации:', error)
          reject(new Error('Произошла ошибка при входе в систему'))
        }
      }, 800) // Имитация сетевой задержки
    })
  },
  
  // Выход из системы
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = null
        localStorage.removeItem('gkbr_user_data')
        localStorage.removeItem('gkbr_user_progress')
        console.log('👋 Пользователь вышел из системы')
        resolve(true)
      }, 200)
    })
  },
  
  // Получить текущего пользователя
  fetchCurrentUser: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Сначала проверяем память
          if (currentUser) {
            resolve(currentUser)
            return
          }
          
          // Затем проверяем localStorage
          const savedUser = localStorage.getItem('gkbr_user_data')
          if (savedUser) {
            try {
              const user = JSON.parse(savedUser)
              if (user?.isLoggedIn) {
                currentUser = user
                console.log(`✅ Восстановлена сессия пользователя ${user.email}`)
                resolve(user)
                return
              }
            } catch (parseError) {
              console.error('Ошибка парсинга данных пользователя:', parseError)
              localStorage.removeItem('gkbr_user_data')
            }
          }
          
          // Пользователь не найден
          reject(new Error('Пользователь не авторизован'))
          
        } catch (error) {
          console.error('Ошибка получения текущего пользователя:', error)
          reject(error)
        }
      }, 300)
    })
  },
  
  // Обновить данные пользователя
  updateUser: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!currentUser || !userData.id) {
            reject(new Error('Пользователь не авторизован или отсутствует ID'))
            return
          }
          
          // Обновляем данные в mockUsers
          const existingUser = Object.values(mockUsers).find(u => u.id === userData.id)
          if (existingUser) {
            Object.assign(existingUser, {
              fullName: userData.fullName || existingUser.fullName,
              firstName: userData.firstName || existingUser.firstName,
              lastName: userData.lastName || existingUser.lastName,
              department: userData.department || existingUser.department,
              position: userData.position || existingUser.position,
              phone: userData.phone || existingUser.phone,
              avatar: userData.avatar || existingUser.avatar
            })
          }
          
          // Обновляем текущего пользователя
          const updatedUser = {
            ...currentUser,
            ...userData,
            password: undefined // Не возвращаем пароль
          }
          
          currentUser = updatedUser
          
          // Сохраняем в localStorage
          localStorage.setItem('gkbr_user_data', JSON.stringify(updatedUser))
          
          console.log(`✅ Данные пользователя ${userData.email} обновлены`)
          resolve(updatedUser)
          
        } catch (error) {
          console.error('Ошибка обновления пользователя:', error)
          reject(new Error('Не удалось обновить данные пользователя'))
        }
      }, 500)
    })
  },
  
  // Проверить права доступа
  checkPermission: (permission) => {
    if (!currentUser || !currentUser.role) {
      return false
    }
    
    const userRole = rolePermissions[currentUser.role]
    if (!userRole) {
      return false
    }
    
    // Супер-админ имеет доступ ко всему
    if (userRole.permissions.includes('all')) {
      return true
    }
    
    return userRole.permissions.includes(permission)
  },
  
  // Получить информацию о роли
  getRoleInfo: (role = null) => {
    const targetRole = role || currentUser?.role
    return rolePermissions[targetRole] || rolePermissions.guest
  }
}

// ✅ ЭКСПОРТ ПО УМОЛЧАНИЮ
export default authApi