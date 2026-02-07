import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const documentsData = [
  // Regulations
  {
    title: { nl: 'Huishoudelijk Reglement', en: 'House Rules' },
    category: 'regulation',
    description: {
      nl: 'Het huishoudelijk reglement van Shi-Sei Sport bevat de regels en afspraken die gelden binnen de vereniging.',
      en: 'The house rules of Shi-Sei Sport contain the rules and agreements that apply within the association.',
    },
    pdfFilename: 'Huishoudelijke regels Shi-Sei Sport.pdf',
    order: 1,
  },
  {
    title: { nl: 'Gedragscodes', en: 'Code of Conduct' },
    category: 'regulation',
    description: {
      nl: 'De gedragscodes beschrijven de normen en waarden die wij hanteren binnen Shi-Sei Sport voor een veilige en respectvolle sportomgeving.',
      en: 'The code of conduct describes the norms and values we uphold within Shi-Sei Sport for a safe and respectful sports environment.',
    },
    pdfFilename: 'Gedragcodes Shi-Sei Sport.pdf',
    order: 2,
  },
  {
    title: { nl: 'VOG Beleid', en: 'Certificate of Conduct Policy' },
    category: 'regulation',
    description: {
      nl: 'Het VOG beleid beschrijft hoe Shi-Sei Sport omgaat met de Verklaring Omtrent het Gedrag voor vrijwilligers en instructeurs.',
      en: 'The Certificate of Conduct policy describes how Shi-Sei Sport handles the Certificate of Conduct for volunteers and instructors.',
    },
    pdfFilename: 'VOG Beleid.pdf',
    order: 3,
  },

  // Enrollment
  {
    title: { nl: 'Inschrijfformulier', en: 'Registration Form' },
    category: 'enrollment',
    description: {
      nl: 'Het inschrijfformulier voor nieuwe leden van Shi-Sei Sport.',
      en: 'The registration form for new members of Shi-Sei Sport.',
    },
    pdfFilename: 'Inschrijfformulier.pdf',
    order: 4,
  },
  {
    title: { nl: 'Machtiging Incasso', en: 'Direct Debit Authorization' },
    category: 'enrollment',
    description: {
      nl: 'Het machtigingsformulier voor automatische incasso van de contributie.',
      en: 'The authorization form for automatic direct debit of membership fees.',
    },
    pdfFilename: 'machtiging incasso.pdf',
    order: 5,
  },
]

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
        children: [
          { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 },
        ],
      },
    ],
  },
})

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting documents seed...')

  const assetsPath = path.resolve(__dirname, '../../assets/Formulieren')

  for (const doc of documentsData) {
    try {
      // Upload the PDF file to media collection
      const pdfPath = path.join(assetsPath, doc.pdfFilename)

      let mediaId: string | number | null = null

      if (fs.existsSync(pdfPath)) {
        const fileBuffer = fs.readFileSync(pdfPath)
        const mediaDoc = await payload.create({
          collection: 'media',
          locale: 'nl',
          data: {
            alt: `${doc.title.nl} - PDF`,
            category: 'document',
          },
          file: {
            data: fileBuffer,
            mimetype: 'application/pdf',
            name: doc.pdfFilename,
            size: fileBuffer.length,
          },
        })

        await payload.update({
          collection: 'media',
          id: mediaDoc.id,
          locale: 'en',
          data: {
            alt: `${doc.title.en} - PDF`,
          },
        })

        mediaId = mediaDoc.id
        console.info(`Uploaded PDF: ${doc.pdfFilename}`)
      } else {
        console.error(`PDF file not found: ${pdfPath}`)
      }

      // Create the document in Dutch
      const created = await payload.create({
        collection: 'documents',
        locale: 'nl',
        data: {
          title: doc.title.nl,
          category: doc.category,
          description: formatLexical(doc.description.nl),
          order: doc.order,
          ...(mediaId ? { attachment: mediaId } : {}),
        },
      })

      // Update with English translation
      await payload.update({
        collection: 'documents',
        id: created.id,
        locale: 'en',
        data: {
          title: doc.title.en,
          description: formatLexical(doc.description.en),
        },
      })

      console.info(`Created document: ${doc.title.nl}`)
    } catch (error) {
      console.error(`Failed to create document ${doc.title.nl}:`, error)
    }
  }

  console.info('Documents seed complete.')
}
