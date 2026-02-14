import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

/**
 * Judo figure SVG icon.
 * Light mode: white gi, black belt.
 * Dark mode:  blue gi, white belt.
 */
const JudoIcon = ({ isDark }: { isDark: boolean }) => {
  const giColor = isDark ? '#2563eb' : '#ffffff';
  const beltColor = isDark ? '#ffffff' : '#111111';
  const outlineColor = isDark ? '#93c5fd' : '#111111';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="20"
      height="20"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx="16" cy="5" r="3" fill={giColor} stroke={outlineColor} strokeWidth="1.2" />
      <path d="M10 10 L16 14 L16 22 L9 22 L8 12 Z" fill={giColor} stroke={outlineColor} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M22 10 L16 14 L16 22 L23 22 L24 12 Z" fill={giColor} stroke={outlineColor} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="9" y="17.5" width="14" height="2.5" rx="0.6" fill={beltColor} />
      <line x1="10" y1="11" x2="4" y2="16" stroke={outlineColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="11" x2="27" y2="8" stroke={outlineColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="22" x2="10" y2="29" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="22" x2="22" y2="29" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const DarkModeToggle = () => {
  const { isDark, toggleDark } = useDarkMode();
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

  const handleClick = () => {
    if (flashing) return;
    // Fill color = mode we're switching TO: dark→light = white, light→dark = blue
    const fillColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(37,99,235,0.5)';
    if (btnRef.current) {
      btnRef.current.style.setProperty('--judo-fill-color', fillColor);
    }
    setFlashing(true);
    toggleDark();
    setTimeout(() => setFlashing(false), 450);
  };

  const idleBg = isTransparent ? 'bg-white/10' : 'bg-gray-100';

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`flex items-center justify-center w-10 h-10 rounded-lg ${idleBg} judo-toggle-btn${flashing ? ' judo-toggle-btn--flash' : ''}`}
      aria-label={isDark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      title={isDark ? 'Lichte modus' : 'Donkere modus'}
    >
      <JudoIcon isDark={isDark} />
    </button>
  );
};
