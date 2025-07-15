// RoleGate.jsx - Компонент защиты доступа по ролям пользователей
// Путь: src/components/RoleGate.jsx

import React from 'react'
import { auditLogger } from '../utils/auditLogger'

// 🎭 КОМПОНЕНТ ЗАЩИТЫ ПО РОЛЯМ
const RoleGate = ({ 
  children, 
  userRole, 
  requiredRole, 
  requiredRoles = [],
  allowedRoles = [],
  fallback = null,
  showAccessDenied = true 
}) => {

  // 📋 Определение всех разрешенных ролей
  const getAllowedRoles = () => {
    let roles = []
    
    if (requiredRole) {
      roles.push(requiredRole)
    }
    
    if (requiredRoles.length > 0) {
      roles = [...roles, ...requiredRoles]
    }
    
    if (allowedRoles.length > 0) {
      roles = [...roles, ...allowedRoles]
    }

    return [...new Set(roles)] // Убираем дубликаты
  }

  // 🔍 Проверка доступа по роли
  const hasAccess = () => {
    if (!userRole) {
      return false
    }

    const allowedRoles = getAllowedRoles()
    
    if (allowedRoles.length === 0) {
      // Если роли не указаны, доступ разрешен всем
      return true
    }

    // Проверка иерархии ролей
    return checkRoleHierarchy(userRole, allowedRoles)
  }

  // 👑 Проверка иерархии ролей
  const checkRoleHierarchy = (userRole, allowedRoles) => {
    // Иерархия ролей (от низшей к высшей)
    const roleHierarchy = {
      'student': 1,
      'user': 2,
      'instructor': 3,
      'moderator': 4,
      'admin': 5,
      'superadmin_s': 6
    }

    const userLevel = roleHierarchy[userRole] || 0
    
    // Проверяем, есть ли прямое совпадение
    if (allowedRoles.includes(userRole)) {
      return true
    }

    // Проверяем иерархию - пользователи с высшими ролями имеют доступ к функциям низших ролей
    const minRequiredLevel = Math.min(
      ...allowedRoles.map(role => roleHierarchy[role] || 999)
    )

    return userLevel >= minRequiredLevel
  }

  // 📊 Логирование попытки доступа
  const logAccessAttempt = (granted) => {
    auditLogger.log('role_access_attempt', {
      userRole,
      requiredRoles: getAllowedRoles(),
      accessGranted: granted,
      component: 'RoleGate'
    })
  }

  // Проверяем доступ
  const accessGranted = hasAccess()
  
  // Логируем попытку доступа
  logAccessAttempt(accessGranted)

  // Если доступ разрешен
  if (accessGranted) {
    return <>{children}</>
  }

  // Если доступ запрещен и есть custom fallback
  if (fallback) {
    return fallback
  }

  // Если не показывать экран "Доступ запрещен"
  if (!showAccessDenied) {
    return null
  }

  // Стандартный экран "Доступ запрещен"
  return (
    <AccessDeniedScreen 
      userRole={userRole}
      requiredRoles={getAllowedRoles()}
    />
  )
}

// 🚫 ЭКРАН "ДОСТУП ЗАПРЕЩЕН"
const AccessDeniedScreen = ({ userRole, requiredRoles }) => {
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'student': 'Студент',
      'user': 'Пользователь',
      'instructor': 'Инструктор',
      'moderator': 'Модератор',
      'admin': 'Администратор',
      'superadmin_s': 'Суперадминистратор'
    }
    return roleNames[role] || role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        {/* Иконка */}
        <div className="text-8xl mb-6">🔒</div>
        
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          Доступ ограничен
        </h1>
        
        {/* Описание */}
        <p className="text-red-600 mb-6">
          У вас недостаточно прав для доступа к этому разделу.
        </p>
        
        {/* Информация о ролях */}
        <div className="bg-white rounded-lg p-6 mb-6 text-left">
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-600">Ваша роль:</span>
            <div className="text-lg font-bold text-blue-600">
              {getRoleDisplayName(userRole)}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-semibold text-gray-600">Требуемые роли:</span>
            <div className="mt-2 space-y-1">
              {requiredRoles.map(role => (
                <div key={role} className="text-sm bg-gray-100 rounded px-2 py-1 inline-block mr-2">
                  {getRoleDisplayName(role)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold"
          >
            ← Вернуться назад
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all"
          >
            🏠 На главную
          </button>
        </div>

        {/* Подсказка */}
        <p className="text-xs text-gray-500 mt-6">
          Если вы считаете, что это ошибка, обратитесь к администратору
        </p>
      </div>
    </div>
  )
}

// 🛠️ ВСПОМОГАТЕЛЬНЫЕ ХУКИ И КОМПОНЕНТЫ

// Хук для проверки роли
export const useRoleCheck = (userRole) => {
  const hasRole = (requiredRole) => {
    return new RoleGate({ userRole, requiredRole }).hasAccess()
  }

  const hasAnyRole = (roles) => {
    return roles.some(role => hasRole(role))
  }

  const hasAllRoles = (roles) => {
    return roles.every(role => hasRole(role))
  }

  const isAdmin = () => {
    return hasAnyRole(['admin', 'superadmin_s'])
  }

  const isSuperAdmin = () => {
    return hasRole('superadmin_s')
  }

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isSuperAdmin,
    userRole
  }
}

// Компонент для условного рендеринга на основе роли
export const RoleBasedRender = ({ 
  userRole, 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const hasAccess = allowedRoles.includes(userRole)
  return hasAccess ? children : fallback
}

// HOC для защиты компонентов по ролям
export const withRoleProtection = (WrappedComponent, requiredRoles) => {
  return function ProtectedComponent(props) {
    return (
      <RoleGate 
        userRole={props.userRole} 
        requiredRoles={requiredRoles}
      >
        <WrappedComponent {...props} />
      </RoleGate>
    )
  }
}

export default RoleGate