import { Calendar, Users, History, MapPin, Trophy } from 'lucide-react';

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
      year: '2011',
      title: 'Morgenstond',
      desc: 'Verhuizing naar de Pachtersdreef.',
    },
    {
      year: '2025',
      title: '75 Jaar',
      description: '75 jaar bestaan!.',
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* --- Page Header --- */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          Sinds 1950
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Onze Rijke Geschiedenis</h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- MAIN CONTENT (Narrative) --- */}
        <div className="lg:col-span-8 space-y-12 text-judo-gray leading-relaxed text-lg">
          
          {/* 1950s - The Beginning */}
          <section>
            <h2 className="text-3xl font-bold text-judo-dark mb-6 flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <History className="text-judo-red w-8 h-8" />
              </div> 
              De Oprichting (1950)
            </h2>
            <p className="mb-4">
              In november 1950 werd <strong>JUDOVERENIGING SHI-SEI</strong> opgericht. Een aantal enthousiaste judoka’s van Johan v.d. Bruggen uit de Zoutmanstraat wilden een eigen club. Een club waar men goedkoper en ook meer kon trainen. 
            </p>
            <p className="mb-4">
              Onder leiding van <strong>Jacques Brakel</strong>, Hans van Diggelen en nog enkele anderen, werd op 5 november 1950 de Judovereniging SHI-SEI geboren, aangemeld bij de Kamer van Koophandel en bij de Nederlandse Amateur Judo Associatie aangesloten.
            </p>
            <p>
              In de beginperiode werd geoefend in een gymzaal aan de Daal en Bergselaan, maar al vrij snel verhuisde men naar een permanente dojo in de <strong>Jan Hendrikstraat 9</strong>. Hier zorgde de NAJA-bondstrainer Tokio Hirano (6e dan) voor de technische basis.
            </p>
          </section>

          {/* Highlights Box */}
          <section className="bg-gray-50 p-8 rounded-2xl border-l-4 border-judo-red shadow-sm">
            <h3 className="text-xl font-bold text-judo-dark mb-4 flex items-center gap-2">
              <Trophy className="text-judo-red w-5 h-5" /> Technische Groei
            </h3>
            <p className="mb-4">
              <strong>Wil Wagner</strong> was de eerste zwartebandhouder van de club, gevolgd door Jan v.d. Toorn. De club werd een kweekvijver voor talent en leverde door de jaren heen honderden zwartebandhouders af.
            </p>
            <p className="text-sm italic">
              Wist je dat Shi-Sei de moederclub is van vele bekende Haagse clubs zoals Lu-Gia-Jen en De Doorkruiers?
            </p>
          </section>

          {/* 1981 & Taekwondo */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">1981: De Nieuwe Schoolstraat</h2>
            <p className="mb-4">
              In 1981 kreeg de club een iconische plek in de oude school aan de <strong>Nieuwe Schoolstraat 22-B</strong>. Met een ruime oefenzaal, douches en een kantine werd dit het hart van de vereniging.
            </p>
            <div className="bg-judo-dark text-white p-6 rounded-xl mb-4">
              <p className="font-medium">
                Sinds 1990 is de vereniging uitgebreid met een zeer actieve <strong>taekwondo-afdeling</strong>, waardoor we een breder scala aan budosporten konden aanbieden.
              </p>
            </div>
          </section>

          {/* Recent History */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">Moderne Tijd & Morgenstond</h2>
            <p className="mb-4">
              Toen de locatie in het centrum in 2006 plaats moest maken voor woningbouw, begon een zoektocht naar een nieuw thuis. Sinds 2011 zijn we gevestigd in de gymzaal aan de <strong>Pachtersdreef</strong> (Morgenstond).
            </p>
            <p>
              Ondanks uitdagingen zoals de coronaperiode, blijft Shi-Sei een bruisende vereniging waar traditie en moderne sportbeoefening hand in hand gaan.
            </p>
          </section>
        </div>

        {/* --- SIDEBAR (Timeline) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-judo-dark mb-6 flex items-center gap-2">
              <Calendar className="text-judo-red w-5 h-5" /> Tijdlijn
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-8">
                  {/* Dot on the line */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-judo-red rounded-full border-4 border-white shadow-sm"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-judo-red font-bold text-xs bg-red-50 inline-block w-fit px-2 py-0.5 rounded mb-1">
                      {milestone.year}
                    </span>
                    <h4 className="font-bold text-judo-dark text-base">{milestone.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Summary Widget */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-judo-dark mb-4 text-xs uppercase tracking-wider">Status Quo</h4>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark text-lg">180+</div>
                    <div className="text-[10px] text-gray-500 uppercase">Leden</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <MapPin className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark text-lg">Den Haag</div>
                    <div className="text-[10px] text-gray-500 uppercase">Zuid-West</div>
                  </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

