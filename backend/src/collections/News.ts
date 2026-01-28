import { CollectionConfig } from 'payload/types';
import { HTMLConverter, lexicalEditor } from '@payloadcms/richtext-lexical';

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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
        ],
      }),
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date', defaultValue: () => new Date() },
  ],
};