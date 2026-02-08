import type { GlobalConfig } from 'payload'

export const VCPInfo: GlobalConfig = {
  slug: 'vcp-info',
  label: 'VCP Informatie',
  admin: {
    description: 'Vertrouwenscontactpersoon (VCP) informatie',
    group: 'Vereniging',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'vcpName',
      type: 'text',
      label: 'Naam VCP',
      required: true,
      admin: {
        description: 'Naam van de vertrouwenscontactpersoon',
      },
    },
    {
      name: 'vcpEmail',
      type: 'email',
      label: 'VCP Email',
      required: true,
      admin: {
        description: 'Email adres van de VCP',
      },
    },
    {
      name: 'vcpSince',
      type: 'text',
      label: 'Betrokken Sinds',
      required: false,
      admin: {
        description: 'Jaar sinds wanneer de VCP betrokken is (bijv. "2020")',
      },
    },
    {
      name: 'introduction',
      type: 'richText',
      label: 'Introductie',
      required: true,
      localized: true,
      admin: {
        description: 'Algemene introductie over de VCP en veilig sporten',
      },
    },
    {
      name: 'whatDoesVcpDo',
      type: 'richText',
      label: 'Wat doet de VCP?',
      required: true,
      localized: true,
      admin: {
        description: 'Uitleg over de taken van de VCP',
      },
    },
    {
      name: 'forWhom',
      type: 'richText',
      label: 'Voor wie is de VCP er?',
      required: true,
      localized: true,
      admin: {
        description: 'Voor wie de VCP beschikbaar is',
      },
    },
    {
      name: 'whyContact',
      type: 'richText',
      label: 'Waarom contact opnemen?',
      required: true,
      localized: true,
      admin: {
        description: 'Redenen om contact op te nemen met de VCP',
      },
    },
    {
      name: 'vcpBio',
      type: 'richText',
      label: 'VCP Biografie',
      required: false,
      localized: true,
      admin: {
        description: 'Persoonlijke achtergrond van de VCP',
      },
    },
    {
      name: 'preventivePolicy',
      type: 'richText',
      label: 'Preventief Beleid',
      required: false,
      localized: true,
      admin: {
        description: 'Informatie over preventief beleid',
      },
    },
    {
      name: 'crossingBehavior',
      type: 'richText',
      label: 'Grensoverschrijdend Gedrag',
      required: false,
      localized: true,
      admin: {
        description: 'Definitie van grensoverschrijdend gedrag',
      },
    },
    {
      name: 'vcpTasks',
      type: 'richText',
      label: 'Taken VCP',
      required: false,
      localized: true,
      admin: {
        description: 'Gedetailleerde taken van de VCP',
      },
    },
  ],
}
