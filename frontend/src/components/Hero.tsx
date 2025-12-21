import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?q=80&w=2070" 
          alt="Judo Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      {/* Text Content */}
      <div className="container mx-auto px-6 relative z-10 text-white max-w-4xl">
        <span className="inline-block bg-judo-red text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          Opgericht in 1950
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Judo & Taekwondo <br />
          <span className="text-judo-red">SHI-SEI SPORT</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-gray-200 mb-4">
          De oudste judo club van Den Haag
        </p>
        
        <p className="text-gray-300 max-w-2xl text-lg mb-10 leading-relaxed">
          Wij geven judo les op maandag, woensdag, donderdag en zaterdag. 
          Ervaar de kracht van discipline, respect en zelfvertrouwen in onze dojo.
        </p>
        
        <Link 
          to="/proefles"
          className="inline-block bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded transition-colors duration-300"
        >
          Probeer een Proefles →
        </Link>
      </div>
    </section>
  );
};