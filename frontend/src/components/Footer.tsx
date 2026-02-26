import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import jbnLogo from '../assets/JBN-logo.png';
import ooievaarspasLogo from '../assets/ooievaarspas.png';
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('footer.club')}</h3>
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-400">{t('footer.followUs')}</span>
              <a
                href="https://www.facebook.com/ShiSeiSport/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block ml-2 group"
                aria-label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white group-hover:fill-[#1877F2] group-hover:scale-110 transition-all duration-300"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/schedule" className="hover:text-white transition-colors">
                  {t('nav.schedule')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/trial-lesson" className="hover:text-white transition-colors">
                  {t('nav.trial')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">
                  {t('nav.news')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners/Logos */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-base mb-2">{t('footer.partners') || 'Partners'}</h3>
            {/* JBN Link */}
            <a href="https://jbn.nl/482-shi-sei-sport" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
              <img src={jbnLogo} alt="Judo Bond Nederland" className="h-12 w-auto" loading="lazy" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{t('footer.jbn')}</span>
            </a>

            {/* Ooievaarspas Link */}
            <a href="https://ooievaarspas.nl/aanbiedingen/op-eigen-kracht/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
              <img src={ooievaarspasLogo} alt="Ooievaarspas" className="h-10 w-auto" loading="lazy" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{t('footer.ooievaarspas')}</span>
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t('footer.contact')}</h3>
            <p className="text-sm leading-relaxed">
              {t('footer.contactText')}
            </p>
          </div>
        </div>

        {/* Copyright and footer links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <span>© {currentYear} {t('footer.club')}. {t('footer.copyright')}</span>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/rules" className="hover:text-white transition-colors">
                {t('footer.rules')}
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};