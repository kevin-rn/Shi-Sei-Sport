import { Check, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';
import { FillButton } from '../components/FillButton';
import { useEffect, useState } from 'react';
import { getPrices, getPricingSettings, type Price, type PricingSettings } from '../lib/api';

// BELANGRIJK: Importeer de afbeelding hier zodat React/Vite hem kan bundelen
import ooievaarspasImg from '../assets/ooievaarspas.png';

export const TarievenPage = () => {
  const { t, language } = useLanguage();
  const [prices, setPrices] = useState<Price[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pricesResponse, settingsResponse] = await Promise.all([
          getPrices(language, 'plan'),
          getPricingSettings(language),
        ]);
        setPrices(pricesResponse.docs);
        setPricingSettings(settingsResponse);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError(t('pricing.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [language, t]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-judo-gray">{t('pricing.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">{t('pricing.error')}</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="payments" size={42} className="text-judo-red" />
          {t('pricing.title')}
          </h1>           
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
      </div>

      {/* One-time Registration Fee */}
      {pricingSettings?.registrationFee && (
        <div className="bg-light-gray border border-gray-200 rounded-2xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-judo-red/10 p-4 rounded-2xl">
              <Icon name="payments" size={32} className="text-judo-red" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-baseline gap-3 justify-center sm:justify-start mb-2">
                <p className="text-judo-red font-bold text-xl">
                  {t('pricing.registrationFee')}
                </p>
                <p className="text-judo-dark text-3xl font-extrabold">
                  {pricingSettings.registrationFee}
                </p>
              </div>
              <p className="text-judo-gray text-sm leading-relaxed">
                {t('pricing.registrationFeeDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      {prices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-judo-gray">{t('pricing.noPrices')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {prices.map((plan) => (
            <div key={plan.id} className={`bg-white border-2 rounded-2xl shadow-lg p-8 relative flex flex-col ${plan.popular ? 'border-judo-red transform scale-105 z-10' : 'border-gray-100'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-judo-red text-white px-4 py-1 rounded-full text-sm font-bold">
                  {t('pricing.popular')}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-judo-dark">{plan.planName}</h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold text-judo-red">{plan.monthlyPrice}</span>
                    <span className="text-judo-gray font-medium">{t('pricing.month')}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 font-semibold italic">
                    {plan.yearlyPrice} {t('pricing.year')}
                  </div>
                </div>

              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features?.map((featureItem: { feature: string; id?: string | null }, fIndex: number) => (
                  <li key={featureItem.id || fIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-judo-red flex-shrink-0 mt-0.5" />
                    <span className="text-judo-gray">{featureItem.feature}</span>
                  </li>
                ))}
              </ul>
              <FillButton to="/inschrijven" pressedClass="nav-btn--pressed" className={`nav-btn w-full justify-center py-3 px-6 rounded-lg font-bold ${plan.popular ? 'bg-judo-red text-white hover:bg-red-700' : 'bg-light-gray text-judo-dark hover:bg-gray-200'}`}>
                <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
                <span className="nav-btn-text">{t('pricing.startNow')}</span>
              </FillButton>
            </div>
          ))}
        </div>
      )}
      
      {/* Ooievaarspas Section */}
      {pricingSettings?.ooievaarspasText && (
        <div className="bg-gray-50 border-l-4 border-judo-red p-6 rounded-r-2xl mb-12 flex items-center gap-6 shadow-sm overflow-hidden relative">
          <div className="hidden sm:block shrink-0 relative z-10">
            <a href="https://ooievaarspas.nl/aanbiedingen/op-eigen-kracht/"  target="_blank" rel="noopener noreferrer" title="Ga naar ooievaarspas.nl">
              <img src={ooievaarspasImg} alt="Ooievaarspas" className="w-24 h-auto object-contain rounded-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform duration-300"/>
            </a>
          </div>
          <div className="flex-1 z-10">
             <p className="text-judo-dark font-bold text-lg md:text-xl leading-snug">
               {pricingSettings.ooievaarspasText}
             </p>
             <FillButton href="https://ooievaarspas.nl/aanbiedingen/op-eigen-kracht/" target="_blank" rel="noopener noreferrer" className="download-button-fill inline-flex items-center gap-1 mt-3 text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg overflow-hidden border border-amber-300">
               <span>Meer informatie</span>
             </FillButton>
          </div>
           <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none z-0"></div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-judo-red text-white rounded-2xl p-12 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">{t('pricing.cta.title')}</h2>
        <p className="text-lg mb-6 opacity-90">{t('pricing.cta.desc')}</p>
        <FillButton to="/proefles" pressedClass="nav-btn--pressed" className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg">
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('pricing.cta.button')}</span>
        </FillButton>
      </div>
    </div>
  );
};