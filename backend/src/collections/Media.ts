import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mediabestand',
    plural: 'Mediabestanden',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'category', 'createdAt'],
    description: 'Afbeeldingen, PDF\'s en andere bestanden',
    group: 'Nieuws & Media',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'center',
      },
      {
        name: 'full',
        width: 1920,
        height: 1440,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Optioneel Alt Tekst',
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Optioneel Bijschrift',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Algemeen', value: 'general' },
        { label: 'Instructeur Foto', value: 'instructor' },
        { label: 'Nieuws', value: 'news' },
        { label: 'Album', value: 'album' },
        { label: 'Locatie', value: 'location' },
        { label: 'Document', value: 'document' },
      ],
      defaultValue: 'general',
      admin: {
        description: 'Categoriseer media om filtering makkelijker te maken',
      },
    },
    {
      name: 'relatedInstructor',
      type: 'relationship',
      relationTo: 'instructors',
      label: 'Gerelateerde Instructeur',
      hasMany: false,
      admin: {
        description: 'Optioneel: Koppel deze media aan een specifieke instructeur',
        condition: (data) => data.category === 'instructor',
      },
    },
  ],
}