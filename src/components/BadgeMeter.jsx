// BadgeMeter.jsx - Премиальная система достижений и значков
// Путь: src/components/BadgeMeter.jsx

import React, { useState, useEffect, useRef } from 'react'
import { GlassEffect, GlowEffect, ShimmerEffect } from './premium/VisualEffects'
import { AnimatedCounter, TypewriterEffect, PulseElement } from './premium/AnimatedComponents'
import { InteractiveCard, AnimatedModal, RippleButton } from './premium/InteractiveElements'
import { useSounds } from './premium/SoundSystem'

// 🏆 ОСНОВНОЙ КОМПОНЕНТ СИСТЕМЫ ДОСТИЖЕНИЙ
const BadgeMeter = ({ 
  userBadges = [],
  availableBadges = [],
  totalScore = 0,
  level = 1,
  nextLevelScore = 1000,
  showProgress = true,
  showStats = true,
  variant = 'horizontal', // horizontal, vertical, grid, compact
  className = '',
  onBadgeClick,
  ...props 
}) => {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showAllBadges, setShowAllBadges] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { sounds } = useSounds()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Вычисления
  const earnedBadges = userBadges || []
  const progressToNext = nextLevelScore > 0 ? (totalScore % 1000) / 10 : 0
  const badgesEarned = earnedBadges.length
  const totalBadges = availableBadges.length

  const handleBadgeClick = (badge) => {
    if (sounds) sounds.click()
    setSelectedBadge(badge)
    if (onBadgeClick) onBadgeClick(badge)
  }

  const layouts = {
    horizontal: 'flex items-center space-x-6',
    vertical: 'flex flex-col space-y-4',
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    compact: 'flex items-center space-x-3'
  }

  return (
    <div className={`${layouts[variant]} ${className}`} {...props}>
      {/* Уровень и очки */}
      {showStats && (
        <LevelDisplay 
          level={level}
          score={totalScore}
          nextLevelScore={nextLevelScore}
          progressToNext={progressToNext}
          variant={variant === 'compact' ? 'compact' : 'default'}
        />
      )}

      {/* Значки */}
      <BadgeCollection
        earnedBadges={earnedBadges}
        availableBadges={availableBadges}
        variant={variant}
        onBadgeClick={handleBadgeClick}
      />

      {/* Прогресс */}
      {showProgress && variant !== 'compact' && (
        <ProgressSection
          badgesEarned={badgesEarned}
          totalBadges={totalBadges}
          level={level}
          progressToNext={progressToNext}
        />
      )}

      {/* Модал детального просмотра значка */}
      <BadgeDetailModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />

      {/* Модал всех значков */}
      <AllBadgesModal
        earnedBadges={earnedBadges}
        availableBadges={availableBadges}
        isOpen={showAllBadges}
        onClose={() => setShowAllBadges(false)}
        onBadgeClick={handleBadgeClick}
      />
    </div>
  )
}

// 📊 ОТОБРАЖЕНИЕ УРОВНЯ
const LevelDisplay = ({ 
  level, 
  score, 
  nextLevelScore, 
  progressToNext,
  variant = 'default' 
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
          Ур. <AnimatedCounter value={level} />
        </div>
        <span className="text-yellow-300 text-sm">
          <AnimatedCounter value={score} />
        </span>
      </div>
    )
  }

  return (
    <GlassEffect className="p-4 text-center min-w-[140px]">
      <div className="text-3xl mb-2">⭐</div>
      <div className="text-2xl font-bold text-yellow-400 mb-1">
        Уровень <AnimatedCounter value={level} />
      </div>
      <div className="text-sm text-yellow-200 mb-3">
        <AnimatedCounter value={score} /> очков
      </div>
      
      {nextLevelScore > 0 && (
        <>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="text-xs text-yellow-300">
            До {level + 1} уровня: {1000 - (score % 1000)} очков
          </div>
        </>
      )}
    </GlassEffect>
  )
}

