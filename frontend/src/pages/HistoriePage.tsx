import { Calendar, Users, History, MapPin, Trophy } from 'lucide-react';
import { Icon } from '../components/Icon';
import { useLanguage } from '../contexts/LanguageContext';

export const HistoriePage = () => {
  const { t } = useLanguage();

  const milestones = [
    {
      year: '1950',
      title: t('history.milestones.1950.title'),
      description: t('history.milestones.1950.description'),
    },
    {
      year: '1960',
      title: t('history.milestones.1960.title'),
      description: t('history.milestones.1960.description'),
    },
    {
      year: '1981',
      title: t('history.milestones.1980.title'),
      description: t('history.milestones.1980.description'),
    },
    {
      year: '2011',
      title: t('history.milestones.2011.title'),
      description: t('history.milestones.2011.description'),
    },
    {
      year: '2025',
      title: t('history.milestones.2025.title'),
      description: t('history.milestones.2025.description'),
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* --- Page Header --- */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="history" size={42} className="text-judo-red" />
          {t('history.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- MAIN CONTENT (Narrative) --- */}
        <div className="lg:col-span-8 space-y-12 text-judo-gray leading-relaxed text-lg">

          {/* Section 1: The Foundation (1950) */}
          <section>
            <h2 className="text-3xl font-bold text-judo-dark mb-6 flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <History className="text-judo-red w-8 h-8" />
              </div>
              {t('history.section1.title')}
            </h2>
            <p className="mb-4">
              {t('history.section1.p1')}
            </p>
            <p className="mb-4">
              {t('history.section1.p2')}
            </p>
            <p className="mb-4">
              {t('history.section1.p3').split('Tokio Hirano').map((part, index, array) => (
                index < array.length - 1 ? (
                  <span key={index}>
                    {part}
                    <a
                      href={t('history.section1.tokioHiranoLink')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-judo-red hover:underline font-semibold"
                    >
                      Tokio Hirano
                    </a>
                  </span>
                ) : part
              ))}
            </p>
            <p className="mb-4">
              {t('history.section1.p4')}
            </p>
            <p>
              {t('history.section1.p5')}
            </p>
          </section>

          {/* Highlights Box: Growth in the Sixties */}
          <section className="bg-gray-50 p-8 rounded-2xl border-l-4 border-judo-red shadow-sm">
            <h3 className="text-xl font-bold text-judo-dark mb-4 flex items-center gap-2">
              <Trophy className="text-judo-red w-5 h-5" /> {t('history.growth.title')}
            </h3>
            <p className="mb-4">
              {t('history.growth.description')}
            </p>
            <p className="text-sm italic text-purple-900 font-medium">
              {t('history.growth.didYouKnow')}
            </p>
          </section>

          {/* Successful Judokas */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">{t('history.section2.title')}</h2>
            <p>
              {t('history.section2.p1')}
            </p>
          </section>

          {/* Resurrection & New Locations */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">{t('history.section3.title')}</h2>
            <p className="mb-4">
              {t('history.section3.p1')}
            </p>
            <p className="mb-4">
              {t('history.section3.p2')}
            </p>
            <p className="mb-4">
              {t('history.section3.p3')}
            </p>
            <p>
              {t('history.section3.p4')}
            </p>
          </section>

          {/* Relocations & Recent History */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">{t('history.section4.title')}</h2>
            <p className="mb-4">
              {t('history.section4.p1')}
            </p>
            <p className="mb-4">
              {t('history.section4.p2')}
            </p>
            <p className="mb-4">
              {t('history.section4.p3')}
            </p>
            <p>
              {t('history.section4.p4')}
            </p>
          </section>
        </div>

        {/* --- SIDEBAR (Timeline) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-judo-dark mb-6 flex items-center gap-2">
              <Calendar className="text-judo-red w-5 h-5" /> {t('history.timeline.title')}
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-judo-red rounded-full border-4 border-white shadow-sm"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-judo-red font-bold text-xs bg-red-50 inline-block w-fit px-2 py-0.5 rounded mb-1">
                      {milestone.year}
                    </span>
                    <h4 className="font-bold text-judo-dark text-base">{milestone.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Summary Widget */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-judo-dark mb-4 text-xs uppercase tracking-wider">{t('history.stats.title')}</h4>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark text-lg">150+</div>
                    <div className="text-[10px] text-gray-500 uppercase">{t('history.stats.members')}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <MapPin className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark text-lg">{t('history.stats.city')}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{t('history.stats.region')}</div>
                  </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};