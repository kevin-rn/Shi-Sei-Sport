import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import error404Image from '../assets/error404.png';

export const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen">
      {/* Background image — cropped to upper half to show the sparring judokas */}
      <div className="absolute inset-0">
        <img
          src={error404Image}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-24 max-w-2xl mx-auto">
        <h1 className="text-[10rem] font-extrabold leading-none text-judo-red drop-shadow-lg mb-2">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">
          {t('404.title')}
        </h2>
        <p className="text-gray-300 text-lg mb-10">
          {t('404.description')}
        </p>

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
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            {t('404.back')}
          </button>
        </div>
      </div>
    </div>
  );
};
