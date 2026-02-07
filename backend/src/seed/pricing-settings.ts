import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting pricing settings seed...')

  try {
    // Update the global pricing settings with Dutch version
    await payload.updateGlobal({
      slug: 'pricing-settings',
      locale: 'nl',
      data: {
        registrationFee: '€27,50',
        ooievaarspasText: 'Met de ooievaarspas tot 100% korting op de contributie mogelijk',
      },
    })

    // Then update with English translation
    await payload.updateGlobal({
      slug: 'pricing-settings',
      locale: 'en',
      data: {
        ooievaarspasText: 'Discounts up to 100% on membership fees possible with the Ooievaarspas',
      },
    })

    console.info('Created localized pricing settings')
  } catch (error) {
    console.error('Failed to create pricing settings:', error)
  }

  console.info('Pricing settings seed complete.')
}
