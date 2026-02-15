import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { LoadingDots } from '../components/LoadingDots';


export const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    api.get(`/news/${id}?locale=${language}`)
       .then((res) => {
         setNews(res.data);
         setLoading(false);
       })
       .catch((err) => {
         console.error("Failed to load news", err);
         setLoading(false);
       });
  }, [id, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-4xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('news.notFound')}</h2>
          <Link to="/news" className="news-link text-judo-red font-medium">
            {t('news.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-4xl">
      <article>
        {news.coverImage && typeof news.coverImage === 'object' && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <LazyImage
              media={news.coverImage}
              placeholderSize="thumbnail"
              alt={news.title}
              eager
              className="w-full"
              style={{ height: 'auto' }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-judo-red text-sm font-medium mb-6">
          <Calendar size={16} />
          {news.publishedDate && format(new Date(news.publishedDate), 'd MMMM yyyy', { locale: dateLocale })}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-judo-dark">
          {news.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          <div className="text-judo-gray leading-relaxed">
            {/* Oplossing: Controleer alleen of content aanwezig is en cast naar any voor de renderer */}
            {news.content ? (
              <RichTextRenderer content={news.content as any} />
            ) : (
              <p>{t('news.noContent')}</p>
            )}
          </div>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          to="/news"
          className="news-link news-link--back text-judo-red font-medium"
        >
          {t('news.backAll')}
        </Link>
      </div>
    </div>
  );
};