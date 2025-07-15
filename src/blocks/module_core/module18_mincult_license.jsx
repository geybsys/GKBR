import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, AlertTriangle, FileText, DollarSign, Building, Users, Award, Camera, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ✅ ПРЕМИАЛЬНАЯ СИСТЕМА
import { PremiumPage, PremiumCard, RippleButton, AnimatedProgress } from '../../components/premium/PremiumUI.jsx';
import { useSounds } from '../../components/premium/SoundSystem.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import BadgeMeter from '../../components/BadgeMeter.jsx';
import { notify } from '../../components/NotificationPanel.jsx';
import { contentApi } from '../../api/mockContentApi.js';
import { progressApi } from '../../api/mockProgressApi.js';

const Module18CultureLicense = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams(); // Получаем ID модуля из URL
  const { sounds } = useSounds();

  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [moduleData, setModuleData] = useState(null); // Для хранения данных, загруженных из API
  const [isLoading, setIsLoading] = useState(true); // Для отслеживания состояния загрузки

  // Загрузка данных модуля из API и прогресса пользователя
  useEffect(() => {
    const fetchModuleContentAndProgress = async () => {
      setIsLoading(true);
      try {
        const parsedModuleId = parseInt(moduleId) || 18; // Используем 18 как ID по умолчанию, если не указан в URL
        if (isNaN(parsedModuleId)) {
          console.error("Недопустимый ID модуля");
          setIsLoading(false);
          return;
        }

        const data = await contentApi.fetchModuleContent(parsedModuleId);
        setModuleData(data);

        const userProgress = await progressApi.fetchUserProgress(parsedModuleId);
        if (userProgress) {
          setCompletedSections(userProgress.completedSections || []);
          setCurrentSection(userProgress.lastViewedSection || 0);
          setReadingTime(userProgress.totalReadingTime || 0); // Загружаем сохраненное время чтения
        }

      } catch (error) {
        console.error("Не удалось загрузить данные модуля или прогресс:", error);
        notify("error", "Ошибка", "Не удалось загрузить данные модуля.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleContentAndProgress();
  }, [moduleId]);

  // Таймер чтения
  useEffect(() => {
    let timer;
    if (isReading && !isLoading && moduleData && currentSection < (moduleData.sections?.length || 0)) {
      timer = setInterval(() => {
        setReadingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReading, isLoading, moduleData, currentSection]);

  // Установка isReading при смене секции (если модуль загружен)
  useEffect(() => {
    if (!isLoading && moduleData) {
      setIsReading(true);
    }
  }, [currentSection, isLoading, moduleData]);

  // Обработка завершения раздела
  const handleSectionComplete = useCallback(async (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      const updatedCompletedSections = [...completedSections, sectionId];
      setCompletedSections(updatedCompletedSections);
      sounds.success();
      notify("success", "Раздел завершен!", "Вы успешно прошли раздел.");

      try {
        await progressApi.updateModuleProgress(
          parseInt(moduleId) || 18,
          updatedCompletedSections,
          currentSection,
          readingTime // Сохраняем текущее время чтения
        );
      } catch (error) {
        console.error("Не удалось обновить прогресс раздела:", error);
        notify("error", "Ошибка", "Не удалось обновить прогресс раздела.");
      }
    } else {
      notify("info", "Уже завершено", "Этот раздел уже был вами завершен.");
    }
  }, [completedSections, currentSection, sounds, moduleId, readingTime]);

  const nextSection = useCallback(async () => {
    if (!moduleData || !moduleData.sections) return;

    // Автоматически завершаем текущую секцию при переходе к следующей
    if (moduleData.sections[currentSection] && !completedSections.includes(moduleData.sections[currentSection].id)) {
      await handleSectionComplete(moduleData.sections[currentSection].id);
    }

    if (currentSection < moduleData.sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      sounds.click();
    } else {
      // Завершение модуля
      sounds.complete();
      notify("success", "Модуль завершен!", "Вы успешно прошли весь модуль.");
      setIsReading(false); // Останавливаем таймер чтения
      try {
        await progressApi.markModuleCompleted(parseInt(moduleId) || 18, readingTime);
      } catch (error) {
        console.error("Не удалось отметить модуль как завершенный:", error);
        notify("error", "Ошибка", "Не удалось отметить модуль как завершенный.");
      }
      navigate('/dashboard'); // Возврат на дашборд после завершения
    }
  }, [currentSection, moduleData, completedSections, handleSectionComplete, sounds, readingTime, moduleId, navigate]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      sounds.click();
    }
  }, [currentSection, sounds]);

  const backToDashboard = useCallback(() => {
    sounds.click();
    navigate('/dashboard');
  }, [navigate, sounds]);

  // Расчет прогресса модуля
  const progress = moduleData && moduleData.sections.length > 0
    ? (completedSections.length / moduleData.sections.length) * 100
    : 0;

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <PremiumPage className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
        <div className="text-xl">Загрузка модуля...</div>
      </PremiumPage>
    );
  }

  // Отображение ошибки, если данные модуля не загружены
  if (!moduleData) {
    return (
      <PremiumPage className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
        <div className="text-xl">Ошибка: Данные модуля не загружены.</div>
      </PremiumPage>
    );
  }

  const currentSectionContent = moduleData.sections[currentSection];

  // Отображение ошибки, если текущий раздел не найден
  if (!currentSectionContent) {
    return (
      <PremiumPage className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
        <div className="text-xl">Ошибка: Раздел не найден.</div>
      </PremiumPage>
    );
  }

  // Вспомогательная функция для рендеринга блоков контента
  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return <h3 key={index} className="text-2xl font-bold mb-4 text-purple-300">{block.text}</h3>;
      case 'paragraph':
        return <p key={index} className="text-white leading-relaxed mb-4">{block.text}</p>;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside text-white mb-4">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-4">
            <table className="min-w-full bg-purple-700/30 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  {block.headers.map((header, i) => (
                    <th key={i} className="py-2 px-4 border-b border-purple-500 text-left text-purple-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="even:bg-purple-700/20">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-4 border-b border-purple-500 text-white">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'image':
        return <img key={index} src={block.src} alt={block.alt} className="max-w-full h-auto rounded-lg my-4" />;
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-purple-500 pl-4 italic text-purple-200 mb-4">
            {block.text}
          </blockquote>
        );
      case 'icon_text':
        const IconComponent = {
          AlertTriangle: AlertTriangle,
          CheckCircle: CheckCircle,
          Clock: Clock,
          FileText: FileText,
          DollarSign: DollarSign,
          Building: Building,
          Users: Users,
          Award: Award,
          Camera: Camera,
          MapPin: MapPin,
          // Добавьте другие иконки по мере необходимости
        }[block.icon];

        return (
          <div key={index} className="flex items-start bg-purple-700/40 p-4 rounded-lg mb-4">
            {IconComponent && <IconComponent className="w-6 h-6 mr-3 text-purple-300 flex-shrink-0" />}
            <p className="text-white leading-relaxed">{block.text}</p>
          </div>
        );
      default:
        return <p key={index} className="text-red-400">Неизвестный тип блока: {block.type}</p>;
    }
  };

  return (
    <PremiumPage className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-100 drop-shadow-lg">
          Модуль {moduleData.id}: {moduleData.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <PremiumCard className="bg-purple-700/50 p-6 rounded-lg shadow-xl flex-1">
            <h2 className="text-2xl font-bold mb-4 text-purple-200">Прогресс модуля</h2>
            <ProgressBar progress={progress} color="bg-purple-400" />
            <p className="text-sm text-purple-200 mt-2">{completedSections.length} из {moduleData.sections.length} разделов завершено</p>
            <div className="flex items-center text-purple-200 mt-4">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-sm">Время чтения: {Math.floor(readingTime / 60)} мин {readingTime % 60} сек</span>
            </div>
          </PremiumCard>

          <PremiumCard className="bg-purple-700/50 p-6 rounded-lg shadow-xl flex-1">
            <h2 className="text-2xl font-bold mb-4 text-purple-200">Ваши награды</h2>
            <BadgeMeter current={completedSections.length} total={moduleData.sections.length} />
            <p className="text-sm text-purple-200 mt-2">
              Пройдите все разделы, чтобы получить значок!
            </p>
          </PremiumCard>
        </div>

        <div className="mb-8">
          <PremiumCard className="bg-purple-700/50 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-purple-100 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-purple-300" />
              {currentSectionContent.title}
            </h2>

            <div className="prose prose-invert max-w-none">
              {currentSectionContent.content?.blocks.map(renderContentBlock)}
            </div>

            {/* Отметка о завершении раздела */}
            <div className="mt-8 flex justify-end">
              <RippleButton
                onClick={() => handleSectionComplete(currentSectionContent.id)}
                className={`flex items-center px-6 py-3 rounded-lg text-white font-semibold transition-colors
                  ${completedSections.includes(currentSectionContent.id)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                disabled={completedSections.includes(currentSectionContent.id)}
              >
                {completedSections.includes(currentSectionContent.id) ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" /> Завершено
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" /> Завершить раздел
                  </>
                )}
              </RippleButton>
            </div>
          </PremiumCard>
        </div>

        {/* Навигация */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-600">
          <RippleButton
            variant="outline"
            onClick={backToDashboard}
            className="text-purple-300 border-purple-300 hover:bg-purple-500/20"
          >
            ← Назад к модулям
          </RippleButton>

          <div className="flex space-x-4">
            <RippleButton
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="text-purple-300 border-purple-300 hover:bg-purple-500/20 disabled:opacity-50"
            >
              ← Предыдущий
            </RippleButton>

            <RippleButton
              variant="glow"
              onClick={nextSection}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {currentSection === (moduleData.sections?.length - 1) ? 'Завершить модуль' : 'Следующий →'}
            </RippleButton>
          </div>
        </div>
      </div>
    </PremiumPage>
  );
};

export default Module18CultureLicense;