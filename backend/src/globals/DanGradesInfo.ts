import type { GlobalConfig } from 'payload'

export const DanGradesInfo: GlobalConfig = {
  slug: 'dan-grades-info',
  label: 'Dan Graden Informatie',
  admin: {
    description: 'Informatie over zwarte band (Dan graden) examens',
    group: 'Training',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
      localized: true,
      defaultValue: 'Zwarte Band (Dan Graden)',
      admin: {
        description: 'Titel van de zwarte band sectie',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      required: true,
      localized: true,
      admin: {
        description: 'Uitgebreide uitleg over zwarte band examens',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Externe Link (JBN)',
      required: false,
      admin: {
        description: 'Link naar officiële JBN pagina',
      },
    },
    {
      name: 'externalUrlText',
      type: 'text',
      label: 'Link Tekst',
      required: false,
      localized: true,
      admin: {
        description: 'Tekst voor de externe link',
      },
    },
  ],
}
