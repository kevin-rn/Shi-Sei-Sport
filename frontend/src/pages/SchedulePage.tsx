import { useEffect, useState } from 'react';
import { getSchedule } from '../lib/api';
import { Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Schedule } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';

// Map English day names from backend to Dutch/English (case-insensitive)
const dayMapNl: Record<string, string> = {
  'monday': 'Maandag',
  'tuesday': 'Dinsdag',
  'wednesday': 'Woensdag',
  'thursday': 'Donderdag',
  'friday': 'Vrijdag',
  'saturday': 'Zaterdag',
  'sunday': 'Zondag',
  'Monday': 'Maandag',
  'Tuesday': 'Dinsdag',
  'Wednesday': 'Woensdag',
  'Thursday': 'Donderdag',
  'Friday': 'Vrijdag',
  'Saturday': 'Zaterdag',
  'Sunday': 'Zondag',
};

const dayMapEn: Record<string, string> = {
  'monday': 'Monday',
  'tuesday': 'Tuesday',
  'wednesday': 'Wednesday',
  'thursday': 'Thursday',
  'friday': 'Friday',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
  'Monday': 'Monday',
  'Tuesday': 'Tuesday',
  'Wednesday': 'Wednesday',
  'Thursday': 'Thursday',
  'Friday': 'Friday',
  'Saturday': 'Saturday',
  'Sunday': 'Sunday',
};

const dayOrderNl = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const dayOrderEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSchedule(language);
        console.log('Schedule response:', response);
        setSchedule(response.docs);
      } catch (err) {
        console.error("Failed to load schedule", err);
        setError(t('schedule.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [language, t]);

  const dayMap = language === 'en' ? dayMapEn : dayMapNl;
  const dayOrder = language === 'en' ? dayOrderEn : dayOrderNl;

  // Group classes by "day" and map to current language
  const grouped = schedule.reduce((acc, curr) => {
    const day = dayMap[curr.day] || curr.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Sort classes by startTime inside each day
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  console.log('Grouped schedule:', grouped);
  console.log('Day order:', dayOrder);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('schedule.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-judo-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            {t('schedule.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4">{t('schedule.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('schedule.description')}
        </p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-judo-gray text-lg">{t('schedule.noClasses')}</p>
        </div>
      ) : (
        /* Grid - 2x2 layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dayOrder.map((day) => {
          const classes = grouped[day];
          if (!classes) return null;

          return (
            <div key={day} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              {/* Day Header with Red Vertical Bar */}
              <div className="flex items-center mb-6">
                <div className="w-1 h-10 bg-judo-red mr-4"></div>
                <h3 className="text-2xl font-bold text-gray-900">{day}</h3>
              </div>
              
              {/* Lessons */}
              <div className="space-y-4">
                {classes.map((cls: Schedule) => (
                  <div key={cls.id} className="bg-light-gray rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      {/* Clock Icon and Time */}
                      <div className="flex items-center gap-2 text-judo-red font-semibold min-w-[140px] flex-shrink-0">
                        <Clock size={18} className="flex-shrink-0" />
                        <span>{cls.startTime} - {cls.endTime}</span>
                      </div>
                      {/* Class Info */}
                      <div className="flex flex-col gap-1">
                        <strong className="text-lg text-gray-800 font-bold">
                          {cls.groupName}
                        </strong>
                        {cls.instructors && typeof cls.instructors === 'object' && (
                          <span className="text-sm text-judo-gray">
                            {cls.instructors.name}
                          </span>
                        )}
                        {cls.location && typeof cls.location === 'object' && (
                          <span className="text-xs text-judo-gray flex items-center gap-1">
                            <Icon name="location" size={14} className="text-judo-red" />
                            {cls.location.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};