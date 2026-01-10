import { Calendar, Users, MapPin, History } from 'lucide-react';

export const HistoriePage = () => {
  // Timeline data for the sidebar
  const milestones = [
    { year: '1950', title: 'Oprichting', desc: 'Start aan de Daal en Bergselaan.' },
    { year: '1960s', title: 'Gouden Jaren', desc: 'Moederclub van vele Haagse verenigingen.' },
    { year: '1972', title: 'Nieuwe Start', desc: 'Wim Lut blaast de club nieuw leven in.' },
    { year: '1981', title: 'Nieuwe Schoolstraat', desc: 'Verhuizing naar de iconische dojo.' },
    { year: '1990', title: 'Introductie Taekwondo', desc: 'Start van de succesvolle Taekwondo afdeling.' },
    { year: '2006', title: 'Gedwongen Verhuizing', desc: 'Vertrek uit de Schoolstraat.' },
    { year: '2011', title: 'Morgenstond', desc: 'Nieuwe locatie aan de Pachtersdreef.' },
    { year: '2020', title: 'Corona Crisis', desc: 'Tijdelijke sluiting en nieuwe uitdagingen.' },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* --- Page Header --- */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          Since 1950
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Onze Rijke Geschiedenis</h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- MAIN CONTENT (Narrative) --- */}
        <div className="lg:col-span-8 space-y-8 text-judo-gray leading-relaxed text-lg">
          
          {/* 1950s - The Beginning */}
          <section>
            <h2 className="text-3xl font-bold text-judo-dark mb-4 flex items-center gap-2">
              <History className="text-judo-red" /> De Oprichting (1950)
            </h2>
            <p className="mb-4">
              In november 1950 werd <strong>JUDOVERENIGING SHI-SEI</strong> opgericht. Een aantal enthousiaste judoka’s van Johan v.d. Bruggen uit de Zoutmanstraat wilden een eigen club. Een club waar men goedkoper en ook meer kon trainen. 
            </p>
            <p className="mb-4">
              Onder leiding van <strong>Jacques Brakel</strong>, Hans van Diggelen en nog enkele anderen, werd op 5 november 1950 de Judovereniging SHI-SEI geboren, aangemeld bij de Kamer van Koophandel en bij de Nederlandse Amateur Judo Associatie aangesloten.
            </p>
            <p>
              In de beginperiode werd geoefend in een gymzaal aan de Daal en Bergselaan, maar al vrij snel verhuisde men naar een permanente dojo in de <strong>Jan Hendrikstraat 9</strong>. Hier kon naar hartelust worden geoefend en zorgde de NAJA-bondstrainer Tokio Hirano, 6e dan, voor verbetering van de technieken. Er kon nu 7 dagen in de week worden getraind.
            </p>
          </section>

          {/* Key Figures */}
          <section className="bg-gray-50 p-6 rounded-xl border-l-4 border-judo-red">
            <h3 className="text-xl font-bold text-judo-dark mb-2">Technische & Organisatorische Groei</h3>
            <p className="mb-4">
              <strong>Wil Wagner</strong> was de eerste zwartebandhouder van de club. Op een judo-zomerschool in Zwitserland ontving hij uit handen van grootmeester Hanno Rhi de felbegeerde band. Kort daarna behaalde Jan v.d. Toorn als tweede ook de 1e dan graad.
            </p>
            <p>
              De organisatorische leiding onder aanvoering van voorzitter Jacques Brakel zorgde dat de club uitstekend draaide. Zwarte- en bruine banden werden ingeschreven voor Oefenmeester- en scheidsrechterscursussen.
            </p>
          </section>

          {/* 1960s & 1970s */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">De Jaren '60 en de Wederopstanding</h2>
            <p className="mb-4">
              In de jaren zestig was SHI-SEI een toonaangevende club in Den Haag en een geduchte tegenstander op de mat. Het werd de moederclub van vele Haagse judoclubs zoals Lu-Gia-Jen, Guan-Tsui, en De Doorkruiers. Honderden zwartebandhouders heeft de club inmiddels afgeleverd waaronder een aantal bijzonder goede wedstrijdjudoka's.
            </p>
            <p className="mb-4">
              In 1970 ging de vereniging bijna ter ziele door bestuurlijke problemen. Doch in 1972 werd onder de bezielende leiding van <strong>Wim Lut</strong> een nieuw bestuur gevormd en werd vooral door vestigingen in het Westland de club weer nieuw leven ingeblazen.
            </p>
          </section>

          {/* The Big Dojo 1981 */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">1981: De Nieuwe Schoolstraat</h2>
            <p className="mb-4">
              Eindelijk in 1981 kreeg men door toedoen van wethouders Piet Vink en Adrie Duivestein de beschikking over een ruime accommodatie in de oude school aan de Nieuwe Schoolstraat 22-B. 
            </p>
            <p>
              Hier hadden we de beschikking over een ruime oefenzaal, douches, kantoor en kantine. In deze ruimte hebben we nu niet alleen judo maar ook al sinds 1990 een <strong>taekwondo-afdeling</strong>.
            </p>
          </section>

          {/* Relocations & Recent History */}
          <section>
            <h2 className="text-2xl font-bold text-judo-dark mb-4">Verhuizingen & Recente Historie</h2>
            <p className="mb-4">
              Helaas kwam in 2006 aan onze mooie eigen locatie een einde toen de gemeente besloot het huurcontract op te zeggen voor woningbouw. Na tijdelijke locaties vonden we in 2011 in ontmoetingscentrum Morgenstond onze nieuwe plek, met een gymzaal aan de Pachtersdreef.
            </p>
            <p className="mb-4">
              Vanaf 2011 tot aan de coronacrisis in 2020 gaven wij 6 dagen per week les. Ons ledental groeide gestaag naar ongeveer 140 judoleden en 40 taekwondoleden. Vanaf 16 maart 2020 moesten wij noodgedwongen sluiten i.v.m. het coronavirus.
            </p>
          </section>

          {/* Taekwondo Special Section */}
          <section className="mt-12 pt-8 border-t border-gray-200">
             <div className="flex items-center gap-3 mb-4">
                <span className="bg-judo-red text-white px-3 py-1 rounded text-sm font-bold">SPECIAL</span>
                <h2 className="text-2xl font-bold text-judo-dark">De Taekwondo Historie</h2>
             </div>
             <p className="mb-4">
               70 jaar ervaring in Judo en zeker ook geen onbekende in Taekwondo. Door de inzet van Wim Lut is Taekwondo in de vroege jaren geïntroduceerd toen Park Jong Soo en Kwon Moo Gun in Nederland kwamen promoten.
             </p>
             <p className="mb-4">
               In 1990 zijn wij gestart met een zeer succesvolle taekwondo tak. Binnen korte tijd waren meer dan 100 taekwondoka’s lid. Taekwondo is een dynamische olympische sport die door veelzijdigheid iedereen erg veel te bieden heeft.
             </p>
          </section>
        </div>

        {/* --- SIDEBAR (Timeline) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-judo-dark mb-6 flex items-center gap-2">
              <Calendar className="text-judo-red w-5 h-5" /> Tijdlijn
            </h3>
            
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-8">
                  {/* Dot on the line */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-judo-red rounded-full border-4 border-white shadow-sm"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-judo-red font-bold text-sm bg-red-50 inline-block w-fit px-2 py-0.5 rounded mb-1">
                      {milestone.year}
                    </span>
                    <h4 className="font-bold text-judo-dark text-lg">{milestone.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Summary Widget */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-judo-dark mb-4 text-sm uppercase tracking-wider">Vandaag de dag</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-light-gray p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark">180+</div>
                    <div className="text-xs text-gray-500">Leden</div>
                 </div>
                 <div className="bg-light-gray p-3 rounded-lg text-center">
                    <MapPin className="w-5 h-5 mx-auto text-judo-red mb-1" />
                    <div className="font-bold text-judo-dark">Den Haag</div>
                    <div className="text-xs text-gray-500">Locatie</div>
                 </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};