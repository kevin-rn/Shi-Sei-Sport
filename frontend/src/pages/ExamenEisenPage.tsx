import { Award, Book, Target } from 'lucide-react';

export const ExamenEisenPage = () => {
  const beltLevels = [
    {
      belt: '6e Kyu (Wit)',
      description: 'Basis technieken en etiquette',
      techniques: ['Ukemi (valbreken)', 'Basis worpen', 'Grondwerk basis'],
    },
    {
      belt: '5e Kyu (Geel)',
      description: 'Uitbreiding van basis technieken',
      techniques: ['Osoto-gari', 'Seoi-nage', 'Kesa-gatame'],
    },
    {
      belt: '4e Kyu (Oranje)',
      description: 'Geavanceerde worpen en houdgrepen',
      techniques: ['O-goshi', 'Juji-gatame', 'Kata-gatame'],
    },
    {
      belt: '3e Kyu (Groen)',
      description: 'Complexere combinaties',
      techniques: ['Harai-goshi', 'Ude-garami', 'Sankaku-jime'],
    },
    {
      belt: '2e Kyu (Blauw)',
      description: 'Geavanceerde technieken',
      techniques: ['Tai-otoshi', 'Kata-juji-jime', 'Yoko-shiho-gatame'],
    },
    {
      belt: '1e Kyu (Bruin)',
      description: 'Voorbereiding op zwarte band',
      techniques: ['Uchi-mata', 'Okuri-eri-jime', 'Kami-shiho-gatame'],
    },
    {
      belt: '1e Dan (Zwart)',
      description: 'Zwarte band - Expert niveau',
      techniques: ['Alle technieken', 'Kata', 'Randori op hoog niveau'],
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          🥋 Examen Eisen
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Examen Eisen</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Overzicht van de exameneisen voor elke bandgraad. Bereid je goed voor op je volgende examen.
        </p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Target className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">Minimale Leeftijd</h3>
          <p className="text-sm text-judo-gray">Vanaf 6 jaar</p>
        </div>
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Book className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">Theorie</h3>
          <p className="text-sm text-judo-gray">Kennis van technieken en regels</p>
        </div>
        <div className="bg-light-gray rounded-lg p-6 text-center">
          <Award className="w-10 h-10 text-judo-red mx-auto mb-3" />
          <h3 className="font-bold mb-2">Praktijk</h3>
          <p className="text-sm text-judo-gray">Demonstratie van technieken</p>
        </div>
      </div>

      {/* Belt Levels */}
      <div className="space-y-6">
        {beltLevels.map((level, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-6">
              <div className="bg-judo-red/10 p-4 rounded-full flex-shrink-0">
                <Award className="w-8 h-8 text-judo-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-judo-dark">{level.belt}</h3>
                </div>
                <p className="text-judo-gray mb-4">{level.description}</p>
                <div>
                  <h4 className="font-semibold mb-2 text-judo-dark">Vereiste Technieken:</h4>
                  <ul className="space-y-2">
                    {level.techniques.map((technique, techIndex) => (
                      <li key={techIndex} className="flex items-center gap-2 text-judo-gray">
                        <span className="w-2 h-2 bg-judo-red rounded-full"></span>
                        {technique}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

