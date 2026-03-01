import { Check, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import { Icon } from '../components/Icon';
import { FillButton } from '../components/FillButton';
import { PageWrapper } from '../components/PageWrapper';
import { PageHeader } from '../components/PageHeader';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useEffect, useState } from 'react';
import { getPrices, getPricingSettings, getMediaByFilename, getImageUrl, type Price, type PricingSettings } from '../lib/api';
import type { Media } from '../types/payload-types';

import ooievaarspasImg from '../assets/ooievaarspas.webp';

export const PricingPage = () => {
  const { t, language } = useLanguage();
  useSeo({ title: t('pricing.title') });
  const [prices, setPrices] = useState<Price[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerImage, setHeaderImage] = useState<Media | null>(null);
  const [bannerHovered, setBannerHovered] = useState(false);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pricesResponse, settingsResponse, media] = await Promise.all([
          getPrices(language, 'plan'),
          getPricingSettings(language),
          getMediaByFilename('lesson.webp'),
        ]);
        setPrices(pricesResponse.docs);
        setPricingSettings(settingsResponse);
        setHeaderImage(media);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError(t('pricing.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [language, t]);

  if (loading) return <LoadingState message={t('pricing.loading')} maxWidth="max-w-5xl" />;
  if (error) return <ErrorState title={t('pricing.error')} message={error} maxWidth="max-w-5xl" />;

  return (
    <PageWrapper maxWidth="max-w-5xl">
      <PageHeader icon={<Icon name="payments" size={42} className="text-judo-red" />} title={t('pricing.title')} />

      {/* One-time Registration Fee */}
      {pricingSettings?.registrationFee && (
        headerImage ? (
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg mb-12 group"
            onMouseEnter={() => setBannerHovered(true)}
            onMouseLeave={() => setBannerHovered(false)}
          >
            <img
              src={getImageUrl(headerImage, 'thumbnail')}
              alt={typeof headerImage.alt === 'string' ? headerImage.alt : ''}
              className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />
            {/* Diagonal red stripe: top-left → bottom-right on hover */}
            <div className="absolute w-[200%] h-[30px] bg-judo-red pointer-events-none" style={{
              opacity: 0.65,
              top: bannerHovered ? 'calc(100% - 40px)' : '40px',
              left: bannerHovered ? 'calc(100% - 40px)' : '40px',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              transition: 'top 500ms ease-in-out, left 500ms ease-in-out',
            }} />
            {/* Text overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end gap-6 p-6 sm:p-8 pointer-events-none">
              <div className="shrink-0 bg-white/10 p-4 rounded-2xl">
                <Icon name="payments" size={32} className="text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="font-bold text-lg text-white">
                    {t('pricing.registrationFee')}
                  </p>
                  <p className="text-xl md:text-2xl font-extrabold text-white">
                    {pricingSettings.registrationFee}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-white/80">
                  {t('pricing.registrationFeeDescription')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-light-gray border border-gray-200 rounded-2xl p-6 sm:p-8 mb-12 flex items-end gap-6 shadow-lg">
            <div className="shrink-0 bg-white/10 p-4 rounded-2xl">
              <Icon name="payments" size={32} className="text-gray-400" />
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-bold text-lg text-gray-500">
                  {t('pricing.registrationFee')}
                </p>
                <p className="text-xl md:text-2xl font-extrabold text-judo-dark">
                  {pricingSettings.registrationFee}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-judo-gray">
                {t('pricing.registrationFeeDescription')}
              </p>
            </div>
          </div>
        )
      )}

      {/* Pricing Cards */}
      {prices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-judo-gray">{t('pricing.noPrices')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {prices.map((plan) => (
            <div key={plan.id} className={`bg-white border-2 rounded-2xl shadow-lg p-8 relative flex flex-col ${plan.popular ? 'border-judo-red md:scale-105 z-10' : 'border-gray-100'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-judo-red text-white px-4 py-1 rounded-full text-sm font-bold">
                  {t('pricing.popular')}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2 text-judo-dark">{plan.planName}</h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl md:text-3xl font-extrabold text-judo-red">{plan.monthlyPrice}</span>
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
            <a href="https://ooievaarspas.nl/aanbiedingen/judo-bij-shi-sei-sport/" target="_blank" rel="noopener noreferrer" title="Visit ooievaarspas.nl">
              <img src={ooievaarspasImg} alt="Ooievaarspas" className="w-24 h-auto object-contain rounded-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] dark:drop-shadow-[0_0_6px_rgba(202,138,4,0.25)] hover:scale-105 transition-transform duration-300" loading="lazy"/>
            </a>
          </div>
          <div className="flex-1 z-10">
             <p className="text-judo-dark font-bold text-base md:text-lg leading-snug">
               {pricingSettings.ooievaarspasText}
             </p>
             <a href="https://ooievaarspas.nl/aanbiedingen/op-eigen-kracht/" target="_blank" rel="noopener noreferrer" className="news-link text-judo-red font-medium mt-3 inline-block">
               Meer informatie
             </a>
          </div>
           <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none z-0"></div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-judo-red text-white rounded-2xl p-6 md:p-12 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-bold mb-4">{t('pricing.cta.title')}</h2>
        <p className="text-base mb-6 opacity-90">{t('pricing.cta.desc')}</p>
        <FillButton to="/proefles" pressedClass="nav-btn--pressed" className="nav-btn bg-white text-judo-red px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-base">
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">{t('pricing.cta.button')}</span>
        </FillButton>
      </div>
    </PageWrapper>
  );
};
