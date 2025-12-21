import { CollectionConfig } from 'payload/types';

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
    { name: 'groupName', type: 'text', required: true },
    { name: 'startTime', type: 'text', required: true },
    { name: 'endTime', type: 'text', required: true },
  ],
};