// InteractiveTooltips.jsx - Система интерактивных подсказок и всплывающих элементов
// Путь: src/components/premium/InteractiveTooltips.jsx

import React, { useState, useRef, useEffect } from 'react'

// 🎯 ОСНОВНОЙ КОМПОНЕНТ TOOLTIP
export const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  trigger = 'hover',
  delay = 200,
  className = '',
  maxWidth = '200px',
  interactive = false,
  arrow = true,
  theme = 'dark'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  // 🎨 ТЕМЫ
  const themes = {
    dark: 'bg-gray-900 text-white border-gray-700',
    light: 'bg-white text-gray-900 border-gray-300 shadow-lg',
    info: 'bg-blue-600 text-white border-blue-500',
    success: 'bg-green-600 text-white border-green-500',
    warning: 'bg-yellow-600 text-white border-yellow-500',
    error: 'bg-red-600 text-white border-red-500'
  }

  // 📍 ПОЗИЦИИ
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  // 🔺 СТРЕЛКИ
  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-0',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-0',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-0',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-0'
  }

  // 🔍 ОПРЕДЕЛЕНИЕ ОПТИМАЛЬНОЙ ПОЗИЦИИ
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let newPosition = position

    // Проверяем, помещается ли tooltip в выбранной позиции
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom'
        }
        break
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height) {
          newPosition = 'top'
        }
        break
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right'
        }
        break
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width) {
          newPosition = 'left'
        }
        break
    }

    setActualPosition(newPosition)
  }

  // 👆 ОБРАБОТЧИКИ СОБЫТИЙ
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delay)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      clearTimeout(timeoutRef.current)
      if (!interactive) {
        setIsVisible(false)
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false)
        }, 100)
      }
    }
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
    }
  }

  const handleFocus = () => {
    if (trigger === 'focus') {
      setIsVisible(true)
    }
  }

  const handleBlur = () => {
    if (trigger === 'focus') {
      setIsVisible(false)
    }
  }

  // 🔄 ОБНОВЛЕНИЕ ПОЗИЦИИ
  useEffect(() => {
    if (isVisible) {
      calculatePosition()
      window.addEventListener('scroll', calculatePosition)
      window.addEventListener('resize', calculatePosition)
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isVisible])

  return (
    <div className="relative inline-block">
      {/* ТРИГГЕР */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
      >
        {children}
      </div>

      {/* TOOLTIP */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm rounded-lg border
            transition-all duration-200 ease-in-out
            ${positions[actualPosition]}
            ${themes[theme]}
            animate-fadeIn
          `}
          style={{ maxWidth }}
          onMouseEnter={() => interactive && clearTimeout(timeoutRef.current)}
          onMouseLeave={() => interactive && handleMouseLeave()}
        >
          {/* КОНТЕНТ */}
          {typeof content === 'string' ? (
            <span>{content}</span>
          ) : (
            content
          )}

          {/* СТРЕЛКА */}
          {arrow && (
            <div
              className={`
                absolute w-0 h-0 border-4
                ${arrows[actualPosition]}
                ${theme === 'dark' ? 'border-gray-900' : 
                  theme === 'light' ? 'border-white' : 
                  `border-${theme.split('-')[0]}-600`}
              `}
            />
          )}
        </div>
      )}
    </div>
  )
}

// 💡 ИНФОРМАЦИОННАЯ ПОДСКАЗКА
export const InfoTooltip = ({ children, info, ...props }) => (
  <Tooltip 
    content={info} 
    theme="info" 
    position="top"
    {...props}
  >
    <span className="inline-flex items-center">
      {children}
      <span className="ml-1 text-blue-500 cursor-help">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </span>
    </span>
  </Tooltip>
)

// ❓ ПОДСКАЗКА-ВОПРОС
export const HelpTooltip = ({ children, help, ...props }) => (
  <Tooltip 
    content={help} 
    theme="light" 
    position="right"
    interactive={true}
    {...props}
  >
    <span className="inline-flex items-center cursor-help">
      {children}
      <span className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a1.5 1.5 0 112.12 2.12L10 10.06V11a1 1 0 11-2 0v-1.5a1 1 0 01.5-.86l1.5-.75a.5.5 0 000-.89.5.5 0 00-.5-.5.5.5 0 00-.5.5 1 1 0 11-2 0 2.5 2.5 0 015 0zm0 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </span>
    </span>
  </Tooltip>
)

// 🎯 ИНТЕРАКТИВНЫЙ ПОПОВЕР
export const Popover = ({ 
  children, 
  content, 
  title,
  trigger = 'click',
  position = 'bottom',
  className = '',
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  // 🔒 ЗАКРЫТИЕ ПО КЛИКУ ВНЕ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
        if (onClose) onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* ТРИГГЕР */}
      <div
        onClick={() => trigger === 'click' && setIsOpen(!isOpen)}
        onMouseEnter={() => trigger === 'hover' && setIsOpen(true)}
        onMouseLeave={() => trigger === 'hover' && setIsOpen(false)}
        className={className}
      >
        {children}
      </div>

      {/* ПОПОВЕР */}
      {isOpen && (
        <div className={`
          absolute z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          ${position === 'left' ? 'right-full mr-2' : position === 'right' ? 'left-full ml-2' : 'left-0'}
          animate-slideIn
        `}>
          {/* ЗАГОЛОВОК */}
          {title && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* КОНТЕНТ */}
          <div className="p-4">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

// 🎨 TOOLTIP С БОГАТЫМ КОНТЕНТОМ
export const RichTooltip = ({ 
  children, 
  title, 
  description, 
  image, 
  actions = [],
  ...props 
}) => {
  const content = (
    <div className="max-w-xs">
      {/* ИЗОБРАЖЕНИЕ */}
      {image && (
        <div className="mb-3">
          <img src={image} alt={title} className="w-full h-24 object-cover rounded" />
        </div>
      )}

      {/* ЗАГОЛОВОК */}
      {title && (
        <h4 className="font-semibold text-sm mb-2">{title}</h4>
      )}

      {/* ОПИСАНИЕ */}
      {description && (
        <p className="text-xs opacity-90 mb-3">{description}</p>
      )}

      {/* ДЕЙСТВИЯ */}
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.handler}
              className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Tooltip 
      content={content} 
      interactive={true}
      maxWidth="320px"
      {...props}
    >
      {children}
    </Tooltip>
  )
}

// 🎯 КОНТЕКСТНОЕ МЕНЮ
export const ContextMenu = ({ 
  children, 
  items = [], 
  onItemClick,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  const handleContextMenu = (e) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  const handleItemClick = (item, index) => {
    setIsOpen(false)
    if (onItemClick) onItemClick(item, index)
    if (item.handler) item.handler()
  }

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48"
          style={{ 
            left: position.x, 
            top: position.y,
            maxWidth: '200px'
          }}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.divider ? (
                <hr className="my-1 border-gray-100" />
              ) : (
                <button
                  onClick={() => handleItemClick(item, index)}
                  disabled={item.disabled}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors
                    ${item.disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${item.danger ? 'hover:bg-red-50 hover:text-red-600' : ''}
                  `}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-gray-400">
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// 🎨 АНИМАЦИИ CSS
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`

// Вставляем стили
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default {
  Tooltip,
  InfoTooltip,
  HelpTooltip,
  Popover,
  RichTooltip,
  ContextMenu
}