import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { useLanguage } from '../contexts/LanguageContext';
import type { Media } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';
import { FillButton } from '../components/FillButton';

interface LocationData {
  id: number;
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
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const locationsResponse = await api.get<{ docs: LocationData[] }>(`/locations?locale=${language}`);
        setLocations(locationsResponse.data.docs || []);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError(t('locations.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const getLocationMedia = (image: number | Media | null | undefined): Media | null => {
    if (!image || typeof image === 'number') return null;
    return image;
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
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="location" size={42} className="text-judo-red" />
          {t('locations.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
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
            const locationMedia = getLocationMedia(location.locationImage);

            return (
              <div
                key={location.id}
                className={`bg-white border border-gray-200 hover:border-judo-red shadow-lg overflow-hidden hover:shadow-xl transition-all group rounded-t-2xl ${isEven ? 'lg:rounded-l-2xl lg:rounded-tr-none' : 'lg:rounded-r-2xl lg:rounded-tl-none'}`}
              >
                <div className={`grid lg:grid-cols-2 ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Text Content + Image */}
                  <div className={`flex flex-col ${!isEven ? 'lg:col-start-2' : ''}`}>
                    {locationMedia && (
                      <LazyImage
                        media={locationMedia}
                        alt={location.name}
                        className="w-full h-64"
                        imageClassName="group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  <div className="p-8 md:p-12 flex flex-col justify-center flex-1">

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
                      <FillButton
                        href={location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-button-fill inline-flex items-center gap-2 bg-judo-red text-white px-6 py-3 rounded-lg border-2 border-judo-red hover:bg-white hover:text-judo-red font-bold w-fit overflow-hidden"
                      >
                        <MapPin className="w-5 h-5" />
                        {t('locations.openMaps')}
                      </FillButton>
                    )}
                  </div>
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

      {/* Contact CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-judo-red to-red-600 rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          {t('locations.contactTitle')}
        </h2>
        <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
          {t('locations.contactDescription')}
        </p>
        <FillButton
          to="/contact"
          pressedClass="nav-btn--pressed"
          className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg"
        >
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('locations.contactButton')}</span>
        </FillButton>
      </div>
    </div>
  );
};
