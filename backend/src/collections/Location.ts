import type { CollectionConfig } from 'payload';

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: 'Locatie',
    plural: 'Locaties',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'address'],
    description: 'Trainingslocaties en adressen',
    group: 'Training',
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const newImageId = typeof doc.locationImage === 'object' ? doc.locationImage?.id : doc.locationImage
        const prevImageId = typeof previousDoc?.locationImage === 'object' ? previousDoc?.locationImage?.id : previousDoc?.locationImage

        if (newImageId && newImageId !== prevImageId) {
          await req.payload.update({
            collection: 'media',
            id: newImageId,
            data: { category: 'location' },
            req,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Locatie Naam',
      admin: {
        description: 'Naam van de locatie',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Volledig Adres',
      required: true,
      admin: {
        description: 'Het volledige adres inclusief postcode en stad',
      },
    },
    {
      type: 'collapsible',
      label: 'Kaart & Coördinaten',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'Google Maps Link',
          required: false,
          admin: {
            description: 'Link naar Google Maps voor routebeschrijving (bijv. https://maps.google.com/?q=...)',
          },
        },
        {
          name: 'mapEmbedUrl',
          type: 'text',
          label: 'Google Maps Embed URL',
          required: false,
          admin: {
            description: 'Alleen de embed URL uit de iframe src (bijv. https://www.google.com/maps/embed?pb=...)',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Coördinaten',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              label: 'Latitude',
              required: false,
              admin: {
                description: 'Breedtegraad (bijv. 52.0345)',
              },
            },
            {
              name: 'longitude',
              type: 'number',
              label: 'Longitude',
              required: false,
              admin: {
                description: 'Lengtegraad (bijv. 4.2755)',
              },
            },
          ],
          admin: {
            description: 'Optioneel: GPS coördinaten voor nauwkeurige kaartweergave',
          },
        },
      ],
    },
    {
      name: 'locationImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Locatie Afbeelding',
      required: false,
      hasMany: false,
      admin: {
        description: 'Optionele afbeelding van de locatie',
      },
    },
  ],
};