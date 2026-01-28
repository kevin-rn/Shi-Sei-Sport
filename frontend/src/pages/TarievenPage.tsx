import { Link } from 'react-router-dom';
import { Check, Calendar } from 'lucide-react';

export const TarievenPage = () => {
  const pricingPlans = [
    {
      name: 'Jeugd (t/m 12 jaar)',
      price: '€25',
      period: 'per maand',
      features: [
        '2x per week training',
        'Toegang tot alle jeugdlessen',
        'Examen mogelijkheden',
        'Club t-shirt',
      ],
      popular: false,
    },
    {
      name: 'Volwassenen',
      price: '€30',
      period: 'per maand',
      features: [
        'Onbeperkt trainen',
        'Toegang tot alle lessen',
        'Examen mogelijkheden',
        'Club t-shirt',
        'Vechtsport verzekering',
      ],
      popular: true,
    },
    {
      name: 'Gezinslidmaatschap',
      price: '€50',
      period: 'per maand',
      features: [
        '2 personen uit hetzelfde gezin',
        'Onbeperkt trainen',
        'Toegang tot alle lessen',
        'Examen mogelijkheden',
        'Club t-shirts',
      ],
      popular: false,
    },
  ];

  const additionalInfo = [
    {
      title: 'Inschrijfgeld',
      description: 'Eenmalig inschrijfgeld van €25 bij aanvang van het lidmaatschap.',
    },
    {
      title: 'Proefles',
      description: 'Eerste proefles is altijd gratis! Kom langs en ervaar onze trainingen.',
    },
    {
      title: 'Betalingswijze',
      description: 'Maandelijks via automatische incasso of contant betaling.',
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          💰 Tarieven
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">Lidmaatschap & Tarieven</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          Transparante prijzen voor iedereen. Kies het lidmaatschap dat bij u past.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white border-2 rounded-2xl shadow-lg p-8 relative ${
              plan.popular
                ? 'border-judo-red transform scale-105'
                : 'border-gray-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-judo-red text-white px-4 py-1 rounded-full text-sm font-bold">
                Populair
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2 text-judo-dark">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-extrabold text-judo-red">{plan.price}</span>
                <span className="text-judo-gray">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-judo-red flex-shrink-0 mt-0.5" />
                  <span className="text-judo-gray">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/proefles"
              className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-colors ${
                plan.popular
                  ? 'bg-judo-red hover:bg-red-700 text-white'
                  : 'bg-light-gray hover:bg-gray-200 text-judo-dark'
              }`}
            >
              Start Nu
            </Link>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {additionalInfo.map((info, index) => (
          <div key={index} className="bg-light-gray rounded-lg p-6">
            <h3 className="font-bold mb-2 text-judo-dark">{info.title}</h3>
            <p className="text-sm text-judo-gray">{info.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-judo-red text-white rounded-2xl p-12 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Gratis Proefles</h2>
        <p className="text-lg mb-6 opacity-90">
          Probeer eerst een gratis proefles voordat u zich inschrijft. Geen verplichtingen!
        </p>
        <Link
          to="/proefles"
          className="inline-block bg-white text-judo-red hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300"
        >
          Boek een Gratis Proefles
        </Link>
      </div>
    </div>
  );
};

