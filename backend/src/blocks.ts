import type { Block } from 'payload'

export const videoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: { nl: 'Video', en: 'Video' },
    plural: { nl: 'Video\'s', en: 'Videos' },
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'Video URL',
      required: true,
    },
    {
      name: 'size',
      type: 'select',
      label: { nl: 'Formaat', en: 'Size' },
      defaultValue: 'full',
      options: [
        { label: { nl: 'Klein', en: 'Small' }, value: 'small' },
        { label: { nl: 'Normaal', en: 'Medium' }, value: 'medium' },
        { label: { nl: 'Groot', en: 'Large' }, value: 'large' },
        { label: { nl: 'Volledige breedte', en: 'Full width' }, value: 'full' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: { nl: 'Bijschrift', en: 'Caption' },
      required: false,
    },
  ],
}

export const imageEmbedBlock: Block = {
  slug: 'imageEmbed',
  labels: {
    singular: { nl: 'Afbeelding', en: 'Image' },
    plural: { nl: 'Afbeeldingen', en: 'Images' },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { nl: 'Afbeelding', en: 'Image' },
    },
    {
      name: 'size',
      type: 'select',
      label: { nl: 'Breedte', en: 'Width' },
      defaultValue: 'half',
      admin: {
        description: { nl: 'Afbeeldingen die niet "Volledig" zijn kunnen naast elkaar worden geplaatst.', en: 'Images that are not "Full" can be placed side by side.' },
      },
      options: [
        { label: { nl: '1/4 breedte', en: '1/4 width' }, value: 'quarter' },
        { label: { nl: '1/3 breedte', en: '1/3 width' }, value: 'third' },
        { label: { nl: '1/2 breedte', en: '1/2 width' }, value: 'half' },
        { label: { nl: '2/3 breedte', en: '2/3 width' }, value: 'two-thirds' },
        { label: { nl: '3/4 breedte', en: '3/4 width' }, value: 'three-quarters' },
        { label: { nl: 'Volledig', en: 'Full' }, value: 'full' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: { nl: 'Bijschrift', en: 'Caption' },
      required: false,
    },
  ],
}
