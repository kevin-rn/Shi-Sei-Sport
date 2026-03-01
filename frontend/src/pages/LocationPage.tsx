import { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import type { Media } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { FillButton } from '../components/FillButton';
import { PageWrapper } from '../components/PageWrapper';
import { PageHeader } from '../components/PageHeader';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

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
  useSeo({ title: t('locations.title') });
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
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLocationMedia = (image: number | Media | null | undefined): Media | null => {
    if (!image || typeof image === 'number') return null;
    return image;
  };

  if (loading) return <LoadingState message={t('locations.loading')} maxWidth="max-w-6xl" />;

  if (error) return <ErrorState title={t('locations.error')} message={error} maxWidth="max-w-6xl" />;

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <PageHeader icon={<Icon name="location" size={42} className="text-judo-red" />} title={t('locations.title')} />

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

                    <h2 className="text-xl md:text-2xl font-bold text-judo-dark mb-6">{location.name}</h2>

                    <div className="flex gap-4 mb-6">
                      <div className="bg-judo-red/10 p-3 rounded-full h-fit">
                        <MapPin className="w-6 h-6 text-judo-red" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-judo-red uppercase tracking-wider mb-2">
                          {t('locations.address')}
                        </p>
                        <p className="text-base text-judo-gray leading-relaxed whitespace-pre-line">
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
                  <div className={`relative min-h-[280px] md:min-h-[400px] bg-gray-100 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
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
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          {t('locations.contactTitle')}
        </h2>
        <p className="text-white/90 text-base mb-6 max-w-2xl mx-auto">
          {t('locations.contactDescription')}
        </p>
        <FillButton
          to="/contact"
          pressedClass="nav-btn--pressed"
          className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-base"
        >
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('locations.contactButton')}</span>
        </FillButton>
      </div>
    </PageWrapper>
  );
};
