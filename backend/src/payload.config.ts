import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { 
  lexicalEditor, 
  FixedToolbarFeature, 
  UploadFeature, 
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
// Nieuws & Media
import { News } from './collections/News'
import { Agenda } from './collections/Agenda'
import { Albums } from './collections/Albums'
import { Media } from './collections/Media'
// Training
import { TrainingSchedule } from './collections/Schedule'
import { Instructors } from './collections/Instructors'
import { Locations } from './collections/Location'
import { KyuGrades } from './collections/Grades'
// Vereniging
import { Prices } from './collections/Prices'
import { Documents } from './collections/Documents'
// Admin
import { Users } from './collections/Users'
import { PricingSettings } from './globals/PricingSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Shi Sei Sport',
    },
    components: {
      graphics: {
        Logo: '/src/components/Logo',
        Icon: '/src/components/Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                label: 'Caption',
              },
            ],
          },
        },
      }),
    ],
  }),
  sharp,
  collections: [
    // Nieuws & Media
    News, Agenda, Albums, Media,
    // Training
    TrainingSchedule, Instructors, Locations, KyuGrades,
    // Vereniging
    Documents, Prices,
    // Admin
    Users,
  ],
  globals: [PricingSettings],
  typescript: {
    outputFile: path.resolve(dirname, '../shared-types/payload-types.ts'),
  },
  localization: {
    locales: [
      { label: 'Nederlands', code: 'nl' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'nl',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})