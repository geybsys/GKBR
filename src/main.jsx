// main.jsx - Обновленная точка входа с премиальным UI
// Путь: src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// 🎨 ПРЕМИАЛЬНАЯ СИСТЕМА UI (ФАЗА 2)
import { PremiumUIProvider } from './components/premium/PremiumUI.jsx'
import { SoundProvider } from './components/premium/SoundSystem.jsx'
import { DesignSystemProvider } from './components/premium/DesignSystem.jsx'

// 🎯 СТИЛИ
import './styles/main.css'
import './styles/variables.css'

// 🔧 Проверка наличия root элемента
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found! Make sure you have <div id="root"></div> in your HTML.')
}

// 🚀 Инициализация приложения с премиальными провайдерами
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DesignSystemProvider>
        <SoundProvider>
          <PremiumUIProvider>
            <App />
          </PremiumUIProvider>
        </SoundProvider>
      </DesignSystemProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// 📊 Логирование успешного запуска с премиальным UI
console.log('🚀 GKBR Platform initialized successfully!')
console.log('📊 Version: 2.0.0 (Premium UI)')
console.log('🏢 Type: Premium Corporate Platform')
console.log('🎨 UI System: Premium Components Enabled')
console.log('🔊 Sound System: Enabled')
console.log('⚙️ Mode:', import.meta.env.MODE)

// 🔧 Глобальные обработчики ошибок для разработки
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason)
  })
}

// 🎯 Информация о премиальной платформе
console.log(`
🏢 GKBR Platform v2.0.0 - PREMIUM EDITION
═══════════════════════════════════════════════════════════
📚 Премиальная система корпоративного обучения
🎨 Premium UI Components - Активированы
🔊 Sound System - Включена
⚡ Высокая производительность
🎯 Модульная архитектура  
🔒 Защищенные маршруты
📊 Система прогресса и мотивации
✨ Визуальные эффекты и анимации
🎭 Интерактивные элементы
🌟 Glassmorphism дизайн

🚀 ПРЕМИАЛЬНАЯ ПЛАТФОРМА УСПЕШНО ЗАПУЩЕНА!
═══════════════════════════════════════════════════════════
`)

// 🔧 Утилиты для разработки (только в dev режиме)
if (import.meta.env.DEV) {
  // Добавляем глобальные хелперы для отладки
  window.GKBR = {
    version: '2.0.0',
    type: 'Premium Corporate Platform',
    ui: 'Premium Components',
    
    // Управление данными
    clearStorage: () => {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('gkbr_')) {
          localStorage.removeItem(key)
        }
      })
      console.log('🧹 Данные GKBR очищены из localStorage')
    },
    
    // Просмотр данных пользователя
    showUserData: () => {
      const userData = localStorage.getItem('gkbr_user_data')
      console.log('👤 Данные пользователя:', userData ? JSON.parse(userData) : 'Не найдены')
    },
    
    // Просмотр прогресса
    showProgress: () => {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('gkbr_progress_'))
      console.log('📊 Прогресс пользователей:', keys.map(key => ({
        key,
        data: JSON.parse(localStorage.getItem(key) || '{}')
      })))
    },
    
    // Управление темами
    setTheme: (theme) => {
      localStorage.setItem('gkbr_theme', theme)
      console.log(`🎨 Тема изменена на: ${theme}`)
      window.location.reload()
    },
    
    // Управление звуком
    toggleSound: () => {
      const current = localStorage.getItem('gkbr_sound_enabled')
      const newValue = current === 'false' ? 'true' : 'false'
      localStorage.setItem('gkbr_sound_enabled', newValue)
      console.log(`🔊 Звук ${newValue === 'true' ? 'включен' : 'выключен'}`)
      window.location.reload()
    },
    
    // Тестирование компонентов
    testUI: () => {
      console.log('🎨 Доступные премиальные компоненты:')
      console.log('- ✨ VisualEffects: GlowEffect, GlassEffect, GradientBackground')
      console.log('- 🎭 AnimatedComponents: AnimatedCounter, TypewriterEffect, MagneticElement')
      console.log('- 🎯 InteractiveElements: InteractiveCard, RippleButton, AnimatedModal')
      console.log('- 🔄 LoadingStates: GradientSpinner, AnimatedProgressBar, DotsLoader')
      console.log('- 🔊 SoundSystem: useSounds, SoundProvider')
      console.log('- 🎨 DesignSystem: useDesignSystem, colors, animations')
    },
    
    // Информация о производительности
    performance: () => {
      const perf = performance.getEntriesByType('navigation')[0]
      console.log('⚡ Производительность загрузки:')
      console.log(`- DOM загружен: ${Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart)}ms`)
      console.log(`- Полная загрузка: ${Math.round(perf.loadEventEnd - perf.loadEventStart)}ms`)
      console.log(`- Время до интерактивности: ${Math.round(perf.domInteractive - perf.fetchStart)}ms`)
    }
  }
  
  console.log('🛠️ Dev tools доступны в window.GKBR')
  console.log('📋 Команды: clearStorage(), showUserData(), showProgress(), setTheme(), toggleSound(), testUI(), performance()')
}

// 🎨 Инициализация темы по умолчанию
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('gkbr_theme') || 'corporate'
  const savedSound = localStorage.getItem('gkbr_sound_enabled') !== 'false'
  
  // Установка CSS переменных для темы
  document.documentElement.setAttribute('data-theme', savedTheme)
  document.documentElement.setAttribute('data-sound', savedSound)
  
  console.log(`🎨 Тема инициализирована: ${savedTheme}`)
  console.log(`🔊 Звук инициализирован: ${savedSound ? 'включен' : 'выключен'}`)
}

// Запуск инициализации темы
initializeTheme()

// 🚀 Уведомление о готовности к работе
setTimeout(() => {
  console.log('✅ GKBR Platform готова к работе!')
  console.log('🎯 Все премиальные компоненты загружены и активированы')
}, 1000)