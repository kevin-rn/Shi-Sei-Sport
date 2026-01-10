import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-32 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-judo-red font-bold text-sm tracking-widest uppercase block mb-3">
          📧 {t('contact.subtitle')}
        </span>
        <h1 className="text-5xl font-extrabold text-judo-dark mb-4">{t('contact.title')}</h1>
        <p className="text-judo-gray text-lg max-w-2xl mx-auto">
          {t('contact.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-judo-dark">{t('contact.info')}</h2>
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
                <Phone className="w-6 h-6 text-judo-red" />
              </div>
              <div>
                <h3 className="font-bold mb-1">{t('contact.phone')}</h3>
                <p className="text-judo-gray">
                  Neem contact op via het formulier
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

          <div className="mt-8 p-6 bg-light-gray rounded-lg">
            <h3 className="font-bold mb-2">{t('contact.hours')}</h3>
            <p className="text-sm text-judo-gray">
              {t('contact.hoursText')}<br />
              Bekijk het volledige rooster op de <Link to="/rooster" className="text-judo-red hover:underline">{t('contact.scheduleLink')}</Link>.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-judo-dark">{t('contact.formTitle')}</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg">
              <p className="font-medium">{t('contact.success')}</p>
            </div>
          ) : (
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
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-judo-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

