import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api, getContactInfo, type ContactInfo } from '../lib/api';
import { Icon } from '../components/Icon';
import { FillButton } from '../components/FillButton';
import { LoadingDots } from '../components/LoadingDots';
import { PageWrapper } from '../components/PageWrapper';
import { isValidEmail, isValidPhone } from '../lib/validation';
import 'altcha';

export const ContactPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loadingContactInfo, setLoadingContactInfo] = useState(true);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const altchaRef = useRef<any>(null);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const fieldError = (name: string, value: string, validator?: (v: string) => boolean, errorKey?: string) => {
    if (!touched[name] || !value.trim()) return null;
    if (validator && !validator(value)) return t(errorKey!);
    return null;
  };

  const emailError = fieldError('email', formData.email, isValidEmail, 'common.invalidEmail');
  const phoneError = formData.phone.trim() ? fieldError('phone', formData.phone, isValidPhone, 'common.invalidPhone') : null;

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    isValidEmail(formData.email) &&
    (!formData.phone.trim() || isValidPhone(formData.phone)) &&
    formData.subject !== '' &&
    formData.message.trim() !== '' &&
    altchaPayload !== null;

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

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/contact', { ...formData, altcha: altchaPayload });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      setError(t('contact.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoadingContactInfo(true);
        const info = await getContactInfo(language);
        setContactInfo(info);
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
      } finally {
        setLoadingContactInfo(false);
      }
    };

    fetchContactInfo();
  }, [language]);

  return (
    <PageWrapper maxWidth="max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-2xl font-extrabold text-judo-dark mb-4 flex items-center justify-center gap-4">
          <Icon name="email" size={42} className="text-judo-red" />
          {t('contact.title')}
          </h1>
        <p className="text-judo-gray text-base max-w-2xl mx-auto">
          {t('contact.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-judo-dark">{t('contact.info')}</h2>
          {loadingContactInfo ? (
            <div className="py-8">
              <LoadingDots />
            </div>
          ) : contactInfo ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-judo-red/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-judo-red" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('contact.address')}</h3>
                  <p className="text-judo-gray">
                    {contactInfo.postalAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-judo-red/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-judo-red" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('contact.phone')}</h3>
                  <div className="text-judo-gray space-y-1">
                    {contactInfo.phones.map((phone, index) => (
                      <p key={phone.id || index}>
                        <a
                          href={`tel:${phone.number.replace(/[^0-9+]/g, '')}`}
                          className="hover:text-judo-red transition-colors"
                        >
                          {phone.number}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-judo-red/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-judo-red" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('contact.email')}</h3>
                  <div className="text-judo-gray space-y-1">
                    {contactInfo.emails.map((emailItem, index) => (
                      <p key={emailItem.id || index}>
                        <a
                          href={`mailto:${emailItem.email}`}
                          className="hover:text-judo-red transition-colors"
                        >
                          {emailItem.email}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-judo-red/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-judo-red" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('contact.address')}</h3>
                  <p className="text-judo-gray">
                    Shi-Sei Sport<br />
                    Den Haag, Nederland
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-judo-red/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-judo-red" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('contact.email')}</h3>
                  <p className="text-judo-gray">
                    info@shi-sei.nl
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-light-gray rounded-lg">
            <h3 className="font-bold mb-2">{t('contact.hours')}</h3>
            <p className="text-sm text-judo-gray">
              {t('contact.hoursText')}<br />
              {t('contact.fullScheduleText')} <Link to="/schedule" className="text-judo-red font-medium hover:underline">{t('contact.scheduleLink')}</Link>.
            </p>
          </div>

          <div className="mt-4 p-6 bg-light-gray rounded-lg">
            <p className="text-sm text-judo-gray">
              <span className="font-bold">KVK:</span> 40407508
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-judo-dark">{t('contact.formTitle')}</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg">
              <p className="font-medium">{t('contact.success')}</p>
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
                  placeholder={t('placeholder.name')}
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
                  onBlur={handleBlur}
                  placeholder={t('placeholder.email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('placeholder.phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${phoneError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t('contact.subject')} {t('common.required')}
                </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                  >
                    <option value="">{t('contact.subjectSelect')}</option>
                    <option value="proefles">{t('contact.subjectOptions.proefles')}</option>
                    <option value="inschrijving">{t('contact.subjectOptions.inschrijving')}</option>
                    <option value="vraag">{t('contact.subjectOptions.vraag')}</option>
                    <option value="anders">{t('contact.subjectOptions.anders')}</option>
                  </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.message')} {t('common.required')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('placeholder.message')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>

              <altcha-widget
                ref={altchaRef}
                challengeurl="/api/altcha-challenge"
              />

              <FillButton
                as="button"
                type="submit"
                disabled={submitting || !isFormValid}
                pressedClass="nav-btn--pressed"
                className="nav-btn w-full bg-judo-red text-white font-bold py-4 px-8 rounded-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
                <span className="nav-btn-text">{submitting ? t('contact.sending') : t('contact.send')}</span>
              </FillButton>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

