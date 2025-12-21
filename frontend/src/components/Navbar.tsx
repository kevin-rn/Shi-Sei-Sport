import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="absolute w-full top-0 z-20 py-6 text-white">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex flex-col leading-none hover:opacity-90 transition">
          <strong className="text-xl font-extrabold tracking-wide uppercase">Shi-Sei Sport</strong>
          <span className="text-xs font-medium opacity-80">Sinds 1950</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link to="/" className="hover:text-judo-red transition-colors">Home</Link>
          <Link to="/proefles" className="hover:text-judo-red transition-colors">Proefles</Link>
          <Link to="/rooster" className="hover:text-judo-red transition-colors">Rooster & Agenda</Link>
          <Link to="/contact" className="hover:text-judo-red transition-colors">Contact</Link>
        </div>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-2xl">☰</button>
        </div>

      </div>
    </nav>
  );
};