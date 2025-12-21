export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center md:text-left">
          <span className="text-sm">© 2025 Uw Clubnaam</span>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Huishoudelijke Regels
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Algemene Voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
