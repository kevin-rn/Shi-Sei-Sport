import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting Dan Grades info seed...')

  try {
    // Create Dutch version first
    await payload.updateGlobal({
      slug: 'dan-grades-info',
      locale: 'nl',
      data: {
        title: 'Zwarte Band (Dan Graden)',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Het behalen van een zwarte band (Dan graad) is een belangrijke mijlpaal in de judo-carrière van elke judoka. Het is een bewijs van jarenlange toewijding, technische vaardigheid en begrip van de principes van judo.',
                  },
                ],
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Voorbereiding en Voorwaarden' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Voordat je examen kunt doen voor een Dan graad, moet je aan bepaalde voorwaarden voldoen:',
                  },
                ],
              },
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Minimale 3 jaar bij de JBN (Judo Bond Nederland) ingeschreven staan en de minimale leeftijd van 16 jaar bereikt hebben',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Beheersing van alle vereiste technieken (worpen, grondtechnieken, kata)',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Begrip van judo-filosofie en -etiquette',
                      },
                    ],
                  },
                ],
                listType: 'bullet',
                tag: 'ul',
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Het Examen op de Mat' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Het Dan-examen is uitgebreid en veelzijdig. Het toetst niet alleen je technische vaardigheden, maar ook je begrip van judo als kunst en sport. Het examen omvat doorgaans:',
                  },
                ],
              },
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Demonstratie van worpen (nage-waza) uit verschillende categorieën',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Grondtechnieken (ne-waza): houdgrepen, würgtechnieken en armklemmen',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Kata-uitvoeringen (formele technieken)',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Theoretische kennis van worpnamen and types',
                      },
                    ],
                  },
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
        externalUrl: 'https://www.jbn.nl/danexamens-1e-2e-en-3e-dan-judo',
        externalUrlText: 'Meer informatie op JBN.nl',
      },
    })

    // Update with English translation
    await payload.updateGlobal({
      slug: 'dan-grades-info',
      locale: 'en',
      data: {
        title: 'Black Belt (Dan Grades)',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Achieving a black belt (Dan grade) is an important milestone in every judoka\'s judo career. It is proof of years of dedication, technical skill and understanding of the principles of judo.',
                  },
                ],
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Preparation and Requirements' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Before you can take an exam for a Dan grade, you must meet certain requirements:',
                  },
                ],
              },
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Minimally 3 years having registered with the JBN (Judo Federation Netherlands) and meeting the minimum age requirement of 16 years old',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Mastery of all required techniques (throws, groundwork, kata)',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Understanding of judo philosophy and etiquette',
                      },
                    ],
                  },
                ],
                listType: 'bullet',
                tag: 'ul',
              },
              {
                type: 'heading',
                children: [{ type: 'text', text: 'The Exam on the Mat' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The Dan exam is extensive and multifaceted. It tests not only your technical skills, but also your understanding of judo as an art and sport. The exam typically includes:',
                  },
                ],
              },
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Demonstration of throws (nage-waza) from different categories',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Groundwork techniques (ne-waza): pins, strangles and armlocks',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Kata performances (formal techniques)',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Theoretical knowledge on technique names and types',
                      },
                    ],
                  },
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
        externalUrl: 'https://www.jbn.nl/danexamens-1e-2e-en-3e-dan-judo',
        externalUrlText: 'More information at JBN.nl',
      },
    })

    console.info('Created localized Dan Grades info')
  } catch (error) {
    console.error('Failed to create Dan Grades info:', error)
  }

  console.info('Dan Grades info seed complete.')
}
