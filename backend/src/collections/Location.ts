import type { CollectionConfig } from 'payload';

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    group: 'Information',
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Locatie Naam',
      localized: true,
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
    {
      name: 'locationImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Locatie Afbeelding',
      required: false,
      hasMany: false,
      filterOptions: {
        category: { equals: 'location' },
      },
      admin: {
        description: 'Optionele afbeelding van de locatie (alleen locatie categorie)',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Galerij',
      required: false,
      hasMany: true,
      filterOptions: {
        category: { equals: 'location' },
      },
      admin: {
        description: 'Meerdere foto\'s van de locatie (optioneel)',
      },
    },
  ],
};