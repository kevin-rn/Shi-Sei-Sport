import { useEffect, useState } from 'react';
import { Users, Award, Calendar, ArrowRight } from 'lucide-react';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { getInstructors } from '../lib/api';
import { LazyImage } from '../components/LazyImage';
import type { Instructor } from '../types/payload-types';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';
import { FillButton } from '../components/FillButton';
import { useLanguage } from '../contexts/LanguageContext';

export const TeamPage = () => {
  const { t } = useLanguage();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getInstructors();
        setInstructors(data.docs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching instructors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">Laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
        <div className="text-center">
          <p className="text-red-600">Er is een fout opgetreden bij het laden van het team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="group" size={42} className="text-judo-red" />
          Ons Team
        </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Ontmoet onze ervaren en gepassioneerde trainers die zich inzetten voor uw ontwikkeling in judo.
        </p>
      </div>

      {/* Team Grid */}
      {instructors.length === 0 ? (
        <div className="text-center text-judo-gray">
          <p>Geen instructeurs gevonden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {instructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-6">
                {instructor.profileImage && typeof instructor.profileImage === 'object' ? (
                  <LazyImage
                    media={instructor.profileImage}
                    size="thumbnail"
                    alt={instructor.profileImage.alt || instructor.name}
                    className="w-20 h-20 rounded-full shrink-0"
                    imageClassName="transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="bg-judo-red/10 p-4 rounded-full">
                    <Users className="w-8 h-8 text-judo-red" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-judo-dark">
                    {instructor.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-judo-red" />
                    <span className="text-judo-red font-semibold">
                      {instructor.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-judo-gray">
                    <Calendar className="w-4 h-4" />
                    <span>{instructor.rank}</span>
                  </div>
                  
                  {/* Bio */}
                  {instructor.bio && (
                    <RichTextRenderer 
                      content={instructor.bio} 
                      className="text-judo-gray leading-relaxed mb-4"
                    />
                  )}
                  
                  {/* Qualifications */}
                  {instructor.qualifications && instructor.qualifications.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-judo-dark mb-2 text-sm">
                        Certificeringen & Prestaties:
                      </h4>
                      <ul className="text-sm text-judo-gray space-y-1">
                        {instructor.qualifications.map((qual: any, idx: number) => (
                          <li key={qual.id || idx} className="flex items-start">
                            <span className="text-judo-red mr-2">•</span>
                            <span>{qual.item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-light-gray rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-judo-dark">
            {t('team.cta')}
          </h2>
          <p className="text-judo-gray mb-6">
            {t('team.ctaText')}
          </p>
          <FillButton
            to="/trial-lesson"
            pressedClass="nav-btn--pressed"
            className="nav-btn bg-judo-red text-white px-8 py-4 rounded-lg hover:bg-red-700 font-bold text-lg"
          >
            <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
            <span className="nav-btn-text">{t('team.button')}</span>
          </FillButton>
        </div>
      </div>
    </div>
  );
};