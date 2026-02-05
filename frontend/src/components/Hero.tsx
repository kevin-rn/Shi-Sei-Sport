import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[90vh] flex items-center -mt-20 pt-20">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://shi-sei.nl/resources/IMG_1445.jpg" 
          alt="Judo training bij Shi-Sei Sport" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      {/* Text Content */}
      <div className="container mx-auto px-6 relative z-10 text-white max-w-4xl">
        {/* Red Callout Box */}
        <div className="inline-block bg-judo-red text-white px-4 py-2 rounded-lg mb-6 font-bold text-sm">
          {t('hero.founded') || 'Opgericht in 1950'}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          {t('hero.title')} <br />
          <span className="text-judo-red">{t('hero.subtitle')}</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-gray-200 mb-4">
          {t('hero.description')}
        </p>
        
        <p className="text-gray-300 max-w-2xl text-lg mb-10 leading-relaxed">
          {t('hero.text')}
        </p>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/proefles"
            className="inline-block bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300"
          >
            {t('hero.button')}
          </Link>
          <Link 
            to="/rooster"
            className="inline-block bg-white hover:bg-gray-100 text-judo-dark font-bold py-4 px-8 rounded-lg transition-colors duration-300"
          >
            {t('hero.scheduleButton') || 'Rooster & Agenda'}
          </Link>
        </div>
      </div>
    </section>
  );
};