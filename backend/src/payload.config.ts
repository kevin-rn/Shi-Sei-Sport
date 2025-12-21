import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import path from 'path';
import { News } from './collections/News';
import { Schedule } from './collections/Schedule';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  },
  bucket: process.env.S3_BUCKET || '',
});

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  editor: lexicalEditor({}),
  collections: [Users, News, Schedule, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    cloudStorage({
      collections: {
        media: { adapter },
      },
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
});