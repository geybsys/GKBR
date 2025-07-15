// PremiumLayouts.jsx - Премиальные лейауты и контейнеры
// Путь: src/components/premium/PremiumLayouts.jsx

import React from 'react'

// 📦 ПРЕМИАЛЬНЫЙ КОНТЕЙНЕР
export const PremiumContainer = ({ 
  children,
  variant = 'default',
  padding = 'normal',
  maxWidth = 'full',
  background = true,
  className = '' 
}) => {
  const variants = {
    default: 'bg-slate-900',
    glass: 'bg-white/5 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
    dark: 'bg-black/50'
  }

  const paddings = {
    none: 'p-0',
    small: 'p-4',
    normal: 'p-6 md:p-8',
    large: 'p-8 md:p-12'
  }

  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={`
      ${background ? variants[variant] : ''}
      ${paddings[padding]}
      ${maxWidths[maxWidth]}
      mx-auto
      ${className}
    `}>
      {children}
    </div>
  )
}

// 🎯 ГЕРОИЧЕСКАЯ СЕКЦИЯ
export const HeroSection = ({ 
  title,
  subtitle,
  children,
  background = 'gradient',
  height = 'screen',
  align = 'center',
  effects = true,
  className = '' 
}) => {
  const backgrounds = {
    gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
    image: 'bg-cover bg-center bg-no-repeat',
    video: 'relative overflow-hidden',
    solid: 'bg-slate-900'
  }

  const heights = {
    auto: 'min-h-fit',
    half: 'min-h-[50vh]',
    screen: 'min-h-screen',
    custom: ''
  }

  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  return (
    <section className={`
      relative flex flex-col justify-center
      ${backgrounds[background]}
      ${heights[height]}
      ${alignments[align]}
      ${className}
    `}>
      {effects && (
        <>
          {/* Анимированный фон */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          </div>
          
          {/* Частицы */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </>
      )}

      <PremiumContainer maxWidth="lg" className="relative z-10">
        <div className="space-y-6">
          {title && (
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          )}
          
          {subtitle && (
            <p className="text-lg md:text-xl text-blue-200 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
          
          {children}
        </div>
      </PremiumContainer>
    </section>
  )
}

// 📊 СЕКЦИЯ СТАТИСТИКИ
export const StatsSection = ({ 
  stats = [],
  columns = 'auto',
  variant = 'cards',
  className = '' 
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: `grid-cols-1 ${
      stats.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
      stats.length === 3 ? 'md:grid-cols-3' :
      stats.length === 2 ? 'md:grid-cols-2' :
      'md:grid-cols-1'
    }`
  }

  const StatCard = ({ stat, index }) => (
    <div className={`
      ${variant === 'cards' ? 'bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20' : 'p-6'}
      text-center transform transition-all duration-500 hover:scale-105
      animate-fade-in-up
    `}
    style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-4xl mb-4">{stat.icon}</div>
      <div className="text-3xl font-bold text-white mb-2">
        {stat.value}
      </div>
      <div className="text-blue-200 text-sm">
        {stat.label}
      </div>
      {stat.description && (
        <div className="text-blue-300 text-xs mt-2 opacity-75">
          {stat.description}
        </div>
      )}
    </div>
  )

  return (
    <section className={`py-16 ${className}`}>
      <PremiumContainer>
        <div className={`grid gap-6 ${columnClasses[columns]}`}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </PremiumContainer>
    </section>
  )
}

// 🎨 ФУНКЦИОНАЛЬНАЯ СЕКЦИЯ
export const FeatureSection = ({ 
  title,
  subtitle,
  features = [],
  layout = 'grid',
  background = 'transparent',
  className = '' 
}) => {
  const layouts = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    list: 'space-y-8',
    carousel: 'flex space-x-6 overflow-x-auto pb-4'
  }

  const backgrounds = {
    transparent: '',
    glass: 'bg-white/5 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-white/5 to-white/10'
  }

  const FeatureCard = ({ feature, index }) => (
    <div className={`
      group p-6 rounded-2xl border border-white/20 transition-all duration-300
      hover:bg-white/10 hover:border-white/30 hover:transform hover:scale-105
      animate-fade-in-up
      ${backgrounds[background]}
    `}
    style={{ animationDelay: `${index * 150}ms` }}
    >
      {feature.icon && (
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
          {feature.icon}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-white mb-3">
        {feature.title}
      </h3>
      
      <p className="text-blue-200 leading-relaxed">
        {feature.description}
      </p>
      
      {feature.link && (
        <div className="mt-4">
          <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            {feature.link} →
          </button>
        </div>
      )}
    </div>
  )

  return (
    <section className={`py-16 ${className}`}>
      <PremiumContainer>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-blue-200 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className={layouts[layout]}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </PremiumContainer>
    </section>
  )
}

// 📞 СЕКЦИЯ ПРИЗЫВА К ДЕЙСТВИЮ
export const CTASection = ({ 
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  background = 'gradient',
  className = '' 
}) => {
  const backgrounds = {
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
    solid: 'bg-slate-800'
  }

  return (
    <section className={`py-16 ${className}`}>
      <PremiumContainer>
        <div className={`
          rounded-3xl p-12 text-center
          ${backgrounds[background]}
        `}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
          )}
          
          {subtitle && (
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton && (
              <button className="
                bg-white text-blue-600 font-bold py-4 px-8 rounded-xl
                hover:bg-blue-50 transition-all transform hover:scale-105
                shadow-lg
              ">
                {primaryButton}
              </button>
            )}
            
            {secondaryButton && (
              <button className="
                border-2 border-white text-white font-bold py-4 px-8 rounded-xl
                hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105
              ">
                {secondaryButton}
              </button>
            )}
          </div>
        </div>
      </PremiumContainer>
    </section>
  )
}

// 🎪 ГИБКИЙ ПРЕМИАЛЬНЫЙ ЛЕЙАУТ
export const FlexLayout = ({ 
  children,
  direction = 'column',
  align = 'center',
  justify = 'center',
  gap = 'normal',
  wrap = true,
  className = '' 
}) => {
  const directions = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  }

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gaps = {
    none: 'gap-0',
    small: 'gap-2',
    normal: 'gap-4',
    large: 'gap-8',
    xl: 'gap-12'
  }

  return (
    <div className={`
      flex
      ${directions[direction]}
      ${alignments[align]}
      ${justifications[justify]}
      ${gaps[gap]}
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default {
  PremiumContainer,
  HeroSection,
  StatsSection,
  FeatureSection,
  CTASection,
  FlexLayout
}