import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { Check, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { FillButton } from './FillButton';
import { CustomSelect } from './CustomSelect';
import { SignaturePad } from './SignaturePad';
import { isValidEmail, isValidPhone, isValidIban, isValidPostalCode } from '../lib/validation';
import 'altcha';
import { useCountdown } from '../hooks/useCountdown';
import { PersonalInfoSection } from './enrollment/PersonalInfoSection';
import { AddressSection } from './enrollment/AddressSection';
import { PaymentSection } from './enrollment/PaymentSection';
import { ConfirmationModal } from './enrollment/ConfirmationModal';
import { INITIAL_FORM_DATA, formatPostalCode } from './enrollment/types';
import type { EnrollmentFormData } from './enrollment/types';

export const EnrollmentForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<EnrollmentFormData>({ ...INITIAL_FORM_DATA });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const altchaRef = useRef<HTMLElement>(null);
  const triggerElementRef = useRef<Element | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSignatureChange = useCallback((dataUrl: string | null) => {
    setSignature(dataUrl);
  }, []);

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

  useEffect(() => {
    if (!showConfirmation && triggerElementRef.current instanceof HTMLElement) {
      triggerElementRef.current.focus();
      triggerElementRef.current = null;
    }
  }, [showConfirmation]);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerElementRef.current = document.activeElement;
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/submit-enrollment', {
        ...formData,
        signature,
        altcha: altchaPayload,
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({ ...INITIAL_FORM_DATA });
        setAltchaPayload(null);
        setSignature(null);
        if (altchaRef.current) {
          (altchaRef.current as HTMLElement & { reset(): void }).reset();
        }
        setTimeout(() => setSubmitted(false), 20000);
      }
    } catch (err) {
      console.error('Failed to submit enrollment:', err);
      setError(t('enrollment.form.error'));
      setAltchaPayload(null);
      if (altchaRef.current) {
        (altchaRef.current as HTMLElement & { reset(): void }).reset();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'address.postalCode') value = formatPostalCode(value);

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else if (name.startsWith('bankAccount.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankAccount: {
          accountHolder: prev.bankAccount?.accountHolder || '',
          iban: prev.bankAccount?.iban || '',
          [field]: value
        },
      }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === 'dateOfBirth' && value) {
          const dob = new Date(value);
          const cutoff = new Date();
          cutoff.setFullYear(cutoff.getFullYear() - 18);
          if (dob <= cutoff) updated.guardianName = '';
        }
        return updated;
      });
    }
  };

  const handleDaysChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredTrainingDays: prev.preferredTrainingDays.includes(day)
        ? prev.preferredTrainingDays.filter((d) => d !== day)
        : [...prev.preferredTrainingDays, day],
    }));
  };

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    isValidEmail(formData.email) &&
    formData.phone.trim() !== '' &&
    isValidPhone(formData.phone) &&
    formData.dateOfBirth !== '' &&
    formData.address.street.trim() !== '' &&
    formData.address.houseNumber.trim() !== '' &&
    formData.address.postalCode.trim() !== '' &&
    isValidPostalCode(formData.address.postalCode) &&
    formData.address.city.trim() !== '' &&
    (formData.paymentMethod === 'ooievaarspas'
      ? formData.ooievaarspasNumber.trim() !== ''
      : (formData.bankAccount?.accountHolder ?? '').trim() !== '' &&
        (formData.bankAccount?.iban ?? '').trim() !== '' &&
        isValidIban(formData.bankAccount?.iban ?? '')
    ) &&
    agreedToTerms &&
    signature !== null &&
    altchaPayload !== null;

  const { remaining, progress } = useCountdown(submitted, 20);

  if (submitted) {
    return (
      <div ref={successRef} className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-900 mb-2">{t('enrollment.form.success')}</h3>
            <p className="text-green-700 mb-4">{t('enrollment.form.successText')}</p>
            <p className="text-sm text-green-600 mb-4">{t('enrollment.form.pdfGenerated')}</p>
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
    );
  }

  const sectionProps = { formData, handleChange, handleBlur, t };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Personal Information */}
      <PersonalInfoSection {...sectionProps} touched={touched} setTouched={setTouched} setFormData={setFormData} />

      {/* Address */}
      <AddressSection {...sectionProps} touched={touched} />

      {/* Judo Experience */}
      <div>
        <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.judoExperience')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.experience')} *
            </label>
            <CustomSelect
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-[#2e3145] dark:bg-[#252836] dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
              options={[
                { value: 'beginner', label: t('enrollment.form.experienceBeginner') },
                { value: 'some', label: t('enrollment.form.experienceSome') },
                { value: 'advanced', label: t('enrollment.form.experienceAdvanced') },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.judoGrade')}
            </label>
            <CustomSelect
              name="judoGrade"
              value={formData.judoGrade}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-[#2e3145] dark:bg-[#252836] dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
              options={[
                { value: '', label: t('enrollment.form.judoGrade.none') },
                { value: '6e kyu', label: t('enrollment.form.judoGrade.6kyu') },
                { value: '5e kyu', label: t('enrollment.form.judoGrade.5kyu') },
                { value: '4e kyu', label: t('enrollment.form.judoGrade.4kyu') },
                { value: '3e kyu', label: t('enrollment.form.judoGrade.3kyu') },
                { value: '2e kyu', label: t('enrollment.form.judoGrade.2kyu') },
                { value: '1e kyu', label: t('enrollment.form.judoGrade.1kyu') },
                { value: 'dan', label: t('enrollment.form.judoGrade.dan') },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Training Days */}
      <div>
        <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.preferredDays')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {['monday', 'wednesday', 'thursday', 'saturday'].map((day) => (
            <label
              key={day}
              className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-judo-red transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.preferredTrainingDays.includes(day)}
                onChange={() => handleDaysChange(day)}
                className="w-4 h-4 text-judo-red focus:ring-judo-red"
              />
              <span className="text-sm font-medium">{t(`enrollment.form.day.${day}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medical Info */}
      <div>
        <label className="block text-sm font-medium text-judo-dark mb-2">
          {t('enrollment.form.medicalInfo')}
        </label>
        <textarea
          name="medicalInfo"
          value={formData.medicalInfo}
          onChange={handleChange}
          rows={3}
          placeholder={t('enrollment.form.medicalInfoPlaceholder')}
          className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-judo-dark mb-2">
          {t('enrollment.form.remarks')}
        </label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={3}
          placeholder={t('enrollment.form.remarksPlaceholder')}
          className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent"
        />
      </div>

      {/* Payment Method */}
      <PaymentSection {...sectionProps} touched={touched} setTouched={setTouched} setFormData={setFormData} />

      {/* Signature */}
      <div>
        <SignaturePad
          onSignatureChange={handleSignatureChange}
          label={t('enrollment.form.signature')}
          clearLabel={t('enrollment.form.signatureClear')}
        />
      </div>

      {/* Agree to Terms */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 text-judo-red focus:ring-judo-red mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-judo-gray">
            {t('enrollment.form.agreeTermsPre')}{' '}
            <Link to="/voorwaarden" className="text-judo-red underline hover:text-red-700" target="_blank">
              {t('enrollment.form.agreeTermsLink')}
            </Link>
            {' '}{t('enrollment.form.agreeTermsMid')}{' '}
            <Link to="/privacy" className="text-judo-red underline hover:text-red-700" target="_blank">
              {t('enrollment.form.agreePrivacyLink')}
            </Link>
            {' '}{t('enrollment.form.agreeTermsPost')} *
          </span>
        </label>
      </div>

      {/* CAPTCHA Verification */}
      <altcha-widget
        ref={altchaRef}
        challengeurl="/api/altcha-challenge"
        strings={JSON.stringify({ label: t('common.captchaLabel') })}
        style={{ width: '100%' }}
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <FillButton
          as="button"
          type="submit"
          disabled={submitting || !isFormValid}
          pressedClass="nav-btn--pressed"
          className="nav-btn bg-judo-red text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="nav-btn-arrow"><ArrowRight className="w-5 h-5" /></span>
          <span className="nav-btn-text">
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin inline mr-2" />
                {t('enrollment.form.submitting')}
              </>
            ) : (
              t('enrollment.form.submit')
            )}
          </span>
        </FillButton>
      </div>

      <p className="text-sm text-gray-600 text-center">
        {t('enrollment.form.disclaimer')}
      </p>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          formData={formData}
          t={t}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </form>
  );
};
