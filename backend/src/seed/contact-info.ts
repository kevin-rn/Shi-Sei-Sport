import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting contact info seed...')

  try {
    await payload.updateGlobal({
      slug: 'contact-info',
      data: {
        postalAddress: 'Willem-Alexanderlaan 3, 2685 VB Poeldijk',
        phones: [
          { number: '06-41752435' },
          { number: '0174-284213' },
        ],
        emails: [
          { email: 'info@shi-sei.nl' },
          { email: 'jlut@kpnmail.nl' },
        ],
      },
    })

    console.info('Created contact info')
  } catch (error) {
    console.error('Failed to create contact info:', error)
  }

  console.info('Contact info seed complete.')
}
