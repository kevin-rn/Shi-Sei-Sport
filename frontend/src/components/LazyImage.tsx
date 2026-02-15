import { useEffect, useRef, useState } from 'react';
import { getImageUrl } from '../lib/api';
import type { Media } from '../types/payload-types';

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  media: Media | string | null | undefined;
  /** The full-resolution size to load when entering the viewport. Defaults to original. */
  size?: 'placeholder' | 'thumbnail';
  /** Override the placeholder size. Defaults to 'placeholder'. Pass false to disable the placeholder. */
  placeholderSize?: 'placeholder' | 'thumbnail' | false;
  /** Always load immediately without waiting for the viewport (e.g. hero images). */
  eager?: boolean;
  /** Extra classes applied to the inner <img> element (e.g. hover animations). */
  imageClassName?: string;
}

/**
 * Image component with IntersectionObserver-based lazy loading and a blurred
 * low-resolution placeholder (Payload's `placeholder` size, ~20px wide) that is
 * shown instantly while the full image loads. Fades in the full image on load.
 */
export const LazyImage = ({
  media,
  size,
  placeholderSize = 'placeholder',
  eager = false,
  className = '',
  imageClassName = '',
  alt,
  style,
  ...props
}: LazyImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  const fullSrc = getImageUrl(media, size);
  const placeholderSrc = placeholderSize ? getImageUrl(media, placeholderSize) : null;

  // If the placeholder is the same URL as the full image (e.g. size === placeholderSize
  // or no thumbnail exists), skip the placeholder to avoid a double request.
  const showPlaceholder = !!placeholderSrc && placeholderSrc !== fullSrc;

  // When style.height is 'auto', the container sizes to the image naturally.
  // Otherwise (fixed height from className like h-64), fill the container.
  const autoHeight = style?.height === 'auto';
  const imgFill = autoHeight ? 'w-full' : 'w-full h-full object-cover';

  // For auto-height mode, reserve space using the image's aspect ratio via
  // paddingBottom so the placeholder fills the correct area before the full
  // image loads. Once loaded, collapse the padding and let height be natural.
  const mediaObj = media && typeof media === 'object' ? media : null;
  const aspectPadding =
    autoHeight && !loaded && mediaObj?.width && mediaObj?.height
      ? `${(mediaObj.height / mediaObj.width) * 100}%`
      : undefined;

  useEffect(() => {
    if (eager || !containerRef.current) return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }, // start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, paddingBottom: aspectPadding }}
    >
      {/* Blurred placeholder — fills the aspect-ratio-reserved space until the full image loads */}
      {showPlaceholder && !loaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(8px)', transform: 'scale(1.1)' }}
        />
      )}

      {/* Full image — rendered (but invisible) once in view, fades in on load.
          While aspect-padding is active (not yet loaded), position absolutely to
          fill the padding-box. Once loaded, padding collapses and the image is
          in normal flow sizing the container naturally. */}
      {inView && fullSrc && (
        <img
          {...props}
          src={fullSrc}
          alt={alt ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          className={`${imgFill} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
          style={!loaded && aspectPadding ? { position: 'absolute', inset: 0, height: '100%' } : undefined}
        />
      )}
    </div>
  );
};
