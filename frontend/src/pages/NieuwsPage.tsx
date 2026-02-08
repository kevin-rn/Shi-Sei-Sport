import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getImageUrl } from '../lib/api';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';

export const NieuwsPage = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news?limit=20&sort=-publishedDate')
       .then((res) => {
         setNews(res.data.docs);
         setLoading(false);
       })
       .catch((err) => {
         console.error("Failed to load news", err);
         setLoading(false);
       });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
          <Icon name="newspaper" size={20} className="text-judo-red" />
          {t('nav.news')}
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">{t('news.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('news.description')}
        </p>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-judo-gray text-lg">{t('news.noNews')}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

