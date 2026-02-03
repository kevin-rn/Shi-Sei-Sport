import type { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { 
      name: 'content', 
      type: 'richText', 
      required: true,
      localized: true,
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date', defaultValue: () => new Date() },
  ],
};