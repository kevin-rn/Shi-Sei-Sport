import type { Payload } from 'payload'

const pricesData = [
  {
    priceType: 'plan' as const,
    planName: { nl: 'Jeugd (t/m 18 jaar)', en: 'Youth (up to 18 years)' },
    monthlyPrice: '€27,50',
    yearlyPrice: '€330,-',
    features: {
      nl: [
        'Onbeperkt trainen',
        'Toegang tot alle jeugdlessen',
        'Examen mogelijkheden',
        'Gratis Judo pak t/m 17 jaar',
      ],
      en: [
        'Unlimited training',
        'Access to all youth classes',
        'Exam opportunities',
        'Free Judo-Gi up to 17 years',
      ],
    },
    popular: true,
    displayOrder: 1,
  },
  {
    priceType: 'plan' as const,
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

const pricingSettings = {
  priceType: 'settings' as const,
  registrationFee: '€27,50',
  ooievaarspasText: {
    nl: 'Met de ooievaarspas tot 100% korting op de contributie mogelijk',
    en: 'Discounts up to 100% on membership fees possible with the Ooievaarspas',
  },
  displayOrder: 999,
}

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting prices seed...')

  // Seed price plans
  for (const item of pricesData) {
    try {
      // Create the document in the default locale (Dutch) first
      const doc = await payload.create({
        collection: 'prices',
        locale: 'nl',
        data: {
          priceType: item.priceType,
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

  // Seed pricing settings
  try {
    console.info('Creating pricing settings...')

    const settingsDoc = await payload.create({
      collection: 'prices',
      locale: 'nl',
      data: {
        priceType: pricingSettings.priceType,
        registrationFee: pricingSettings.registrationFee,
        ooievaarspasText: pricingSettings.ooievaarspasText.nl,
        displayOrder: pricingSettings.displayOrder,
      },
    })

    // Update with English translation
    await payload.update({
      collection: 'prices',
      id: settingsDoc.id,
      locale: 'en',
      data: {
        ooievaarspasText: pricingSettings.ooievaarspasText.en,
      },
    })

    console.info('Created pricing settings')
  } catch (error) {
    console.error('Failed to create pricing settings:', error)
  }

  console.info('Prices seed complete.')
}
