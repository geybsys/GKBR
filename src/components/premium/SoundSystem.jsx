// SoundSystem.jsx - Премиальная звуковая система
// Путь: src/components/premium/SoundSystem.jsx

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

// 🎵 АУДИО КОНТЕКСТ
const SoundContext = createContext()

// 🎛️ ЗВУКОВЫЕ ЭФФЕКТЫ (Base64 или URL)
const SOUND_LIBRARY = {
  // Короткие звуки для UI (можно заменить на реальные файлы)
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Клик
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Успех
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Ошибка
  notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Уведомление
  whoosh: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Свист
  pop: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Поп
  badge: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/', // Значок
  pageTransition: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuM1vLOeCkFJ3vK7+SRNPY/' // Переход страницы
}

// 🎛️ ПРОВАЙДЕР ЗВУКОВОЙ СИСТЕМЫ
export const SoundProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolume] = useState(0.3)
  const [audioCache, setAudioCache] = useState({})
  const audioContextRef = useRef(null)

  // Инициализация аудио контекста
  useEffect(() => {
    // Загружаем настройки из localStorage
    const savedEnabled = localStorage.getItem('gkbr_sound_enabled')
    const savedVolume = localStorage.getItem('gkbr_sound_volume')
    
    if (savedEnabled !== null) {
      setIsEnabled(JSON.parse(savedEnabled))
    }
    
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume))
    }

    // Предзагрузка звуков
    preloadSounds()
  }, [])

  // Предзагрузка звуков для лучшей производительности
  const preloadSounds = async () => {
    const cache = {}
    
    for (const [name, url] of Object.entries(SOUND_LIBRARY)) {
      try {
        const audio = new Audio(url)
        audio.preload = 'auto'
        audio.volume = volume
        cache[name] = audio
      } catch (error) {
        console.warn(`Не удалось загрузить звук ${name}:`, error)
      }
    }
    
    setAudioCache(cache)
  }

  // Воспроизведение звука
  const playSound = async (soundName, options = {}) => {
    if (!isEnabled || !audioCache[soundName]) {
      return
    }

    try {
      const audio = audioCache[soundName].cloneNode()
      audio.volume = (options.volume ?? volume) * (options.volumeMultiplier ?? 1)
      audio.playbackRate = options.playbackRate ?? 1
      
      // Применяем фильтры если есть Web Audio API
      if (options.filter && audioContextRef.current) {
        // Реализация фильтров через Web Audio API
        // Пока что простое воспроизведение
      }
      
      await audio.play()
      
      // Освобождаем память после воспроизведения
      audio.addEventListener('ended', () => {
        audio.remove()
      })
      
    } catch (error) {
      console.warn(`Ошибка воспроизведения звука ${soundName}:`, error)
    }
  }

  // Включение/выключение звуков
  const toggleSound = () => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    localStorage.setItem('gkbr_sound_enabled', JSON.stringify(newEnabled))
  }

  // Изменение громкости
  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    localStorage.setItem('gkbr_sound_volume', clampedVolume.toString())
    
    // Обновляем громкость в кэше
    Object.values(audioCache).forEach(audio => {
      audio.volume = clampedVolume
    })
  }

  // Быстрые методы для частых звуков
  const sounds = {
    click: () => playSound('click'),
    success: () => playSound('success', { volumeMultiplier: 1.2 }),
    error: () => playSound('error', { volumeMultiplier: 1.1 }),
    notification: () => playSound('notification'),
    whoosh: () => playSound('whoosh', { volumeMultiplier: 0.8 }),
    pop: () => playSound('pop', { volumeMultiplier: 0.9 }),
    badge: () => playSound('badge', { volumeMultiplier: 1.3 }),
    pageTransition: () => playSound('pageTransition', { volumeMultiplier: 0.7 }),
    
    // Комбинированные эффекты
    buttonClick: () => {
      playSound('click')
      setTimeout(() => playSound('pop', { volumeMultiplier: 0.5 }), 50)
    },
    
    achievement: () => {
      playSound('success')
      setTimeout(() => playSound('badge'), 200)
    },
    
    levelUp: () => {
      playSound('whoosh')
      setTimeout(() => playSound('success', { playbackRate: 1.2 }), 300)
    },
    
    moduleComplete: () => {
      playSound('success', { volumeMultiplier: 1.5 })
      setTimeout(() => playSound('badge', { playbackRate: 1.1 }), 400)
      setTimeout(() => playSound('pop', { volumeMultiplier: 0.8 }), 600)
    }
  }

  const value = {
    isEnabled,
    volume,
    toggleSound,
    changeVolume,
    playSound,
    sounds
  }

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

