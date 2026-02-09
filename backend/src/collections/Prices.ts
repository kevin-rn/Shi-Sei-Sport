import type { CollectionConfig } from 'payload'

export const Prices: CollectionConfig = {
  slug: 'prices',
  labels: {
    singular: 'Prijsplan',
    plural: 'Prijsplannen',
  },
  admin: {
    useAsTitle: 'planName',
    defaultColumns: ['planName', 'monthlyPrice', 'yearlyPrice', 'popular'],
    description: 'Lidmaatschap prijzen en abonnementen',
    group: 'Vereniging',
  },
  defaultSort: 'displayOrder',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'planName',
      type: 'text',
      label: 'Plan Naam',
      required: true,
      localized: true,
      admin: {
        description: 'Naam van het prijsplan (bijv. "Jeugd (t/m 18 jaar)")',
      },
    },
    {
      name: 'monthlyPrice',
      type: 'text',
      label: 'Maandelijkse Prijs',
      required: true,
      admin: {
        description: 'Prijs per maand (bijv. "€27,50")',
      },
    },
    {
      name: 'yearlyPrice',
      type: 'text',
      label: 'Jaarlijkse Prijs',
      required: true,
      admin: {
        description: 'Totale prijs per jaar (bijv. "€330,-")',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Voordelen',
      required: true,
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
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      label: 'Populair',
      defaultValue: false,
      admin: {
        description: 'Markeer dit plan als "Populair" om het te highlighten',
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