// 🎖️ КОЛЛЕКЦИЯ ЗНАЧКОВ
const BadgeCollection = ({ 
  earnedBadges, 
  availableBadges, 
  variant,
  onBadgeClick 
}) => {
  const displayCount = variant === 'compact' ? 3 : 5
  const recentBadges = earnedBadges.slice(-displayCount)

  return (
    <div className="flex items-center space-x-3">
      {/* Недавние значки */}
      <div className="flex items-center space-x-2">
        {recentBadges.map((badge, index) => (
          <Badge
            key={badge.id}
            badge={badge}
            earned={true}
            size={variant === 'compact' ? 'small' : 'medium'}
            onClick={() => onBadgeClick(badge)}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Счетчик */}
      {earnedBadges.length > displayCount && (
        <div className="text-sm text-blue-200">
          +{earnedBadges.length - displayCount} ещё
        </div>
      )}

      {/* Следующий значок */}
      {availableBadges.length > 0 && (
        <div className="flex items-center space-x-2 ml-4 border-l border-white/20 pl-4">
          <span className="text-xs text-gray-400">Следующий:</span>
          <Badge
            badge={availableBadges[0]}
            earned={false}
            size="small"
            onClick={() => onBadgeClick(availableBadges[0])}
          />
        </div>
      )}
    </div>
  )
}

// 🏅 ОТДЕЛЬНЫЙ ЗНАЧОК
const Badge = ({ 
  badge, 
  earned = false,
  size = 'medium', // small, medium, large
  onClick,
  delay = 0,
  showTooltip = true 
}) => {
  const [mounted, setMounted] = useState(false)
  const [showTooltipState, setShowTooltipState] = useState(false)
  const { sounds } = useSounds()

  useEffect(() => {
    setTimeout(() => setMounted(true), delay)
  }, [delay])

  const sizes = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl'
  }

  const handleClick = () => {
    if (sounds) sounds.click()
    if (onClick) onClick()
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        className={`
          ${sizes[size]} rounded-full flex items-center justify-center
          transition-all duration-300 transform hover:scale-110 active:scale-95
          ${earned 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50' 
            : 'bg-gray-600 grayscale opacity-50 hover:opacity-70'
          }
          ${mounted ? 'animate-bounce-in' : 'opacity-0'}
        `}
      >
        {earned && (
          <GlowEffect color="yellow" intensity="medium" trigger="always" />
        )}
        
        <span className={earned ? 'text-black' : 'text-gray-300'}>
          {badge.icon}
        </span>

        {earned && badge.rarity === 'legendary' && (
          <ShimmerEffect className="absolute inset-0 rounded-full" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{badge.name}</div>
            <div className="text-xs text-gray-300">{badge.description}</div>
            {badge.rarity && (
              <div className={`text-xs ${getRarityColor(badge.rarity)}`}>
                {getRarityText(badge.rarity)}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

// 📈 СЕКЦИЯ ПРОГРЕССА
const ProgressSection = ({ 
  badgesEarned, 
  totalBadges, 
  level, 
  progressToNext 
}) => {
  const badgeProgress = totalBadges > 0 ? (badgesEarned / totalBadges) * 100 : 0

  return (
    <GlassEffect className="p-4 min-w-[200px]">
      <h4 className="text-sm font-semibold text-white mb-3">Прогресс</h4>
      
      <div className="space-y-3">
        {/* Прогресс значков */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Значки</span>
            <span>{badgesEarned}/{totalBadges}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${badgeProgress}%` }}
            />
          </div>
        </div>

        {/* Прогресс уровня */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Уровень {level}</span>
            <span>{Math.round(progressToNext)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>
    </GlassEffect>
  )
}

// 🔍 МОДАЛ ДЕТАЛЬНОГО ПРОСМОТРА ЗНАЧКА
const BadgeDetailModal = ({ badge, isOpen, onClose }) => {
  if (!badge) return null

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Информация о достижении"
      size="medium"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{badge.icon}</div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          {badge.name}
        </h3>
        
        <p className="text-gray-300 mb-4">
          {badge.description}
        </p>

        {badge.rarity && (
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRarityBg(badge.rarity)}`}>
            {getRarityText(badge.rarity)}
          </div>
        )}

        {badge.earnedAt && (
          <div className="mt-4 text-sm text-gray-400">
            Получено: {new Date(badge.earnedAt).toLocaleDateString('ru-RU')}
          </div>
        )}

        {badge.progress && (
          <div className="mt-4">
            <div className="text-sm text-gray-300 mb-2">
              Прогресс: {badge.progress.current}/{badge.progress.required}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </AnimatedModal>
  )
}

// 🎖️ МОДАЛ ВСЕХ ЗНАЧКОВ
const AllBadgesModal = ({ 
  earnedBadges, 
  availableBadges, 
  isOpen, 
  onClose, 
  onBadgeClick 
}) => {
  const [filter, setFilter] = useState('all') // all, earned, available

  const filteredBadges = {
    all: [...earnedBadges, ...availableBadges],
    earned: earnedBadges,
    available: availableBadges
  }

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Все достижения"
      size="large"
    >
      <div className="space-y-6">
        {/* Фильтры */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Все' },
            { key: 'earned', label: 'Полученные' },
            { key: 'available', label: 'Доступные' }
          ].map(filterOption => (
            <RippleButton
              key={filterOption.key}
              variant={filter === filterOption.key ? 'accent' : 'ghost'}
              size="small"
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label}
            </RippleButton>
          ))}
        </div>

        {/* Сетка значков */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {filteredBadges[filter].map(badge => (
            <Badge
              key={badge.id}
              badge={badge}
              earned={earnedBadges.some(b => b.id === badge.id)}
              size="large"
              onClick={() => onBadgeClick(badge)}
            />
          ))}
        </div>
      </div>
    </AnimatedModal>
  )
}

// 🎨 УТИЛИТЫ ДЛЯ РЕДКОСТИ
const getRarityColor = (rarity) => {
  const colors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400'
  }
  return colors[rarity] || colors.common
}

const getRarityBg = (rarity) => {
  const backgrounds = {
    common: 'bg-gray-600',
    uncommon: 'bg-green-600',
    rare: 'bg-blue-600',
    epic: 'bg-purple-600',
    legendary: 'bg-yellow-600'
  }
  return backgrounds[rarity] || backgrounds.common
}

const getRarityText = (rarity) => {
  const texts = {
    common: 'Обычное',
    uncommon: 'Необычное',
    rare: 'Редкое',
    epic: 'Эпическое',
    legendary: 'Легендарное'
  }
  return texts[rarity] || texts.common
}

// 🎯 КОМПАКТНЫЙ ИНДИКАТОР ДОСТИЖЕНИЙ
export const BadgeIndicator = ({ 
  count = 0, 
  newBadges = 0,
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-yellow-400">🏆</div>
      <span className="text-white font-medium">{count}</span>
      {newBadges > 0 && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          +{newBadges}
        </div>
      )}
    </div>
  )
}

// 🏆 УВЕДОМЛЕНИЕ О НОВОМ ДОСТИЖЕНИИ
export const BadgeNotification = ({ badge, onClose }) => {
  const { sounds } = useSounds()

  useEffect(() => {
    if (sounds) sounds.badge()
  }, [sounds])

  return (
    <GlowEffect color="yellow" intensity="high" trigger="always">
      <GlassEffect className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border border-yellow-400/50 rounded-xl p-6 max-w-sm">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {badge.icon}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Достижение получено!
          </h3>
          
          <h4 className="text-lg font-semibold text-yellow-200 mb-3">
            {badge.name}
          </h4>
          
          <p className="text-white/90 text-sm mb-4">
            {badge.description}
          </p>

          <RippleButton
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Продолжить
          </RippleButton>
        </div>
      </GlassEffect>
    </GlowEffect>
  )
}

export default BadgeMeter