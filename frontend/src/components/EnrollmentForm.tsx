import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { Check, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { FillButton } from './FillButton';
import { SignaturePad } from './SignaturePad';
import { isValidEmail, isValidPhone, isValidIban, isValidPostalCode } from '../lib/validation';
import 'altcha';

interface EnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  parentGuardian?: {
    name: string;
    email: string;
    phone: string;
  };
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
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
    parentGuardian: {
      name: '',
      email: '',
      phone: '',
    },
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
  const [error, setError] = useState<string | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const altchaRef = useRef<any>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const emailError = touched.email && formData.email.trim() && !isValidEmail(formData.email) ? t('common.invalidEmail') : null;
  const phoneError = touched.phone && formData.phone.trim() && !isValidPhone(formData.phone) ? t('common.invalidPhone') : null;
  const emergencyPhoneError = touched['emergencyContact.phone'] && formData.emergencyContact.phone.trim() && !isValidPhone(formData.emergencyContact.phone) ? t('common.invalidPhone') : null;
  const parentEmailError = touched['parentGuardian.email'] && formData.parentGuardian?.email?.trim() && !isValidEmail(formData.parentGuardian.email) ? t('common.invalidEmail') : null;
  const parentPhoneError = touched['parentGuardian.phone'] && formData.parentGuardian?.phone?.trim() && !isValidPhone(formData.parentGuardian.phone) ? t('common.invalidPhone') : null;
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

    widget.addEventListener('statechange', handleStateChange);
    return () => widget.removeEventListener('statechange', handleStateChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify ALTCHA is completed
    if (!altchaPayload) {
      setError(t('enrollment.form.captchaRequired'));
      return;
    }

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
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          address: {
            street: '',
            houseNumber: '',
            postalCode: '',
            city: '',
          },
          emergencyContact: {
            name: '',
            phone: '',
            relation: '',
          },
          parentGuardian: {
            name: '',
            email: '',
            phone: '',
          },
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
          altchaRef.current.reset();
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
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: { ...formData.emergencyContact, [field]: value },
      });
    } else if (name.startsWith('parentGuardian.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        parentGuardian: {
          name: formData.parentGuardian?.name || '',
          email: formData.parentGuardian?.email || '',
          phone: formData.parentGuardian?.phone || '',
          [field]: value
        },
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
    formData.name.trim() !== '' &&
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
    formData.emergencyContact.name.trim() !== '' &&
    formData.emergencyContact.phone.trim() !== '' &&
    isValidPhone(formData.emergencyContact.phone) &&
    formData.emergencyContact.relation.trim() !== '' &&
    (!formData.parentGuardian?.email?.trim() || isValidEmail(formData.parentGuardian.email)) &&
    (!formData.parentGuardian?.phone?.trim() || isValidPhone(formData.parentGuardian.phone)) &&
    (formData.paymentMethod === 'ooievaarspas'
      ? formData.ooievaarspasNumber.trim() !== ''
      : (formData.bankAccount?.accountHolder ?? '').trim() !== '' &&
        (formData.bankAccount?.iban ?? '').trim() !== '' &&
        isValidIban(formData.bankAccount?.iban ?? '')
    ) &&
    agreedToTerms &&
    signature !== null;

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
            <h3 className="text-xl font-bold text-green-900 mb-2">{t('enrollment.form.success')}</h3>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Personal Information */}
      <div>
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${phoneError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.address')}</h3>
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
              value={formData.address.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="1234 AB"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${postalCodeError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {postalCodeError && <p className="text-sm text-red-600 mt-1">{postalCodeError}</p>}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.emergencyContact')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.contactName')} *
            </label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.contactPhone')} *
            </label>
            <input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${emergencyPhoneError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {emergencyPhoneError && <p className="text-sm text-red-600 mt-1">{emergencyPhoneError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.contactRelation')} *
            </label>
            <input
              type="text"
              name="emergencyContact.relation"
              value={formData.emergencyContact.relation}
              onChange={handleChange}
              required
              placeholder={t('enrollment.form.relationPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Parent/Guardian (Optional) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-judo-dark mb-2">{t('enrollment.form.parentGuardian')}</h3>
        <p className="text-sm text-blue-700 mb-4">{t('enrollment.form.parentGuardianNote')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.parentName')}
            </label>
            <input
              type="text"
              name="parentGuardian.name"
              value={formData.parentGuardian?.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.parentEmail')}
            </label>
            <input
              type="email"
              name="parentGuardian.email"
              value={formData.parentGuardian?.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${parentEmailError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {parentEmailError && <p className="text-sm text-red-600 mt-1">{parentEmailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-judo-dark mb-2">
              {t('enrollment.form.parentPhone')}
            </label>
            <input
              type="tel"
              name="parentGuardian.phone"
              value={formData.parentGuardian?.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${parentPhoneError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {parentPhoneError && <p className="text-sm text-red-600 mt-1">{parentPhoneError}</p>}
          </div>
        </div>
      </div>

      {/* Judo Experience */}
      <div>
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.judoExperience')}</h3>
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
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.preferredDays')}</h3>
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
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-judo-dark mb-4">{t('enrollment.form.paymentMethod')}</h3>
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
                  value={formData.bankAccount?.iban || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={formData.paymentMethod === 'regular'}
                  placeholder="NL00 BANK 0000 0000 00"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent ${ibanError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {ibanError && <p className="text-sm text-red-600 mt-1">{ibanError}</p>}
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
            <Link to="/terms" className="text-judo-red underline hover:text-red-700" target="_blank">
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
        floating="auto"
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
    </form>
  );
};
