import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAgendaItems, type AgendaItem } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';

// Month names in Dutch
const MONTH_NAMES_NL = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

// Month names in English
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const AgendaPage = () => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthNames = language === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_NL;

  // Generate years for the timeline (3 years back + current + beyond)
  const timelineYears = [
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAgendaItems(language, selectedYear);
        setEvents(response.docs);
      } catch (err) {
        console.error('Error fetching agenda items:', err);
        setError(t('agenda.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [language, selectedYear, t]);

  const getCategoryColor = (category: string) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800 border-blue-200',
      holiday: 'bg-purple-100 text-purple-800 border-purple-200',
      exam: 'bg-red-100 text-red-800 border-red-200',
      competition: 'bg-orange-100 text-orange-800 border-orange-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getCategoryBadge = (category: string) => {
    return t(`agenda.${category}`);
  };

  const formatDateParts = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return { day, month };
  };

  const getDateRangeParts = (event: AgendaItem) => {
    if (!event.endDate) {
      const { day, month } = formatDateParts(event.startDate);
      return { startDay: day, startMonth: month, endDay: null, endMonth: null };
    }

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Same day
    if (startDate.toDateString() === endDate.toDateString()) {
      const { day, month } = formatDateParts(event.startDate);
      return { startDay: day, startMonth: month, endDay: null, endMonth: null };
    }

    // Different days - show range
    const start = formatDateParts(event.startDate);
    const end = formatDateParts(event.endDate);
    return { startDay: start.day, startMonth: start.month, endDay: end.day, endMonth: end.month };
  };

  const formatTimeRange = (event: AgendaItem) => {
    if (event.allDay) return null;

    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    } else if (event.startTime) {
      return event.startTime;
    }
    return null;
  };

  const isEventPast = (event: AgendaItem) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for comparison

    const compareDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < now;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('agenda.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">{t('agenda.error')}</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4">
          {t('agenda.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      {/* Year Timeline Selector */}
      <div className="mb-10">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>

          {/* Timeline items */}
          <div className="relative flex items-center justify-center gap-4">
            {/* Earlier years button */}
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full hover:border-judo-red hover:text-judo-red transition-all shadow-sm z-10"
              aria-label="Previous year"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{timelineYears[0] - 1}</span>
            </button>

            {/* Timeline year items */}
            {timelineYears.map((year) => {
              const isSelected = year === selectedYear;
              const isCurrent = year === currentYear;

              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative rounded-full font-bold transition-all shadow-md z-10 ${
                    isSelected
                      ? 'bg-judo-red text-white scale-110 shadow-lg px-6 py-3 text-lg'
                      : isCurrent
                      ? 'bg-white text-judo-red border-2 border-judo-red hover:bg-judo-red hover:text-white px-5 py-2 text-base'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-judo-red hover:text-judo-red px-5 py-2 text-base'
                  }`}
                >
                  {year}
                </button>
              );
            })}

            {/* Future years button */}
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full hover:border-judo-red hover:text-judo-red transition-all shadow-sm z-10"
              aria-label="Next year"
            >
              <span className="text-sm font-medium">{currentYear + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray">{t('agenda.noEvents')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {events.map((event, index) => {
            const dateParts = getDateRangeParts(event);
            const timeRange = formatTimeRange(event);
            const isPast = isEventPast(event);

            return (
              <div
                key={event.id}
                className={`flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors ${
                  index !== 0 ? 'border-t border-gray-100' : ''
                } ${isPast ? 'opacity-50' : ''}`}
              >
                {/* Date range */}
                <div className="flex items-center gap-2 w-[300px] flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className={`text-sm font-medium grid grid-cols-[auto_auto_auto_auto_auto] gap-2 items-center ${isPast ? 'text-gray-400' : 'text-gray-700'}`}>
                    <span className="text-right w-5">{dateParts.startDay}</span>
                    <span className="w-16">{dateParts.startMonth}</span>
                    {dateParts.endDay && (
                      <>
                        <span className="text-center w-3">-</span>
                        <span className="text-right w-5">{dateParts.endDay}</span>
                        <span className="w-16">{dateParts.endMonth}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Event title */}
                <div className="flex-1 text-center">
                  <h3 className={`font-semibold ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>{event.title}</h3>
                </div>

                {/* Time range (only if not all day) */}
                <div className="flex items-center gap-2 w-[140px] flex-shrink-0">
                  {timeRange && (
                    <>
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className={`text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                        {timeRange}
                      </span>
                    </>
                  )}
                </div>

                {/* Category badge */}
                <div className="w-[120px] flex justify-end flex-shrink-0">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(event.category)}`}>
                    {getCategoryBadge(event.category)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-8 text-center text-gray-500">
        <p className="text-sm">
          {events.length > 0
            ? `${events.length} ${events.length === 1 ? 'evenement' : 'evenementen'} in ${selectedYear}`
            : `Geen evenementen in ${selectedYear}`}
        </p>
      </div>
    </div>
  );
};
