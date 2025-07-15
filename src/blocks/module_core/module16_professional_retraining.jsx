import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Play, CheckCircle, Clock, AlertTriangle, FileText, DollarSign, Building, Users, Award, GraduationCap, BookOpen } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА
import { PremiumPage, PremiumCard, RippleButton, AnimatedProgress } from '../../components/premium/PremiumUI.jsx'
import { useSounds } from '../../components/premium/SoundSystem.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import BadgeMeter from '../../components/BadgeMeter.jsx'
import { notify } from '../../components/NotificationPanel.jsx'
import { contentApi } from '../../api/mockContentApi.js'
import { progressApi } from '../../api/mockProgressApi.js'

// Define sections outside the component, similar to module17's updated structure
const module16Sections = [
    {
        id: 0,
        title: "16.1. Что такое профессиональная переподготовка?",
        type: "theory",
        estimatedTime: "7 мин",
        content: {
            blocks: [
                { type: 'heading', level: 3, text: 'ПРОФЕССИОНАЛЬНАЯ ПЕРЕПОДГОТОВКА - НОВАЯ ВОЗМОЖНОСТЬ НА РЫНКЕ СТРОИТЕЛЬСТВА' },
                { type: 'paragraph', text: 'Профессиональная переподготовка — это дополнительное профессиональное образование, позволяющее получить новые компетенции для выполнения нового вида профессиональной деятельности или повышения квалификации. Она дает возможность специалистам сменить профессию или углубить знания в текущей области, оставаясь конкурентоспособными на рынке труда.' },
                { type: 'heading', level: 4, text: 'КЛЮЧЕВЫЕ ХАРАКТЕРИСТИКИ:' },
                { type: 'list', items: [
                    'Направлена на получение новой квалификации',
                    'Объем программы не менее 250 академических часов',
                    'По завершении выдается диплом о профессиональной переподготовке',
                    'Может быть освоена в заочной форме с применением дистанционных технологий'
                ]},
                { type: 'heading', level: 4, text: 'НОРМАТИВНО-ПРАВОВАЯ БАЗА:' },
                { type: 'list', items: [
                    'Федеральный закон от 29.12.2012 №273-ФЗ "Об образовании в Российской Федерации"',
                    'Приказ Минобрнауки России от 01.07.2013 №499 "Об утверждении Порядка организации и осуществления образовательной деятельности по дополнительным профессиональным программам"'
                ]},
                { type: 'heading', level: 4, text: '💰 ПРОДАЖНЫЙ АРГУМЕНТ:' },
                { type: 'paragraph', text: '"В современном строительстве постоянно появляются новые технологии и требования. Профессиональная переподготовка — это не просто документ, это возможность оставаться востребованным специалистом, осваивать новые направления, такие как BIM-технологии, энергоэффективное строительство или управление проектами в условиях цифровизации. Это инвестиция в вашу карьеру, которая быстро окупается за счет новых проектов и более высокой заработной платы. Даже если специалист обладает обширным опытом, получение диплома о переподготовке демонстрирует его готовность к развитию и адаптации к изменениям рынка, что особенно ценится крупными работодателями."'}
            ]
        }
    },
    {
        id: 1,
        title: "16.2. Для кого нужна профессиональная переподготовка?",
        type: "practical",
        estimatedTime: "10 мин",
        content: {
            blocks: [
                { type: 'heading', level: 4, text: 'ОСНОВНЫЕ КАТЕГОРИИ СПЕЦИАЛИСТОВ:' },
                {
                    type: 'table',
                    headers: ['Категория', 'Цель переподготовки', 'Примеры направлений'],
                    rows: [
                        ['Инженеры-строители', 'Получение новой специализации', 'Технический заказчик, Проектировщик, Специалист по охране труда'],
                        ['Руководители проектов', 'Углубление знаний в управлении', 'Управление строительством, Управление качеством'],
                        ['Кадастровые инженеры', 'Расширение компетенций', 'Геодезия, Землеустройство'],
                        ['Специалисты по охране труда', 'Обновление знаний', 'Пожарная безопасность, Промышленная безопасность'],
                        ['Люди с непрофильным высшим образованием', 'Получение квалификации для работы в строительстве', 'Промышленное и гражданское строительство, Экспертиза и управление недвижимостью']
                    ]
                },
                { type: 'heading', level: 4, text: 'КОГДА ПЕРЕПОДГОТОВКА НЕОБХОДИМА:' },
                { type: 'list', items: [
                    'При смене рода деятельности (например, из инженера в проектировщика)',
                    'При необходимости соответствия новым профессиональным стандартам',
                    'При отсутствии профильного образования, но наличии опыта работы'
                ]},
                { type: 'heading', level: 4, text: '💰 ПРОДАЖНЫЙ АРГУМЕНТ:' },
                { type: 'paragraph', text: '"Многие компании сталкиваются с дефицитом квалифицированных кадров по новым направлениям. Профессиональная переподготовка позволяет вашим сотрудникам быстро освоить необходимые компетенции без отрыва от производства. Это особенно актуально для специалистов, которые имеют опыт, но их основное образование не соответствует новым требованиям. Например, инженер с многолетним опытом может получить диплом по программе "Технический заказчик" и сразу же приступить к новым обязанностям. Мы предлагаем гибкие программы, которые позволяют специалистам учиться в удобное для них время, не прерывая рабочий процесс."'}
            ]
        }
    },
    {
        id: 2,
        title: "16.3. Преимущества получения диплома о переподготовке",
        type: "theory",
        estimatedTime: "8 мин",
        content: {
            blocks: [
                { type: 'heading', level: 4, text: 'КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА:' },
                {
                    type: 'table',
                    headers: ['Преимущество', 'Описание', 'Как это работает на практике'],
                    rows: [
                        ['Легализация квалификации', 'Подтверждение права на ведение нового вида деятельности', 'Позволяет работать на должностях, требующих определенной квалификации (например, ГИП, ГАП)'],
                        ['Карьерный рост', 'Доступ к новым должностям и проектам', 'Открывает путь к руководящим позициям и более сложным задачам'],
                        ['Конкурентоспособность', 'Повышение ценности специалиста на рынке труда', 'Работодатели предпочитают специалистов с актуальным образованием'],
                        ['Расширение компетенций', 'Приобретение новых знаний и навыков', 'Позволяет решать более широкий спектр задач, увеличивает профессионализм'],
                        ['Экономия времени', 'Быстрее, чем второе высшее образование', 'Программы переподготовки короче, фокусируются на практике']
                    ]
                },
                { type: 'heading', level: 4, text: 'ДИПЛОМ О ПЕРЕПОДГОТОВКЕ VS ВТОРОЕ ВЫСШЕЕ ОБРАЗОВАНИЕ:' },
                { type: 'list', items: [
                    'Диплом о переподготовке: 250+ часов, срок обучения от 3 месяцев, акцент на практику, новая квалификация.',
                    'Второе высшее образование: 2-3 года, фундаментальное образование, академический уклон, новая профессия.'
                ]},
                { type: 'heading', level: 4, text: '💰 ПРОДАЖНЫЙ АРГУМЕНТ:' },
                { type: 'paragraph', text: '"Диплом о профессиональной переподготовке — это быстрый и эффективный способ получить новую квалификацию, которая официально признается государством. В отличие от второго высшего образования, которое занимает годы, переподготовка позволяет освоить новую специальность всего за несколько месяцев. Это дает возможность не только легализовать свою деятельность, но и значительно ускорить карьерный рост. Например, если у вас есть базовое строительное образование, но вы хотите стать специалистом по ценообразованию в строительстве, диплом о переподготовке даст вам необходимые знания и официальное подтверждение квалификации, открывая двери к новым проектам и более высокооплачиваемой работе."'}
            ]
        }
    },
    {
        id: 3,
        title: "16.4. Процесс обучения и выдача документов",
        type: "step_by_step",
        estimatedTime: "10 мин",
        content: {
            blocks: [
                { type: 'heading', level: 4, text: 'ЭТАПЫ ОБУЧЕНИЯ:' },
                {
                    type: 'table',
                    headers: ['Этап', 'Описание', 'Сроки', 'Особенности'],
                    rows: [
                        ['1. ВЫБОР ПРОГРАММЫ', 'Выбор программы переподготовки в соответствии с целями', '1 день', 'Широкий выбор программ по всем строительным направлениям'],
                        ['2. ПОДАЧА ДОКУМЕНТОВ', 'Предоставление документов для зачисления', '1-2 дня', 'Паспорт, диплом о высшем/среднем профессиональном образовании'],
                        ['3. ЗАКЛЮЧЕНИЕ ДОГОВОРА', 'Подписание договора на обучение', '1 день', 'Оформление всех юридических моментов'],
                        ['4. ОБУЧЕНИЕ', 'Дистанционное освоение программы', 'От 250 часов', 'Гибкий график, доступ 24/7 к учебным материалам'],
                        ['5. ИТОГОВАЯ АТТЕСТАЦИЯ', 'Сдача итогового экзамена или защита проекта', '1 день', 'Проверяются полученные знания'],
                        ['6. ПОЛУЧЕНИЕ ДИПЛОМА', 'Выдача диплома о профессиональной переподготовке', '7-14 дней', 'Доставка курьером или самовывоз']
                    ]
                },
                { type: 'heading', level: 4, text: 'ФОРМАТ ОБУЧЕНИЯ:' },
                { type: 'list', items: [
                    'Дистанционный формат с использованием современных образовательных платформ.',
                    'Доступ к учебным материалам 24/7, возможность учиться в удобном темпе.'
                ]},
                { type: 'heading', level: 4, text: 'ДИПЛОМ О ПРОФЕССИОНАЛЬНОЙ ПЕРЕПОДГОТОВКЕ:' },
                { type: 'list', items: [
                    'Установленного образца, выдается образовательной организацией, имеющей лицензию.',
                    'Вносится в Федеральный реестр сведений о документах об образовании (ФРДО).'
                ]},
                { type: 'heading', level: 4, text: '💰 ПРОДАЖНЫЙ АРГУМЕНТ:' },
                { type: 'paragraph', text: '"Мы предлагаем максимально удобный и эффективный дистанционный формат обучения, который позволяет вашим сотрудникам получать новую квалификацию без отрыва от работы. Все учебные материалы доступны 24/7, что дает возможность учиться в своем темпе. После успешного завершения обучения выдается диплом о профессиональной переподготовке установленного образца, который вносится в Федеральный реестр сведений о документах об образовании (ФРДО). Это гарантирует легитимность и признание документа на всей территории России. Инвестируя в переподготовку сотрудников, вы не только повышаете их квалификацию, но и укрепляете конкурентные преимущества вашей компании на рынке."'}
            ]
        }
    },
    {
        id: 4,
        title: "16.5. Работа с возражениями клиентов",
        type: "theory",
        estimatedTime: "12 мин",
        content: {
            blocks: [
                { type: 'heading', level: 4, text: 'ВОЗРАЖЕНИЕ 1: "У нас уже есть сотрудники с высшим образованием"' },
                { type: 'paragraph', text: '"Согласен, высшее образование — это отличная база. Однако рынок труда постоянно меняется, появляются новые технологии, стандарты и требования. Профессиональная переподготовка позволяет актуализировать знания сотрудников, получить новые, узкоспециализированные компетенции, которые не всегда дают базовые вузовские программы. Например, специалист по охране труда, получивший образование 10 лет назад, нуждается в переподготовке по последним изменениям в законодательстве. Это не замена, а дополнение к высшему образованию, которое делает ваших специалистов еще более ценными и конкурентоспособными на рынке."'},
                { type: 'heading', level: 4, text: 'ВОЗРАЖЕНИЕ 2: "Это слишком дорого"' },
                { type: 'paragraph', text: '"Понимаю, что каждая инвестиция требует обоснования. Но давайте посмотрим на это с другой стороны: сколько стоит отсутствие квалифицированных кадров? Ошибки, штрафы, упущенные проекты из-за несоответствия требованиям — все это обходится значительно дороже. Стоимость программ переподготовки обычно существенно ниже, чем второе высшее образование, а эффект от нее виден гораздо быстрее. Это прямая инвестиция в рост производительности и снижение рисков. Кроме того, качественные специалисты с актуальными знаниями повышают репутацию вашей компании и привлекают более крупные и престижные проекты."'},
                { type: 'heading', level: 4, text: 'ВОЗРАЖЕНИЕ 3: "У нас нет времени на обучение сотрудников"' },
                { type: 'paragraph', text: '"Именно поэтому мы предлагаем полностью дистанционный формат обучения с гибким графиком. Ваши сотрудники могут осваивать материалы в любое удобное время, без отрыва от основной работы. Все учебные материалы доступны 24/7, что дает возможность учиться в своем темпе. Более того, многие программы можно пройти в ускоренном режиме. Мы минимизируем отвлечение ваших сотрудников, обеспечивая при этом высокий уровень подготовки, который в конечном итоге экономит ваше время за счет повышения эффективности работы."'},
                { type: 'heading', level: 4, text: 'ФИНАЛЬНЫЙ ПРОДАЖНЫЙ АРГУМЕНТ:' },
                { type: 'paragraph', text: '"Профессиональная переподготовка — это не просто курсы, это стратегическое вложение в человеческий капитал вашей компании. В условиях постоянно меняющегося рынка труда и ужесточения требований, наличие специалистов с актуальными и подтвержденными квалификациями становится ключевым конкурентным преимуществом. Мы предлагаем программы, которые дают не только теоретические знания, но и практические навыки, необходимые для решения реальных задач. Повышая квалификацию своих сотрудников, вы открываете новые возможности для развития бизнеса, увеличиваете его устойчивость и привлекательность для крупных заказчиков. Это путь к стабильному росту и лидерству на рынке."' }
            ]
        }
    }
];

