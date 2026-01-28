import { Calendar, Trophy, Users } from 'lucide-react';

export const HistoriePage = () => {
  const milestones = [
    {
      year: '1950',
      title: 'Oprichting',
      description: 'Shi-Sei Sport wordt opgericht als de oudste judo club van Den Haag.',
    },
    {
      year: '1960',
      title: 'Uitbreiding',
      description: 'De club groeit en breidt uit met meer trainingsuren en nieuwe trainers.',
    },
    {
      year: '1980',
      title: 'Nieuwe Dojo',
      description: 'Verhuizing naar een nieuwe, modernere trainingslocatie.',
    },
    {
      year: '2020',
      title: '70 Jaar',
      description: 'Viering van 70 jaar Shi-Sei Sport met speciale evenementen.',
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          📜 Historie
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Onze Geschiedenis</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Sinds 1950 is Shi-Sei Sport een begrip in Den Haag. Ontdek onze rijke geschiedenis en traditie.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-judo-red transform md:-translate-x-1/2"></div>

        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`relative flex items-start gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Year Badge */}
              <div className="relative z-10 flex-shrink-0">
                <div className="bg-judo-red text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-lg">
                  {milestone.year}
                </div>
              </div>

              {/* Content Card */}
              <div
                className={`flex-1 bg-white border border-gray-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                  index % 2 === 0 ? 'md:ml-auto md:w-5/12' : 'md:mr-auto md:w-5/12'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-judo-red" />
                  <h3 className="text-xl font-bold text-judo-dark">{milestone.title}</h3>
                </div>
                <p className="text-judo-gray leading-relaxed">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center bg-light-gray rounded-2xl p-8">
          <Calendar className="w-12 h-12 text-judo-red mx-auto mb-4" />
          <div className="text-4xl font-bold text-judo-dark mb-2">75+</div>
          <div className="text-judo-gray">Jaar Ervaring</div>
        </div>
        <div className="text-center bg-light-gray rounded-2xl p-8">
          <Users className="w-12 h-12 text-judo-red mx-auto mb-4" />
          <div className="text-4xl font-bold text-judo-dark mb-2">100+</div>
          <div className="text-judo-gray">Actieve Leden</div>
        </div>
        <div className="text-center bg-light-gray rounded-2xl p-8">
          <Trophy className="w-12 h-12 text-judo-red mx-auto mb-4" />
          <div className="text-4xl font-bold text-judo-dark mb-2">4</div>
          <div className="text-judo-gray">Trainingsdagen</div>
        </div>
      </div>
    </div>
  );
};

