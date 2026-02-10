import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { Icon } from '../components/Icon';
import 'altcha';

export const ProeflesPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    experience: '',
    preferredDay: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const altchaRef = useRef<any>(null);

  useEffect(() => {
    const widget = altchaRef.current;
    if (!widget) return;

    const handleStateChange = (ev: CustomEvent) => {
      if (ev.detail.state === 'verified') {
        setAltchaPayload(ev.detail.payload);
      }
    };

    widget.addEventListener('statechange', handleStateChange);
    return () => widget.removeEventListener('statechange', handleStateChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify ALTCHA is completed
    if (!altchaPayload) {
      setError(t('trial.captchaRequired'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/trial-lesson', { ...formData, altcha: altchaPayload });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        experience: '',
        preferredDay: '',
        message: '',
      });
      setAltchaPayload(null);
      if (altchaRef.current) {
        altchaRef.current.reset();
      }
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit trial lesson request:', err);
      setError(t('trial.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.age.trim() !== '' &&
    formData.experience !== '';

  const benefits = [
    t('trial.benefit1'),
    t('trial.benefit2'),
    t('trial.benefit3'),
    t('trial.benefit4'),
    t('trial.benefit5'),
  ];

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="belt" size={42} className="text-judo-red" />
          {t('trial.title')}
        </h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('trial.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Section */}
        <div>
          <div className="bg-judo-red text-white rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t('trial.benefits')}</h2>
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
                <h3 className="font-bold text-lg">{t('trial.days')}</h3>
              </div>
              <p className="text-judo-gray mb-2">{t('trial.daysText')}</p>
              <Link to="/rooster" className="text-judo-red hover:underline text-sm">
                {t('trial.scheduleLink')} →
              </Link>
            </div>

            <div className="bg-light-gray rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-8 h-8 text-judo-red" />
                <h3 className="font-bold text-lg">{t('trial.bring')}</h3>
              </div>
              <ul className="text-judo-gray space-y-2 text-sm">
                <li>• {t('trial.bring1')}</li>
                <li>• {t('trial.bring2')}</li>
                <li>• {t('trial.bring3')}</li>
                <li>• {t('trial.bring4')}</li>
                <li>• {t('trial.bring5')}</li>
              </ul>
            </div>

            <div className="bg-light-gray rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-8 h-8 text-judo-red" />
                <h3 className="font-bold text-lg">{t('trial.forWho')}</h3>
              </div>
              <p className="text-judo-gray text-sm">
                {t('trial.forWhoText')}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-judo-dark">{t('trial.formTitle')}</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{t('trial.success')}</h3>
              <p>
                {t('trial.successText')}
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg mb-6">
              <p className="font-medium">{error}</p>
            </div>
          ) : null}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('contact.phone')} {t('common.required')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
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
                    min="4"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2">
                    {t('trial.experience')} {t('common.required')}
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="beginner">{t('trial.experienceOptions.beginner')}</option>
                    <option value="some">{t('trial.experienceOptions.some')}</option>
                    <option value="advanced">{t('trial.experienceOptions.advanced')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="preferredDay" className="block text-sm font-medium mb-2">
                  {t('trial.preferredDay')}
                </label>
                <select
                  id="preferredDay"
                  name="preferredDay"
                  value={formData.preferredDay}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                >
                  <option value="">{t('trial.preferredDayOptions.none')}</option>
                  <option value="maandag">{t('trial.preferredDayOptions.maandag')}</option>
                  <option value="woensdag">{t('trial.preferredDayOptions.woensdag')}</option>
                  <option value="donderdag">{t('trial.preferredDayOptions.donderdag')}</option>
                  <option value="zaterdag">{t('trial.preferredDayOptions.zaterdag')}</option>
                </select>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  placeholder={t('trial.messagePlaceholder')}
                />
              </div>

              {/* CAPTCHA Verification */}
              <div className="flex justify-center">
                <altcha-widget
                  ref={altchaRef}
                  challengeurl="/api/altcha-challenge"
                  hidelogo={true}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !altchaPayload || !isFormValid}
                className="w-full bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('trial.submitting') : t('trial.button')}
              </button>

              <p className="text-xs text-judo-gray text-center">
                {t('trial.disclaimer')}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

