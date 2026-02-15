import type { CollectionConfig } from 'payload'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: 'Fotoalbum',
    plural: 'Fotoalbums',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'photos', 'date', 'status'],
    description: 'Fotoalbums van evenementen en trainingen',
    group: 'Nieuws & Media',
  },
  defaultSort: '-date',
  access: {
    read: () => true,
  },
  timestamps: true,
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const hasPhotos = Array.isArray(data?.photos) && data.photos.length > 0;
        const hasVideos = Array.isArray(data?.videos) && data.videos.length > 0;
        if (!hasPhotos && !hasVideos) {
          throw new Error('Een album moet minimaal één foto of één video bevatten.');
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Album Titel',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Optionele Beschrijving',
      required: false,
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto\'s',
      required: false,
      filterOptions: {
        or: [
          { category: { equals: 'album' } },
          { category: { equals: 'general' } },
        ],
      },
      admin: {
        description: 'Upload foto\'s voor dit album (album/algemeen categorie). Verplicht als er geen video\'s zijn.',
      },
    },
    {
      name: 'videos',
      type: 'relationship',
      relationTo: 'video-embeds',
      hasMany: true,
      label: 'Video\'s',
      required: false,
      admin: {
        description: 'Koppel YouTube/embed video\'s aan dit album. Verplicht als er geen foto\'s zijn.',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      defaultValue: 'published',
      required: true,
      index: true,
    },
    {
      name: 'isHeroCarousel',
      type: 'checkbox',
      label: 'Hero Carousel',
      defaultValue: false,
      admin: {
        description: 'Markeer dit album als het hero carousel album. Dit album verschijnt niet op de mediapagina.',
      },
    },
  ],
}