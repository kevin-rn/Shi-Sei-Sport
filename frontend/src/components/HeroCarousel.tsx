import { useState, useEffect, useRef } from 'react';
import type { Media } from '../types/payload-types';
import { getImageUrl } from '../lib/api';

interface HeroCarouselProps {
  slides: Media[];
  fallbackSrc?: string;
  fallbackAlt?: string;
}

const AUTOPLAY_INTERVAL = 5000;

export const HeroCarousel = ({ slides, fallbackSrc, fallbackAlt }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const slidesLenRef = useRef(slides.length);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  slidesLenRef.current = slides.length;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slidesLenRef.current);
    }, AUTOPLAY_INTERVAL);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    startTimer();
  };

  // Fallback — no carousel data
  if (slides.length === 0) {
    return (
      <>
        <img
          src={fallbackSrc}
          alt={fallbackAlt ?? ''}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </>
    );
  }

  // Single image — no controls needed
  if (slides.length === 1) {
    return (
      <>
        <img
          src={getImageUrl(slides[0])}
          alt={slides[0].alt ?? ''}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </>
    );
  }

  return (
    <>
      {/* Slides */}
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={getImageUrl(slide)}
          alt={slide.alt ?? ''}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden={i !== current}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ga naar afbeelding ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </>
  );
};
