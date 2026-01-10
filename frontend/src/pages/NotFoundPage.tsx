import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-4xl text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-extrabold text-judo-red mb-4">404</h1>
        <h2 className="text-4xl font-bold text-judo-dark mb-4">{t('404.title')}</h2>
        <p className="text-judo-gray text-lg mb-8">
          {t('404.description')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300"
        >
          <Home size={20} />
          {t('404.home')}
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 bg-light-gray hover:bg-gray-200 text-judo-dark font-bold py-4 px-8 rounded-lg transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          {t('404.back')}
        </button>
      </div>
    </div>
  );
};

