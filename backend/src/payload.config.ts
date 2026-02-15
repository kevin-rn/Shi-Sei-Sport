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

import { nl } from '@payloadcms/translations/languages/nl'
import { en } from '@payloadcms/translations/languages/en'

// Nieuws & Media
import { News } from './collections/News'
import { Agenda } from './collections/Agenda'
import { Albums } from './collections/Albums'
import { Media } from './collections/Media'
import { VideoEmbeds } from './collections/VideoEmbeds'
// Training
import { TrainingSchedule } from './collections/Schedule'
import { Instructors } from './collections/Instructors'
import { Locations } from './collections/Location'
import { Grades } from './collections/Grades'
// Vereniging
import { Prices } from './collections/Prices'
import { Documents } from './collections/Documents'
// Admin
import { Users } from './collections/Users'
import { ContactInfo } from './globals/ContactInfo'
import { VCPInfo } from './globals/VCPInfo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
    theme: 'all',
    meta: {
      titleSuffix: '- Shi-Sei Sport',
    },
    components: {
      graphics: {
        Logo: '/src/components/Logo',
        Icon: '/src/components/Icon',
      },
      beforeLogin: ['@/components/ThemeToggle'],
      actions: ['@/components/ThemeToggle'],
    },
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  i18n: {
    supportedLanguages: { nl, en },
    fallbackLanguage: 'nl',
    translations: {
      nl: {
        general: {
          dashboard: 'Dashboard',
          logout: 'Uitloggen',
          backToDashboard: 'Terug naar Dashboard',
        },
        authentication: {
          loggedIn: 'U bent ingelogd',
          loggedOutSuccessfully: 'U bent succesvol uitgelogd',
          loginUser: 'Inloggen',
          emailAddress: 'E-mailadres',
          password: 'Wachtwoord',
          forgotPassword: 'Wachtwoord vergeten?',
          createFirstUser: 'Maak eerste gebruiker aan',
        },
        validation: {
          required: 'Dit veld is verplicht',
          emailAddress: 'Voer een geldig e-mailadres in',
          trueOrFalse: 'Dit veld moet waar of onwaar zijn',
          maxLength: 'Dit veld mag niet meer dan {{max}} karakters bevatten',
          minLength: 'Dit veld moet minimaal {{min}} karakters bevatten',
          invalidSelection: 'U heeft een ongeldige selectie gemaakt',
        },
        fields: {
          blockType: 'Blok Type',
          blocks: 'Blokken',
          addBlock: 'Blok toevoegen',
          moveUp: 'Omhoog verplaatsen',
          moveDown: 'Omlaag verplaatsen',
          remove: 'Verwijderen',
          duplicate: 'Dupliceren',
          collapseAll: 'Alles inklappen',
          expandAll: 'Alles uitklappen',
          addLabel: '{{label}} toevoegen',
          addNew: 'Nieuwe toevoegen',
          addNewLabel: 'Nieuwe {{label}} toevoegen',
          editLabel: '{{label}} bewerken',
          enterAValue: 'Voer een waarde in',
          selectValue: 'Selecteer een waarde',
          uploadNewLabel: 'Nieuwe {{label}} uploaden',
          chooseFromExisting: 'Kies uit bestaande',
          chooseLabel: '{{label}} kiezen',
          textToDisplay: 'Weer te geven tekst',
          labelRelationship: '{{label}} relatie',
          createNew: 'Nieuwe aanmaken',
          relationTo: 'Relatie met',
          filterBy: 'Filteren op',
          filterLabel: '{{label}} filteren',
          clearAll: 'Alles wissen',
        },
        custom: {
          theme: 'Thema',
          light: 'Licht',
          dark: 'Donker',
        },
      },
      en: {
        custom: {
          theme: 'Theme',
          light: 'Light',
          dark: 'Dark',
        },
      },
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
                label: {
                  nl: 'Bijschrift',
                  en: 'Caption',
                },
              },
            ],
          },
          'video-embeds': {
            fields: [],
          },
        },
      }),
    ],
  }),
  sharp,
  collections: [
    // Nieuws & Media
    News, Agenda, Albums, Media, VideoEmbeds,
    // Training
    TrainingSchedule, Instructors, Locations, Grades,
    // Vereniging
    Documents, Prices,
    // Admin
    Users,
  ],
  globals: [ContactInfo, VCPInfo],
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
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
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