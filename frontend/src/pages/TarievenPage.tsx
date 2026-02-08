import { Link } from 'react-router-dom';
import { Check, Calendar, Ticket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from '../components/Icon';

export const TarievenPage = () => {
  const { t } = useLanguage();

  const pricingPlans = [
    {
      name: t('pricing.plans.youth.name'),
      price: t('pricing.plans.youth.price'),
      period: t('pricing.month'),
      yearlyPrice: t('pricing.plans.youth.yearly'), // Nieuw
      yearlyPeriod: t('pricing.year'), // Nieuw
      features: [
        t('pricing.plans.youth.f1'),
        t('pricing.plans.youth.f2'),
        t('pricing.plans.youth.f3'),
        t('pricing.plans.youth.f4'),
      ],
      popular: true,
    },
    {
      name: t('pricing.plans.adults.name'),
      price: t('pricing.plans.adults.price'),
      period: t('pricing.month'),
      yearlyPrice: t('pricing.plans.adults.yearly'), // Nieuw
      yearlyPeriod: t('pricing.year'), // Nieuw
      features: [
        t('pricing.plans.adults.f1'),
        t('pricing.plans.adults.f2'),
        t('pricing.plans.adults.f3'),
      ],
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          {t('pricing.subtitle')}
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">{t('pricing.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">{t('pricing.description')}</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {pricingPlans.map((plan, index) => (
          <div key={index} className={`bg-white border-2 rounded-2xl shadow-lg p-8 relative flex flex-col ${plan.popular ? 'border-judo-red transform scale-105 z-10' : 'border-gray-100'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-judo-red text-white px-4 py-1 rounded-full text-sm font-bold">
                {t('pricing.popular')}
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2 text-judo-dark">{plan.name}</h3>
              
              <div className="flex flex-col items-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-extrabold text-judo-red">{plan.price}</span>
                  <span className="text-judo-gray font-medium">{plan.period}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1 font-semibold italic">
                  {plan.yearlyPrice} {plan.yearlyPeriod}
                </div>
              </div>

            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-judo-red flex-shrink-0 mt-0.5" />
                  <span className="text-judo-gray">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/proefles" className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-judo-red hover:bg-red-700 text-white' : 'bg-light-gray hover:bg-gray-200 text-judo-dark'}`}>
              {t('pricing.startNow')}
            </Link>
          </div>
        ))}
      </div>

      {/* Ooievaarspas Balk */}
      <div className="bg-gray-50 border-l-4 border-judo-red p-6 rounded-r-2xl mb-16 flex items-center gap-6 shadow-sm">
        <div className="bg-red-50 p-3 rounded-full hidden sm:block">
          <Ticket className="text-judo-red w-8 h-8" />
        </div>
        <p className="text-judo-dark font-bold text-lg md:text-xl leading-snug">
          {t('pricing.ooievaarspas')}
        </p>
      </div>

      {/* Call to Action */}
      <div className="bg-judo-red text-white rounded-2xl p-12 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">{t('pricing.cta.title')}</h2>
        <p className="text-lg mb-6 opacity-90">{t('pricing.cta.desc')}</p>
        <Link to="/proefles" className="inline-block bg-white text-judo-red hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300">
          {t('pricing.cta.button')}
        </Link>
      </div>
    </div>
  );
};