// PremiumForms.jsx - Премиальные формы и элементы ввода
// Путь: src/components/premium/PremiumForms.jsx

import React, { useState, useRef, useEffect } from 'react'
import { useDesignSystem } from './DesignSystem.jsx'
import { GlowEffect } from './VisualEffects.jsx'

// 🎨 ПРЕМИАЛЬНОЕ ПОЛЕ ВВОДА
export const PremiumInput = ({ 
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  required = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setHasValue(value && value.length > 0)
  }, [value])

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  const variants = {
    default: 'bg-white/10 border-white/20 focus:border-primary-400',
    glass: 'bg-white/5 border-white/10 focus:border-primary-400',
    outlined: 'bg-transparent border-2 border-white/30 focus:border-primary-500',
    filled: 'bg-neutral-800 border-neutral-700 focus:border-primary-400'
  }

  const getStatusClasses = () => {
    if (error) return 'border-red-400 focus:border-red-500'
    if (success) return 'border-green-400 focus:border-green-500'
    return variants[variant]
  }

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-300
          ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-neutral-300'}
        `}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}

        {/* Input field */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-xl backdrop-blur-lg text-white placeholder-neutral-400
            transition-all duration-300 outline-none
            ${sizes[size]}
            ${icon ? 'pl-10' : ''}
            ${getStatusClasses()}
            ${isFocused ? 'shadow-lg shadow-primary-500/20 transform scale-[1.02]' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-opacity-60'}
          `}
        />

        {/* Floating label effect */}
        {variant === 'outlined' && label && (
          <div className={`
            absolute left-3 transition-all duration-300 pointer-events-none
            ${isFocused || hasValue 
              ? '-top-2 text-xs bg-neutral-900 px-2 text-primary-400' 
              : 'top-1/2 transform -translate-y-1/2 text-neutral-400'
            }
          `}>
            {label}
          </div>
        )}

        {/* Focus glow effect */}
        {isFocused && !error && !disabled && (
          <div className="absolute inset-0 rounded-xl border-2 border-primary-400 pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-primary-400/10" />
          </div>
        )}
      </div>

      {/* Helper text */}
      {(error || success) && (
        <div className={`mt-2 text-sm flex items-center space-x-2 ${
          error ? 'text-red-400' : 'text-green-400'
        }`}>
          <span>{error ? '⚠️' : '✅'}</span>
          <span>{error || success}</span>
        </div>
      )}
    </div>
  )
}

