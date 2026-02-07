import type { CollectionConfig } from 'payload';

export const Instructors: CollectionConfig = {
  slug: 'instructors',
  labels: {
    singular: 'Instructeur',
    plural: 'Instructeurs',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rank', 'role'],
    group: 'Training',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Volledige Naam',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          label: 'Rol',
          localized: true,
          admin: {
            width: '50%',
            placeholder: 'bijv. Hoofd Instructeur',
          },
        },
        {
          name: 'rank',
          type: 'text',
          required: true,
          label: 'Huidige Rang',
          admin: {
            width: '50%',
            placeholder: 'bijv. 4e Dan',
          },
        },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      label: 'Profielfoto',
      filterOptions: {
        category: { equals: 'instructor' },
      },
      admin: {
        description: 'Selecteer een instructeur foto (alleen instructeur categorie)',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: true,
      label: 'Foto Galerij',
      filterOptions: {
        category: { equals: 'instructor' },
      },
      admin: {
        description: 'Extra foto\'s van deze instructeur (optioneel)',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biografie',
      localized: true,
    },
    {
      name: 'qualifications',
      type: 'array',
      label: 'Certificaten & Prestaties',
      localized: true,
      fields: [
        {
          name: 'item',
          type: 'text',
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Weergavevolgorde',
      defaultValue: 10,
      admin: {
        description: 'Lagere nummers verschijnen eerst op de website',
      },
    },
  ],
};