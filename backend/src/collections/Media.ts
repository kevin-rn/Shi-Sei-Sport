import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'createdAt'],
    group: 'Social',
  },
  upload: {
    staticDir: 'media',
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
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Optioneel Alt Tekst',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Optioneel Bijschrift',
    },
  ],
}