import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Премиальные компоненты
import { PremiumCard, RippleButton } from '../components/premium/PremiumUI.jsx'
import { useSounds } from '../components/premium/SoundSystem.jsx'

// Компоненты UI
import ProgressBar, { CircularProgress } from './ProgressBar.jsx'
import BadgeMeter from './BadgeMeter.jsx'
import { notify } from './NotificationPanel.jsx'

// API
import { authApi } from '../api/mockAuthApi.js'

const UserCard = ({ variant = "full", showActions = true, className = "" }) => {
  const navigate = useNavigate()
  const { sounds } = useSounds()
  
  const [userData, setUserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      const user = await authApi.fetchCurrentUser()
      if (user) {
        setUserData(user)
        setEditForm({
          fullName: user.fullName || '',
          department: user.department || '',
          email: user.email || ''
        })
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя через API:', error)
      notify.error('Ошибка загрузки профиля', error.message || 'Пожалуйста, попробуйте снова.')
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const saveUserData = async () => {
    setIsLoading(true)
    try {
      if (!userData || !userData.id) {
        throw new Error('Данные пользователя отсутствуют для сохранения.')
      }

      const updatedUser = {
        ...userData,
        ...editForm,
      }

      const result = await authApi.updateUser(updatedUser)
      setUserData(result)
      setIsEditing(false)
      sounds.success()
      notify.success('Профиль обновлен', 'Ваши данные успешно сохранены.')
    } catch (error) {
      console.error('Ошибка сохранения данных пользователя через API:', error)
      sounds.error()
      notify.error('Ошибка сохранения', error.message || 'Не удалось обновить профиль.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
      sounds.click()
      navigate('/login')
    } catch (error) {
      console.error('Ошибка выхода через API:', error)
      sounds.error()
      notify.error('Ошибка выхода', error.message || 'Не удалось выйти из системы.')
      navigate('/login')
    }
  }

  const getRoleDisplayName = (role) => {
    const roles = {
      user: 'Пользователь',
      hr: 'HR-специалист',
      manager: 'Руководитель',
      superadmin_s: 'Суперадминистратор'
    }
    return roles[role] || role
  }

  const getRoleColor = (role) => {
    const colors = {
      user: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      hr: 'bg-green-500/20 text-green-300 border-green-400/30',
      manager: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      superadmin_s: 'bg-red-500/20 text-red-300 border-red-400/30'
    }
    return colors[role] || colors.user
  }

  const getDepartmentIcon = (department) => {
    const icons = {
      sales: '💼',
      marketing: '📢',
      hr: '👥',
      management: '🏛️',
      other: '⚙️'
    }
    return icons[department] || '🏢'
  }

  const getCompletionStats = () => {
    if (!userData) return { completed: 0, total: 21, percentage: 0, totalScore: 0 }
    
    const completed = userData.completedModules?.length || 0
    const totalScore = userData.score || 0
    const percentage = Math.round((completed / 21) * 100)
    
    return { completed, total: 21, percentage, totalScore }
  }

  const getRecentActivity = () => {
    const stats = getCompletionStats()
    return [
      { action: 'Завершен модуль', target: 'СРО', time: '2 часа назад', icon: '✅' },
      { action: 'Набрано баллов', target: `${stats.totalScore}`, time: 'сегодня', icon: '🏆' },
      { action: 'Вход в систему', target: 'GKBR Platform', time: 'сегодня', icon: '🔐' }
    ]
  }

  if (isLoading) {
    return (
      <PremiumCard className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-white/20 rounded-full w-16 mx-auto"></div>
          <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
        </div>
      </PremiumCard>
    )
  }

  if (!userData) {
    return (
      <PremiumCard className={className}>
        <div className="text-center text-white">
          <p>Пользователь не найден</p>
          <RippleButton 
            onClick={() => navigate('/login')}
            className="mt-4"
            variant="glow"
          >
            Войти
          </RippleButton>
        </div>
      </PremiumCard>
    )
  }

  const stats = getCompletionStats()
  const recentActivity = getRecentActivity()

  // Модальное окно редактирования
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <PremiumCard variant="glow" className="max-w-md w-full">
          <h3 className="text-2xl font-bold text-white mb-6">Редактирование профиля</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-blue-200 mb-2">Полное имя</label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-200 mb-2">Отдел</label>
              <select
                name="department"
                value={editForm.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-slate-800">Выберите отдел</option>
                <option value="sales" className="bg-slate-800">Продажи</option>
                <option value="marketing" className="bg-slate-800">Маркетинг</option>
                <option value="hr" className="bg-slate-800">HR</option>
                <option value="management" className="bg-slate-800">Руководство</option>
                <option value="other" className="bg-slate-800">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-blue-200 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <RippleButton
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1"
            >
              Отмена
            </RippleButton>
            <RippleButton
              onClick={saveUserData}
              variant="glow"
              className="flex-1"
              disabled={isLoading}
            >
              Сохранить
            </RippleButton>
          </div>
        </PremiumCard>
      </div>
    )
  }

  // Компактный вариант
  if (variant === "compact") {
    return (
      <PremiumCard className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          {/* Аватар */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userData.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          {/* Основная информация */}
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">{userData.fullName}</div>
            <div className="text-blue-200 text-xs">
              {getDepartmentIcon(userData.department)} {userData.department}
            </div>
          </div>

          {/* Прогресс */}
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">{stats.totalScore}</div>
            <div className="text-blue-200 text-xs">баллов</div>
          </div>

          {/* Кнопка действий */}
          {showActions && (
            <RippleButton
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="small"
              className="w-8 h-8 p-0"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </RippleButton>
          )}
        </div>
      </PremiumCard>
    )
  }

  // Полный вариант карточки
  return (
    <PremiumCard variant="glow" className={`p-8 ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Профиль пользователя</h3>
        {showActions && (
          <div className="flex space-x-2">
            <RippleButton
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="small"
              className="p-2"
              title="Редактировать профиль"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </RippleButton>
            <RippleButton
              onClick={handleLogout}
              variant="ghost"
              size="small"
              className="p-2 text-red-300 hover:bg-red-500/20"
              title="Выйти"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </RippleButton>
          </div>
        )}
      </div>

      {/* Основная информация */}
      <div className="flex items-center space-x-6 mb-8">
        {/* Аватар */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
          {userData.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        {/* Информация */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-white mb-1">{userData.fullName}</h4>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getDepartmentIcon(userData.department)}</span>
            <span className="text-blue-200">{userData.department}</span>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
            {getRoleDisplayName(userData.role)}
          </div>
        </div>

        {/* Статистика */}
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.totalScore}</div>
          <div className="text-blue-200 text-sm">баллов</div>
        </div>
      </div>

      {/* Прогресс обучения */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-lg font-semibold text-white">Прогресс обучения</h5>
          <span className="text-blue-200 text-sm">{stats.completed} из {stats.total} модулей</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <ProgressBar value={stats.percentage} />
          </div>
          <div className="w-16 h-16">
            <CircularProgress value={stats.percentage} />
          </div>
        </div>
      </div>

      {/* Достижения */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold text-white mb-4">Достижения</h5>
        <BadgeMeter 
          earnedBadges={userData.badges || []}
          totalBadges={['beginner', 'expert', 'master', 'champion']}
        />
      </div>

      {/* Недавняя активность */}
      <div>
        <h5 className="text-lg font-semibold text-white mb-4">Недавняя активность</h5>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <span className="text-lg">{activity.icon}</span>
              <span className="text-white">{activity.action}</span>
              <span className="text-blue-300 font-medium">{activity.target}</span>
              <span className="text-blue-200 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </PremiumCard>
  )
}

export default UserCard