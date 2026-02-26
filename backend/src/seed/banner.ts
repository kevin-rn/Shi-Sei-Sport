import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const bannerImages = [
  {
    file: 'tournament.png',
    mimetype: 'image/png',
    altNl: 'Judoka tijdens een toernooi bij Shi-Sei Sport',
    altEn: 'Judoka during a tournament at Shi-Sei Sport',
  },
  {
    file: 'exam.png',
    mimetype: 'image/png',
    altNl: 'Judoka tijdens een examen bij Shi-Sei Sport',
    altEn: 'Judoka during an exam at Shi-Sei Sport',
  },
  {
    file: 'lesson.png',
    mimetype: 'image/png',
    altNl: 'Judoka tijdens een les bij Shi-Sei Sport',
    altEn: 'Judoka during a lesson at Shi-Sei Sport',
  },
]

const bannerDir = path.resolve(__dirname, '../../assets/images/banner')

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting banner album seed...')

  const uploadedIds: (string | number)[] = []

  for (const img of bannerImages) {
    const filePath = path.join(bannerDir, img.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`Banner image not found: ${filePath}`)
      continue
    }
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: img.altNl,
          category: 'general',
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
      console.info(`Uploaded banner image: ${img.file} (ID: ${mediaDoc.id})`)
    } catch (e) {
      console.error(`Failed to upload banner image ${img.file}:`, e)
    }
  }

  if (uploadedIds.length === 0) {
    console.warn('No banner images uploaded, skipping album creation.')
    return
  }

  try {
    await payload.create({
      collection: 'albums',
      data: {
        title: 'Banner',
        photos: uploadedIds,
        date: new Date().toISOString(),
        status: 'published',
        isHeroCarousel: false,
        isBanner: true,
      } as any,
    })

    console.info('Banner album created.')
  } catch (e) {
    console.error('Failed to create banner album:', e)
  }

  console.info('Banner album seed complete.')
}
