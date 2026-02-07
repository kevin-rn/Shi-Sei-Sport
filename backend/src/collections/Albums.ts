import type { CollectionConfig } from 'payload'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: 'Fotoalbum',
    plural: 'Fotoalbums',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: 'Nieuws & Media',
  },
  defaultSort: '-date',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Album Titel',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Optionele Beschrijving',
      required: false,
      localized: true,
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto\'s',
      required: true,
      filterOptions: {
        or: [
          { category: { equals: 'album' } },
          { category: { equals: 'general' } },
        ],
      },
      admin: {
        description: 'Upload een of meerdere foto\'s voor dit album (album/algemeen categorie)',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      defaultValue: 'published',
      required: true,
      index: true,
    },
  ],
}