import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Calendar, Clock, Users, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import { api } from '../lib/api';
import { Icon } from '../components/Icon';
import { FillButton } from '../components/FillButton';
import { CustomSelect } from '../components/CustomSelect';
import { isValidEmail, isValidPhone } from '../lib/validation';
import { PhoneInput } from '../components/PhoneInput';
import 'altcha';
import { PageWrapper } from '../components/PageWrapper';

export const TrialLessonPage = () => {
  const { t } = useLanguage();
  useSeo({ title: t('trial.title'), description: t('trial.description') });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '4',
    experience: 'beginner',
    preferredDay: 'maandag',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const altchaRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const emailError = touched.email && formData.email.trim() && !isValidEmail(formData.email) ? t('common.invalidEmail') : null;
  const phoneNumber = formData.phone.replace(/^\+\d{1,4}-/, '').trim();
  const phoneError = touched.phone && phoneNumber && !isValidPhone(formData.phone) ? t('common.invalidPhone') : null;
  const ageNum = parseInt(formData.age);
  const ageError = touched.age && (isNaN(ageNum) || ageNum < 4 || ageNum > 100) ? t('common.invalidAge') : null;

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitted]);

  useEffect(() => {
    const widget = altchaRef.current;
    if (!widget) return;

    const handleStateChange = (ev: CustomEvent) => {
      if (ev.detail.state === 'verified') {
        setAltchaPayload(ev.detail.payload);
      }
    };

    widget.addEventListener('statechange', handleStateChange as EventListener);
    return () => widget.removeEventListener('statechange', handleStateChange as EventListener);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/trial-lesson', { ...formData, altcha: altchaPayload });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '4',
        experience: 'beginner',
        preferredDay: 'maandag',
        message: '',
      });
      setAltchaPayload(null);
      if (altchaRef.current) {
        (altchaRef.current as HTMLElement & { reset(): void }).reset();
      }
      setTimeout(() => setSubmitted(false), 20000);
    } catch (err) {
      console.error('Failed to submit trial lesson request:', err);
      setError(t('trial.error'));
      setAltchaPayload(null);
      if (altchaRef.current) {
        (altchaRef.current as HTMLElement & { reset(): void }).reset();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isAdult = parseInt(formData.age) >= 18;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === 'age') {
      const adult = parseInt(value) >= 18;
      const adultOnly = ['maandag', 'donderdag'];
      if (adult && updated.preferredDay && !adultOnly.includes(updated.preferredDay)) {
        updated.preferredDay = 'maandag';
      }
    }
    setFormData(updated);
  };

  const { remaining, progress } = useCountdown(submitted, 20);

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    isValidEmail(formData.email) &&
    formData.phone.trim() !== '' &&
    isValidPhone(formData.phone) &&
    formData.age.trim() !== '' &&
    !isNaN(ageNum) && ageNum >= 4 && ageNum <= 100 &&
    formData.experience !== '' &&
    altchaPayload !== null;

  const benefits = [
    t('trial.benefit1'),
    t('trial.benefit2'),
    t('trial.benefit3'),
    t('trial.benefit4'),
    t('trial.benefit5'),
  ];

  return (
    <PageWrapper maxWidth="max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-xl md:text-2xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="belt" size={42} className="text-judo-red" />
          {t('trial.title')}
        </h1>
        <p className="text-judo-gray text-base max-w-2xl mx-auto">
          {t('trial.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Section */}
        <div>
          <div className="bg-judo-red text-white rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">{t('trial.benefits')}</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="bg-light-gray rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="w-8 h-8 text-judo-red" />
                <h3 className="font-bold text-base">{t('trial.days')}</h3>
              </div>
              <p className="text-judo-gray mb-2">{t('trial.daysText')}</p>
              <Link to="/rooster" className="news-link text-judo-red font-medium text-sm">
                {t('trial.scheduleLink')}
              </Link>
            </div>

            <div className="bg-light-gray rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-8 h-8 text-judo-red" />
                <h3 className="font-bold text-base">{t('trial.bring')}</h3>
              </div>
              <ul className="text-judo-gray space-y-2 text-sm">
                <li>• {t('trial.bring1')}</li>
                <li>• {t('trial.bring2')}</li>
                <li>• {t('trial.bring3')}</li>
                <li>• {t('trial.bring4')}</li>
              </ul>
            </div>

            <div className="bg-light-gray rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-8 h-8 text-judo-red" />
                <h3 className="font-bold text-base">{t('trial.forWho')}</h3>
              </div>
              <p className="text-judo-gray text-sm">
                {t('trial.forWhoText')}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-judo-dark">{t('trial.formTitle')}</h2>
          {submitted ? (
            <div ref={successRef} className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 mb-2">{t('trial.success')}</h3>
                  <p className="text-green-700 mb-4">{t('trial.successText')}</p>
                  <div className="h-1 bg-green-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-500 mt-1">{remaining}s</p>
                </div>
              </div>
            </div>
          ) : null}
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('contact.name')} {t('common.required')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('placeholder.name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('contact.email')} {t('common.required')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('placeholder.email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('contact.phone')} {t('common.required')}
                </label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  required
                  hasError={!!phoneError}
                  aria-describedby={phoneError ? 'trial-phone-error' : undefined}
                  inputClassName="py-3"
                />
                {phoneError && <p id="trial-phone-error" className="text-sm text-red-600 mt-1">{phoneError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium mb-2">
                    {t('trial.age')} {t('common.required')}
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    min={4}
                    max={100}
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={ageError ? true : undefined}
                    aria-describedby={ageError ? 'trial-age-error' : undefined}
                    placeholder={t('placeholder.age')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent ${ageError ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {ageError && <p id="trial-age-error" role="alert" className="text-sm text-red-600 mt-1">{ageError}</p>}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2">
                    {t('trial.experience')} {t('common.required')}
                  </label>
                  <CustomSelect
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 dark:border-[#2e3145] dark:bg-[#252836] dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
                    options={[
                      { value: '', label: t('common.select') },
                      { value: 'beginner', label: t('trial.experienceOptions.beginner') },
                      { value: 'some', label: t('trial.experienceOptions.some') },
                      { value: 'advanced', label: t('trial.experienceOptions.advanced') },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferredDay" className="block text-sm font-medium mb-2">
                  {t('trial.preferredDay')}
                </label>
                <CustomSelect
                  id="preferredDay"
                  name="preferredDay"
                  value={formData.preferredDay}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 dark:border-[#2e3145] dark:bg-[#252836] dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  options={[
                    { value: '', label: t('trial.preferredDayOptions.none') },
                    { value: 'maandag', label: t('trial.preferredDayOptions.maandag') },
                    ...(!isAdult ? [{ value: 'woensdag', label: t('trial.preferredDayOptions.woensdag') }] : []),
                    { value: 'donderdag', label: t('trial.preferredDayOptions.donderdag') },
                    ...(!isAdult ? [{ value: 'zaterdag', label: t('trial.preferredDayOptions.zaterdag') }] : []),
                  ]}
                />
                {isAdult && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">{t('trial.preferredDayAdultHint')}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('trial.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  placeholder={t('trial.messagePlaceholder')}
                />
              </div>

              {/* CAPTCHA Verification */}
              <div className="mt-4">
                <altcha-widget
                  ref={altchaRef}
                  challengeurl="/api/altcha-challenge"
                  strings={JSON.stringify({ label: t('common.captchaLabel') })}
                  style={{ width: '100%' }}
                />
              </div>

              <FillButton
                as="button"
                type="submit"
                disabled={submitting || !isFormValid}
                pressedClass="nav-btn--pressed"
                className="nav-btn w-full bg-judo-red text-white font-bold py-4 px-8 rounded-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
                <span className="nav-btn-text">{submitting ? t('trial.submitting') : t('trial.button')}</span>
              </FillButton>

              <p className="text-xs text-judo-gray text-center">
                {t('trial.disclaimer')}
              </p>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
