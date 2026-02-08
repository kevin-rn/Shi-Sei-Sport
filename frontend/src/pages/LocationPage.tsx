import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { api, getImageUrl } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Media } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';

interface Location {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
  mapEmbedUrl?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  locationImage?: number | Media | null;
  gallery?: (number | Media)[] | null;
}

export const LocationPage = () => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/locations');
        setLocations(response.data.docs || []);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError(t('locations.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [t]);

  const getLocationImageUrl = (image: number | Media | null | undefined): string | null => {
    if (!image) return null;
    if (typeof image === 'number') return null;
    return getImageUrl(image);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('locations.loading')}</p>
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
            <h3 className="font-bold text-red-900 mb-2">{t('locations.error')}</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
          <Icon name="location" size={20} className="text-judo-red" />
          {t('locations.badge')}
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">{t('locations.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('locations.description')}
        </p>
      </div>

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-judo-gray">{t('locations.noLocations')}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {locations.map((location, index) => {
            const isEven = index % 2 === 0;
            const imageUrl = getLocationImageUrl(location.locationImage);

            return (
              <div
                key={location.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`grid lg:grid-cols-2 ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Text Content */}
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${!isEven ? 'lg:col-start-2' : ''}`}>
                    {/* Location Image (if available) - Show at top */}
                    {imageUrl && (
                      <div className="mb-6 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                        <img
                          src={imageUrl}
                          alt={location.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <h2 className="text-3xl font-bold text-judo-dark mb-6">{location.name}</h2>

                    <div className="flex gap-4 mb-6">
                      <div className="bg-judo-red/10 p-3 rounded-full h-fit">
                        <MapPin className="w-6 h-6 text-judo-red" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-judo-red uppercase tracking-wider mb-2">
                          {t('locations.address')}
                        </p>
                        <p className="text-lg text-judo-gray leading-relaxed whitespace-pre-line">
                          {location.address}
                        </p>
                      </div>
                    </div>

                    {/* Google Maps Link */}
                    {location.googleMapsUrl && (
                      <a
                        href={location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-judo-red text-white px-6 py-3 rounded-lg hover:bg-judo-red/90 transition-colors font-bold w-fit"
                      >
                        <MapPin className="w-5 h-5" />
                        Open in Google Maps
                      </a>
                    )}
                  </div>

                  {/* Map */}
                  <div className={`relative min-h-[400px] bg-gray-100 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {location.mapEmbedUrl ? (
                      <iframe
                        src={location.mapEmbedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${location.name}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
                        {t('locations.noMap')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Info Section */}
      <div className="mt-16 bg-gradient-to-r from-judo-red to-red-600 rounded-2xl p-8 md:p-12 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t('locations.questionsTitle')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-white/20 p-4 rounded-full mb-2">
              <Phone size={28} />
            </div>
            <p className="font-bold text-white">{t('locations.phone')}</p>
            <a
              href="tel:+31612345678"
              className="text-white/90 hover:text-white transition-colors underline"
            >
              +31 (0) 6 12345678
            </a>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-white/20 p-4 rounded-full mb-2">
              <Mail size={28} />
            </div>
            <p className="font-bold text-white">{t('locations.email')}</p>
            <a
              href="mailto:info@shiseisport.nl"
              className="text-white/90 hover:text-white transition-colors underline"
            >
              info@shiseisport.nl
            </a>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-white/20 p-4 rounded-full mb-2">
              <Clock size={28} />
            </div>
            <p className="font-bold text-white">{t('locations.hours')}</p>
            <p className="text-white/90">{t('locations.hoursText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
