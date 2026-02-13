import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <svg className="w-10 h-10 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('terms.title')}
        </h1>
        <div className="w-24 h-1 bg-judo-red mx-auto rounded-full"></div>
        <p className="mt-6 text-judo-gray text-lg max-w-3xl mx-auto">
          {t('terms.lastUpdated')}: 9 februari 2026
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-light-gray border border-gray-200 rounded-2xl p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="shrink-0 bg-judo-red/10 p-4 rounded-2xl">
            <svg className="w-8 h-8 text-judo-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-judo-red mb-3">{t('terms.intro.title')}</h2>
            <p className="text-judo-gray leading-relaxed">
              {t('terms.intro.text')}
            </p>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.expect.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            {(['item1','item2','item3','item4','item5','item6','item7'] as const).map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-judo-gray">{t(`terms.expect.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enrollment */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.enrollment.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.enrollment.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">
                {t('terms.enrollment.item2pre')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.enrollment.regelementLink')}</Link>
                {', '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.enrollment.huishoudelijkLink')}</Link>
                {' '}{t('terms.enrollment.item2mid')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.enrollment.gedragscodeLink')}</Link>
                {'.'}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Signature */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.signature.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.signature.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.signature.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.signature.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.signature.item4')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.signature.item5')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Membership */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.membership.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.membership.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.membership.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">
                {t('terms.membership.item3pre')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.link.huisregels')}</Link>
                {' '}{t('terms.membership.item3mid')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.link.gedragscode')}</Link>
                {'.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.membership.item4')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.rates.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            {(['item1','item2','item3','item4'] as const).map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-judo-gray">{t(`terms.rates.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Payment */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.payment.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            {(['item1','item2','item3','item4','item5'] as const).map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-judo-gray">{t(`terms.payment.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Behavior */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.behavior.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.behavior.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">
                {t('terms.behavior.item2pre')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.link.huisregels')}</Link>
                {' '}{t('terms.behavior.item2mid')}{' '}
                <Link to="/regels" className="text-judo-red underline hover:text-red-700">{t('terms.link.gedragscode')}</Link>
                {'.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.behavior.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.behavior.item4')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Exams & Competitions */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.exams.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.exams.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.exams.item2')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Liability */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.liability.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray leading-relaxed mb-4">
            {t('terms.liability.text1')}
          </p>
          <p className="text-judo-gray leading-relaxed">
            {t('terms.liability.text2')}
          </p>
        </div>
      </section>

      {/* Photos & Media */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.photos.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.photos.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.photos.item2')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Changes */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.changes.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <p className="text-judo-gray leading-relaxed">
            {t('terms.changes.text')}
          </p>
        </div>
      </section>

      {/* Cancellation */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-judo-red/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-judo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-judo-dark">{t('terms.cancellation.title')}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.cancellation.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.cancellation.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-judo-red rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-judo-gray">{t('terms.cancellation.item3')}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-judo-red to-red-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold">{t('terms.contact.title')}</h2>
        </div>
        <p className="text-white/90 mb-4 leading-relaxed">
          {t('terms.contact.text')}
        </p>
        <div className="bg-white/10 rounded-lg p-4">
          <p className="font-semibold mb-1">{t('footer.club')}</p>
          <p className="text-white/80 text-sm">{t('terms.contact.email')}: info@shi-sei-sport.nl</p>
        </div>
      </section>
    </div>
  );
};
