import { IbanInput } from '../IbanInput';
import { isValidIban } from '../../lib/validation';
import type { EnrollmentFormData, EnrollmentSectionProps } from './types';

interface Props extends EnrollmentSectionProps {
  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setFormData: React.Dispatch<React.SetStateAction<EnrollmentFormData>>;
}

export const PaymentSection = ({ formData, handleChange, t, touched, setTouched, setFormData }: Props) => {
  const ibanError = touched['bankAccount.iban'] && formData.bankAccount?.iban?.trim() && !isValidIban(formData.bankAccount.iban) ? t('common.invalidIban') : null;

  return (
    <div className="payment-section bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.paymentMethod')}</h3>
      <p className="text-sm text-gray-600 mb-4">{t('enrollment.form.paymentMethodNote')}</p>

      {/* Ooievaarspas Checkbox */}
      <label className="flex items-start gap-3 p-4 -mx-4 sm:mx-0 sm:border-2 border-yellow-300 sm:rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors mb-4">
        <input
          type="checkbox"
          checked={formData.paymentMethod === 'ooievaarspas'}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              paymentMethod: e.target.checked ? 'ooievaarspas' : 'regular',
            }));
          }}
          className="w-5 h-5 text-judo-red focus:ring-judo-red mt-1"
        />
        <div>
          <span className="font-bold text-judo-dark block">{t('enrollment.form.ooievaarspas')}</span>
          <span className="text-sm text-gray-600">{t('enrollment.form.ooievaarspasNote')}</span>
        </div>
      </label>

      {/* Ooievaarspas Number */}
      {formData.paymentMethod === 'ooievaarspas' && (
        <div className="bg-white -mx-4 sm:mx-0 p-4 sm:p-6 sm:border border-yellow-300 sm:rounded-lg mb-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.ooievaarspasNumber')} *
            </label>
            <input
              type="text"
              name="ooievaarspasNumber"
              value={formData.ooievaarspasNumber}
              onChange={handleChange}
              required
              placeholder={t('enrollment.form.ooievaarspasNumberPlaceholder')}
              className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
          <p className="text-sm text-yellow-700 mt-3">{t('enrollment.form.ooievaarspasCheckLocation')}</p>
        </div>
      )}

      {/* Bank Account (Machtiging) */}
      {formData.paymentMethod === 'regular' && (
        <div className="bg-white -mx-4 sm:mx-0 p-4 sm:p-6 sm:border border-gray-200 sm:rounded-lg">
          <h4 className="font-bold text-judo-dark mb-3">{t('enrollment.form.machtiging')}</h4>
          <p className="text-sm text-gray-600 mb-4">{t('enrollment.form.machtigingNote')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-judo-dark mb-2">
                {t('enrollment.form.accountHolder')} *
              </label>
              <input
                type="text"
                name="bankAccount.accountHolder"
                value={formData.bankAccount?.accountHolder || ''}
                onChange={handleChange}
                required={formData.paymentMethod === 'regular'}
                placeholder={t('placeholder.accountHolder')}
                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-judo-dark mb-2">
                {t('enrollment.form.iban')} *
              </label>
              <IbanInput
                id="enrollment-iban"
                value={formData.bankAccount?.iban || ''}
                onChange={(val) => setFormData((prev) => ({
                  ...prev,
                  bankAccount: { accountHolder: prev.bankAccount?.accountHolder || '', iban: val },
                }))}
                onBlur={() => setTouched((prev: Record<string, boolean>) => ({ ...prev, 'bankAccount.iban': true }))}
                required={formData.paymentMethod === 'regular'}
                hasError={!!ibanError}
                aria-describedby={ibanError ? 'enrollment-iban-error' : undefined}
              />
              {ibanError && <p id="enrollment-iban-error" role="alert" className="text-sm text-red-600 mt-1">{ibanError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
