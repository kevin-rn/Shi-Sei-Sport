import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

export const Agenda: CollectionConfig = {
  slug: 'agenda',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'category', 'status'],
    group: 'Social',
  },
  defaultSort: 'startDate',
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
        hidden: true,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Evenement Titel',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      label: 'Beschrijving',
      localized: true,
      admin: {
        description: 'Optionele beschrijving van het evenement',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Vakantie', value: 'vacation' },
        { label: 'Feestdag', value: 'holiday' },
        { label: 'Examen', value: 'exam' },
        { label: 'Wedstrijd', value: 'competition' },
        { label: 'Anders', value: 'other' },
      ],
      required: true,
      defaultValue: 'other',
      index: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Startdatum',
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: false,
      label: 'Einddatum',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Voor meerdaagse evenementen',
        condition: (data) => data.category === 'vacation' || data.category === 'other',
      },
    },
    {
      name: 'allDay',
      type: 'checkbox',
      label: 'Hele Dag',
      defaultValue: true,
      admin: {
        description: 'Vink uit als het evenement specifieke tijden heeft',
      },
    },
    {
      name: 'startTime',
      type: 'text',
      label: 'Starttijd',
      required: false,
      admin: {
        description: 'Bijv. "14:00"',
        condition: (data) => !data.allDay,
      },
    },
    {
      name: 'endTime',
      type: 'text',
      label: 'Eindtijd',
      required: false,
      admin: {
        description: 'Bijv. "16:00"',
        condition: (data) => !data.allDay,
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
        description: 'Optioneel: Koppel een locatie aan dit evenement',
      },
    },
    {
      name: 'customLocation',
      type: 'text',
      label: 'Aangepaste Locatie',
      required: false,
      admin: {
        description: 'Gebruik dit als de locatie niet in de locatielijst staat',
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
        description: 'Optioneel: Upload een afbeelding voor dit evenement (nieuws/algemeen categorie)',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true,
    },
    {
      name: 'registrationRequired',
      type: 'checkbox',
      label: 'Registratie Vereist',
      defaultValue: false,
      admin: {
        description: 'Vink aan als aanmelding nodig is voor dit evenement',
      },
    },
    {
      name: 'registrationDeadline',
      type: 'date',
      label: 'Registratie Deadline',
      required: false,
      admin: {
        description: 'Optioneel: Deadline voor aanmelding',
        condition: (data) => data.registrationRequired,
      },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      label: 'Maximaal Aantal Deelnemers',
      required: false,
      admin: {
        description: 'Optioneel: Beperk het aantal deelnemers',
        condition: (data) => data.registrationRequired,
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Externe Link',
      required: false,
      admin: {
        description: 'Optioneel: Link naar externe pagina met meer informatie',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title
        if (data.title && !data.slug) {
          const dateSuffix = data.startDate ? `-${data.startDate}` : '';
          data.slug = formatSlug(`${data.title}${dateSuffix}`);
        } 

        // Ensure end date is not before start date
        if (data.endDate && data.startDate) {
          const start = new Date(data.startDate)
          const end = new Date(data.endDate)
          if (end < start) {
            throw new Error('Einddatum kan niet voor de startdatum liggen')
          }
        }
        return data
      },
    ],
  },
}
