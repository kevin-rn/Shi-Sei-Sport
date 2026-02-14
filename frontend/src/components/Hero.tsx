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
    <section className="relative h-[90vh] flex items-center -mt-20 pt-20">

      {/* Background Image / Carousel */}
      <div className="absolute inset-0 z-0">
        <HeroCarousel
          slides={carouselSlides}
          fallbackSrc="https://shi-sei.nl/resources/IMG_1445.jpg"
          fallbackAlt="Judo training bij Shi-Sei Sport"
        />
      </div>

      {/* Text Content */}
      <div className="container mx-auto px-6 relative z-10 text-white max-w-4xl">

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          {t('hero.title')} <br />
          <span className="text-judo-red">{t('hero.subtitle')}</span>
        </h1>

        <p className="text-xl md:text-2xl font-medium text-gray-200 mb-4">
          {t('hero.description')}
        </p>

        <p className="text-gray-300 max-w-2xl text-lg mb-10 leading-relaxed">
          {t('hero.text')}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/proefles"
            className={`hero-btn hero-btn-left shadow-lg hover:shadow-xl${leftPressed ? ' hero-btn-pressed' : ''}`}
            onMouseDown={() => setLeftPressed(true)}
            onMouseUp={() => setLeftPressed(false)}
            onMouseLeave={() => setLeftPressed(false)}
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
          >
            <span className="hero-btn-text">{t('hero.scheduleButton') || 'Rooster'}</span>
            <span className="hero-btn-arrow">➤</span>
          </Link>
        </div>
      </div>
    </section>
  );
};