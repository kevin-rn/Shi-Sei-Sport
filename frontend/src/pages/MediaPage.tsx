import { useState, useEffect } from 'react';
import { Camera, Calendar, Images, AlertCircle, ChevronRight, X, Play, Film } from 'lucide-react';
import { getAlbums, getYouTubeEmbedUrl, type Album, type VideoEmbed } from '../lib/api';
import type { Media } from '../types/payload-types';
import { LazyImage } from '../components/LazyImage';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { SearchFilter } from '../components/SearchFilter';

const ALBUMS_PER_PAGE = 12;

type Slide =
  | { kind: 'photo'; media: Media }
  | { kind: 'video'; embed: VideoEmbed };

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export const MediaPage = () => {
  const { t, language } = useLanguage();
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

  const resolveVideoEmbed = (item: number | VideoEmbed): VideoEmbed | null => {
    if (typeof item === 'number') return null;
    return item;
  };

  const buildSlides = (album: Album): Slide[] => {
    const photoSlides: Slide[] = (album.photos ?? [])
      .map(resolveMedia)
      .filter((m): m is Media => m !== null)
      .map((media) => ({ kind: 'photo' as const, media }));

    const videoSlides: Slide[] = (album.videos ?? [])
      .map(resolveVideoEmbed)
      .filter((v): v is VideoEmbed => v !== null && !!v.embedUrl)
      .map((embed) => ({ kind: 'video' as const, embed }));

    return [...photoSlides, ...videoSlides];
  };

  const openLightbox = (album: Album, slideIndex: number) => {
    const allSlides = buildSlides(album);
    setSelectedAlbum(album);
    setSlides(allSlides);
    setSelectedIndex(slideIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setSlides([]);
    setSelectedIndex(0);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

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

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error voordat we beginnen

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
        // We zetten nu WEL de error state, zodat de rode balk verschijnt
        // Dit gebeurt alleen als de API echt faalt (bijv. 500 error of offline)
        setError(t('media.error')); 
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [language, t, currentPage, search, yearFilter, contentTypeFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('media.loading')}</p>
        </div>
      </div>
    );
  }

  // Dit blok toont de rode balk ALLEEN als er een echte error is (catch block geraakt)
  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">{t('media.error')}</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
           <Camera size={42} className="w-8 h-8 text-judo-red" />
          {t('media.title')}
          </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
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
            icon: <Film className="h-4 w-4 text-gray-500" />,
            options: [
              { value: 'photos', label: t('media.filterPhotos') },
              { value: 'videos', label: t('media.filterVideos') },
            ],
          },
        ]}
      />

      {/* Albums Grid */}
      {/* Als er GEEN error is, maar de lijst is leeg (gewoon geen resultaten), toon dan dit: */}
      {albums.length === 0 ? (
        <div className="text-center py-16">
          <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray text-lg">{t('media.noAlbums')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => {
            const photoCount = album.photos.length;
            const videoCount = (album.videos ?? []).length;
            const collagePhotos = album.photos
              .map(resolveMedia)
              .filter((m: any): m is Media => m !== null)
              .slice(0, 4);

            return (
              <div
                key={album.id}
                className="cursor-pointer group"
                onClick={() => openLightbox(album, 0)}
              >
                {/* Collage */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-judo-red">
                  {collagePhotos.length === 1 && (
                    <LazyImage
                      media={collagePhotos[0]}
                      size="thumbnail"
                      alt={collagePhotos[0].alt || ''}
                      className="h-64 bg-gray-100"
                    />
                  )}
                  {collagePhotos.length === 2 && (
                    <div className="h-64 bg-gray-100 grid grid-cols-2 gap-0.5">
                      {collagePhotos.map((photo, i) => (
                        <LazyImage key={i} media={photo} size="thumbnail" alt={photo.alt || ''} className="w-full h-full" />
                      ))}
                    </div>
                  )}
                  {collagePhotos.length === 3 && (
                    <div className="h-64 bg-gray-100 grid grid-cols-2 gap-0.5">
                      <LazyImage media={collagePhotos[0]} size="thumbnail" alt={collagePhotos[0].alt || ''} className="w-full h-full row-span-2" />
                      <LazyImage media={collagePhotos[1]} size="thumbnail" alt={collagePhotos[1].alt || ''} className="w-full h-32" />
                      <LazyImage media={collagePhotos[2]} size="thumbnail" alt={collagePhotos[2].alt || ''} className="w-full h-32" />
                    </div>
                  )}
                  {collagePhotos.length >= 4 && (
                    <div className="h-64 bg-gray-100 grid grid-cols-2 gap-0.5">
                      <LazyImage media={collagePhotos[0]} size="thumbnail" alt={collagePhotos[0].alt || ''} className="w-full h-full row-span-2" />
                      <LazyImage media={collagePhotos[1]} size="thumbnail" alt={collagePhotos[1].alt || ''} className="w-full h-[84px]" />
                      <LazyImage media={collagePhotos[2]} size="thumbnail" alt={collagePhotos[2].alt || ''} className="w-full h-[84px]" />
                      <div className="relative w-full h-[84px]">
                        <LazyImage media={collagePhotos[3]} size="thumbnail" alt={collagePhotos[3].alt || ''} className="w-full h-full" />
                        {photoCount > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                            +{photoCount - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {collagePhotos.length === 0 && (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
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
                <div className="mt-3 px-1 flex justify-center">
                  <div className="text-left">
                    <h3 className="text-base font-bold text-judo-dark group-hover:text-judo-red transition-colors truncate">
                      {album.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-judo-gray mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(album.date)}
                    </div>
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
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Lightbox Modal */}
      {selectedAlbum && slides.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-judo-red transition-colors p-2 z-10"
            aria-label={t('media.close')}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Album Title */}
          <div className="absolute top-4 left-4 text-white z-10">
            <h2 className="text-2xl font-bold mb-1">{selectedAlbum.title}</h2>
            <p className="text-sm text-gray-300">
              {selectedIndex + 1} / {slides.length}
            </p>
          </div>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-judo-red transition-colors p-4 z-10"
                aria-label={t('media.previous')}
              >
                <ChevronRight className="w-8 h-8 rotate-180" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-judo-red transition-colors p-4 z-10"
                aria-label={t('media.next')}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Slide */}
          <div className="absolute inset-0 top-16 bottom-24 mx-16 flex items-center justify-center">
            {(() => {
              const slide = slides[selectedIndex];
              if (slide.kind === 'photo') {
                return (
                  <LazyImage
                    media={slide.media}
                    placeholderSize="thumbnail"
                    alt={slide.media.alt || ''}
                    eager
                    className="max-w-full max-h-full"
                  />
                );
              }
              return (
                <div className="w-full max-w-5xl mx-auto" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(slide.embed.embedUrl)}
                    title={slide.embed.title}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            })()}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
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
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};