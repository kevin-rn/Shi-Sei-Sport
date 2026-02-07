import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const instructorsData = [
  {
    name: 'John Lut',
    role: { nl: 'Hoofd Instructeur', en: 'Head Instructor' },
    rank: '2e Dan',
    order: 1,
    bio: 'Gediplomeerd judo-instructeur met jarenlange ervaring in het trainen van zowel beginners als gevorderden.',
    qualifications: [
      { item: 'Judo Leraar A' }
    ],
  },
  {
    name: "Lucas van der Meulen",
    role: { nl: 'Hoofd Instructeur', en: 'Head Instructor' },
    rank: '2e Dan',
    order: 2,
    bio: 'Gediplomeerd judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
    qualifications: [
      { item: 'Judo Leraar A' }
    ],
  }
];

const formatLexical = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
      },
    ],
  },
});

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting instructors seed...')

  const defaultProfilePath = path.resolve(__dirname, '../../assets/images/Default_Profile.png')
  let defaultProfileId: string | number | null = null

  // Image Upload Logic
  if (fs.existsSync(defaultProfilePath)) {
    try {
      const fileBuffer = fs.readFileSync(defaultProfilePath)
      // Create media in Dutch locale first
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: 'Standaard profiel afbeelding',
          category: 'instructor',
        },
        file: {
          data: fileBuffer,
          name: 'Default_Profile.png',
          mimetype: 'image/png',
          size: fileBuffer.byteLength,
        },
      })

      // Update with English translation
      await payload.update({
        collection: 'media',
        id: mediaDoc.id,
        locale: 'en',
        data: {
          alt: 'Default profile image',
        },
      })

      defaultProfileId = mediaDoc.id;
      console.info('Uploaded default profile image with ID:', defaultProfileId)
      console.info('Media category:', mediaDoc.category)

      // Verify the media can be found with the instructor filter
      const verifyMedia = await payload.find({
        collection: 'media',
        where: {
          and: [
            { id: { equals: defaultProfileId } },
            { category: { equals: 'instructor' } },
          ],
        },
      })
      console.info('Media verification result:', verifyMedia.totalDocs > 0 ? 'Found' : 'Not found')
    } catch (e) {
      console.error('Image upload failed:', e)
    }
  }

  for (const item of instructorsData) {
    try {
      // Create the document in the default locale (Dutch) first
      const instructorData: any = {
        name: item.name,
        role: item.role.nl,
        rank: item.rank,
        order: item.order,
        qualifications: item.qualifications,
        bio: formatLexical(item.bio),
      }

      // Only add profileImage if it was successfully uploaded
      if (defaultProfileId) {
        instructorData.profileImage = defaultProfileId
      }

      const doc = await payload.create({
        collection: 'instructors',
        locale: 'nl',
        data: instructorData,
      })

      // Then update it with the English translation
      await payload.update({
        collection: 'instructors',
        id: doc.id,
        locale: 'en',
        data: {
          role: item.role.en,
        },
      })

      console.info(`Created instructor: ${item.name}`)
    } catch (error: any) {
      console.error(`Failed to create instructor ${item.name}:`, error)
      if (error.data?.errors) {
        console.error('Validation errors:', JSON.stringify(error.data.errors, null, 2))
      }
    }
  }
  console.info('Instructors seed complete.')
}