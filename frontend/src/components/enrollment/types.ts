export interface EnrollmentFormData {
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

export interface EnrollmentSectionProps {
  formData: EnrollmentFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  t: (key: string) => string;
}

export const INITIAL_FORM_DATA: EnrollmentFormData = {
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
};

export const formatPostalCode = (value: string): string => {
  const stripped = value.replace(/\s/g, '').toUpperCase().slice(0, 6);
  return stripped.length > 4 ? stripped.slice(0, 4) + ' ' + stripped.slice(4) : stripped;
};
