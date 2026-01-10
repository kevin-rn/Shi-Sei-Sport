import { Link } from 'react-router-dom';
import { Users, Award, Calendar } from 'lucide-react';

export const TeamPage = () => {

  const teamMembers = [
    {
      name: 'Sensei John Lut',
      role: 'Hoofdtrainer',
      experience: '30+ jaar ervaring',
      description: 'Gediplomeerd judo-instructeur met jarenlange ervaring in het trainen van zowel beginners als gevorderden.',
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          👥 Het Team
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Ons Team</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Ontmoet onze ervaren en gepassioneerde trainers die zich inzetten voor uw ontwikkeling in judo.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-6">
              <div className="bg-judo-red/10 p-4 rounded-full">
                <Users className="w-8 h-8 text-judo-red" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-judo-dark">{member.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-judo-red" />
                  <span className="text-judo-red font-semibold">{member.role}</span>
                </div>
                <div className="flex items-center gap-2 mb-4 text-sm text-judo-gray">
                  <Calendar className="w-4 h-4" />
                  <span>{member.experience}</span>
                </div>
                <p className="text-judo-gray leading-relaxed">{member.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-light-gray rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-judo-dark">Interesse in Training?</h2>
          <p className="text-judo-gray mb-6">
            Kom langs voor een gratis proefles en maak kennis met ons team!
          </p>
          <Link
            to="/proefles"
            className="inline-block bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300"
          >
            Boek een Gratis Proefles
          </Link>
        </div>
      </div>
    </div>
  );
};

