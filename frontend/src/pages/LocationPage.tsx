import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { api } from '../lib/api';

interface Location {
  id: string;
  name: string;
  address: string;
  mapLink: string;
  locationImage?: {
    url: string;
  };
}

export const LocationPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/locations');
        setLocations(response.data.docs || []);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Could not load location information');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">Loading location information...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Locaties</h1>
          </div>
          <p className="text-blue-100 text-lg">Bezoek onze trainingslocaties</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {locations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Geen locaties beschikbaar</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Left: Location Image */}
                  {location.locationImage && (
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={location.locationImage.url}
                        alt={location.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Right: Location Info */}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{location.name}</h2>

                    {/* Address */}
                    <div className="flex gap-3 mb-4">
                      <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Adres</p>
                        <p className="text-gray-800 whitespace-pre-line">{location.address}</p>
                      </div>
                    </div>

                    {/* Map Link */}
                    {location.mapLink && (
                      <div className="mt-6">
                        <a
                          href={location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                          Bekijk op kaart →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Neem contact op</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <Phone className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Telefoon</p>
                <p className="text-gray-600">+31 (70) XXX-XXXX</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">info@shiseisport.nl</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Openingstijden</p>
                <p className="text-gray-600">Ma-Vr: 18:00-21:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
