import type { GlobalConfig } from 'payload'

export const PricingSettings: GlobalConfig = {
  slug: 'pricing-settings',
  label: 'Prijzen Instellingen',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'registrationFee',
      type: 'text',
      label: 'Eenmalige Inschrijfkosten',
      required: true,
      admin: {
        description: 'Eenmalige registratiekosten voor alle nieuwe leden (bijv. "€27,50,-")',
      },
    },
    {
      name: 'ooievaarspasText',
      type: 'text',
      label: 'Ooievaarspas Tekst',
      required: false,
      localized: true,
      admin: {
        description: 'Tekst over de Ooievaarspas korting',
      },
    },
  ],
}
