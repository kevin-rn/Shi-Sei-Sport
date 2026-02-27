import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { api, getImageUrl } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar, Share2, Check, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import type { News } from '../types/payload-types';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { LoadingState } from '../components/LoadingState';
import { PageWrapper } from '../components/PageWrapper';
import { useFocusTrap } from '../hooks/useFocusTrap';

export const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  const [news, setNews] = useState<News | null>(null);
  useSeo({ title: news?.title ?? t('news.title') });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; alt: string } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  useFocusTrap(lightboxRef, !!zoomedImage, () => setZoomedImage(null));

  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [zoomedImage]);

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
          <h2 className="text-xl font-bold mb-4">{t('news.notFound')}</h2>
          <Link to="/news" className="news-link text-judo-red font-medium">
            {t('news.back')}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const coverImageUrl = news.coverImage && typeof news.coverImage === 'object'
    ? getImageUrl(news.coverImage)
    : null;

  return (
    <PageWrapper maxWidth="max-w-4xl">
      <article>
        {news.coverImage && typeof news.coverImage === 'object' && (
          <div
            className="relative mb-8 rounded-2xl overflow-hidden h-[clamp(240px,40vw,480px)] cursor-zoom-in group"
            onClick={() => coverImageUrl && setZoomedImage({ url: coverImageUrl, alt: news.title ?? '' })}
          >
            <LazyImage
              media={news.coverImage}
              placeholderSize="thumbnail"
              alt={news.title}
              eager
              className="w-full h-full"
              imageClassName="object-cover object-[center_30%] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
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

        <h1 className="text-2xl md:text-4xl font-extrabold mb-6 text-judo-dark">
          {news.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          <div className="text-judo-gray leading-relaxed">
            {news.content ? (
              <RichTextRenderer
                content={news.content as unknown as Parameters<typeof RichTextRenderer>[0]['content']}
                onImageClick={(url: string, alt: string) => setZoomedImage({ url, alt })}
              />
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

      {zoomedImage && createPortal(
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={zoomedImage.alt || 'Image preview'}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="relative flex items-center justify-center max-w-[95vw] max-h-[95vh] animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage.url}
              alt={zoomedImage.alt}
              className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>,
        document.body
      )}
    </PageWrapper>
  );
};
