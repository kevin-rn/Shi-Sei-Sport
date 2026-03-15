import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: {
    singular: 'Paginastatistiek',
    plural: 'Paginastatistieken',
  },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['date', 'path', 'views', 'uniqueVisitors', 'device'],
    description: 'Dagelijkse bezoekersstatistieken per pagina',
    group: 'Admin',
  },
  defaultSort: '-date',
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  timestamps: false,
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      index: true,
      label: 'Datum',
      admin: { description: 'YYYY-MM-DD' },
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      label: 'Pagina',
    },
    {
      name: 'device',
      type: 'select',
      required: true,
      label: 'Apparaat',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobiel', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
    },
    {
      name: 'browser',
      type: 'text',
      required: true,
      label: 'Browser',
    },
    {
      name: 'views',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Weergaven',
    },
    {
      name: 'uniqueVisitors',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Unieke bezoekers',
    },
    {
      name: 'sessions',
      type: 'text',
      label: 'Sessie-hashes',
      admin: {
        description: 'Komma-gescheiden sessie-hashes voor deduplicatie',
        hidden: true,
      },
    },
  ],
}
