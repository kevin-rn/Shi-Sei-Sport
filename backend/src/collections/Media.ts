import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  access: { read: () => true }, // Public access
  fields: [{ name: 'alt', type: 'text' }],
};