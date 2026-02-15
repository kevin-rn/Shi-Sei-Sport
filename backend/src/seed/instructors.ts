import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { formatLexical } from './lexical'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const instructorsData = [
  {
    name: 'John Lut',
    role: { nl: 'Hoofd Instructeur', en: 'Head Instructor' },
    rank: { nl: '2e Dan ⚫️', en: '2nd Dan ⚫️' },
    order: 1,
    bio: {
      nl: 'Gediplomeerd judo-instructeur met jarenlange ervaring in het trainen van zowel beginners als gevorderden.',
      en: 'Certified judo instructor with years of experience training both beginners and advanced students.',
    },
    qualifications: [
      { item: 'Judo Leraar A (JBN leerkracht niveau 3)' },
      { item: 'ZekerBewegen-instructeur' },
      { item: 'JBN TuimeljudoPlus' }
    ],
  },
  {
    name: 'Lucas van der Meulen',
    role: { nl: 'Hoofd Instructeur', en: 'Head Instructor' },
    rank: { nl: '2e Dan ⚫️', en: '2nd Dan ⚫️' },
    order: 2,
    bio: {
      nl: 'Gediplomeerd judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
      en: 'Certified judo instructor with experience training both beginners and advanced students.',
    },
    qualifications: [
      { item: 'Judo Leraar A (JBN leerkracht niveau 3)' },
      { item: 'Scheidsrechter judo (niveau 3b)' },
    ],
  },
  {
    name: 'Kevin Nanhekhan',
    role: { nl: 'Instructeur', en: 'Instructor'},
    rank: { nl: '1e Dan ⚫️', en: '1st Dan ⚫️' },
    order: 3,
    bio: {
      nl: 'Judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
      en: 'Judo instructor with experience training both beginners and advanced students.',
    },
    qualifications: [],
  },
  {
    name: 'Aditya Ramdin',
    role: { nl: 'Instructeur', en: 'Instructor' },
    rank: { nl: '1e Dan ⚫️', en: '1st Dan ⚫️' },
    order: 4,
    bio: {
      nl: 'Judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
      en: 'Judo instructor with experience training both beginners and advanced students.',
    },
    qualifications: [],
  },
  {
    name: 'Thalia Nanhekhan',
    role: { nl: 'Instructeur', en: 'Instructor'},
    rank: { nl: '1e Kyu 🟤', en: '1st Kyu 🟤' },
    order: 5,
    bio: {
      nl: 'Judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
      en: 'Judo instructor with experience training both beginners and advanced students.',
    },
    qualifications: [],
  },
  {
    name: 'Joey Vos',
    role: { nl: 'Assistent', en: 'Assistant'},
    rank: { nl: '1e Kyu 🟤', en: '1st Kyu 🟤' },
    order: 6,
    bio: {
      nl: 'Gediplomeerd judo-leider met ervaring in het trainen van beginners.',
      en: 'Certified judo leader with experience training beginners.',
    },
    qualifications: [
      { item: 'Judo Leider (JBN leerkracht niveau 2)' }
    ],
  },
  {
    name: 'Hedda Vos',
    role: { nl: 'Assistent', en: 'Assistant'},
    rank: { nl: '1e Kyu 🟤', en: '1st Kyu 🟤' },
    order: 7,
    bio: {
      nl: 'Gediplomeerd judo-assistent met ervaring in het trainen van beginners.',
      en: 'Certified judo assistant with experience training beginners.',
    },
    qualifications: [
      { item: 'Dojo Assistent Judo (JBN leerkracht niveau 1)' },
      { item: 'Vertrouwenscontactpersoon (VCP)' },
    ],
  },
  {
    name: 'David Chan',
    role: { nl: 'Assistent', en: 'Assistant'},
    rank: { nl: '2e Kyu 🔵', en: '2nd Kyu 🔵' },
    order: 8,
    bio: {
      nl: 'Gediplomeerd judo-assistent met ervaring in het trainen van beginners.',
      en: 'Certified judo assistant with experience training beginners.',
    },
    qualifications: [
      { item: 'Dojo Assistent Judo (JBN leerkracht niveau 1)' }
    ],
  },
  {
    name: 'Noah el Ajjouri',
    role: { nl: 'Assistent', en: 'Assistant'},
    rank: { nl: '1e Kyu 🟤', en: '1st Kyu 🟤' },
    order: 9,
    bio: {
      nl: 'Judo-assistent met ervaring in het trainen van beginners.',
      en: 'Judo assistant with experience training beginners.',
    },
    qualifications: [],
  },
];


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
        rank: item.rank.nl,
        order: item.order,
        qualifications: item.qualifications,
        bio: formatLexical(item.bio.nl),
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
          rank: item.rank.en,
          bio: formatLexical(item.bio.en),
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