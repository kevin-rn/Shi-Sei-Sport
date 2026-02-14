import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { DarkModeToggle } from './DarkModeToggle';
import logoSvg from '../assets/logo/shi-sei-logo-final.svg';

interface MenuItemProps {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [exitingLabel, setExitingLabel] = useState<string | null>(null);
  const prevActiveLabel = useRef<string | null>(null);
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

  const getActiveLabel = (items: MenuItemProps[]) => {
    for (const item of items) {
      if (item.href && location.pathname === item.href) return item.label;
      if (item.subItems?.some((sub) => location.pathname === sub.href)) return item.label;
    }
    return null;
  };

  const isActive = (item: MenuItemProps) => {
    if (item.href) return location.pathname === item.href;
    return item.subItems?.some((sub) => location.pathname === sub.href) ?? false;
  };

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

  // On route change: trigger exit animation on old tab, then clear it
  useEffect(() => {
    const currentLabel = getActiveLabel(menuItems);
    const prev = prevActiveLabel.current;
    if (prev && prev !== currentLabel) {
      setExitingLabel(prev);
      const timer = setTimeout(() => setExitingLabel(null), 200);
      prevActiveLabel.current = currentLabel;
      return () => clearTimeout(timer);
    }
    prevActiveLabel.current = currentLabel;
  }, [location.pathname]);

  return (
    <nav className={`fixed w-full top-0 z-50 py-4 transition-all duration-300 ${navbarBg} ${textColor}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition" onClick={() => setMobileMenuOpen(false)}>
          <img src={logoSvg} alt="Shi-Sei Sport logo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none">
            <strong className={`text-xl font-black font-display tracking-wide uppercase ${logoColor}`}>Shi-Sei Sport</strong>
            <span className={`text-xs font-medium ${isTransparent ? 'opacity-80' : 'opacity-70'}`}>Sinds 1950</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 font-bold font-display text-sm">
          {menuItems.map((item) => {
            const active = isActive(item);
            const exiting = exitingLabel === item.label;
            return (
              <div key={item.label} className="relative group">
                <span
                  className="absolute -top-4 left-0 right-0 h-0.5 bg-judo-red rounded-b origin-center"
                  style={{
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    transition: (active || exiting) ? 'transform 200ms ease-in-out' : 'none',
                  }}
                />
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`hover:text-judo-red transition-colors py-2 ${textColor} ${active ? 'font-bold' : ''}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button className={`hover:text-judo-red transition-colors py-2 flex items-center gap-1 ${textColor} ${active ? 'font-bold' : ''}`} aria-label={item.label}>
                    {item.label}
                    <span className="text-xs transition-transform duration-200 group-hover:rotate-90" aria-hidden="true">❯</span>
                  </button>
                )}

                {item.subItems && (
                  <div className="absolute left-0 mt-0 w-48 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
            );
          })}
          {/* Vertaalknop en dark mode toggle achter de menu-items */}
          <LanguageToggle />
          <DarkModeToggle />
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
          {/* Vertaalknop en dark mode toggle na de hamburger menu knop */}
          <LanguageToggle />
          <DarkModeToggle />
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
                    className="block py-3 px-4 font-bold font-display hover:bg-judo-red hover:text-white text-judo-dark transition-colors rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="py-3 px-4 font-bold font-display text-judo-dark">{item.label}</div>
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