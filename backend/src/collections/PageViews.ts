import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: {
    singular: 'Paginaweergave',
    plural: 'Paginaweergaven',
  },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'sessionHash', 'device', 'createdAt'],
    description: 'Website bezoekersstatistieken',
    group: 'Admin',
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => !!req.user,
    create: () => true, // Public — tracking endpoint writes here
    update: () => false,
    delete: ({ req }) => !!req.user,
  },
  timestamps: true,
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      label: 'Pagina',
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
    },
    {
      name: 'sessionHash',
      type: 'text',
      required: true,
      index: true,
      label: 'Sessie',
      admin: {
        description: 'Anonieme sessie-hash (geen persoonlijke gegevens)',
      },
    },
    {
      name: 'device',
      type: 'select',
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
      label: 'Browser',
    },
    {
      name: 'country',
      type: 'text',
      label: 'Land',
    },
  ],
}
