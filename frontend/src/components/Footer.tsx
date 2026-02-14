import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import jbnLogo from '../assets/JBN-logo.png';
import ooievaarspasLogo from '../assets/ooievaarspas.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.club')}</h3>
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
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
            <h3 className="text-white font-bold text-lg mb-2">{t('footer.partners') || 'Partners'}</h3>
            {/* JBN Link */}
            <a href="https://jbn.nl/482-shi-sei-sport" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
              <img src={jbnLogo} alt="Judo Bond Nederland" className="h-12 w-auto" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{t('footer.jbn')}</span>
            </a>

            {/* Ooievaarspas Link */}
            <a href="https://ooievaarspas.nl/aanbiedingen/op-eigen-kracht/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
              <img src={ooievaarspasLogo} alt="Ooievaarspas" className="h-10 w-auto" />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{t('footer.ooievaarspas')}</span>
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.contact')}</h3>
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