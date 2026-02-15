import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mediabestand',
    plural: 'Mediabestanden',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'createdAt'],
    description: 'Afbeeldingen, PDF\'s en andere bestanden',
    group: 'Nieuws & Media',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  upload: {
    // Cap the stored original to 2K (2048px on the longest side) and convert to WebP.
    resizeOptions: {
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        // Tiny blur placeholder (~20px wide). Used by LazyImage as the blurred preview.
        name: 'placeholder',
        width: 20,
        height: undefined,
        withoutEnlargement: false,
        formatOptions: {
          format: 'webp',
          options: { quality: 30 },
        },
      },
      {
        // Scaled-down preview for admin panel and LazyImage full-res display.
        name: 'thumbnail',
        width: 720,
        height: 720,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Tekst',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Algemeen', value: 'general' },
        { label: 'Instructeur Foto', value: 'instructor' },
        { label: 'Nieuws', value: 'news' },
        { label: 'Album', value: 'album' },
        { label: 'Locatie', value: 'location' },
        { label: 'Document', value: 'document' },
        { label: 'Video (embed)', value: 'embed' },
      ],
      defaultValue: 'general',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.alt && data.filename) {
          data.alt = data.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        }
        return data;
      },
    ],
  },
}