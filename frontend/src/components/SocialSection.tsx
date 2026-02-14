import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';

const FB_PAGE_URL = 'https://www.facebook.com/ShiSeiSport';

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
}

export const SocialSection = () => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? enUS : nl;
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    api.get<{ posts: FacebookPost[] }>('/facebook-posts')
      .then((res) => {
        if (res.data.posts.length === 0) {
          setVisible(false);
        } else {
          setPosts(res.data.posts);
        }
      })
      .catch(() => setVisible(false));
  }, []);

  if (!visible) return null;
  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2 className="text-3xl font-bold text-judo-dark">
            {t('social.title')}
          </h2>
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-judo-red hover:text-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
            </svg>
            {t('social.followFacebook')}
          </a>
        </div>

        {/* Horizontal scrolling post cards */}
        <div className="overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-5" style={{ width: 'max-content' }}>
            {posts.map((post) => {
              const text = post.message || post.story || '';
              const date = new Date(post.created_time);
              return (
                <a
                  key={post.id}
                  href={post.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                  style={{ width: '300px', flexShrink: 0 }}
                >
                  {/* Image */}
                  {post.full_picture && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={post.full_picture}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-judo-red mb-2">
                      {format(date, 'd MMMM yyyy', { locale: dateLocale })}
                    </span>
                    {text && (
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 flex-1">
                        {text}
                      </p>
                    )}
                    <span className="news-link mt-4 text-sm font-semibold text-judo-red inline-block">
                      {t('social.readMore')}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
