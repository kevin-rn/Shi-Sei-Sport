import type { CollectionConfig } from 'payload';

export const TrainingSchedule: CollectionConfig = {
  slug: 'training-schedule',
  labels: {
    singular: 'Trainingstijd',
    plural: 'Trainingsrooster',
  },
  admin: {
    useAsTitle: 'groupName',
    defaultColumns: ['day', 'groupName', 'startTime', 'endTime'],
    group: 'Training',
  },
  defaultSort: 'day',
  access: { read: () => true },
  timestamps: true,
  fields: [
    {
      name: 'day',
      type: 'select',
      label: 'Dag',
      options: [
        { label: 'Maandag', value: 'monday' },
        { label: 'Dinsdag', value: 'tuesday' },
        { label: 'Woensdag', value: 'wednesday' },
        { label: 'Donderdag', value: 'thursday' },
        { label: 'Vrijdag', value: 'friday' },
        { label: 'Zaterdag', value: 'saturday' },
        { label: 'Zondag', value: 'sunday' },
      ],
      required: true,
    },
    {
      name: 'groupName',
      type: 'text',
      label: 'Groep Naam',
      required: true,
      localized: true,
      admin: {
        description: 'Naam van de trainingsgroep (bijv. "Recreanten", "Wedstrijdjudoka\'s")',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      label: 'Starttijd',
      required: true,
      admin: {
        description: 'Bijv. "19:00"',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      label: 'Eindtijd',
      required: true,
      admin: {
        description: 'Bijv. "20:30"',
      },
    },
    {
      name: 'instructors',
      type: 'relationship',
      relationTo: 'instructors',
      label: 'Instructeurs',
      required: false,
      hasMany: true,
      admin: {
        description: 'Optioneel: Koppel instructeurs aan deze training',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Locatie',
      required: false,
      hasMany: false,
      admin: {
        description: 'Optioneel: Koppel een locatie aan deze training',
      },
    },
  ],
};