// 🎵 ХУК ДЛЯ ИСПОЛЬЗОВАНИЯ ЗВУКОВ
export const useSounds = () => {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSounds должен использоваться внутри SoundProvider')
  }
  return context
}

// 🎛️ НАСТРОЙКИ ЗВУКА
export const SoundSettings = ({ className = '' }) => {
  const { isEnabled, volume, toggleSound, changeVolume, sounds } = useSounds()

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium">Звуковые эффекты</div>
          <div className="text-gray-400 text-sm">Включить звуки интерфейса</div>
        </div>
        
        <button
          onClick={toggleSound}
          className={`
            w-12 h-6 rounded-full relative transition-colors duration-300
            ${isEnabled ? 'bg-blue-500' : 'bg-gray-600'}
          `}
        >
          <div
            className={`
              w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
              ${isEnabled ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          {/* Регулятор громкости */}
          <div className="space-y-2">
            <label className="text-white text-sm">Громкость: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Тест звуков */}
          <div className="space-y-2">
            <label className="text-white text-sm">Тест звуков</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sounds.click()}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
              >
                Клик
              </button>
              <button
                onClick={() => sounds.success()}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
              >
                Успех
              </button>
              <button
                onClick={() => sounds.error()}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
              >
                Ошибка
              </button>
              <button
                onClick={() => sounds.achievement()}
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
              >
                Достижение
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 🎯 КНОПКА С ЗВУКОМ
export const SoundButton = ({ 
  children,
  soundType = 'click',
  onClick,
  className = '',
  ...props 
}) => {
  const { sounds } = useSounds()

  const handleClick = (e) => {
    sounds[soundType]?.()
    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// 🎊 АВТОМАТИЧЕСКИЕ ЗВУКИ ДЛЯ СОБЫТИЙ
export const useAutoSounds = () => {
  const { sounds } = useSounds()

  useEffect(() => {
    // Слушаем кастомные события для автоматического воспроизведения
    const handleSuccess = () => sounds.success?.()
    const handleError = () => sounds.error?.()
    const handleAchievement = () => sounds.achievement?.()
    const handleLevelUp = () => sounds.levelUp?.()
    const handleModuleComplete = () => sounds.moduleComplete?.()

    window.addEventListener('gkbr:success', handleSuccess)
    window.addEventListener('gkbr:error', handleError)
    window.addEventListener('gkbr:achievement', handleAchievement)
    window.addEventListener('gkbr:levelup', handleLevelUp)
    window.addEventListener('gkbr:module-complete', handleModuleComplete)

    return () => {
      window.removeEventListener('gkbr:success', handleSuccess)
      window.removeEventListener('gkbr:error', handleError)
      window.removeEventListener('gkbr:achievement', handleAchievement)
      window.removeEventListener('gkbr:levelup', handleLevelUp)
      window.removeEventListener('gkbr:module-complete', handleModuleComplete)
    }
  }, [sounds])

  // Функции для триггера событий
  const triggerSuccess = () => window.dispatchEvent(new Event('gkbr:success'))
  const triggerError = () => window.dispatchEvent(new Event('gkbr:error'))
  const triggerAchievement = () => window.dispatchEvent(new Event('gkbr:achievement'))
  const triggerLevelUp = () => window.dispatchEvent(new Event('gkbr:levelup'))
  const triggerModuleComplete = () => window.dispatchEvent(new Event('gkbr:module-complete'))

  return {
    triggerSuccess,
    triggerError,
    triggerAchievement,
    triggerLevelUp,
    triggerModuleComplete
  }
}

// 🎵 ХУКИ ДЛЯ ЖИЗНЕННОГО ЦИКЛА КОМПОНЕНТОВ
export const useSoundOnMount = (soundName = 'pop') => {
  const { sounds } = useSounds()
  
  useEffect(() => {
    sounds[soundName]?.()
  }, [sounds, soundName])
}

export const useSoundOnChange = (dependency, soundName = 'click') => {
  const { sounds } = useSounds()
  
  useEffect(() => {
    sounds[soundName]?.()
  }, [dependency, sounds, soundName])
}

// 🎯 ТРИГГЕР ЗВУКА
export const SoundTrigger = ({ 
  trigger, 
  soundName, 
  options = {},
  children 
}) => {
  const { playSound } = useSounds()
  
  useEffect(() => {
    if (trigger) {
      playSound(soundName, options)
    }
  }, [trigger, soundName, options, playSound])
  
  return children || null
}

// 🎨 ОСНОВНОЙ ЭКСПОРТ
export default {
  SoundProvider,
  useSounds,
  SoundSettings,
  SoundButton,
  useAutoSounds,
  useSoundOnMount,
  useSoundOnChange,
  SoundTrigger
}