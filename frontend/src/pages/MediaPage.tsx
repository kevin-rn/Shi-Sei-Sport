import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Calendar, Images, ChevronRight, X, Play, Film, Download, Archive, Loader2, Share2, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getAlbums, getAlbum, getImageUrl, getVideoEmbedUrl, type Album } from '../lib/api';
import type { Media } from '../types/payload-types';
import { LazyImage } from '../components/LazyImage';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { SearchFilter } from '../components/SearchFilter';
import { PageWrapper } from '../components/PageWrapper';
import { ErrorState } from '../components/ErrorState';
import { useFocusTrap } from '../hooks/useFocusTrap';

const ALBUMS_PER_PAGE = 12;

type Slide =
  | { kind: 'photo'; media: Media }
  | { kind: 'video'; media: Media };

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export const MediaPage = () => {
  const { t, language } = useLanguage();
  useSeo({ title: t('media.title'), description: t('media.description') });
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'photos' | 'videos' | ''>('');
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const lightboxRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isFirstOpen = useRef(true);
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);
  const activePointers = useRef<Map<number, { clientX: number; clientY: number }>>(new Map());
  const deepLinkHandled = useRef(false);

  /** Returns the best download URL and filename for a photo: JPEG copy if available, WebP otherwise. */
  const getPhotoDownload = (media: Media): { url: string; filename: string } => {
    const jpegSize = media.sizes?.jpeg;
    if (jpegSize?.url) {
      const raw = jpegSize.url.includes('minio:9000')
        ? jpegSize.url.replace(/https?:\/\/minio:9000\/[^/]+\//, '/media/')
        : jpegSize.url;
      const name = jpegSize.filename ?? (media.filename ? media.filename.replace(/\.[^/.]+$/, '') + '.jpg' : 'photo.jpg');
      return { url: raw, filename: name };
    }
    return {
      url: getImageUrl(media),
      filename: media.filename ?? 'photo.webp',
    };
  };

  const downloadAll = async (album: Album, albumSlides: Slide[]) => {
    const photoSlides = albumSlides.filter((s): s is Extract<Slide, { kind: 'photo' }> => s.kind === 'photo');
    if (photoSlides.length === 0) return;

    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        photoSlides.map(async (slide) => {
          const { url, filename } = getPhotoDownload(slide.media);
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(filename, blob);
        })
      );
      const content = await zip.generateAsync({ type: 'blob' });
      const safeName = album.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      saveAs(content, `${safeName}.zip`);
    } finally {
      setDownloadingAll(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', {
      locale: language === 'nl' ? nl : enUS,
    });
  };

  const resolveMedia = (item: number | Media): Media | null => {
    if (typeof item === 'number') return null;
    return item;
  };

  const buildSlides = (album: Album): Slide[] => {
    const photoSlides: Slide[] = (album.photos ?? [])
      .map(resolveMedia)
      .filter((m): m is Media => m !== null)
      .map((media) => ({ kind: 'photo' as const, media }));

    const videoSlides: Slide[] = (album.videos ?? [])
      .map(resolveMedia)
      .filter((m): m is Media => m !== null && !!m.videoUrl)
      .map((media) => ({ kind: 'video' as const, media }));

    return [...photoSlides, ...videoSlides];
  };

  const openLightbox = (album: Album, slideIndex: number) => {
    const allSlides = buildSlides(album);
    setSelectedAlbum(album);
    setSlides(allSlides);
    setSelectedIndex(slideIndex);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setSlides([]);
    setSelectedIndex(0);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    panStart.current = null;
    activePointers.current.clear();
  };

  useFocusTrap(lightboxRef, !!(selectedAlbum && slides.length > 0), closeLightbox);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedAlbum]);

  // Reset zoom/pan when navigating slides
  useEffect(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    panStart.current = null;
    activePointers.current.clear();
  }, [selectedIndex]);

  // Preload adjacent images (±2) for smooth navigation
  useEffect(() => {
    if (!selectedAlbum || slides.length === 0) return;
    const offsets = [-2, -1, 1, 2];
    offsets
      .map((o) => (selectedIndex + o + slides.length) % slides.length)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((i) => slides[i])
      .filter((s): s is Extract<Slide, { kind: 'photo' }> => s?.kind === 'photo')
      .forEach((s) => {
        const img = new Image();
        img.src = getImageUrl(s.media);
      });
  }, [selectedIndex, slides, selectedAlbum]);

  // Scroll active thumbnail into center of strip
  useEffect(() => {
    if (!selectedAlbum) {
      isFirstOpen.current = true;
      return;
    }
    const el = thumbRefs.current[selectedIndex];
    if (!el) return;
    el.scrollIntoView({
      behavior: isFirstOpen.current ? 'instant' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    isFirstOpen.current = false;
  }, [selectedIndex, selectedAlbum]);

  // Wheel zoom — must be passive:false so preventDefault works
  useEffect(() => {
    const el = slideContainerRef.current;
    if (!el || !selectedAlbum) return;
    const handler = (e: WheelEvent) => {
      const slide = slides[selectedIndex];
      if (!slide || slide.kind !== 'photo') return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => {
        const next = Math.min(4, Math.max(1, prev * factor));
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [selectedAlbum, selectedIndex, slides]);

  // Deep-link: open lightbox from ?album=<id>&slide=<n> on initial album load
  useEffect(() => {
    if (deepLinkHandled.current || albums.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('album');
    const slideParam = params.get('slide');
    if (!albumId) return;
    deepLinkHandled.current = true;

    const slideIndex = Math.max(0, parseInt(slideParam ?? '0', 10) || 0);
    const found = albums.find((a) => String(a.id) === albumId);
    if (found) {
      openLightbox(found, slideIndex);
    } else {
      // Album is on a different page — fetch by ID directly
      getAlbum(albumId, language).then((album) => {
        if (album) openLightbox(album, slideIndex);
      }).catch(() => {/* ignore */});
    }
    history.replaceState(null, '', window.location.pathname);
  }, [albums]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox: arrows, zoom shortcuts
  useEffect(() => {
    if (!selectedAlbum) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrevious(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom((z: number) => Math.min(4, z * 1.25)); }
      else if (e.key === '-') { e.preventDefault(); setZoom((z: number) => Math.max(1, z * 0.8)); }
      else if (e.key === '0') { e.preventDefault(); setZoom(1); setPanOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedAlbum, goToPrevious, goToNext]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleYearFilter = (year: string) => {
    setYearFilter(year);
    setCurrentPage(1);
  };

  const handleContentTypeFilter = (value: string) => {
    setContentTypeFilter(value as 'photos' | 'videos' | '');
    setCurrentPage(1);
  };

  const handleShare = (album: Album, index: number) => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('album', String(album.id));
    url.searchParams.set('slide', String(index));
    const shareUrl = url.toString();

    const copyToClipboard = (text: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        }).catch(() => {/* ignore */});
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    };

    if (typeof navigator.share === 'function') {
      navigator.share({ title: album.title, url: shareUrl }).catch(() => copyToClipboard(shareUrl));
    } else {
      copyToClipboard(shareUrl);
    }
  };

  // Zoom/pan pointer handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    if (activePointers.current.size === 2) {
      const pts = [...activePointers.current.values()];
      const dist = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
      pinchStart.current = { dist, zoom };
      panStart.current = null;
    } else if (zoom > 1) {
      e.currentTarget.setPointerCapture(e.pointerId);
      panStart.current = { x: e.clientX, y: e.clientY, px: panOffset.x, py: panOffset.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
    if (activePointers.current.size === 2 && pinchStart.current) {
      const pts = [...activePointers.current.values()];
      const dist = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
      const newZoom = Math.min(4, Math.max(1, pinchStart.current.zoom * (dist / pinchStart.current.dist)));
      setZoom(newZoom);
      if (newZoom === 1) setPanOffset({ x: 0, y: 0 });
    } else if (activePointers.current.size === 1 && panStart.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPanOffset({ x: panStart.current.px + dx, y: panStart.current.py + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) pinchStart.current = null;
    if (activePointers.current.size === 0) panStart.current = null;
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAlbums(
          language,
          ALBUMS_PER_PAGE,
          currentPage,
          search,
          yearFilter,
          contentTypeFilter || undefined
        );
        
        setAlbums(response.docs);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error fetching albums:', err);
        // Only set the error banner when the API call itself fails (e.g. 500 or offline).
        setError(t('media.error'));
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [language, t, currentPage, search, yearFilter, contentTypeFilter]);

  if (error) return <ErrorState title={t('media.error')} message={error} maxWidth="max-w-7xl" />;

  return (
    <PageWrapper maxWidth="max-w-7xl">
      {/* Header + Filters */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-extrabold text-judo-dark mb-3 flex items-center justify-center gap-3">
            <Camera size={36} className="text-judo-red" />
            {t('media.title')}
          </h1>
          <p className="text-judo-gray text-base max-w-xl mx-auto">
            {t('media.description')}
          </p>
        </div>

        <SearchFilter
          onSearch={handleSearch}
          onFilterDate={handleYearFilter}
          years={generateYears()}
          placeholder={t('media.search')}
          extraFilters={[
            {
              value: contentTypeFilter,
              onChange: handleContentTypeFilter,
              placeholder: t('media.filterContent'),
              icon: <Film className="h-4 w-4 text-gray-400" />,
              options: [
                { value: 'photos', label: t('media.filterPhotos') },
                { value: 'videos', label: t('media.filterVideos') },
              ],
            },
          ]}
        />
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-judo-red animate-spin" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16">
          <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray text-base">{t('media.noAlbums')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {albums.map((album) => {
            const photoCount = album.photos.length;
            const videoCount = (album.videos ?? []).length;
            const collagePhotos = album.photos
              .map(resolveMedia)
              .filter((m: Media | null): m is Media => m !== null)
              .slice(0, 4);

            return (
              <div
                key={album.id}
                className="cursor-pointer group"
                onClick={() => openLightbox(album, 0)}
                role="button"
                tabIndex={0}
                aria-label={album.title}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(album, 0); } }}
              >
                {/* Collage */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-judo-red">
                  {collagePhotos.length === 1 && (
                    <LazyImage
                      media={collagePhotos[0]}
                      size="thumbnail"
                      alt={collagePhotos[0].alt || ''}
                      className="h-[55vw] md:h-[35vw] lg:h-[25vw] max-h-64 bg-gray-100"
                    />
                  )}
                  {collagePhotos.length === 2 && (
                    <div className="h-[55vw] md:h-[35vw] lg:h-[25vw] max-h-64 bg-gray-100 grid grid-cols-2 grid-rows-1 gap-0.5">
                      <LazyImage media={collagePhotos[0]} size="thumbnail" alt={collagePhotos[0].alt || ''} className="w-full h-full" />
                      <LazyImage media={collagePhotos[1]} size="thumbnail" alt={collagePhotos[1].alt || ''} className="w-full h-full" />
                    </div>
                  )}
                  {collagePhotos.length === 3 && (
                    <div className="h-[55vw] md:h-[35vw] lg:h-[25vw] max-h-64 bg-gray-100 grid grid-cols-2 grid-rows-2 gap-0.5">
                      <LazyImage media={collagePhotos[0]} size="thumbnail" alt={collagePhotos[0].alt || ''} className="w-full h-full row-span-2" />
                      <LazyImage media={collagePhotos[1]} size="thumbnail" alt={collagePhotos[1].alt || ''} className="w-full h-full" />
                      <LazyImage media={collagePhotos[2]} size="thumbnail" alt={collagePhotos[2].alt || ''} className="w-full h-full" />
                    </div>
                  )}
                  {collagePhotos.length >= 4 && (
                    <div className="h-[55vw] md:h-[35vw] lg:h-[25vw] max-h-64 bg-gray-100 flex gap-0.5">
                      <div className="w-1/2 flex-shrink-0">
                        <LazyImage media={collagePhotos[0]} size="thumbnail" alt={collagePhotos[0].alt || ''} className="w-full h-full" />
                      </div>
                      <div className="relative w-1/2 flex flex-col gap-0.5">
                        <LazyImage media={collagePhotos[1]} size="thumbnail" alt={collagePhotos[1].alt || ''} className="w-full flex-1" />
                        <LazyImage media={collagePhotos[2]} size="thumbnail" alt={collagePhotos[2].alt || ''} className="w-full flex-1" />
                        <LazyImage media={collagePhotos[3]} size="thumbnail" alt={collagePhotos[3].alt || ''} className="w-full flex-1" />
                        {photoCount > 3 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-base">
                            +{photoCount - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {collagePhotos.length === 0 && (
                    <div className="h-[55vw] md:h-[35vw] lg:h-[25vw] max-h-64 bg-gray-100 flex items-center justify-center">
                      <Images className="w-16 h-16 text-gray-300" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {videoCount > 0 && (
                      <div className="bg-black/60 text-white p-1.5 rounded-full">
                        <Play className="w-4 h-4" />
                      </div>
                    )}
                    <div className="bg-black/60 text-white p-1.5 rounded-full">
                      <Images className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Floating title below collage */}
                <div className="mt-3 px-1 text-center">
                  <h3 className="text-base font-bold text-judo-dark group-hover:text-judo-red transition-colors truncate">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-judo-gray mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(album.date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-11 h-11 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-judo-red text-white'
                  : 'border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-judo-gray hover:border-judo-red hover:text-judo-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lightbox Modal - rendered via portal to escape any stacking context */}
      {selectedAlbum && slides.length > 0 && createPortal(
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-lightbox-title"
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col"
        >
          {/* Top bar */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 py-2 min-h-[56px]">
            {/* Album title + counter */}
            <div className="text-white min-w-0">
              <h2 id="media-lightbox-title" className="text-base font-bold leading-tight truncate">{selectedAlbum.title}</h2>
              <p className="text-xs text-gray-300">{selectedIndex + 1} / {slides.length}</p>
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {/* Download current photo */}
              {slides[selectedIndex]?.kind === 'photo' && (() => {
                const slide = slides[selectedIndex];
                if (slide.kind !== 'photo') return null;
                const { url, filename } = getPhotoDownload(slide.media);
                return (
                  <a
                    href={url}
                    download={filename}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-white hover:text-judo-red transition-colors p-2 text-sm font-medium"
                    aria-label={t('media.download')}
                    title={t('media.download')}
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('media.download')}</span>
                  </a>
                );
              })()}

              {/* Download all photos as zip */}
              {slides.some((s) => s.kind === 'photo') && (
                <button
                  onClick={() => downloadAll(selectedAlbum, slides)}
                  disabled={downloadingAll}
                  className="flex items-center gap-1.5 text-white hover:text-judo-red transition-colors p-2 text-sm font-medium disabled:opacity-50 disabled:cursor-wait"
                  aria-label={t('media.downloadAll')}
                  title={t('media.downloadAll')}
                >
                  <Archive className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {downloadingAll ? t('media.downloadingAll') : t('media.downloadAll')}
                  </span>
                </button>
              )}

              <button
                onClick={() => handleShare(selectedAlbum, selectedIndex)}
                className="flex items-center gap-1.5 text-white hover:text-judo-red transition-colors p-2 text-sm font-medium"
                aria-label={t('media.share')}
                title={t('media.share')}
              >
                {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                <span className="hidden sm:inline">
                  {shareCopied ? t('media.shareCopied') : t('media.share')}
                </span>
              </button>

              <span className="w-px h-5 bg-white/20 mx-1" />

              <button
                onClick={closeLightbox}
                className="text-white hover:text-judo-red transition-colors p-2"
                aria-label={t('media.close')}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Main Slide */}
          <div className="flex-1 flex items-center min-h-0">
            {/* Prev button */}
            {slides.length > 1 && (
              <button
                onClick={goToPrevious}
                className="flex-shrink-0 text-white hover:text-judo-red transition-colors p-2 sm:p-4 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('media.previous')}
              >
                <ChevronRight className="w-8 h-8 rotate-180" />
              </button>
            )}

            {/* Slide content */}
            <div className="relative flex-1 h-full flex items-center justify-center min-w-0 overflow-hidden">
              {(() => {
                const slide = slides[selectedIndex];
                if (slide.kind === 'photo') {
                  return (
                    <div
                      ref={slideContainerRef}
                      className="w-full h-full"
                      style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: panStart.current ? 'none' : 'transform 0.1s ease-out',
                        cursor: zoom > 1 ? (panStart.current ? 'grabbing' : 'grab') : 'default',
                        touchAction: zoom > 1 ? 'none' : 'auto',
                      }}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                    >
                      <LazyImage
                        media={slide.media}
                        placeholderSize="thumbnail"
                        alt={slide.media.alt || ''}
                        eager
                        className="w-full h-full"
                        imageClassName="!object-contain"
                      />
                    </div>
                  );
                }
                return (
                  <div className="w-full max-w-5xl mx-auto" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src={getVideoEmbedUrl(slide.media.videoUrl!)}
                      title={slide.media.alt || ''}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              })()}

              {/* Zoom controls — only for photos */}
              {slides[selectedIndex]?.kind === 'photo' && (
                <div className="absolute bottom-4 left-4 flex gap-1 z-10">
                  <button
                    onClick={() => setZoom((z) => Math.min(4, z * 1.25))}
                    className="bg-black/50 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  {zoom > 1 && (
                    <>
                      <button
                        onClick={() => setZoom((z) => Math.max(1, z * 0.8))}
                        className="bg-black/50 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
                        aria-label="Zoom out"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
                        className="bg-black/50 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
                        aria-label="Reset zoom"
                        title="Reset zoom"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Next button */}
            {slides.length > 1 && (
              <button
                onClick={goToNext}
                className="flex-shrink-0 text-white hover:text-judo-red transition-colors p-2 sm:p-4 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('media.next')}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip — wheel scrolls navigate slides */}
          <div
            className="flex-shrink-0 bg-black/80 p-4 overflow-x-auto"
            onWheel={(e) => {
              const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
              if (delta > 0) goToNext(); else if (delta < 0) goToPrevious();
            }}
          >
            <div className="flex gap-2 justify-center">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  ref={(el) => { thumbRefs.current[index] = el; }}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={slide.media.alt || (slide.kind === 'video' ? `Video ${index + 1}` : `Photo ${index + 1}`)}
                  aria-pressed={index === selectedIndex}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? 'border-judo-red scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {slide.kind === 'photo' ? (
                    <LazyImage
                      media={slide.media}
                      size="thumbnail"
                      placeholderSize={false}
                      alt={slide.media.alt || ''}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-800">
                      <LazyImage
                        media={slide.media}
                        size="thumbnail"
                        placeholderSize={false}
                        alt={slide.media.alt || ''}
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-6 h-6 text-white drop-shadow" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageWrapper>
  );
};