import type { CollectionConfig } from 'payload'

export const Prices: CollectionConfig = {
  slug: 'prices',
  labels: {
    singular: 'Prijs',
    plural: 'Prijzen',
  },
  admin: {
    useAsTitle: 'planName',
    defaultColumns: ['priceType', 'planName', 'monthlyPrice', 'registrationFee'],
    description: 'Prijsplannen en instellingen',
    group: 'Vereniging',
  },
  defaultSort: 'displayOrder',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'priceType',
      type: 'select',
      label: 'Type',
      options: [
        { label: 'Prijsplan', value: 'plan' },
        { label: 'Instellingen', value: 'settings' },
      ],
      required: true,
      defaultValue: 'plan',
      admin: {
        description: 'Selecteer of dit een prijsplan of prijsinstellingen is',
        position: 'sidebar',
      },
    },
    {
      name: 'planName',
      type: 'text',
      label: 'Plan Naam',
      localized: true,
      admin: {
        description: 'Naam van het prijsplan (bijv. "Jeugd (t/m 18 jaar)")',
        condition: (data) => data.priceType === 'plan',
      },
    },
    {
      name: 'monthlyPrice',
      type: 'text',
      label: 'Maandelijkse Prijs',
      admin: {
        description: 'Prijs per maand (bijv. "€27,50")',
        condition: (data) => data.priceType === 'plan',
      },
    },
    {
      name: 'yearlyPrice',
      type: 'text',
      label: 'Jaarlijkse Prijs',
      admin: {
        description: 'Totale prijs per jaar (bijv. "€330,-")',
        condition: (data) => data.priceType === 'plan',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Voordelen',
      minRows: 1,
      localized: true,
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Voordeel',
          required: true,
        },
      ],
      admin: {
        description: 'Lijst van voordelen/kenmerken van dit prijsplan',
        condition: (data) => data.priceType === 'plan',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      label: 'Populair',
      defaultValue: false,
      admin: {
        description: 'Markeer dit plan als "Populair" om het te highlighten',
        condition: (data) => data.priceType === 'plan',
      },
    },
    {
      name: 'registrationFee',
      type: 'text',
      label: 'Eenmalige Inschrijfkosten',
      admin: {
        description: 'Eenmalige registratiekosten voor alle nieuwe leden (bijv. "€27,50,-")',
        condition: (data) => data.priceType === 'settings',
      },
    },
    {
      name: 'ooievaarspasText',
      type: 'text',
      label: 'Ooievaarspas Tekst',
      localized: true,
      admin: {
        description: 'Tekst over de Ooievaarspas korting',
        condition: (data) => data.priceType === 'settings',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Weergave Volgorde',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Bepaal de volgorde waarin prijsplannen worden weergegeven (lager nummer = eerder)',
      },
    },
  ],
}
