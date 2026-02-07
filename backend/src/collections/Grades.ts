import type { CollectionConfig } from 'payload'

export const KyuGrades: CollectionConfig = {
  slug: 'kyu-grades',
  labels: {
    singular: 'Bandgraad',
    plural: 'Bandgraden',
  },
  admin: {
    useAsTitle: 'beltLevel',
    defaultColumns: ['beltLevel', 'kyuRank', 'minimumAge', 'status'],
    description: 'Kyu bandgraden en exameneisen',
    group: 'Training',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
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
      required: true,
      unique: true,
      admin: {
        description: 'Selecteer het band niveau en bijbehorende Kyu rang',
      },
    },
    {
      name: 'kyuRank',
      type: 'number',
      label: 'Kyu Rang',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Numerieke Kyu rang (1-5)',
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
      required: true,
      hasMany: false,
      filterOptions: {
        and: [
          { mimeType: { contains: 'pdf' } },
          { category: { equals: 'document' } },
        ],
      },
      admin: {
        description: 'Upload het PDF document met de exameneisen voor dit band niveau (alleen document categorie)',
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
      },
    },
    {
      name: 'minimumAge',
      type: 'text',
      label: 'Minimale Leeftijd',
      required: false,
      admin: {
        description: 'Minimale leeftijdsvereiste voor dit band niveau (bijv. "6 - 7 jaar")',
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
