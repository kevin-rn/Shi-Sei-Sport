import { Link } from 'react-router-dom';
import { Check, Calendar, Info, CreditCard, ShieldCheck } from 'lucide-react';

export const TarievenPage = () => {
  const pricingPlans = [
    {
      name: 'Jeugd (t/m 17 jaar)',
      price: '€27,50',
      period: 'per maand',
      yearlyPrice: '€330 per jaar',
      description: 'Voor jonge judoka’s die plezier en discipline willen combineren.',
      features: [
        'Gratis Judo pak bij inschrijving',
        '2x per week training',
        'Deelname aan examens',
        'Ooievaarspas korting mogelijk',
      ],
      popular: true,
    },
    {
      name: 'Senioren (18+)',
      price: '€27,50',
      period: 'per maand',
      yearlyPrice: '€330 per jaar',
      description: 'Voor volwassenen, van beginners tot gevorderden.',
      features: [
        'Onbeperkt trainen',
        'Conditie & Techniek',
        'Deelname aan examens',
        'Sociale activiteiten',
      ],
      popular: false,
    },
  ];

  const additionalInfo = [
    {
      icon: <CreditCard className="w-6 h-6 text-judo-red" />,
      title: 'Inschrijfgeld & Actie',
      description: 'Eenmalig inschrijfgeld van €27,50. Voor de jeugd (t/m 17 jaar) is dit inclusief een gratis judopak!',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-judo-red" />,
      title: 'Ooievaarspas',
      description: 'Houders van de Ooievaarspas krijgen tot 100% korting op de contributie.',
    },
    {
      icon: <Info className="w-6 h-6 text-judo-red" />,
      title: 'Betaling',
      description: 'Contributie bedraagt €330 op jaarbasis. Dit kan voldaan worden als €27,50 per maand.',
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          Tarieven
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Lidmaatschap & Tarieven</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Eerlijke en transparante prijzen. Sporten moet voor iedereen toegankelijk zijn.
        </p>
      </div>

      {/* Pricing Cards - Centered Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white border-2 rounded-2xl shadow-lg p-8 relative flex flex-col ${
              plan.popular
                ? 'border-judo-red transform md:-translate-y-2'
                : 'border-gray-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-judo-red text-white px-6 py-1 rounded-full text-sm font-bold shadow-sm">
                Meest Gekozen
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-judo-dark">{plan.name}</h3>
              <p className="text-sm text-judo-gray mb-4">{plan.description}</p>
              
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-judo-red">{plan.price}</span>
                    <span className="text-judo-gray font-medium">{plan.period}</span>
                </div>
                <span className="text-xs text-gray-400 mt-1">of {plan.yearlyPrice}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <div className="bg-red-50 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-judo-red flex-shrink-0" />
                  </div>
                  <span className="text-judo-dark font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/proefles"
              className={`block w-full text-center py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                plan.popular
                  ? 'bg-judo-red hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-judo-dark hover:bg-black text-white'
              }`}
            >
              Start met Proefles
            </Link>
          </div>
        ))}
      </div>

      {/* Ooievaarspas Banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-6">
         <div className="bg-white p-4 rounded-full shadow-sm">
            <ShieldCheck className="w-10 h-10 text-green-600" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-green-800 mb-2">Ooievaarspas Korting</h3>
            <p className="text-green-700">
               Heeft u een Ooievaarspas? Dan is tot <strong>100% korting</strong> op de contributie mogelijk! 
               Wij vinden dat financiën geen drempel mogen zijn om te sporten.
            </p>
         </div>
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {additionalInfo.map((info, index) => (
          <div key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6">
            <div className="mb-4 bg-light-gray w-12 h-12 rounded-lg flex items-center justify-center">
              {info.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 text-judo-dark">{info.title}</h3>
            <p className="text-sm text-judo-gray leading-relaxed">{info.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-judo-red text-white rounded-2xl p-12 text-center relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        
        <div className="relative z-10">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Eerst proberen?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            Kom sfeer proeven tijdens een gratis proefles. Je hebt alleen een lange joggingbroek en een t-shirt nodig.
          </p>
          <Link
            to="/proefles"
            className="inline-block bg-white text-judo-red hover:bg-gray-50 font-bold py-4 px-10 rounded-xl transition-colors duration-300 shadow-lg"
          >
            Boek Gratis Proefles
          </Link>
        </div>
      </div>
    </div>
  );
};