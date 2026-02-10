import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'nl' ? 'en' : 'nl');
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  const textClass = isTransparent ? 'text-white' : 'text-judo-dark';
  const idleClass = isTransparent
    ? 'bg-white/10 hover:bg-white/20'
    : 'bg-gray-100 hover:bg-gray-200';

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${textClass} ${clicked ? 'animate-fill-flash' : `${idleClass} transition-colors duration-300`}`}
      aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
      title={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
    >
      <Languages size={16} />
      <span className="uppercase">{language === 'nl' ? 'EN' : 'NL'}</span>
    </button>
  );
};

