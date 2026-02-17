import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar, Share2, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { News } from '../types/payload-types';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { LoadingState } from '../components/LoadingState';
import { PageWrapper } from '../components/PageWrapper';

export const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!slug) return;

    api.get(`/news?where[slug][equals]=${slug}&locale=${language}&limit=1`)
       .then((res) => {
         const doc = res.data.docs?.[0] ?? null;
         setNews(doc);
         setLoading(false);
       })
       .catch((err) => {
         console.error("Failed to load news", err);
         setLoading(false);
       });
  }, [slug, language]);

  if (loading) return <LoadingState message={t('common.loading')} maxWidth="max-w-4xl" />;

  if (!news) {
    return (
      <PageWrapper maxWidth="max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('news.notFound')}</h2>
          <Link to="/news" className="news-link text-judo-red font-medium">
            {t('news.back')}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="max-w-4xl">
      <article>
        {news.coverImage && typeof news.coverImage === 'object' && (
          <div className="mb-8 rounded-2xl overflow-hidden h-[clamp(240px,40vw,480px)]">
            <LazyImage
              media={news.coverImage}
              placeholderSize="thumbnail"
              alt={news.title}
              eager
              className="w-full h-full"
              imageClassName="object-cover object-[center_30%]"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-judo-red text-sm font-medium">
            <Calendar size={16} />
            {news.publishedDate && format(new Date(news.publishedDate), 'd MMMM yyyy', { locale: dateLocale })}
          </div>

          <button
            onClick={handleShare}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-judo-gray hover:border-judo-red hover:text-judo-red transition-colors duration-200"
            aria-label={t('news.share')}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? t('news.shareCopied') : t('news.share')}
          </button>
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
    </PageWrapper>
  );
};