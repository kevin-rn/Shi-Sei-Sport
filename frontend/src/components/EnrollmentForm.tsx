import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/api';
import { Check, AlertCircle, Loader } from 'lucide-react';
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
    bankAccount: {
      accountHolder: '',
      iban: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(t('enrollment.form.captchaRequired'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/submit-enrollment', {
        ...formData,
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
          bankAccount: {
            accountHolder: '',
            iban: '',
          },
        });
        setAltchaPayload(null);
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
    formData.phone.trim() !== '' &&
    formData.dateOfBirth !== '' &&
    formData.address.street.trim() !== '' &&
    formData.address.houseNumber.trim() !== '' &&
    formData.address.postalCode.trim() !== '' &&
    formData.address.city.trim() !== '' &&
    formData.emergencyContact.name.trim() !== '' &&
    formData.emergencyContact.phone.trim() !== '' &&
    formData.emergencyContact.relation.trim() !== '' &&
    (formData.paymentMethod === 'ooievaarspas' || (
      (formData.bankAccount?.accountHolder ?? '').trim() !== '' &&
      (formData.bankAccount?.iban ?? '').trim() !== ''
    ));

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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
            />
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
                  required={formData.paymentMethod === 'regular'}
                  placeholder="NL00 BANK 0000 0000 00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-judo-red focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CAPTCHA Verification */}
      <div className="flex justify-center">
        <altcha-widget
          ref={altchaRef}
          challengeurl="/api/altcha-challenge"
          hidelogo={true}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !altchaPayload || !isFormValid}
          className="bg-judo-red text-white px-8 py-3 rounded-lg font-bold hover:bg-judo-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {t('enrollment.form.submitting')}
            </>
          ) : (
            t('enrollment.form.submit')
          )}
        </button>
      </div>

      <p className="text-sm text-gray-600 text-center">
        {t('enrollment.form.disclaimer')}
      </p>
    </form>
  );
};
