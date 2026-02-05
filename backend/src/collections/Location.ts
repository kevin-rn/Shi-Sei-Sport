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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Venue Name',
      admin: {
        placeholder: 'e.g. Main Street Dojo',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Full Address',
    },
    {
      name: 'mapLink',
      type: 'text',
      label: 'Google Maps URL',
    },
    {
      name: 'locationImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Location Image',
      required: false,
    },
  ],
};