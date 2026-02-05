import type { CollectionConfig } from 'payload';

export const Instructors: CollectionConfig = {
  slug: 'instructors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rank', 'role'],
    group: 'Information',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          label: 'Role',
          admin: {
            width: '50%',
            placeholder: 'e.g. Head Instructor',
          },
        },
        {
          name: 'rank',
          type: 'text',
          required: true,
          label: 'Current Rank',
          admin: {
            width: '50%',
            placeholder: 'e.g. 4th Dan',
          },
        },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Profile Photo',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biography',
      localized: true,
    },
    {
      name: 'qualifications',
      type: 'array',
      label: 'Certifications & Achievements',
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
      label: 'Display Order',
      defaultValue: 10,
      admin: {
        description: 'Lower numbers appear first on the website',
      },
    },
  ],
};