// 🎛️ ПРЕМИАЛЬНЫЙ SELECT
export const PremiumSelect = ({ 
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Выберите опцию...',
  error,
  variant = 'default',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label}
        </label>
      )}

      {/* Select trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-left rounded-xl backdrop-blur-lg transition-all duration-300
          bg-white/10 border border-white/20 hover:border-white/40
          ${isOpen ? 'border-primary-400 shadow-lg shadow-primary-500/20' : ''}
          ${error ? 'border-red-400' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-white' : 'text-neutral-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            {options.length > 5 && (
              <div className="p-3 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 outline-none focus:border-primary-400"
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange?.(option.value)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`
                      w-full px-4 py-3 text-left transition-colors duration-200
                      ${value === option.value 
                        ? 'bg-primary-500/20 text-primary-300' 
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-neutral-400 text-center">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-400 flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// 🎚️ ПРЕМИАЛЬНЫЙ СЛАЙДЕР
export const PremiumSlider = ({ 
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  color = 'primary',
  className = ''
}) => {
  const { colors } = useDesignSystem()
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseDown = (e) => {
    setIsDragging(true)
    updateValue(e)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValue(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateValue = (e) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newValue = min + percent * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    
    onChange?.(Math.max(min, Math.min(max, steppedValue)))
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const baseColor = colors[color]?.[500] || colors.primary[500]

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && <span className="text-sm font-medium text-neutral-300">{label}</span>}
          {showValue && <span className="text-sm text-white font-medium">{value}</span>}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-neutral-700 rounded-full cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Progress */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
            style={{
              width: `${percentage}%`,
              backgroundColor: baseColor
            }}
          />

          {/* Thumb */}
          <div
            className={`
              absolute top-1/2 w-5 h-5 rounded-full border-2 border-white cursor-pointer
              transform -translate-y-1/2 transition-all duration-200
              ${isDragging ? 'scale-125 shadow-lg' : 'hover:scale-110'}
            `}
            style={{
              left: `${percentage}%`,
              marginLeft: '-10px',
              backgroundColor: baseColor,
              boxShadow: isDragging ? `0 0 0 8px ${baseColor}33` : 'none'
            }}
          />
        </div>

        {/* Value indicators */}
        <div className="flex justify-between mt-2 text-xs text-neutral-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}

// 🎛️ ПЕРЕКЛЮЧАТЕЛЬ
export const PremiumToggle = ({ 
  label,
  checked = false,
  onChange,
  size = 'md',
  color = 'primary',
  disabled = false,
  className = ''
}) => {
  const { colors } = useDesignSystem()

  const sizes = {
    sm: { container: 'w-8 h-4', thumb: 'w-3 h-3' },
    md: { container: 'w-12 h-6', thumb: 'w-5 h-5' },
    lg: { container: 'w-16 h-8', thumb: 'w-7 h-7' }
  }

  const sizeConfig = sizes[size]
  const baseColor = colors[color]?.[500] || colors.primary[500]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={`
          ${sizeConfig.container} rounded-full relative transition-all duration-300 focus:outline-none
          ${checked ? '' : 'bg-neutral-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: checked ? baseColor : undefined
        }}
      >
        <div
          className={`
            ${sizeConfig.thumb} bg-white rounded-full shadow-md transition-all duration-300 transform
            ${checked ? `translate-x-${size === 'sm' ? '4' : size === 'md' ? '6' : '8'}` : 'translate-x-0.5'}
            ${disabled ? '' : 'group-hover:shadow-lg'}
          `}
        />
        
        {/* Glow effect when checked */}
        {checked && !disabled && (
          <div 
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              boxShadow: `0 0 0 2px ${baseColor}66`
            }}
          />
        )}
      </button>

      {label && (
        <span className={`text-sm ${disabled ? 'text-neutral-500' : 'text-white'}`}>
          {label}
        </span>
      )}
    </div>
  )
}

// 📝 ПРЕМИАЛЬНАЯ TEXTAREA
export const PremiumTextarea = ({ 
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  success,
  maxLength,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(value?.length || 0)

  useEffect(() => {
    setCharCount(value?.length || 0)
  }, [value])

  return (
    <div className={className}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-300
          ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-neutral-300'}
        `}>
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-xl backdrop-blur-lg text-white placeholder-neutral-400
            transition-all duration-300 outline-none resize-none
            bg-white/10 border border-white/20 hover:border-white/40
            ${isFocused ? 'border-primary-400 shadow-lg shadow-primary-500/20' : ''}
            ${error ? 'border-red-400' : success ? 'border-green-400' : ''}
          `}
        />

        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-neutral-400">
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {(error || success) && (
        <div className={`mt-2 text-sm flex items-center space-x-2 ${
          error ? 'text-red-400' : 'text-green-400'
        }`}>
          <span>{error ? '⚠️' : '✅'}</span>
          <span>{error || success}</span>
        </div>
      )}
    </div>
  )
}

// 🎨 ФОРМА-КОНТЕЙНЕР
export const PremiumForm = ({ 
  children,
  onSubmit,
  title,
  subtitle,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-lg border border-white/20',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    prominent: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-primary-400/30'
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`${variants[variant]} rounded-2xl p-6 space-y-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </form>
  )
}

export default {
  PremiumInput,
  PremiumSelect,
  PremiumSlider,
  PremiumToggle,
  PremiumTextarea,
  PremiumForm
}