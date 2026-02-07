import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Nieuwsbericht',
    plural: 'Nieuwsberichten',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedDate', 'status'],
    group: 'Nieuws & Media',
  },
  defaultSort: '-publishedDate',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-vriendelijke versie van de titel (bijv. "mijn-eerste-artikel")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Inhoud',
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Samenvatting (SEO)',
      localized: true,
      admin: {
        description: 'Korte samenvatting voor SEO en sociale media (max 160 tekens aanbevolen)',
      },
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      label: 'Foto Album',
      required: false,
      hasMany: false,
      admin: {
        description: 'Optioneel: Koppel een foto album aan dit artikel',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Afbeelding',
      required: false,
      hasMany: false,
      filterOptions: {
        or: [
          { category: { equals: 'news' } },
          { category: { equals: 'general' } },
        ],
      },
      admin: {
        description: 'Optioneel: Auto-select cover van gekoppeld album of upload een specifieke cover (nieuws/algemeen categorie)',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Publicatiedatum',
      defaultValue: () => new Date(),
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.coverImage && data.album) {
          try {
            const album = await req.payload.findByID({
              collection: 'albums',
              id: data.album,
            })

            if (album?.photos && Array.isArray(album.photos) && album.photos.length > 0) {
              const firstPhoto = album.photos[0]
              const coverID = typeof firstPhoto === 'object' && firstPhoto !== null
                ? firstPhoto.id 
                : firstPhoto

              data.coverImage = coverID
            }
          } catch (error) {
            console.error('Error auto-selecting cover from album:', error)
          }
        }
        return data
      },
    ],
  },
}