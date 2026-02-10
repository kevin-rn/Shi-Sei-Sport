import type { CollectionConfig } from 'payload'

export const VideoEmbeds: CollectionConfig = {
  slug: 'video-embeds',
  labels: {
    singular: 'Video',
    plural: 'Video\'s',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'embedUrl', 'createdAt'],
    description: 'YouTube en andere embed video\'s',
    group: 'Nieuws & Media',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      label: 'Video URL',
      admin: {
        description: 'YouTube URL (bijv. https://www.youtube.com/watch?v=...)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Optionele Beschrijving',
      required: false,
    },
  ],
}
