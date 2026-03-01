import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { Check, AlertCircle, Loader, ArrowRight, X } from 'lucide-react';
import { FillButton } from './FillButton';
import { SignaturePad } from './SignaturePad';
import { isValidEmail, isValidPhone, isValidIban, isValidPostalCode } from '../lib/validation';
import 'altcha';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface EnrollmentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  guardianName: string;
  experience: string;
  judoGrade: string;
  medicalInfo: string;
  preferredTrainingDays: string[];
  remarks: string;
  paymentMethod: 'regular' | 'ooievaarspas';
  ooievaarspasNumber: string;
  bankAccount?: {
    accountHolder: string;
    iban: string;
  };
}

export const EnrollmentForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<EnrollmentFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
    },
    guardianName: '',
    experience: 'beginner',
    judoGrade: '',
    medicalInfo: '',
    preferredTrainingDays: [],
    remarks: '',
    paymentMethod: 'regular',
    ooievaarspasNumber: '',
    bankAccount: {
      accountHolder: '',
      iban: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const altchaRef = useRef<HTMLElement>(null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<Element | null>(null);
  useFocusTrap(confirmModalRef, showConfirmation, () => setShowConfirmation(false));
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const emailError = touched.email && formData.email.trim() && !isValidEmail(formData.email) ? t('common.invalidEmail') : null;
  const phoneError = touched.phone && formData.phone.trim() && !isValidPhone(formData.phone) ? t('common.invalidPhone') : null;
  const postalCodeError = touched['address.postalCode'] && formData.address.postalCode.trim() && !isValidPostalCode(formData.address.postalCode) ? t('common.invalidPostalCode') : null;
  const ibanError = touched['bankAccount.iban'] && formData.bankAccount?.iban?.trim() && !isValidIban(formData.bankAccount.iban) ? t('common.invalidIban') : null;

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
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          address: {
            street: '',
            houseNumber: '',
            postalCode: '',
            city: '',
          },
          guardianName: '',
          experience: 'beginner',
          judoGrade: '',
          medicalInfo: '',
          preferredTrainingDays: [],
          remarks: '',
          paymentMethod: 'regular',
          ooievaarspasNumber: '',
          bankAccount: {
            accountHolder: '',
            iban: '',
          },
        });
        setAltchaPayload(null);
        setSignature(null);
        if (altchaRef.current) {
          (altchaRef.current as HTMLElement & { reset(): void }).reset();
        }
        setTimeout(() => setSubmitted(false), 8000);
      }
    } catch (err) {
      console.error('Failed to submit enrollment:', err);
      setError(t('enrollment.form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else if (name.startsWith('bankAccount.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        bankAccount: {
          accountHolder: formData.bankAccount?.accountHolder || '',
          iban: formData.bankAccount?.iban || '',
          [field]: value
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const handleDaysChange = (day: string) => {
    const currentDays = formData.preferredTrainingDays;
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        preferredTrainingDays: currentDays.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        preferredTrainingDays: [...currentDays, day],
      });
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-2">{t('enrollment.form.success')}</h3>
            <p className="text-green-700 mb-4">{t('enrollment.form.successText')}</p>
            <p className="text-sm text-green-600">{t('enrollment.form.pdfGenerated')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Personal Information */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
          <div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              placeholder={t('enrollment.form.guardianNamePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {emailError && <p id="enrollment-email-error" role="alert" className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              id="enrollment-phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? 'enrollment-phone-error' : undefined}
              placeholder={t('placeholder.phone')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${phoneError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {phoneError && <p id="enrollment-phone-error" role="alert" className="text-sm text-red-600 mt-1">{phoneError}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${postalCodeError ? 'border-red-400' : 'border-gray-300'}`}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Judo Experience */}
      <div>
        <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.judoExperience')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.experience')} *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            >
              <option value="beginner">{t('enrollment.form.experienceBeginner')}</option>
              <option value="some">{t('enrollment.form.experienceSome')}</option>
              <option value="advanced">{t('enrollment.form.experienceAdvanced')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.judoGrade')}
            </label>
            <input
              type="text"
              name="judoGrade"
              value={formData.judoGrade}
              onChange={handleChange}
              placeholder={t('enrollment.form.judoGradePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Training Days */}
      <div>
        <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.preferredDays')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
        />
      </div>

      {/* Payment Method */}
      <div className="payment-section bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-judo-dark mb-4">{t('enrollment.form.paymentMethod')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('enrollment.form.paymentMethodNote')}</p>

        {/* Ooievaarspas Checkbox */}
        <label className="flex items-start gap-3 p-4 border-2 border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors mb-4">
          <input
            type="checkbox"
            checked={formData.paymentMethod === 'ooievaarspas'}
            onChange={(e) => {
              setFormData({
                ...formData,
                paymentMethod: e.target.checked ? 'ooievaarspas' : 'regular',
              });
            }}
            className="w-5 h-5 text-judo-red focus:ring-judo-red mt-1"
          />
          <div>
            <span className="font-bold text-judo-dark block">{t('enrollment.form.ooievaarspas')}</span>
            <span className="text-sm text-gray-600">{t('enrollment.form.ooievaarspasNote')}</span>
          </div>
        </label>

        {/* Ooievaarspas Number - Only show when ooievaarspas is selected */}
        {formData.paymentMethod === 'ooievaarspas' && (
          <div className="bg-white border border-yellow-300 rounded-lg p-6 mb-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
              />
            </div>
            <p className="text-sm text-yellow-700 mt-3">{t('enrollment.form.ooievaarspasCheckLocation')}</p>
          </div>
        )}

        {/* Bank Account (Machtiging) - Only show if NOT using Ooievaarspas */}
        {formData.paymentMethod === 'regular' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-judo-dark mb-2">
                  {t('enrollment.form.iban')} *
                </label>
                <input
                  type="text"
                  name="bankAccount.iban"
                  id="enrollment-iban"
                  value={formData.bankAccount?.iban || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={formData.paymentMethod === 'regular'}
                  aria-invalid={ibanError ? true : undefined}
                  aria-describedby={ibanError ? 'enrollment-iban-error' : undefined}
                  placeholder="NL00 BANK 0000 0000 00"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${ibanError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {ibanError && <p id="enrollment-iban-error" role="alert" className="text-sm text-red-600 mt-1">{ibanError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

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
      <div className="mt-4">
        <altcha-widget
          ref={altchaRef}
          challengeurl="/api/altcha-challenge"
          strings={JSON.stringify({ label: t('common.captchaLabel') })}
          style={{ width: '100%' }}
        />
      </div>

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmation(false)}>
          <div
            ref={confirmModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enrollment-confirm-title"
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 id="enrollment-confirm-title" className="text-lg font-bold text-judo-dark">{t('enrollment.confirm.title')}</h3>
              <button onClick={() => setShowConfirmation(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">{t('enrollment.confirm.description')}</p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.firstName')}</span>
                  <span className="font-medium text-judo-dark">{formData.firstName}</span>
                </div>
                {formData.middleName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('enrollment.form.middleName')}</span>
                    <span className="font-medium text-judo-dark">{formData.middleName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.lastName')}</span>
                  <span className="font-medium text-judo-dark">{formData.lastName}</span>
                </div>
                {formData.guardianName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('enrollment.form.guardianName')}</span>
                    <span className="font-medium text-judo-dark">{formData.guardianName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.dateOfBirth')}</span>
                  <span className="font-medium text-judo-dark">{formData.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.email')}</span>
                  <span className="font-medium text-judo-dark">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.phone')}</span>
                  <span className="font-medium text-judo-dark">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.address')}</span>
                  <span className="font-medium text-judo-dark text-right">
                    {formData.address.street} {formData.address.houseNumber}<br />
                    {formData.address.postalCode} {formData.address.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('enrollment.form.paymentMethod')}</span>
                  <span className="font-medium text-judo-dark">
                    {formData.paymentMethod === 'ooievaarspas' ? t('enrollment.form.ooievaarspas') : t('enrollment.form.machtiging')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('enrollment.confirm.cancel')}
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-3 bg-judo-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                {t('enrollment.confirm.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
