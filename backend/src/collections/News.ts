import { CollectionConfig } from 'payload/types';

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date', defaultValue: () => new Date() },
  ],
};