import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Transforms a plain string into the JSON structure required by the Lexical editor.
 */
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
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
      },
    ],
  },
})

const gradesData = [
  {
    beltLevel: 'yellow-5kyu',
    kyuRank: 5,
    minimumAge: '6 - 7 jaar',
    title: {
      nl: 'Eisen Judo Examen - 5e Kyu (Gele Band)',
      en: 'Judo Exam Requirements - 5th Kyu (Yellow Belt)',
    },
    description: {
      nl: 'Het 5e Kyu examen is het eerste examen voor beginnende judoka\'s. Bij dit examen worden de basis technieken getoetst, waaronder ukemi (valtechnieken), nage-waza (worptechnieken) en ne-waza (grondtechnieken).',
      en: 'The 5th Kyu exam is the first exam for beginning judokas. This exam tests basic techniques, including ukemi (falling techniques), nage-waza (throwing techniques), and ne-waza (ground techniques).',
    },
    pdfFilename: '5e kyu examen programma.pdf',
    order: 1,
  },
  {
    beltLevel: 'orange-4kyu',
    kyuRank: 4,
    minimumAge: '8 - 9 jaar',
    title: {
      nl: 'Eisen Judo Examen - 4e Kyu (Oranje Band)',
      en: 'Judo Exam Requirements - 4th Kyu (Orange Belt)',
    },
    description: {
      nl: 'Het 4e Kyu examen bouwt voort op de basis technieken van de gele band. Er wordt meer nadruk gelegd op uitvoering en controle van de technieken, inclusief variaties op worpen en meer geavanceerde grondtechnieken.',
      en: 'The 4th Kyu exam builds upon the basic techniques of the yellow belt. More emphasis is placed on execution and control of techniques, including variations of throws and more advanced ground techniques.',
    },
    pdfFilename: '4e kuy examen programma.pdf',
    order: 2,
  },
  {
    beltLevel: 'green-3kyu',
    kyuRank: 3,
    minimumAge: '10 - 12 jaar',
    title: {
      nl: 'Eisen Judo Examen - 3e Kyu (Groene Band)',
      en: 'Judo Exam Requirements - 3rd Kyu (Green Belt)',
    },
    description: {
      nl: 'Het 3e Kyu examen vereist een goede beheersing van de technieken uit de vorige graden. Judoka\'s moeten nu ook demonstreren dat ze technieken kunnen toepassen in verschillende situaties en kunnen combineren.',
      en: 'The 3rd Kyu exam requires good mastery of techniques from previous grades. Judokas must now also demonstrate that they can apply techniques in different situations and combine them.',
    },
    pdfFilename: '3e kyu examen programma.pdf',
    order: 3,
  },
  {
    beltLevel: 'blue-2kyu',
    kyuRank: 2,
    minimumAge: '12 - 13 jaar',
    title: {
      nl: 'Eisen Judo Examen - 2e Kyu (Blauwe Band)',
      en: 'Judo Exam Requirements - 2nd Kyu (Blue Belt)',
    },
    description: {
      nl: 'Het 2e Kyu examen is het voorlaatste Kyu examen. Judoka\'s moeten hier een breed scala aan technieken beheersen en kunnen toepassen in randori (vrije oefening). Ook tactisch inzicht wordt belangrijker.',
      en: 'The 2nd Kyu exam is the penultimate Kyu exam. Judokas must master a wide range of techniques and be able to apply them in randori (free practice). Tactical insight also becomes more important.',
    },
    pdfFilename: '2e kyu examen programma.pdf',
    order: 4,
  },
  {
    beltLevel: 'brown-1kyu',
    kyuRank: 1,
    minimumAge: '13 - 14 jaar',
    title: {
      nl: 'Eisen Judo Examen - 1e Kyu (Bruine Band)',
      en: 'Judo Exam Requirements - 1st Kyu (Brown Belt)',
    },
    description: {
      nl: 'Het 1e Kyu examen is het hoogste Kyu niveau en vormt de voorbereiding op het zwarte band (1e Dan) examen. Judoka\'s moeten alle technieken op hoog niveau beheersen en een diep begrip tonen van judo principes.',
      en: 'The 1st Kyu exam is the highest Kyu level and forms preparation for the black belt (1st Dan) exam. Judokas must master all techniques at a high level and show a deep understanding of judo principles.',
    },
    pdfFilename: '1e kyu examen programma.pdf',
    order: 5,
  },
]

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting grades seed...')

  const assetsPath = path.resolve(__dirname, '../../assets/Examens')

  for (const grade of gradesData) {
    try {
      // Upload the PDF file to media collection
      const pdfPath = path.join(assetsPath, grade.pdfFilename)

      if (!fs.existsSync(pdfPath)) {
        console.error(`PDF file not found: ${pdfPath}`)
        continue
      }

      const fileBuffer = fs.readFileSync(pdfPath)
      // Create media in Dutch locale first
      const mediaDoc = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: `${grade.title.nl} - PDF Document`,
          category: 'document',
        },
        file: {
          data: fileBuffer,
          mimetype: 'application/pdf', // or mime.getType(filePath)
          name: grade.pdfFilename,
          size: fileBuffer.length,
        },
      })

      // Update with English translation
      await payload.update({
        collection: 'media',
        id: mediaDoc.id,
        locale: 'en',
        data: {
          alt: `${grade.title.en} - PDF Document`,
        },
      })

      console.info(`Uploaded PDF: ${grade.pdfFilename}`)

      // Upload the PNG image (if exists)
      const pngFilename = grade.pdfFilename.replace('.pdf', '.png')
      const pngPath = path.join(assetsPath, pngFilename)
      let imageDoc = null

      if (fs.existsSync(pngPath)) {
        const imageBuffer = fs.readFileSync(pngPath)
        imageDoc = await payload.create({
          collection: 'media',
          locale: 'nl',
          data: {
            alt: `${grade.title.nl} - Voorbeeld`,
            category: 'document',
          },
          file: {
            data: imageBuffer,
            mimetype: 'image/png',
            name: pngFilename,
            size: imageBuffer.length,
          },
        })

        // Update with English translation
        await payload.update({
          collection: 'media',
          id: imageDoc.id,
          locale: 'en',
          data: {
            alt: `${grade.title.en} - Preview`,
          },
        })

        console.info(`Uploaded image: ${pngFilename}`)
      } else {
        console.warn(`Image file not found: ${pngPath}`)
      }

      // Prepare supplementary documents array
      const supplementaryDocs = imageDoc
        ? [
            {
              document: imageDoc.id,
              description: 'Voorbeeld afbeelding van het examen programma',
            },
          ]
        : []

      // Create the grade document in Dutch (default locale)
      const gradeDoc = await payload.create({
        collection: 'kyu-grades',
        locale: 'nl',
        data: {
          beltLevel: grade.beltLevel,
          kyuRank: grade.kyuRank,
          minimumAge: grade.minimumAge,
          title: grade.title.nl,
          description: formatLexical(grade.description.nl),
          examDocument: mediaDoc.id,
          supplementaryDocuments: supplementaryDocs,
          order: grade.order,
          status: 'published',
        },
      })

      // Update with English translation
      await payload.update({
        collection: 'kyu-grades',
        id: gradeDoc.id,
        locale: 'en',
        data: {
          title: grade.title.en,
          description: formatLexical(grade.description.en),
        },
      })

      console.info(`Created grade: ${grade.title.nl}`)
    } catch (error) {
      console.error(`Failed to create grade ${grade.title.nl}:`, error)
    }
  }

  console.info('Grades seed complete.')
}
