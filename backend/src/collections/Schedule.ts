import type { CollectionConfig } from 'payload';

export const Schedule: CollectionConfig = {
  slug: 'schedule',
  admin: { useAsTitle: 'day' },
  access: { read: () => true },
  fields: [
    {
      name: 'day',
      type: 'select',
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    { 
      name: 'groupName', 
      type: 'text', 
      required: true,
      localized: true, // Enable localization for group names
    },
    { name: 'startTime', type: 'text', required: true },
    { name: 'endTime', type: 'text', required: true },
    { 
      name: 'instructors', 
      type: 'relationship',
      relationTo: 'instructors',
      required: false,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: false,
    },
  ],
};