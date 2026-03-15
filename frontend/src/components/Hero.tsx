import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getHeroCarousel } from '../lib/api';
import type { Media } from '../types/payload-types';
import { HeroCarousel } from './HeroCarousel';

export const Hero = () => {
  const { t, language } = useLanguage();
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState<Media[]>([]);

  useEffect(() => {
    getHeroCarousel(language).then((album) => {
      if (!album) return;
      const photos = album.photos
        .filter((p): p is Media => typeof p === 'object' && p !== null);
      setCarouselSlides(photos);
    }).catch(() => {
      // Silently fall back to static image
    });
  }, [language]);

  return (
    <section className="relative h-[75vh] sm:h-[65vh] md:h-[70vh] flex items-end sm:items-center -mt-20 pt-20 pb-16 sm:pb-0">

      {/* Background Image / Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroCarousel
          slides={carouselSlides}
          fallbackSrc="https://shi-sei.nl/resources/IMG_1445.jpg"
          fallbackAlt="Judo training bij Shi-Sei Sport"
        />
      </div>

      {/* Text Content */}
      <div className="container mx-auto px-6 pb-0 pt-0 sm:pt-16 md:pt-0 relative z-10 text-white max-w-4xl [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">

        <h1 className="text-3xl sm:text-3xl md:text-6xl font-black leading-tight mb-4 sm:mb-6">
          {t('hero.title')} <br />
          <span className="text-judo-red">{t('hero.subtitle')}</span>
        </h1>

        <p className="text-sm sm:text-base md:text-xl font-medium text-gray-200 mb-2 sm:mb-4">
          {t('hero.description')}
        </p>

        <p className="text-gray-300 max-w-2xl text-sm sm:text-base mb-6 sm:mb-10 leading-relaxed">
          {t('hero.text')}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4 [text-shadow:none]">
          <Link
            to="/proefles"
            className={`hero-btn hero-btn-left shadow-lg hover:shadow-xl${leftPressed ? ' hero-btn-pressed' : ''}`}
            onMouseDown={() => setLeftPressed(true)}
            onMouseUp={() => setLeftPressed(false)}
            onMouseLeave={() => setLeftPressed(false)}
            onTouchStart={() => setLeftPressed(true)}
            onTouchEnd={() => setLeftPressed(false)}
            onTouchCancel={() => setLeftPressed(false)}
          >
            <span className="hero-btn-text">{t('hero.button')}</span>
            <span className="hero-btn-arrow">➤</span>
          </Link>
          <Link
            to="/rooster"
            className={`hero-btn hero-btn-right shadow-md hover:shadow-lg${rightPressed ? ' hero-btn-pressed' : ''}`}
            onMouseDown={() => setRightPressed(true)}
            onMouseUp={() => setRightPressed(false)}
            onMouseLeave={() => setRightPressed(false)}
            onTouchStart={() => setRightPressed(true)}
            onTouchEnd={() => setRightPressed(false)}
            onTouchCancel={() => setRightPressed(false)}
          >
            <span className="hero-btn-text">{t('hero.scheduleButton') || 'Rooster'}</span>
            <span className="hero-btn-arrow">➤</span>
          </Link>
        </div>
      </div>
    </section>
  );
};