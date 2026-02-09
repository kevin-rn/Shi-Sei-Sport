import type { CollectionConfig } from 'payload'

export const Grades: CollectionConfig = {
  slug: 'grades',
  labels: {
    singular: 'Graad',
    plural: 'Graden',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['gradeType', 'beltLevel', 'kyuRank', 'status'],
    description: 'Kyu en Dan bandgraden informatie',
    group: 'Training',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'gradeType',
      type: 'select',
      label: 'Type Graad',
      options: [
        { label: 'Kyu Graad (Gekleurde Band)', value: 'kyu' },
        { label: 'Dan Graad (Zwarte Band Info)', value: 'dan' },
      ],
      required: true,
      defaultValue: 'kyu',
      admin: {
        description: 'Selecteer of dit een Kyu graad (examen) of Dan graad informatie is',
        position: 'sidebar',
      },
    },
    {
      name: 'beltLevel',
      type: 'select',
      label: 'Band Niveau',
      options: [
        { label: 'Gele Band (5e Kyu)', value: 'yellow-5kyu' },
        { label: 'Oranje Band (4e Kyu)', value: 'orange-4kyu' },
        { label: 'Groene Band (3e Kyu)', value: 'green-3kyu' },
        { label: 'Blauwe Band (2e Kyu)', value: 'blue-2kyu' },
        { label: 'Bruine Band (1e Kyu)', value: 'brown-1kyu' },
      ],
      admin: {
        description: 'Selecteer het band niveau en bijbehorende Kyu rang',
        condition: (data) => data.gradeType === 'kyu',
      },
    },
    {
      name: 'kyuRank',
      type: 'number',
      label: 'Kyu Rang',
      min: 1,
      max: 5,
      admin: {
        description: 'Numerieke Kyu rang (1-5)',
        condition: (data) => data.gradeType === 'kyu',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
      localized: true,
      admin: {
        description: 'Bijv. "Eisen Judo Examen - 5e Kyu"',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Beschrijving',
      localized: true,
      admin: {
        description: 'Gedetailleerde beschrijving van de exameneisen en vereiste technieken',
      },
    },
    {
      name: 'examDocument',
      type: 'upload',
      relationTo: 'media',
      label: 'Examen Document (PDF)',
      hasMany: false,
      filterOptions: {
        and: [
          { mimeType: { contains: 'pdf' } },
          { category: { equals: 'document' } },
        ],
      },
      admin: {
        description: 'Upload het PDF document met de exameneisen voor dit band niveau (alleen document categorie)',
        condition: (data) => data.gradeType === 'kyu',
      },
    },
    {
      name: 'supplementaryDocuments',
      type: 'array',
      label: 'Aanvullende Documenten',
      required: false,
      fields: [
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          label: 'Document',
          required: true,
          filterOptions: {
            category: { equals: 'document' },
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Beschrijving',
          required: false,
        },
      ],
      admin: {
        initCollapsed: true,
        description: 'Optioneel: Extra documenten zoals techniek overzichten',
        condition: (data) => data.gradeType === 'kyu',
      },
    },
    {
      name: 'minimumAge',
      type: 'text',
      label: 'Minimale Leeftijd',
      required: false,
      admin: {
        description: 'Minimale leeftijdsvereiste voor dit band niveau (bijv. "6 - 7 jaar")',
        condition: (data) => data.gradeType === 'kyu',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Externe Link (JBN)',
      required: false,
      admin: {
        description: 'Link naar officiële JBN pagina (voor Dan graad info)',
        condition: (data) => data.gradeType === 'dan',
      },
    },
    {
      name: 'externalUrlText',
      type: 'text',
      label: 'Link Tekst',
      required: false,
      localized: true,
      admin: {
        description: 'Tekst voor de externe link (voor Dan graad info)',
        condition: (data) => data.gradeType === 'dan',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Bepaal de volgorde waarin de graden worden weergegeven',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Gearchiveerd', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true,
    },
  ],
}
