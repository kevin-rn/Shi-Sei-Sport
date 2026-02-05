import type { CollectionConfig } from 'payload'

export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: 'Social',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Album Titel',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Optionele Beschrijving',
      required: false,
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto\'s',
      required: true,
      admin: {
        description: 'Upload een of meerdere foto\'s voor dit album',
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
    },
  ],
}