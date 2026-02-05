import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock} from 'lucide-react';
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
        const response = await api.get('/locations');
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
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          Loading location information...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Locaties</h1>
          </div>
          <p className="text-blue-100 text-lg">Bezoek onze trainingslocaties</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {locations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Geen locaties beschikbaar</p>
          </div>
        ) : (
          <div className="grid gap-12">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  
                  {/* Linker kolom: Informatie */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{location.name}</h2>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Adres</p>
                          <p className="text-lg text-gray-800 leading-relaxed">{location.address}</p>
                        </div>
                      </div>

                      {location.locationImage && (
                        <div className="mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                           <img
                            src={location.locationImage.url}
                            alt={location.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rechter kolom: De Kaart */}
                  <div className="relative min-h-[350px] bg-gray-200">
                    {location.mapLink ? (
                      <div 
                        className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full border-none"
                        dangerouslySetInnerHTML={{ __html: location.mapLink }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
                        Geen kaart beschikbaar
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-8 md:p-12 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Vragen over onze locaties?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                <Phone size={28} />
              </div>
              <p className="font-bold text-gray-900">Telefoon</p>
              <p className="text-gray-600">+31 (0) 6 12345678</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                <Mail size={28} />
              </div>
              <p className="font-bold text-gray-900">Email</p>
              <p className="text-gray-600">info@shiseisport.nl</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                <Clock size={28} />
              </div>
              <p className="font-bold text-gray-900">Openingstijden</p>
              <p className="text-gray-600">Afhankelijk van lesrooster</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};