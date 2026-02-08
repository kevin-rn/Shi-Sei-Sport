import type { Payload } from 'payload'

const pricesData = [
  {
    planName: { nl: 'Jeugd (t/m 12 jaar)', en: 'Youth (up to 12 years)' },
    monthlyPrice: '€27,50',
    yearlyPrice: '€330,-',
    features: {
      nl: [
        'Onbeperkt trainen',
        'Toegang tot alle jeugdlessen',
        'Examen mogelijkheden',
        'Gratis judo pak t/m 17 jaar',
      ],
      en: [
        'Unlimited training',
        'Access to all youth classes',
        'Exam opportunities',
        'Free judo suit up to 17 years',
      ],
    },
    popular: true,
    displayOrder: 1,
  },
  {
    planName: { nl: 'Volwassenen', en: 'Adults' },
    monthlyPrice: '€27,50',
    yearlyPrice: '€330,-',
    features: {
      nl: [
        '2x per week trainen',
        'Toegang tot alle lessen',
        'Examen mogelijkheden',
      ],
      en: [
        '2x per week training',
        'Access to all classes',
        'Exam opportunities',
      ],
    },
    popular: false,
    displayOrder: 2,
  },
]

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting prices seed...')

  for (const item of pricesData) {
    try {
      // Create the document in the default locale (Dutch) first
      const doc = await payload.create({
        collection: 'prices',
        locale: 'nl',
        data: {
          planName: item.planName.nl,
          monthlyPrice: item.monthlyPrice,
          yearlyPrice: item.yearlyPrice,
          features: item.features.nl.map((feature) => ({ feature })),
          popular: item.popular,
          displayOrder: item.displayOrder,
        },
      })

      // Then update it with the English translation
      await payload.update({
        collection: 'prices',
        id: doc.id,
        locale: 'en',
        data: {
          planName: item.planName.en,
          features: item.features.en.map((feature) => ({ feature })),
        },
      })

      console.info(`Created localized price plan: ${item.planName.nl}`)
    } catch (error) {
      console.error(`Failed to create price plan for ${item.planName.nl}:`, error)
    }
  }
  console.info('Prices seed complete.')
}
