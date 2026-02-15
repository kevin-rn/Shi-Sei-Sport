import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAgendaItems, type AgendaItem } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';
import logoSvg from '../assets/logo/shi-sei-logo.svg';

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

export const EventsPage = () => {
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

  const isEventOngoing = (event: AgendaItem) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const startDate = new Date(event.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (!event.endDate) return false;

    const endDate = new Date(event.endDate);
    endDate.setHours(0, 0, 0, 0);

    return startDate <= now && endDate >= now;
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
    <div className="relative">
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <img src={logoSvg} alt="" aria-hidden="true" className="w-[min(80vw,80vh)] opacity-[0.04]" />
      </div>
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl relative" style={{ zIndex: 1 }}>
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-judo-red" />
          {t('agenda.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      {/* Year Timeline Selector */}
      <div className="mb-10">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-20"></div>

          {/* Timeline items */}
          <div className="relative flex items-center justify-center gap-1 sm:gap-4">
            {/* Earlier years button */}
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="flex items-center gap-1 px-2 py-2 sm:px-4 bg-white border-2 border-gray-300 rounded-full hover:border-judo-red hover:text-judo-red transition-all shadow-sm z-10"
              aria-label="Previous year"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">{timelineYears[0] - 1}</span>
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
                      ? 'bg-judo-red text-white scale-110 shadow-lg px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg'
                      : isCurrent
                      ? 'bg-white text-judo-red border-2 border-judo-red hover:bg-judo-red hover:text-white px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-judo-red hover:text-judo-red px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base'
                  }`}
                >
                  {year}
                </button>
              );
            })}

            {/* Future years button */}
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="flex items-center gap-1 px-2 py-2 sm:px-4 bg-white border-2 border-gray-300 rounded-full hover:border-judo-red hover:text-judo-red transition-all shadow-sm z-10"
              aria-label="Next year"
            >
              <span className="hidden sm:inline text-sm font-medium">{currentYear + 1}</span>
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
            const isOngoing = isEventOngoing(event);

            return (
              <div
                key={event.id}
                className={`agenda-event-row flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 sm:p-5 border-l-4 transition-colors ${
                  index !== 0 ? 'border-t border-gray-100' : ''
                } ${isPast ? 'opacity-50 border-l-transparent hover:border-l-judo-red' : isOngoing ? 'bg-green-50 border-l-green-500 hover:border-l-judo-red' : 'border-l-transparent hover:bg-gray-50 hover:border-l-judo-red'}`}
              >
                {/* Top row on mobile: date + badge */}
                <div className="flex items-center justify-between sm:contents">
                  {/* Date range */}
                  <div className="flex items-center gap-2 sm:w-[300px] sm:flex-shrink-0">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className={`text-sm font-medium flex items-center gap-1 ${isPast ? 'text-gray-400' : 'text-gray-700'}`}>
                      <span>{dateParts.startDay} {dateParts.startMonth}</span>
                      {dateParts.endDay && (
                        <span>– {dateParts.endDay} {dateParts.endMonth}</span>
                      )}
                    </div>
                  </div>

                  {/* Category badge (visible on mobile in top row) */}
                  <div className="sm:hidden">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(event.category)}`}>
                      {getCategoryBadge(event.category)}
                    </span>
                  </div>
                </div>

                {/* Event title */}
                <div className="flex-1 sm:text-center">
                  <h3 className={`font-semibold ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>{event.title}</h3>
                </div>

                {/* Time range */}
                <div className="flex items-center gap-2 sm:w-[140px] sm:flex-shrink-0">
                  {timeRange && (
                    <>
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className={`text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                        {timeRange}
                      </span>
                    </>
                  )}
                </div>

                {/* Category badge (desktop only) */}
                <div className="hidden sm:flex w-[120px] justify-end flex-shrink-0">
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
    </div>
  );
};
