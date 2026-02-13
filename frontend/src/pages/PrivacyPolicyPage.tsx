import { useLanguage } from '../contexts/LanguageContext';

export const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <svg className="w-10 h-10 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {t('privacy.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
        <p className="mt-6 text-judo-gray text-lg max-w-3xl mx-auto">
          {t('privacy.lastUpdated')}: 9 februari 2026
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12">
        <div className="flex items-start gap-4">
          <svg className="w-8 h-8 text-judo-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-judo-dark mb-3">{t('privacy.intro.title')}</h2>
            <p className="text-judo-gray leading-relaxed mb-3">
              {t('privacy.intro.text1')}
            </p>
            <p className="text-judo-gray leading-relaxed">
              {t('privacy.intro.text2')}
            </p>
          </div>
        </div>
      </div>

      {/* Data Collection */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('privacy.collection.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray mb-4">{t('privacy.collection.intro')}</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.collection.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.collection.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.collection.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.collection.item4')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.collection.item5')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Data Usage */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('privacy.usage.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray mb-4">{t('privacy.usage.intro')}</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.usage.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.usage.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.usage.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.usage.item4')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Data Protection */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('privacy.protection.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray leading-relaxed mb-4">
            {t('privacy.protection.text1')}
          </p>
          <p className="text-judo-gray leading-relaxed">
            {t('privacy.protection.text2')}
          </p>
        </div>
      </section>

      {/* Your Rights */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('privacy.rights.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray mb-4">{t('privacy.rights.intro')}</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.rights.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.rights.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.rights.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('privacy.rights.item4')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Cookies */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('privacy.cookies.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray leading-relaxed mb-4">
            {t('privacy.cookies.text1')}
          </p>
          <p className="text-judo-gray leading-relaxed">
            {t('privacy.cookies.text2')}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-judo-red to-red-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold">{t('privacy.contact.title')}</h2>
        </div>
        <p className="text-white/90 mb-4 leading-relaxed">
          {t('privacy.contact.text')}
        </p>
        <div className="bg-white/10 rounded-lg p-4">
          <p className="font-semibold mb-1">{t('footer.club')}</p>
          <p className="text-white/80 text-sm">{t('privacy.contact.email')}: info@shi-sei-sport.nl</p>
        </div>
      </section>
    </div>
  );
};
