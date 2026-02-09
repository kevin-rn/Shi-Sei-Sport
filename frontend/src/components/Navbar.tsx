import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface MenuItemProps {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;
  const navbarBg = isTransparent ? '' : 'bg-white shadow-md';
  const textColor = isTransparent ? 'text-white' : 'text-judo-dark';
  const logoColor = isTransparent ? 'text-white' : 'text-judo-dark';

  const menuItems: MenuItemProps[] = [
    { label: t('nav.home'), href: '/' },
    {
      label: t('nav.about'),
      subItems: [
        { label: t('nav.team'), href: '/team' },
        { label: t('nav.history'), href: '/historie' },
        { label: t('nav.locations'), href: '/locaties' },
        { label: t('nav.rules'), href: '/regels' },
      ],
    },
    {
      label: t('nav.info'),
      subItems: [
        { label: t('nav.schedule'), href: '/rooster' },
        { label: t('nav.agenda'), href: '/agenda' },
        { label: t('nav.pricing'), href: '/tarieven' },
        { label: t('nav.exam'), href: '/examen-eisen' },
        { label: t('nav.enrollment'), href: '/inschrijven' },
      ],
    },
    { label: t('nav.news'), href: '/nieuws' },
    { label: t('nav.media'), href: '/media' },
    { label: t('nav.contact'), href: '/contact' },
    { label: t('nav.trial'), href: '/proefles' },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 py-4 transition-all duration-300 ${navbarBg} ${textColor}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex flex-col leading-none hover:opacity-90 transition" onClick={() => setMobileMenuOpen(false)}>
          <strong className={`text-xl font-extrabold tracking-wide uppercase ${logoColor}`}>Shi-Sei Sport</strong>
          <span className={`text-xs font-medium ${isTransparent ? 'opacity-80' : 'opacity-70'}`}>Sinds 1950</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 font-medium text-sm">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className={`hover:text-judo-red transition-colors py-2 ${textColor}`}
                >
                  {item.label}
                </Link>
              ) : (
                <button className={`hover:text-judo-red transition-colors py-2 flex items-center gap-1 ${textColor}`} aria-label={item.label}>
                  {item.label}
                  <span className="text-xs" aria-hidden="true">▼</span>
                </button>
              )}

              {item.subItems && (
                <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      className="block px-4 py-3 text-sm text-judo-dark hover:bg-judo-red hover:text-white transition-colors first:rounded-t-md last:rounded-b-md"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Vertaalknop nu achter de menu-items */}
          <LanguageToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            className={`p-2 hover:opacity-80 transition ${textColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Vertaalknop nu na de hamburger menu knop */}
          <LanguageToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-6 py-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="block py-3 px-4 hover:bg-judo-red hover:text-white text-judo-dark transition-colors rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="py-3 px-4 font-medium text-judo-dark">{item.label}</div>
                )}
                {item.subItems && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className="block py-2 px-4 text-sm hover:bg-judo-red hover:text-white text-judo-dark transition-colors rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};