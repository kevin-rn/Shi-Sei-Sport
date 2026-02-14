import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    if (flashing) return;
    if (btnRef.current) {
      btnRef.current.style.setProperty('--judo-fill-color', 'rgba(230,0,0,0.4)');
    }
    setLanguage(language === 'nl' ? 'en' : 'nl');
    setFlashing(true);
    setTimeout(() => setFlashing(false), 450);
  };

  const textClass = isTransparent ? 'text-white' : 'text-judo-dark';
  const idleBg = isTransparent ? 'bg-white/10' : 'bg-gray-100';

  return (
    <button
      ref={btnRef}
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${textClass} ${idleBg} judo-toggle-btn${flashing ? ' judo-toggle-btn--flash' : ''}`}
      aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
      title={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
    >
      <Languages size={16} />
      <span className="uppercase">{language === 'nl' ? 'EN' : 'NL'}</span>
    </button>
  );
};

