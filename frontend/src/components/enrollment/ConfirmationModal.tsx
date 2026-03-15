import { useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { EnrollmentFormData } from './types';

interface Props {
  formData: EnrollmentFormData;
  t: (key: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({ formData, t, onConfirm, onCancel }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true, onCancel);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-confirm-title"
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 id="enrollment-confirm-title" className="text-lg font-bold text-judo-dark">{t('enrollment.confirm.title')}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">{t('enrollment.confirm.description')}</p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <Row label={t('enrollment.form.firstName')} value={formData.firstName} />
            {formData.middleName && <Row label={t('enrollment.form.middleName')} value={formData.middleName} />}
            <Row label={t('enrollment.form.lastName')} value={formData.lastName} />
            {formData.guardianName && <Row label={t('enrollment.form.guardianName')} value={formData.guardianName} />}
            <Row label={t('enrollment.form.dateOfBirth')} value={formData.dateOfBirth} />
            <Row label={t('enrollment.form.email')} value={formData.email} />
            <Row label={t('enrollment.form.phone')} value={formData.phone} />
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
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('enrollment.confirm.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-judo-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            {t('enrollment.confirm.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-judo-dark">{value}</span>
  </div>
);
