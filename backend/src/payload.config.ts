import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { News } from './collections/News'
import { Schedule } from './collections/Schedule'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Locations } from './collections/Location'
import { Instructors } from './collections/Instructors'
import { seed as seedInstructors } from './seed/instructors'
import { seed as seedLocations } from './seed/locations'
import { seed as seedSchedule } from './seed/schedule'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  sharp,
  collections: [Users, News, Schedule, Media, Locations, Instructors],
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