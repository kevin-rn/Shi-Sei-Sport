import { getPayload } from 'payload'
import config from './src/payload.config.ts'
import dotenv from 'dotenv'
import { seed as seedInstructors } from './src/seed/instructors.ts'
import { seed as seedLocations } from './src/seed/locations.ts'
import { seed as seedSchedule } from './src/seed/schedule.ts'
import { seed as seedPrices } from './src/seed/prices.ts'
import { seed as seedAgenda } from './src/seed/agenda.ts'
import { seed as seedGrades } from './src/seed/grades.ts'
import { seed as seedDocuments } from './src/seed/documents.ts'
import { seed as seedContactInfo } from './src/seed/contact-info.ts'
import { seed as seedVCPInfo } from './src/seed/vcp-info.ts'
import { seed as seedCarousel } from './src/seed/carousel.ts'

dotenv.config()

const initDB = async () => {
  try {
    console.info('Starting database initialization...')
    
    const payload = await getPayload({
      config,
    })
    
    console.info('Payload connected.')

    if (process.env.PAYLOAD_SEED === 'true') {
      console.info('Seeding database...')

      // Seed instructors
      const existingInstructors = await payload.find({ collection: 'instructors', limit: 1 })
      if (existingInstructors.totalDocs === 0) {
        await seedInstructors(payload)
      }

      // Seed locations
      const existingLocations = await payload.find({ collection: 'locations', limit: 1 })
      if (existingLocations.totalDocs === 0) {
        await seedLocations(payload)
      }

      // Seed schedule
      const existingSchedule = await payload.find({ collection: 'training-schedule', limit: 1 })
      if (existingSchedule.totalDocs === 0) {
        await seedSchedule(payload)
      }

      // Seed prices (plans and settings)
      const existingPrices = await payload.find({ collection: 'prices', limit: 1 })
      if (existingPrices.totalDocs === 0) {
        await seedPrices(payload)
      }

      // Seed agenda
      const existingAgenda = await payload.find({ collection: 'agenda', limit: 1 })
      if (existingAgenda.totalDocs === 0) {
        await seedAgenda(payload)
      }

      // Seed grades (Kyu and Dan)
      const existingGrades = await payload.find({ collection: 'grades', limit: 1 })
      if (existingGrades.totalDocs === 0) {
        await seedGrades(payload)
      }

      // Seed documents
      const existingDocuments = await payload.find({ collection: 'documents', limit: 1 })
      if (existingDocuments.totalDocs === 0) {
        await seedDocuments(payload)
      }

      // Seed hero carousel album
      const existingCarousel = await payload.find({
        collection: 'albums',
        where: { isHeroCarousel: { equals: true } },
        limit: 1,
      })
      if (existingCarousel.totalDocs === 0) {
        await seedCarousel(payload)
      }

      // Seed globals (always run to ensure they're set)
      console.info('Seeding globals...')
      await seedContactInfo(payload)
      await seedVCPInfo(payload)

      console.info('Database seeding complete.')
    }

    process.exit(0)
  } catch (error: any) {
    console.error('Database initialization error:', error)
    process.exit(1)
  }
}

initDB()