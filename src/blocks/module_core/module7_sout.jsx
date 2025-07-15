import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ ПРАВИЛЬНЫЕ импорты премиальных компонентов (из blocks/module_core нужно подняться на 2 уровня)
import { PremiumPage, PremiumCard, RippleButton, AnimatedProgress } from '../../components/premium/PremiumUI.jsx'
import { useSounds } from '../../components/premium/SoundSystem.jsx'

// Компоненты модуля (тоже исправляем путь)
import ProgressBar from '../../components/ProgressBar.jsx'
import BadgeMeter from '../../components/BadgeMeter.jsx'

const Module7SOUT = () => {
  const navigate = useNavigate()
  const { sounds } = useSounds()
  
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Контент модуля СОУТ
  const moduleContent = {
    title: "Модуль 7: СОУТ - Специальная оценка условий труда",
    description: "Изучение требований и процедур проведения специальной оценки условий труда",
    sections: [
      {
        title: "Введение в СОУТ",
        content: `
          <h3>🎯 Что такое СОУТ?</h3>
          <p>Специальная оценка условий труда (СОУТ) — это единый комплекс последовательно осуществляемых мероприятий по идентификации вредных и (или) опасных факторов производственной среды и трудового процесса.</p>
          
          <h4>📋 Основные цели СОУТ:</h4>
          <ul>
            <li>Выявление и оценка вредных и опасных производственных факторов</li>
            <li>Определение степени их воздействия на работников</li>
            <li>Установление классов условий труда</li>
            <li>Разработка мероприятий по улучшению условий труда</li>
          </ul>
          
          <h4>⚖️ Правовая база:</h4>
          <ul>
            <li>Федеральный закон № 426-ФЗ "О специальной оценке условий труда"</li>
            <li>Трудовой кодекс РФ (статья 212)</li>
            <li>Методики проведения измерений</li>
          </ul>
        `
      },
      {
        title: "Организация и проведение СОУТ",
        content: `
          <h3>🏢 Кто проводит СОУТ?</h3>
          <p>СОУТ проводят организации, аккредитованные в установленном порядке в качестве испытательных лабораторий (центров).</p>
          
          <h4>📊 Этапы проведения СОУТ:</h4>
          <ol>
            <li><strong>Подготовительный этап:</strong>
              <ul>
                <li>Формирование комиссии</li>
                <li>Составление перечня рабочих мест</li>
                <li>Заключение договора с экспертной организацией</li>
              </ul>
            </li>
            <li><strong>Идентификация вредных факторов:</strong>
              <ul>
                <li>Физические факторы (шум, вибрация, освещение)</li>
                <li>Химические факторы</li>
                <li>Биологические факторы</li>
                <li>Тяжесть и напряженность труда</li>
              </ul>
            </li>
            <li><strong>Инструментальные измерения</strong></li>
            <li><strong>Оценка эффективности СИЗ</strong></li>
            <li><strong>Отнесение к классам условий труда</strong></li>
          </ol>
          
          <h4>⏱️ Сроки проведения:</h4>
          <ul>
            <li>Не реже одного раза в 5 лет</li>
            <li>Внеплановая СОУТ при изменении условий труда</li>
            <li>По требованию государственных органов</li>
          </ul>
        `
      },
      {
        title: "Классы условий труда",
        content: `
          <h3>🎯 Классификация условий труда</h3>
          
          <h4>🟢 Класс 1 - Оптимальные условия труда</h4>
          <p>Условия, при которых воздействие на работника вредных и (или) опасных производственных факторов отсутствует или не превышает уровни, принятые в качестве безопасных для человека.</p>
          
          <h4>🔵 Класс 2 - Допустимые условия труда</h4>
          <p>Условия труда, при которых на работника воздействуют вредные и (или) опасные производственные факторы, уровни воздействия которых не превышают установленных нормативов.</p>
          
          <h4>🟡 Класс 3 - Вредные условия труда</h4>
          <p>Условия труда, при которых уровни воздействия вредных и (или) опасных производственных факторов превышают установленные нормативы.</p>
          <ul>
            <li><strong>3.1</strong> - незначительно превышают нормативы</li>
            <li><strong>3.2</strong> - умеренно превышают нормативы</li>
            <li><strong>3.3</strong> - значительно превышают нормативы</li>
            <li><strong>3.4</strong> - высокий уровень превышения нормативов</li>
          </ul>
          
          <h4>🔴 Класс 4 - Опасные условия труда</h4>
          <p>Условия труда, при которых на работника воздействуют вредные и (или) опасные производственные факторы, уровни воздействия которых в течение всего рабочего дня создают угрозу для жизни.</p>
        `
      },
      {
        title: "Практическое применение",
        content: `
          <h3>💼 Обязанности работодателя</h3>
          
          <h4>📋 До проведения СОУТ:</h4>
          <ul>
            <li>Создать комиссию по проведению СОУТ</li>
            <li>Выбрать и заключить договор с экспертной организацией</li>
            <li>Определить перечень рабочих мест для оценки</li>
            <li>Подготовить необходимую документацию</li>
          </ul>
          
          <h4>🔄 В процессе проведения:</h4>
          <ul>
            <li>Обеспечить участие представителей в комиссии</li>
            <li>Предоставить необходимые документы</li>
            <li>Обеспечить доступ к рабочим местам</li>
            <li>Контролировать соблюдение методик</li>
          </ul>
          
          <h4>✅ После завершения СОУТ:</h4>
          <ul>
            <li>Ознакомить работников с результатами</li>
            <li>Подать декларацию соответствия (при необходимости)</li>
            <li>Организовать доплаты за вредные условия</li>
            <li>Разработать план мероприятий по улучшению условий труда</li>
            <li>Организовать дополнительные медосмотры</li>
          </ul>
          
          <h4>💰 Финансовые последствия:</h4>
          <ul>
            <li>Доплаты к тарифу страховых взносов</li>
            <li>Компенсации работникам за вредные условия</li>
            <li>Дополнительные отпуска</li>
            <li>Сокращенная рабочая неделя</li>
          </ul>
        `
      }
    ]
  }

  useEffect(() => {
    // Расчет прогресса
    const newProgress = ((currentSection + 1) / moduleContent.sections.length) * 100
    setProgress(newProgress)
    
    // Проверка завершения
    if (currentSection === moduleContent.sections.length - 1) {
      setIsCompleted(true)
    }
  }, [currentSection, moduleContent.sections.length])

  const nextSection = () => {
    if (currentSection < moduleContent.sections.length - 1) {
      setCurrentSection(currentSection + 1)
      sounds.success()
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      sounds.click()
    }
  }

  const completeModule = () => {
    sounds.achievement()
    // Сохранение прогресса в localStorage
    const userData = JSON.parse(localStorage.getItem('gkbr_user_data') || '{}')
    userData.completedModules = userData.completedModules || []
    if (!userData.completedModules.includes(7)) {
      userData.completedModules.push(7)
      userData.score = (userData.score || 0) + 50 // +50 баллов за завершение модуля
    }
    localStorage.setItem('gkbr_user_data', JSON.stringify(userData))
    
    // Переход к тесту
    navigate('/module/7/quiz')
  }

  const backToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <PremiumPage background="matrix" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Заголовок модуля */}
        <PremiumCard variant="glow" className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {moduleContent.title}
            </h1>
            <p className="text-blue-200 text-lg mb-4">
              {moduleContent.description}
            </p>
            
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-sm text-blue-300">
                Раздел {currentSection + 1} из {moduleContent.sections.length}
              </span>
              <div className="flex-1 max-w-xs">
                <AnimatedProgress value={progress} />
              </div>
              <span className="text-sm text-blue-300">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </PremiumCard>

        {/* Контент раздела */}
        <PremiumCard variant="default" className="mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">
              {moduleContent.sections[currentSection].title}
            </h2>
            
            <div 
              className="prose prose-invert max-w-none text-white"
              dangerouslySetInnerHTML={{ 
                __html: moduleContent.sections[currentSection].content 
              }}
            />
          </div>
        </PremiumCard>

        {/* Навигация */}
        <div className="flex items-center justify-between">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-blue-300 border-blue-300 hover:bg-blue-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-blue-300 border-blue-300 hover:bg-blue-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            {currentSection === moduleContent.sections.length - 1 ? (
              <RippleButton
                variant="glow"
                onClick={completeModule}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                {isCompleted ? '🏆 Перейти к тесту' : '✅ Завершить модуль'}
              </RippleButton>
            ) : (
              <RippleButton
                variant="glow"
                onClick={nextSection}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                Следующий →
              </RippleButton>
            )}
          </div>
        </div>

        {/* Индикатор достижения */}
        {isCompleted && (
          <div className="mt-6">
            <BadgeMeter 
              earnedBadges={['sout_expert']}
              totalBadges={['sout_expert', 'compliance_master']}
            />
          </div>
        )}
      </div>
    </PremiumPage>
  )
}

export default Module7SOUT