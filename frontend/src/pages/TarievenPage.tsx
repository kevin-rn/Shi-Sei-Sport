import { Link } from 'react-router-dom';
import { Check, Calendar, Ticket, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from '../components/Icon';
import { LoadingDots } from '../components/LoadingDots';
import { useEffect, useState } from 'react';
import { getPrices, getPricingSettings, type Price, type PricingSettings } from '../lib/api';

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
          getPrices(language),
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
              <p className="text-judo-red font-bold text-xl mb-2">
                {t('pricing.registrationFee')}
              </p>
              <p className="text-judo-dark text-3xl font-extrabold mb-2">
                {pricingSettings.registrationFee}
              </p>
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
                {plan.features.map((featureItem, fIndex) => (
                  <li key={featureItem.id || fIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-judo-red flex-shrink-0 mt-0.5" />
                    <span className="text-judo-gray">{featureItem.feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/proefles" className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-judo-red hover:bg-red-700 text-white' : 'bg-light-gray hover:bg-gray-200 text-judo-dark'}`}>
                {t('pricing.startNow')}
              </Link>
            </div>
          ))}
        </div>
      )}

      
      {/* Ooievaarspas Balk */}
      {pricingSettings?.ooievaarspasText && (
        <div className="bg-gray-50 border-l-4 border-judo-red p-6 rounded-r-2xl mb-12 flex items-center gap-6 shadow-sm">
          <div className="bg-red-50 p-3 rounded-full hidden sm:block">
            <Ticket className="text-judo-red w-8 h-8" />
          </div>
          <p className="text-judo-dark font-bold text-lg md:text-xl leading-snug">
            {pricingSettings.ooievaarspasText}
          </p>
        </div>
      )}

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