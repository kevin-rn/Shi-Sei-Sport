import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'Formulier Inzendingen',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'formType', 'submittedAt'],
    description: 'Inzendingen van inschrijfformulieren',
    group: 'Vereniging',
  },
  defaultSort: '-submittedAt',
  access: {
    read: () => true,
    create: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      label: 'Formulier Type',
      options: [
        { label: 'Inschrijving', value: 'enrollment' },
        { label: 'Proefles', value: 'trial-lesson' },
        { label: 'Contact', value: 'contact' },
      ],
      defaultValue: 'enrollment',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefoon',
    },
    {
      name: 'age',
      type: 'number',
      label: 'Leeftijd',
      admin: {
        condition: (data) => data.formType === 'trial-lesson',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Geboortedatum',
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adres',
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Straat',
        },
        {
          name: 'houseNumber',
          type: 'text',
          label: 'Huisnummer',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postcode',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Plaats',
        },
      ],
    },
    {
      name: 'emergencyContact',
      type: 'group',
      label: 'Noodcontact',
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Naam',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoon',
        },
        {
          name: 'relation',
          type: 'text',
          label: 'Relatie',
        },
      ],
    },
    {
      name: 'parentGuardian',
      type: 'group',
      label: 'Ouder/Voogd',
      admin: {
        description: 'Alleen voor personen onder de 18 jaar',
        condition: (data) => data.formType === 'enrollment',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Naam',
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-mail',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefoon',
        },
      ],
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Ervaring',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Enige ervaring', value: 'some' },
        { label: 'Gevorderd', value: 'advanced' },
      ],
      admin: {
        condition: (data) => data.formType === 'enrollment' || data.formType === 'trial-lesson',
      },
    },
    {
      name: 'preferredDay',
      type: 'text',
      label: 'Voorkeur Dag',
      admin: {
        condition: (data) => data.formType === 'trial-lesson',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Bericht',
      admin: {
        condition: (data) => data.formType === 'trial-lesson',
      },
    },
    {
      name: 'judoGrade',
      type: 'text',
      label: 'Judo Graad (indien van toepassing)',
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
    },
    {
      name: 'medicalInfo',
      type: 'textarea',
      label: 'Medische Informatie',
      admin: {
        description: 'Allergieën, medicatie, beperkingen, etc.',
        condition: (data) => data.formType === 'enrollment',
      },
    },
    {
      name: 'preferredTrainingDays',
      type: 'select',
      label: 'Voorkeur Trainingsdagen',
      hasMany: true,
      options: [
        { label: 'Maandag', value: 'monday' },
        { label: 'Woensdag', value: 'wednesday' },
        { label: 'Donderdag', value: 'thursday' },
        { label: 'Zaterdag', value: 'saturday' },
      ],
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
    },
    {
      name: 'remarks',
      type: 'textarea',
      label: 'Opmerkingen',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Betaalmethode',
      options: [
        { label: 'Regulier (Machtiging)', value: 'regular' },
        { label: 'Ooievaarspas', value: 'ooievaarspas' },
      ],
      defaultValue: 'regular',
      admin: {
        condition: (data) => data.formType === 'enrollment',
      },
    },
    {
      name: 'bankAccount',
      type: 'group',
      label: 'Bankgegevens (Machtiging)',
      admin: {
        description: 'Alleen vereist als niet Ooievaarspas',
        condition: (data) => data.formType === 'enrollment' && data.paymentMethod === 'regular',
      },
      fields: [
        {
          name: 'accountHolder',
          type: 'text',
          label: 'Rekeninghouder',
        },
        {
          name: 'iban',
          type: 'text',
          label: 'IBAN',
        },
      ],
    },
    {
      name: 'filledPDF',
      type: 'upload',
      relationTo: 'media',
      label: 'Ingevuld PDF Formulier',
      admin: {
        description: 'Automatisch gegenereerd PDF met ingevulde gegevens',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Ingediend op',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            return value || new Date().toISOString()
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'In behandeling', value: 'processing' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgewezen', value: 'rejected' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
