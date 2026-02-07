import type { Payload } from 'payload'

const agendaData = [
  // 2025 Events
  {
    title: { nl: 'Zomervakantie', en: 'Summer Vacation' },
    category: 'vacation',
    startDate: '2025-07-19',
    endDate: '2025-08-31',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Geen Judo', en: 'No Judo' },
    category: 'other',
    startDate: '2025-10-15',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Herfstvakantie', en: 'Autumn Vacation' },
    category: 'vacation',
    startDate: '2025-10-18',
    endDate: '2025-10-26',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Kerstvakantie', en: 'Christmas Vacation' },
    category: 'vacation',
    startDate: '2025-12-18',
    endDate: '2026-01-04',
    allDay: true,
    status: 'published',
  },

  // 2026 Events
  {
    title: { nl: 'Voorjaarsvakantie', en: 'Spring Vacation' },
    category: 'vacation',
    startDate: '2026-02-14',
    endDate: '2026-02-22',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Pasen', en: 'Easter' },
    category: 'holiday',
    startDate: '2026-04-03',
    endDate: '2026-04-06',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Meivakantie', en: 'May Vacation' },
    category: 'vacation',
    startDate: '2026-04-25',
    endDate: '2026-05-10',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Hemelvaart', en: 'Ascension Day' },
    category: 'holiday',
    startDate: '2026-05-14',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Pinksteren', en: 'Pentecost' },
    category: 'holiday',
    startDate: '2026-05-25',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Geen Judo', en: 'No Judo' },
    category: 'other',
    startDate: '2026-06-25',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Geen Judo', en: 'No Judo' },
    category: 'other',
    startDate: '2026-07-09',
    allDay: true,
    status: 'published',
  },
  {
    title: { nl: 'Zomervakantie', en: 'Summer Vacation' },
    category: 'vacation',
    startDate: '2026-07-17',
    endDate: '2026-08-30',
    allDay: true,
    status: 'published',
  },
]

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting agenda seed...')

  for (const item of agendaData) {
    try {
      // Create the document in the default locale (Dutch) first
      const doc = await payload.create({
        collection: 'agenda',
        locale: 'nl',
        data: {
          title: item.title.nl,
          category: item.category,
          startDate: item.startDate,
          endDate: item.endDate,
          allDay: item.allDay,
          status: item.status,
        },
      })

      // Then update it with the English translation
      await payload.update({
        collection: 'agenda',
        id: doc.id,
        locale: 'en',
        data: {
          title: item.title.en,
        },
      })

      console.info(`Created localized agenda item: ${item.title.nl} - ${item.startDate}`)
    } catch (error) {
      console.error(`Failed to create agenda item for ${item.title.nl}:`, error)
    }
  }
  console.info('Agenda seed complete.')
}
