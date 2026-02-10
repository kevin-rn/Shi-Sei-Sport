import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// CHANGED: Removed 'api', added 'getNews'
import { getNews, getImageUrl } from '../lib/api';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar, ArrowRight, ChevronRight, Hash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';
import { SearchFilter } from '../components/SearchFilter';

const ITEMS_PER_PAGE = 12;

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export const NieuwsPage = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  
  // State
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleYearFilter = (year: string) => {
    setYearFilter(year);
    // Reset month when year is cleared
    if (!year) setMonthFilter('');
    setCurrentPage(1);
  };

  const handleMonthFilter = (month: string) => {
    setMonthFilter(month);
    setCurrentPage(1);
  };

  // SIMPLIFIED USE EFFECT
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // We now use the helper function instead of constructing params manually
        const data = await getNews(
          currentPage,
          ITEMS_PER_PAGE,
          search,
          yearFilter,
          language,
          monthFilter
        );
        
        setNews(data.docs);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to load news", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, search, yearFilter, monthFilter, language]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="newspaper" size={42} className="text-judo-red" />
          {t('news.title')}
        </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('news.description')}
        </p>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onFilterDate={handleYearFilter}
        years={generateYears()}
        placeholder={t('news.search')}
        extraFilters={yearFilter ? [
          {
            value: monthFilter,
            onChange: handleMonthFilter,
            placeholder: t('news.filterMonth'),
            icon: <Hash className="h-4 w-4 text-gray-500" />,
            options: Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              label: t(`news.month.${i + 1}`),
            })),
          },
        ] : []}
      />

      {news.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-judo-gray text-lg">{t('news.noNews')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/nieuws/${item.id}`}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                {item.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={getImageUrl(item.coverImage)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-judo-red text-sm font-medium mb-3">
                    <Calendar size={16} />
                    {item.publishedDate && format(new Date(item.publishedDate), 'd MMMM yyyy', { locale: dateLocale })}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-judo-dark group-hover:text-judo-red transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-judo-red font-medium">
                    {t('news.readMore')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-judo-red text-white'
                      : 'border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};