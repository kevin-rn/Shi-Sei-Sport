import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { LazyImage } from './LazyImage';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { getExcerpt } from '../lib/utils';

const VISIBLE = 3;

export const NewsSection = () => {
  const [news, setNews] = useState<News[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;

  useEffect(() => {
    api.get(`/news?limit=6&sort=-publishedDate&locale=${language}`)
       .then((res) => {
         setNews(res.data.docs);
         setLoading(false);
       })
       .catch((err) => {
         console.error("Failed to load news", err);
         setLoading(false);
       });
  }, [language]);

  if (loading) {
    return (
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <h2 className="text-4xl font-bold mb-12 text-judo-dark">{t('news.latest')}</h2>
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  const visibleNews = news.slice(startIndex, startIndex + VISIBLE);
  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < news.length;

  return (
    <section className="py-20 bg-light-gray">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-judo-dark">{t('news.latest')}</h2>
          <div className="flex items-center gap-3">
            {news.length > VISIBLE && (
              <>
                <button
                  onClick={() => setStartIndex((i) => i - 1)}
                  disabled={!canPrev}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStartIndex((i) => i + 1)}
                  disabled={!canNext}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <Link
              to="/news"
              className="news-link text-judo-red hover:text-red-700 font-medium transition-colors"
            >
              {t('news.all')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="relative flex flex-col h-96 rounded-t-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
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
                {/* Bottom red accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-judo-red scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};