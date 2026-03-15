import { isValidPostalCode } from '../../lib/validation';
import type { EnrollmentSectionProps } from './types';

interface Props extends EnrollmentSectionProps {
  touched: Record<string, boolean>;
}

export const AddressSection = ({ formData, handleChange, handleBlur, t, touched }: Props) => {
  const postalCodeError = touched['address.postalCode'] && formData.address.postalCode.trim() && !isValidPostalCode(formData.address.postalCode) ? t('common.invalidPostalCode') : null;

  return (
    <div>
      <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.address')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.street')} *
          </label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            required
            placeholder={t('placeholder.street')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.houseNumber')} *
          </label>
          <input
            type="text"
            name="address.houseNumber"
            value={formData.address.houseNumber}
            onChange={handleChange}
            required
            placeholder={t('placeholder.houseNumber')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.postalCode')} *
          </label>
          <input
            type="text"
            name="address.postalCode"
            id="enrollment-postalcode"
            value={formData.address.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={postalCodeError ? true : undefined}
            aria-describedby={postalCodeError ? 'enrollment-postalcode-error' : undefined}
            placeholder="1234 AB"
            className={`w-full px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent ${postalCodeError ? 'border-red-400' : 'border-gray-300'}`}
          />
          {postalCodeError && <p id="enrollment-postalcode-error" role="alert" className="text-sm text-red-600 mt-1">{postalCodeError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-judo-dark mb-2">
            {t('enrollment.form.city')} *
          </label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
            placeholder={t('placeholder.city')}
            className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
