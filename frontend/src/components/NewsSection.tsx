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

export const NewsSection = () => {
  const [news, setNews] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;

  useEffect(() => {
    api.get('/news?limit=3&sort=-publishedDate&locale=${language}')
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h2 className="text-4xl font-bold mb-12 text-judo-dark">{t('news.latest')}</h2>
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;
  
  const currentNews = news[currentIndex];

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-judo-dark">{t('news.latest')}</h2>
          <Link
            to="/news"
            className="news-link text-judo-red hover:text-red-700 font-medium transition-colors"
          >
            {t('news.all')}
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button 
            onClick={prevNews}
            className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition hidden md:block"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <Link
            to={`/news/${currentNews.id}`}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl text-left w-full max-w-2xl hover:shadow-2xl transition-shadow cursor-pointer group"
          >
            {currentNews.coverImage && (
              <LazyImage
                media={currentNews.coverImage as any}
                size="thumbnail"
                alt={currentNews.title}
                className="h-64 w-full"
                imageClassName="group-hover:scale-110 transition-transform duration-500"
              />
            )}
            <div className="p-8">
              <span className="block text-judo-red font-bold text-sm mb-2 uppercase tracking-wider">
                {currentNews.publishedDate && format(new Date(currentNews.publishedDate), 'd MMMM yyyy', { locale: dateLocale })}
              </span>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2">{currentNews.title}</h3>
              
              <p className="text-gray-600 leading-relaxed mb-4 h-20 overflow-hidden text-ellipsis">
                {getExcerpt(currentNews.content, 140)}
              </p>

              <span className="news-link text-judo-red font-medium">
                {t('news.readMore')}
              </span>
            </div>
          </Link>

          <button 
            onClick={nextNews}
            className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition hidden md:block"
            aria-label="Next news"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {news.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-judo-red w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};