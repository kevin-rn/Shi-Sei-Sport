import type { GlobalConfig } from 'payload'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  label: 'Contact Informatie',
  admin: {
    description: 'Algemene contactgegevens van de vereniging',
    group: 'Vereniging',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'postalAddress',
      type: 'text',
      label: 'Postadres',
      required: true,
      admin: {
        description: 'Volledig postadres van de vereniging',
      },
    },
    {
      name: 'phones',
      type: 'array',
      label: 'Telefoonnummers',
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Telefoonnummer',
          required: true,
        },
      ],
      admin: {
        description: 'Telefoonnummers voor contact',
      },
    },
    {
      name: 'emails',
      type: 'array',
      label: 'Email Adressen',
      minRows: 1,
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email Adres',
          required: true,
        },
      ],
      admin: {
        description: 'Email adressen voor contact',
      },
    },
  ],
}
