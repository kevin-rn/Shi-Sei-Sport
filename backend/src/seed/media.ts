import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const standaloneImages = [
  {
    file: 'banner/tournament.png',
    mimetype: 'image/png',
    altNl: 'Judoka tijdens een toernooi bij Shi-Sei Sport',
    altEn: 'Judoka during a tournament at Shi-Sei Sport',
    category: 'general',
  },
]

const imagesDir = path.resolve(__dirname, '../../assets/images')

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting standalone media seed...')

  for (const img of standaloneImages) {
    const filePath = path.join(imagesDir, img.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Media image not found: ${filePath}`)
      continue
    }
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: img.altNl,
          category: img.category,
        },
        file: {
          data: fileBuffer,
          name: path.basename(img.file),
          mimetype: img.mimetype,
          size: fileBuffer.byteLength,
        },
      })

      await payload.update({
        collection: 'media',
        id: mediaDoc.id,
        locale: 'en',
        data: {
          alt: img.altEn,
        },
      })

      console.info(`Uploaded standalone media: ${img.file} (ID: ${mediaDoc.id})`)
    } catch (e) {
      console.error(`Failed to upload standalone media ${img.file}:`, e)
    }
  }

  console.info('Standalone media seed complete.')
}
