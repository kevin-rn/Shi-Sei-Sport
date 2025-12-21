import { Link } from 'react-router-dom';

interface MenuItemProps {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export const Navbar = () => {
  const menuItems: MenuItemProps[] = [
    { label: 'HOME', href: '/' },
    {
      label: 'Over Ons',
      subItems: [
        { label: 'Het Team', href: '/team' },
        { label: 'Historie', href: '/historie' },
      ],
    },
    {
      label: 'INFORMATIE',
      subItems: [
        { label: 'Rooster', href: '/rooster' },
        { label: 'Tarieven', href: '/tarieven' },
        { label: 'Examen Eisen', href: '/examen-eisen' },
      ],
    },
    { label: 'Nieuws', href: '/nieuws' },
    { label: 'CONTACT', href: '/contact' },
    { label: 'GRATIS PROEFLES', href: '/proefles' },
  ];

  return (
    <nav className="absolute w-full top-0 z-20 py-6 text-white">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex flex-col leading-none hover:opacity-90 transition">
          <strong className="text-xl font-extrabold tracking-wide uppercase">Shi-Sei Sport</strong>
          <span className="text-xs font-medium opacity-80">Sinds 1950</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className="hover:text-judo-red transition-colors py-2"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="hover:text-judo-red transition-colors py-2 flex items-center gap-1">
                  {item.label}
                  <span className="text-xs">▼</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {item.subItems && (
                <div className="absolute left-0 mt-0 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.label}
                      to={subItem.href}
                      className="block px-4 py-3 text-sm hover:bg-judo-red hover:text-white transition-colors first:rounded-t-md last:rounded-b-md"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-2xl">☰</button>
        </div>

      </div>
    </nav>
  );
};