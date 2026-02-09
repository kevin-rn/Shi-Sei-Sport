import { useState, useEffect } from 'react';
import { Camera, Calendar, Images, AlertCircle, ChevronRight, X } from 'lucide-react';
import { getAlbums, getImageUrl, type Album } from '../lib/api';
import type { Media } from '../types/payload-types';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingDots } from '../components/LoadingDots';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';

export const MediaPage = () => {
  const { t, language } = useLanguage();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAlbums(language);
        setAlbums(response.docs);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError(t('media.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [language, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', {
      locale: language === 'nl' ? nl : enUS,
    });
  };

  const getPhotoUrl = (photo: number | Media): string => {
    if (typeof photo === 'number') return '';
    return getImageUrl(photo);
  };

  const getPhotoAlt = (photo: number | Media): string => {
    if (typeof photo === 'number') return '';
    return photo.alt || '';
  };

  const openLightbox = (album: Album, photoIndex: number) => {
    setSelectedAlbum(album);
    setSelectedPhotoIndex(photoIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setSelectedPhotoIndex(0);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedAlbum) {
      setSelectedPhotoIndex((prev) =>
        prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedAlbum) {
      setSelectedPhotoIndex((prev) =>
        prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum, selectedPhotoIndex]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('media.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
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

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <div className="text-center py-16">
          <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray text-lg">{t('media.noAlbums')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => {
            const coverPhoto = album.photos[0];
            const photoCount = album.photos.length;

            return (
              <div
                key={album.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => openLightbox(album, 0)}
              >
                {/* Cover Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {coverPhoto && (
                    <img
                      src={getPhotoUrl(coverPhoto)}
                      alt={getPhotoAlt(coverPhoto)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  {/* Photo Count Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    {photoCount}
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-judo-gray mb-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(album.date)}
                  </div>
                  <h3 className="text-xl font-bold text-judo-dark mb-2 group-hover:text-judo-red transition-colors">
                    {album.title}
                  </h3>
                  {album.description && (
                    <p className="text-judo-gray text-sm line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-judo-red font-semibold text-sm group-hover:gap-3 transition-all">
                    {t('media.viewAlbum')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedAlbum && (
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
              {selectedPhotoIndex + 1} / {selectedAlbum.photos.length}
            </p>
          </div>

          {/* Navigation Buttons */}
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

          {/* Main Image */}
          <div className="max-w-6xl max-h-[90vh] p-16">
            <img
              src={getPhotoUrl(selectedAlbum.photos[selectedPhotoIndex])}
              alt={getPhotoAlt(selectedAlbum.photos[selectedPhotoIndex])}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {selectedAlbum.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedPhotoIndex
                      ? 'border-judo-red scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getPhotoUrl(photo)}
                    alt={getPhotoAlt(photo)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
