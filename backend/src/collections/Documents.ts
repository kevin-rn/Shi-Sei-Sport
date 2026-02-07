import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Document',
    plural: 'Documenten',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
    group: 'Vereniging',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categorie',
      options: [
        { label: 'Reglement', value: 'regulation' },
        { label: 'Inschrijving', value: 'enrollment' },
      ],
      defaultValue: 'regulation',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Omschrijving',
      localized: true,
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      label: 'PDF Bijlage',
      filterOptions: {
        and: [
          { mimeType: { contains: 'pdf' } },
          { category: { equals: 'document' } },
        ],
      },
      admin: {
        description: 'Upload een PDF document',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Weergavevolgorde',
      defaultValue: 10,
      admin: {
        description: 'Lagere nummers verschijnen eerst',
      },
    },
  ],
}