const Module16ProfessionalRetraining = () => {
  const navigate = useNavigate()
  const { moduleId } = useParams()
  const [currentSection, setCurrentSection] = useState(0)
  const [userData, setUserData] = useState(null)
  const [completedSections, setCompletedSections] = useState(new Set())
  const [moduleProgress, setModuleProgress] = useState(0)
  const [moduleData, setModuleData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readingTime, setReadingTime] = useState(0)
  const [isReading, setIsReading] = useState(false)

  // ✅ ЗВУКОВАЯ СИСТЕМА
  const { sounds } = useSounds()

  useEffect(() => {
    const saved = localStorage.getItem('gkbr_user_data')
    if (saved) {
      setUserData(JSON.parse(saved))
    }

    const fetchModuleContent = async () => {
      setIsLoading(true)
      try {
        const parsedModuleId = parseInt(moduleId) || 16
        if (isNaN(parsedModuleId)) {
            console.error("Invalid module ID");
            setIsLoading(false);
            return;
        }

        // Simulate fetching content based on parsedModuleId
        // For this simulation, we'll use the local module16Sections
        if (parsedModuleId === 16) {
            setModuleData({
                id: parsedModuleId,
                title: "Модуль 16: Профессиональная переподготовка",
                sections: module16Sections
            })
        } else {
            setModuleData(null);
        }

        // Load progress for the fetched module
        const progress = progressApi.getModuleProgress(parsedModuleId)
        if (progress) {
          setCompletedSections(new Set(progress.completedSections))
          setModuleProgress((progress.completedSections.length / module16Sections.length) * 100)
        }

      } catch (error) {
        console.error("Error fetching module content:", error)
        notify('Ошибка', 'Не удалось загрузить содержимое модуля.', 'error')
      } finally {
        setIsLoading(false)
        sounds.success()
      }
    }

    fetchModuleContent()
  }, [moduleId, sounds])

  // Reading time useEffect (as seen in other modules)
  useEffect(() => {
    let timer;
    if (isReading && !isLoading && moduleData) {
      timer = setInterval(() => {
        setReadingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReading, isLoading, moduleData]);

  const handleSectionComplete = (sectionId) => {
    const newCompletedSections = new Set(completedSections)
    newCompletedSections.add(sectionId)
    setCompletedSections(newCompletedSections)

    if (moduleData) {
        const newProgress = (newCompletedSections.size / moduleData.sections.length) * 100
        setModuleProgress(newProgress)
        const parsedModuleId = parseInt(moduleId) || 16;
        progressApi.updateModuleProgress(parsedModuleId, Array.from(newCompletedSections), newProgress)
    }

    notify('Раздел завершен!', 'Вы успешно прошли этот раздел.', 'success')
    sounds.reward()
  }

  const prevSection = () => {
    sounds.click()
    setCurrentSection(Math.max(0, currentSection - 1))
  }

  const nextSection = () => {
    sounds.click()
    setCurrentSection(Math.min(moduleData.sections.length - 1, currentSection + 1))
  }

  const backToDashboard = useCallback(() => {
    sounds.abort()
    navigate('/dashboard')
  }, [navigate, sounds])

  if (isLoading) {
    return (
      <PremiumPage>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white text-lg">Загрузка модуля...</p>
        </div>
      </PremiumPage>
    )
  }

  if (!moduleData || !moduleData.sections || moduleData.sections.length === 0) {
    return (
      <PremiumPage>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white text-lg">Ошибка: Модуль не найден или пуст.</p>
        </div>
      </PremiumPage>
    )
  }

  return (
    <PremiumPage>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8 font-rubik">
        <AnimatedProgress progress={moduleProgress} />

        <div className="max-w-7xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <RippleButton
              variant="outline"
              onClick={backToDashboard}
              className="text-gray-300 border-gray-300 hover:bg-gray-700/50"
            >
              ← К Модулям
            </RippleButton>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white leading-tight">
              {moduleData.title}
            </h1>
            <div className="w-1/4"></div>
          </div>

          <ProgressBar
            currentSection={currentSection}
            totalSections={moduleData.sections.length}
            completedSections={completedSections.size}
          />
          <BadgeMeter progress={moduleProgress} />

          <div className="mt-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700">
            <PremiumCard className="p-6 sm:p-8">
              {moduleData.sections[currentSection] && (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-4 flex items-center">
                    {moduleData.sections[currentSection].title}
                    {completedSections.has(moduleData.sections[currentSection].id) && (
                      <CheckCircle className="ml-3 text-green-400" size={28} />
                    )}
                  </h2>
                  <p className="text-sm text-gray-400 mb-6 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Примерное время: {moduleData.sections[currentSection].estimatedTime}
                  </p>

                  <div className="prose prose-invert max-w-none text-gray-200">
                    {moduleData.sections[currentSection].content.blocks.map((block, blockIndex) => {
                      if (block.type === 'heading') {
                        const HeadingTag = `h${block.level}`
                        return <HeadingTag key={blockIndex} className={`text-white font-bold mb-3 mt-6 text-${block.level === 3 ? '2xl' : 'xl'}`}>{block.text}</HeadingTag>
                      } else if (block.type === 'paragraph') {
                        return <p key={blockIndex} className="mb-4 leading-relaxed">{block.text}</p>
                      } else if (block.type === 'list') {
                        return (
                          <ul key={blockIndex} className="list-disc list-inside mb-4 space-y-2">
                            {block.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        )
                      } else if (block.type === 'table') {
                        return (
                          <div key={blockIndex} className="overflow-x-auto mb-6 shadow-lg rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead className="bg-gray-700">
                                <tr>
                                  {block.headers.map((header, headerIndex) => (
                                    <th
                                      key={headerIndex}
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {block.rows.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-700">
                    <RippleButton
                      onClick={prevSection}
                      disabled={currentSection === 0}
                      variant="outline"
                      className="text-gray-300 border-gray-300 hover:bg-gray-700/50 disabled:opacity-50 mb-4 sm:mb-0"
                    >
                      ← Предыдущий
                    </RippleButton>

                    <div className="flex items-center space-x-4">
                      <RippleButton
                        onClick={() => handleSectionComplete(moduleData.sections[currentSection].id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {completedSections.has(moduleData.sections[currentSection].id) ? 'Завершено' : 'Завершить раздел'}
                      </RippleButton>

                      <RippleButton
                        onClick={() => {
                          sounds.click()
                          setCurrentSection(Math.min(moduleData.sections.length - 1, currentSection + 1))
                        }}
                        disabled={currentSection === moduleData.sections.length - 1}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          currentSection === moduleData.sections.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        Следующий
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </RippleButton>
                    </div>
                  </div>
                </>
              )}
            </PremiumCard>
          </div>
        </div>
      </div>
    </PremiumPage>
  )
}

export default Module16ProfessionalRetraining