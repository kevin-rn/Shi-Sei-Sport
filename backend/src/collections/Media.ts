import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
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
      label: 'Alt Text (Description for Screen Readers)',
      required: true,
    },
    {
      name: 'eventLabel',
      type: 'text',
      label: 'Event or Collection Name',
      admin: {
        placeholder: 'Collection #1',
        position: 'sidebar',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      label: 'Date of Event',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};