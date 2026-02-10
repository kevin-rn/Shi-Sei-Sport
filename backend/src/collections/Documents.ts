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
    description: 'Reglementen en inschrijfformulieren',
    group: 'Vereniging',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const newId = typeof doc.attachment === 'object' ? doc.attachment?.id : doc.attachment
        const prevId = typeof previousDoc?.attachment === 'object' ? previousDoc?.attachment?.id : previousDoc?.attachment
        if (newId && newId !== prevId) {
          await req.payload.update({
            collection: 'media',
            id: newId,
            data: { category: 'document' },
            req,
          })
        }
      },
    ],
  },
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
        mimeType: { contains: 'pdf' },
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
