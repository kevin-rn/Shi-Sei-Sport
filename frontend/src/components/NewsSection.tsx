import { useEffect, useState } from 'react';
import { api, getImageUrl } from '../lib/api';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { News } from '../types/payload-types';

export const NewsSection = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    // Fetch latest 3 news items
    api.get('/news?limit=3&sort=-publishedDate')
       .then((res) => setNews(res.data.docs))
       .catch((err) => console.error("Failed to load news", err));
  }, []);

  // Hide section if no news
  if (news.length === 0) return null;
  
  const featured = news[0]; 

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        <h2 className="text-4xl font-bold mb-12 text-judo-dark">Laatste Nieuws</h2>
        
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition hidden md:block">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Card */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl text-left w-full max-w-2xl">
            {featured.coverImage && (
              <div className="h-64 w-full overflow-hidden">
                 <img 
                   src={getImageUrl(featured.coverImage)} 
                   alt={featured.title} 
                   className="w-full h-full object-cover"
                 />
              </div>
            )}
            <div className="p-8">
              <span className="block text-judo-red font-bold text-sm mb-2 uppercase tracking-wider">
                {featured.publishedDate && format(new Date(featured.publishedDate), 'd MMMM yyyy', { locale: nl })}
              </span>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{featured.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                Klik om het volledige bericht te lezen...
              </p>
            </div>
          </div>

          <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition hidden md:block">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};