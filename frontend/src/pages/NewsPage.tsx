import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { ChevronRight, Hash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { getExcerpt } from '../lib/utils';
import { LoadingDots } from '../components/LoadingDots';
import { SearchFilter } from '../components/SearchFilter';
import logoSvg from '../assets/logo/shi-sei-logo.svg';

const ITEMS_PER_PAGE = 12;

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export const NewsPage = () => {
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
    <div className="relative">
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <img src={logoSvg} alt="" aria-hidden="true" className="w-[min(80vw,80vh)] opacity-[0.04]" />
      </div>
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl relative" style={{ zIndex: 1 }}>
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
              <div key={item.id} className="news-card-wrapper rounded-2xl shadow-md hover:shadow-xl ring-2 ring-transparent hover:ring-[#E60000] transition-all duration-300 group">
              <Link
                to={`/news/${item.id}`}
                className="relative flex flex-col h-96 rounded-2xl overflow-hidden block"
              >
                {/* Image — full card height as background */}
                <div className="absolute inset-0">
                  {item.coverImage ? (
                    <LazyImage
                      media={item.coverImage as any}
                      size="thumbnail"
                      alt={item.title}
                      className="h-full w-full"
                      imageClassName="group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100" />
                  )}
                  {/* Darkening overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </div>

                {/* Date — top left, red at rest, white on hover */}
                <div className="absolute top-4 left-4 group-hover:top-5 group-hover:left-5 transition-all duration-300">
                  <span
                    className="text-judo-red group-hover:text-white font-semibold text-xs uppercase tracking-widest transition-colors duration-300"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                  >
                    {item.publishedDate && format(new Date(item.publishedDate), 'd MMMM yyyy', { locale: dateLocale })}
                  </span>
                </div>

                {/* Idle state: gradient + title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-8 pb-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {/* Hover state: white panel slides up from bottom */}
                <div className="news-card-panel absolute bottom-0 -left-px -right-px bg-white px-5 pt-4 pb-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <h3 className="text-base font-bold text-judo-red leading-snug line-clamp-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-2">
                    {getExcerpt(item.content, 100)}
                  </p>
                  <div className="flex justify-end">
                    <ChevronRight className="w-5 h-5 text-judo-red" />
                  </div>
                </div>
              </Link>
              </div>
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
    </div>
  );
};
