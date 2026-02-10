import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeLexical, formatLexical } from './lexical'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const documentsData = [
  // Regulations
  {
    title: { nl: 'Huishoudelijk Reglement', en: 'House Rules' },
    category: 'regulation',
    description: {
      nl: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Huishoudelijk Reglement Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Dit huishoudelijk reglement bevat de belangrijkste regels en afspraken voor alle leden van Judo Vereniging Shi-Sei Sport.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Algemene Regels' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Alle leden dienen zich te houden aan de regels en aanwijzingen van het bestuur en de trainers.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Trainingen beginnen op tijd. Kom op tijd om te kunnen omkleden en opwarmen.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Het is verplicht om schone sportkleding en een judopak te dragen tijdens de training.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Nagels moeten kort zijn en sieraden moeten worden afgedaan voor de training.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Lidmaatschap en Contributie' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'De contributie wordt automatisch per maand geïncasseerd via machtiging.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Opzegging van het lidmaatschap dient minimaal 1 maand van tevoren schriftelijk te gebeuren.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Bij niet-betaling kan het lidmaatschap worden geschorst.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Gedrag en Veiligheid' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Respectvol gedrag naar medeleden, trainers en vrijwilligers is verplicht.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Pesten, discriminatie en agressief gedrag worden niet getolereerd.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Leden zijn zelf verantwoordelijk voor hun persoonlijke eigendommen.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      en: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'House Rules Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'These house rules contain the most important rules and agreements for all members of Judo Association Shi-Sei Sport.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'General Rules' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'All members must comply with the rules and instructions of the board and trainers.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Training starts on time. Arrive on time to change and warm up.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'It is mandatory to wear clean sportswear and a judo uniform during training.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Nails must be short and jewelry must be removed before training.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Membership and Fees' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Membership fees are automatically debited monthly via authorization.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Termination of membership must be done in writing at least 1 month in advance.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'In case of non-payment, membership may be suspended.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Behavior and Safety' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Respectful behavior towards fellow members, trainers and volunteers is mandatory.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Bullying, discrimination and aggressive behavior will not be tolerated.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Members are responsible for their personal belongings.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    pdfFilename: 'Huishoudelijke regels Shi-Sei Sport.pdf',
    order: 1,
  },
  {
    title: { nl: 'Gedragscodes', en: 'Code of Conduct' },
    category: 'regulation',
    description: {
      nl: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Gedragscode Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Bij Shi-Sei Sport vinden wij het belangrijk dat iedereen zich veilig en welkom voelt. Deze gedragscode beschrijft de normen en waarden die wij hanteren.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Respect en Integriteit' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Behandel iedereen met respect, ongeacht leeftijd, geslacht, afkomst of niveau.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Discriminatie en pesten in welke vorm dan ook worden niet geaccepteerd.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Gebruik geen intimiderende of vernederende taal.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Veilige Sportomgeving' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Fysiek contact is alleen toegestaan in het kader van de judotraining.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Seksueel getinte opmerkingen, gedrag of contact zijn ten strengste verboden.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Meld grensoverschrijdend gedrag direct bij de trainer of de vertrouwenscontactpersoon.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Sportiviteit' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Accepteer beslissingen van trainers en officials.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Wees een goed voorbeeld voor jongere judoka\'s.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Help en steun medeleden, zowel op als naast de mat.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Gevolgen bij Overtreding' }],
              tag: 'h4',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Overtreding van de gedragscode kan leiden tot waarschuwing, schorsing of in ernstige gevallen royement uit de vereniging.',
              }],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      en: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Code of Conduct Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'At Shi-Sei Sport, we believe it is important that everyone feels safe and welcome. This code of conduct describes the norms and values we uphold.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Respect and Integrity' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Treat everyone with respect, regardless of age, gender, origin or level.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Discrimination and bullying in any form are not accepted.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Do not use intimidating or demeaning language.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Safe Sports Environment' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Physical contact is only allowed in the context of judo training.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Sexual comments, behavior or contact are strictly prohibited.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Report transgressive behavior immediately to the trainer or confidential counselor.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Sportsmanship' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Accept decisions of trainers and officials.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Be a good example for younger judokas.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Help and support fellow members, both on and off the mat.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Consequences of Violation' }],
              tag: 'h4',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Violation of the code of conduct may result in warning, suspension or in serious cases expulsion from the association.',
              }],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    pdfFilename: 'Gedragcodes Shi-Sei Sport.pdf',
    order: 2,
  },
  {
    title: { nl: 'VOG Beleid', en: 'Certificate of Conduct Policy' },
    category: 'regulation',
    description: {
      nl: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'VOG Beleid Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Shi-Sei Sport hanteert een strikt beleid omtrent de Verklaring Omtrent het Gedrag (VOG) voor alle vrijwilligers en trainers die met kinderen en jongeren werken.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Wanneer is een VOG Verplicht?' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'Alle trainers en instructeurs die lesgeven aan minderjarigen.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Bestuursleden die regelmatig contact hebben met jeugdleden.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Vrijwilligers die structureel met jeugdleden werken.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Procedure' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'De vereniging vraagt de VOG aan bij Justis namens de vrijwilliger/trainer.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'De kosten voor de VOG worden door de vereniging vergoed.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'De VOG moet elke 4 jaar worden vernieuwd.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Bewaring en Privacy' }],
              tag: 'h4',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'VOG-verklaringen worden vertrouwelijk behandeld en bewaard door het bestuur. Alleen geautoriseerde bestuursleden hebben toegang tot deze documenten. De gegevens worden na verloop van tijd conform de AVG-regelgeving vernietigd.',
              }],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      en: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Certificate of Conduct Policy Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'Shi-Sei Sport maintains a strict policy regarding the Certificate of Conduct (VOG) for all volunteers and trainers working with children and youth.',
              }],
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'When is a VOG Required?' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'All trainers and instructors teaching minors.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Board members who regularly have contact with youth members.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'Volunteers who structurally work with youth members.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Procedure' }],
              tag: 'h4',
            },
            {
              type: 'list',
              children: [
                { type: 'listitem', children: [{ type: 'text', text: 'The association requests the VOG from Justis on behalf of the volunteer/trainer.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'The costs for the VOG are reimbursed by the association.' }] },
                { type: 'listitem', children: [{ type: 'text', text: 'The VOG must be renewed every 4 years.' }] },
              ],
              listType: 'bullet',
              tag: 'ul',
            },
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Storage and Privacy' }],
              tag: 'h4',
            },
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: 'VOG certificates are treated confidentially and stored by the board. Only authorized board members have access to these documents. The data is destroyed after a period of time in accordance with GDPR regulations.',
              }],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    pdfFilename: 'VOG Beleid.pdf',
    order: 3,
  },

  // Enrollment
  {
    title: { nl: 'Inschrijfformulier', en: 'Registration Form' },
    category: 'enrollment',
    description: {
      nl: formatLexical('Het inschrijfformulier voor nieuwe leden van Shi-Sei Sport.'),
      en: formatLexical('The registration form for new members of Shi-Sei Sport.'),
    },
    pdfFilename: 'Inschrijfformulier.pdf',
    order: 4,
  },
  {
    title: { nl: 'Machtiging Incasso', en: 'Direct Debit Authorization' },
    category: 'enrollment',
    description: {
      nl: formatLexical('Het machtigingsformulier voor automatische incasso van de contributie.'),
      en: formatLexical('The authorization form for automatic direct debit of membership fees.'),
    },
    pdfFilename: 'machtiging incasso.pdf',
    order: 5,
  },
]

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
          description: normalizeLexical(doc.description.nl),
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
          description: normalizeLexical(doc.description.en),
        },
      })

      console.info(`Created document: ${doc.title.nl}`)
    } catch (error) {
      console.error(`Failed to create document ${doc.title.nl}:`, error)
    }
  }

  console.info('Documents seed complete.')
}
