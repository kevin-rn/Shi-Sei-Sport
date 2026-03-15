import { PhoneInput } from '../PhoneInput';
import { isValidEmail, isValidPhone } from '../../lib/validation';
import type { EnrollmentSectionProps } from './types';

interface Props extends EnrollmentSectionProps {
  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>;
}

export const PersonalInfoSection = ({ formData, handleChange, handleBlur, t, touched, setTouched, setFormData }: Props) => {
  const emailError = touched.email && formData.email.trim() && !isValidEmail(formData.email) ? t('common.invalidEmail') : null;
  const phoneNumber = formData.phone.replace(/^\+\d{1,4}-/, '').trim();
  const phoneError = touched.phone && phoneNumber && !isValidPhone(formData.phone) ? t('common.invalidPhone') : null;

  const isAdult = (() => {
    if (!formData.dateOfBirth) return false;
    const dob = new Date(formData.dateOfBirth);
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    return dob <= cutoff;
  })();

  return (
    <div>
      <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.personalInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.firstName')} *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder={t('placeholder.firstName')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.middleName')}
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder={t('placeholder.middleName')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.lastName')} *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder={t('placeholder.lastName')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.dateOfBirth')} *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 4); return d.toISOString().split('T')[0]; })()}
            required
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.guardianName')}
          </label>
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            disabled={isAdult}
            placeholder={t('enrollment.form.guardianNamePlaceholder')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.email')} *
          </label>
          <input
            type="email"
            name="email"
            id="enrollment-email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'enrollment-email-error' : undefined}
            placeholder={t('placeholder.email')}
            className={`w-full px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
          />
          {emailError && <p id="enrollment-email-error" role="alert" className="text-sm text-red-600 mt-1">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.phone')} *
          </label>
          <PhoneInput
            id="enrollment-phone"
            value={formData.phone}
            onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            required
            hasError={!!phoneError}
            aria-describedby={phoneError ? 'enrollment-phone-error' : undefined}
          />
          {phoneError && <p id="enrollment-phone-error" role="alert" className="text-sm text-red-600 mt-1">{phoneError}</p>}
        </div>
      </div>
    </div>
  );
};
