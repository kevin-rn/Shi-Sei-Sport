import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const carouselImages = [
  { file: 'image1.png', mimetype: 'image/png', altNl: 'Judo training bij Shi-Sei Sport', altEn: 'Judo training at Shi-Sei Sport' },
  { file: 'image2.jpg', mimetype: 'image/jpeg', altNl: 'Judoka in actie', altEn: 'Judoka in action' },
  { file: 'image3.jpg', mimetype: 'image/jpeg', altNl: 'Judo competitie', altEn: 'Judo competition' },
  { file: 'image4.jpg', mimetype: 'image/jpeg', altNl: 'Judo techniek training', altEn: 'Judo technique training' },
  { file: 'image5.jpg', mimetype: 'image/jpeg', altNl: 'Shi-Sei Sport dojo', altEn: 'Shi-Sei Sport dojo' },
]

const carouselDir = path.resolve(__dirname, '../../assets/images/carousel ')

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting hero carousel seed...')

  const uploadedIds: (string | number)[] = []

  for (const img of carouselImages) {
    const filePath = path.join(carouselDir, img.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Carousel image not found: ${filePath}`)
      continue
    }
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: img.altNl,
          category: 'album',
        },
        file: {
          data: fileBuffer,
          name: img.file,
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

      uploadedIds.push(mediaDoc.id)
      console.info(`Uploaded carousel image: ${img.file} (ID: ${mediaDoc.id})`)
    } catch (e) {
      console.error(`Failed to upload carousel image ${img.file}:`, e)
    }
  }

  if (uploadedIds.length === 0) {
    console.warn('No carousel images uploaded, skipping album creation.')
    return
  }

  try {
    await payload.create({
      collection: 'albums',
      locale: 'nl',
      data: {
        title: 'Hero Carousel',
        photos: uploadedIds,
        date: new Date().toISOString(),
        status: 'published',
        isHeroCarousel: true,
      } as any,
    })
    console.info('Hero carousel album created.')
  } catch (e) {
    console.error('Failed to create hero carousel album:', e)
  }

  console.info('Hero carousel seed complete.')
}
