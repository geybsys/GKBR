// LoginScreen.jsx - Вход и регистрация
// Путь: src/platform/LoginScreen.jsx

import React, { useState } from 'react'

const LoginScreen = ({ onLogin }) => {
  // ✅ СОСТОЯНИЕ КОМПОНЕНТА
  const [isLogin, setIsLogin] = useState(true) // true = вход, false = регистрация
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // ✅ ТЕСТОВЫЕ ПОЛЬЗОВАТЕЛИ
  const testUsers = [
    {
      id: 'user_1',
      email: 'admin@gkbr.ru',
      password: 'admin123',
      fullName: 'Администратор GKBR',
      role: 'superadmin_s'
    },
    {
      id: 'user_2',
      email: 'student@gkbr.ru',
      password: 'student123',
      fullName: 'Студент Иванов',
      role: 'student'
    }
  ]

  // ✅ ОБРАБОТКА ВВОДА
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Очистка ошибок при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // ✅ ВАЛИДАЦИЯ ФОРМЫ
  const validateForm = () => {
    const newErrors = {}

    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    // Проверка пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    // Дополнительная валидация для регистрации
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Имя обязательно'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтверждение пароля обязательно'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ ВХОД В СИСТЕМУ
  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Поиск пользователя в тестовой базе
      const user = testUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      )

      if (user) {
        // Успешный вход
        const userData = {
          ...user,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('gkbr_user_data', JSON.stringify(userData))
        onLogin(userData)
      } else {
        setErrors({ submit: 'Неверный email или пароль' })
      }
    } catch (error) {
      setErrors({ submit: 'Ошибка входа в систему' })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ РЕГИСТРАЦИЯ
  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Проверка на существующего пользователя
      const existingUser = testUsers.find(u => u.email === formData.email)
      if (existingUser) {
        setErrors({ submit: 'Пользователь с таким email уже существует' })
        setIsLoading(false)
        return
      }

      // Создание нового пользователя
      const newUser = {
        id: `user_${Date.now()}`,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'student',
        isLoggedIn: true,
        registrationTime: new Date().toISOString(),
        loginTime: new Date().toISOString()
      }

      // Сохранение в локальной базе (в реальном приложении - отправка на сервер)
      const savedUsers = JSON.parse(localStorage.getItem('gkbr_users') || '[]')
      savedUsers.push(newUser)
      localStorage.setItem('gkbr_users', JSON.stringify(savedUsers))
      
      localStorage.setItem('gkbr_user_data', JSON.stringify(newUser))
      onLogin(newUser)
    } catch (error) {
      setErrors({ submit: 'Ошибка регистрации' })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ ОТПРАВКА ФОРМЫ
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      handleLogin()
    } else {
      handleRegister()
    }
  }

  // ✅ ПЕРЕКЛЮЧЕНИЕ РЕЖИМА
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  // ✅ БЫСТРЫЙ ВХОД ДЛЯ ТЕСТИРОВАНИЯ
  const quickLogin = (userType) => {
    const user = userType === 'admin' ? testUsers[0] : testUsers[1]
    setFormData({
      email: user.email,
      password: user.password,
      fullName: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-4xl font-bold text-white mb-2">GKBR Platform</h1>
          <p className="text-blue-200">
            {isLogin ? 'Войдите в систему обучения' : 'Создайте учетную запись'}
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Поля регистрации */}
            {!isLogin && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Полное имя
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Введите ваше имя"
                />
                {errors.fullName && (
                  <p className="mt-1 text-red-400 text-sm">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="example@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Введите пароль"
              />
              {errors.password && (
                <p className="mt-1 text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Подтверждение пароля для регистрации */}
            {!isLogin && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Подтверждение пароля
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Повторите пароль"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </div>
              ) : (
                isLogin ? 'Войти в систему' : 'Зарегистрироваться'
              )}
            </button>
          </form>

          {/* Переключение режима */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрируйтесь' 
                : 'Уже есть аккаунт? Войдите'
              }
            </button>
          </div>

          {/* Быстрый вход для тестирования */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white text-sm text-center mb-3">Быстрый вход для тестирования:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => quickLogin('admin')}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-sm py-2 px-3 rounded-lg transition-all"
                >
                  👑 Админ
                </button>
                <button
                  onClick={() => quickLogin('student')}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-200 text-sm py-2 px-3 rounded-lg transition-all"
                >
                  🎓 Студент
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center text-blue-300 text-sm">
          <p>🔒 Ваши данные надежно защищены</p>
          <p className="mt-1">Премиальная платформа обучения GKBR</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen