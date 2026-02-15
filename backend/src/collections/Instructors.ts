import type { CollectionConfig } from 'payload';

export const Instructors: CollectionConfig = {
  slug: 'instructors',
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Auto-set category on profileImage
        const newImageId = typeof doc.profileImage === 'object' ? doc.profileImage?.id : doc.profileImage
        const prevImageId = typeof previousDoc?.profileImage === 'object' ? previousDoc?.profileImage?.id : previousDoc?.profileImage
        if (newImageId && newImageId !== prevImageId) {
          await req.payload.update({
            collection: 'media',
            id: newImageId,
            data: { category: 'instructor' },
            req,
          })
        }

        // Auto-set category on gallery photos
        const newGallery: string[] = (doc.gallery || []).map((item: any) =>
          typeof item === 'object' ? item?.id : item
        ).filter(Boolean)
        const prevGallery: string[] = (previousDoc?.gallery || []).map((item: any) =>
          typeof item === 'object' ? item?.id : item
        ).filter(Boolean)
        const addedGalleryIds = newGallery.filter(id => !prevGallery.includes(id))
        for (const id of addedGalleryIds) {
          await req.payload.update({
            collection: 'media',
            id,
            data: { category: 'instructor' },
            req,
          })
        }
      },
    ],
  },
  labels: {
    singular: 'Instructeur',
    plural: 'Instructeurs',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'profileImage', 'rank', 'role'],
    description: 'Instructeurs, hun rangen en biografieën',
    group: 'Training',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Volledige Naam',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          label: 'Rol',
          localized: true,
          admin: {
            width: '50%',
            placeholder: 'bijv. Hoofd Instructeur',
          },
        },
        {
          name: 'rank',
          type: 'text',
          required: true,
          label: 'Huidige Rang',
          localized: true,
          admin: {
            width: '50%',
            placeholder: 'bijv. 4e Dan',
          },
        },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      label: 'Profielfoto',
      admin: {
        description: 'Selecteer of upload een profielfoto (wordt automatisch als instructeur categorie ingesteld)',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biografie',
      localized: true,
    },
    {
      type: 'collapsible',
      label: 'Extra Informatie',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'gallery',
          type: 'upload',
          relationTo: 'media',
          required: false,
          hasMany: true,
          label: 'Foto Galerij',
          filterOptions: {
            category: { equals: 'instructor' },
          },
          admin: {
            description: 'Extra foto\'s van deze instructeur (optioneel)',
          },
        },
        {
          name: 'qualifications',
          type: 'array',
          label: 'Certificaten & Prestaties',
          fields: [
            {
              name: 'item',
              type: 'text',
            },
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Weergavevolgorde',
      defaultValue: 10,
      admin: {
        description: 'Lagere nummers verschijnen eerst op de website',
      },
    },
  ],
};