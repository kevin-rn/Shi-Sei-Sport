import { getPayload } from 'payload'
import config from './src/payload.config.ts'
import dotenv from 'dotenv'
import { seed as seedInstructors } from './src/seed/instructors.ts'
import { seed as seedLocations } from './src/seed/locations.ts'
import { seed as seedSchedule } from './src/seed/schedule.ts'

dotenv.config()

const initDB = async () => {
  try {
    console.info('🚀 Starting database initialization...')
    
    const payload = await getPayload({
      config,
    })
    
    console.info('✅ Payload connected & Schema synced.')

    if (process.env.PAYLOAD_SEED === 'true') {
      console.info('🌱 Seeding database...')

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
      const existingSchedule = await payload.find({ collection: 'schedule', limit: 1 })
      if (existingSchedule.totalDocs === 0) {
        await seedSchedule(payload)
      }
      
      console.info('Database seeding complete.')
    }

    process.exit(0)
  } catch (error: any) {
    console.error('Database initialization error:', error)
    process.exit(1)
  }
}

initDB()