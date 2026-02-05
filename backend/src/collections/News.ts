import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'status'],
    group: 'Social',
  },
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
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Inhoud',
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      label: 'Foto Album',
      required: false,
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
      admin: {
        description: 'Optioneel: Auto-select cover van gekoppeld album of upload een specifieke cover',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Publicatiedatum',
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
      defaultValue: 'draft',
      required: true,
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