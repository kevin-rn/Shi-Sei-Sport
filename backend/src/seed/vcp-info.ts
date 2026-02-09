import type { Payload } from 'payload'

/**
 * Recursively normalizes all text nodes in a Lexical JSON tree,
 * adding required fields (detail, format, mode, style, version) if missing.
 */
const normalizeLexical = (node: any): any => {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map(normalizeLexical)

  const normalized = { ...node }
  if (normalized.type === 'text') {
    normalized.detail = normalized.detail ?? 0
    normalized.format = normalized.format ?? 0
    normalized.mode = normalized.mode ?? 'normal'
    normalized.style = normalized.style ?? ''
    normalized.version = normalized.version ?? 1
  }
  if (normalized.type === 'listitem') {
    normalized.version = normalized.version ?? 1
    normalized.value = normalized.value ?? 1
  }
  if (normalized.children) {
    normalized.children = normalized.children.map(normalizeLexical)
  }
  if (normalized.root) {
    normalized.root = normalizeLexical(normalized.root)
  }
  return normalized
}

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting VCP info seed...')

  try {
    // Create Dutch version first
    await payload.updateGlobal({
      slug: 'vcp-info',
      locale: 'nl',
      data: {
        vcpName: 'Hedda Vos',
        vcpEmail: 'vcp@shi-sei.nl',
        vcpSince: '2020',
        introduction: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Veilig en fijn sporten–daar zorgen we samen voor!' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Bij Shi-Sei Sport vinden we het belangrijk dat iedereen zich prettig en veilig voelt. Toch kan er soms iets gebeuren dat niet goed voelt: pesten, nare opmerkingen, buitensluiten, intimidatie of erger. In zulke situaties kun je altijd terecht bij onze vertrouwenscontactpersoon (VCP).',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        whatDoesVcpDo: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Luistert naar jouw verhaal–zonder oordeel.',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Denkt met je mee–welke stappen zijn mogelijk?',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Gaat vertrouwelijk om met alles wat je vertelt. Alleen in heel ernstige situaties (bijvoorbeeld bij strafbare feiten of als er gevaar is) moet de VCP het bestuur of de politie informeren. Maar dat gebeurt nooit zonder dat je dit weet.',
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
        }),
        forWhom: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Voor ouders, kinderen, trainers, begeleiders en vrijwilligers. Eigenlijk: voor iedereen die betrokken is bij onze club.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        whyContact: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Als je kind wordt gepest of buitengesloten',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Als er sprake is van nare opmerkingen, discriminatie of intimidatie',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Als je je zorgen maakt over iets wat je ziet of hoort',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Of gewoon als iets niet goed voelt',
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
        }),
        vcpBio: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Hedda Vos is sinds 2020 betrokken bij Shi-Sei Sport. In eerste instantie als ouder van een judoka op de club, maar is later ook zelf als judoka gestart in 2022. Je zult haar regelmatig zien lopen. Voel je vrij om haar aan te spreken of om een e-mail te sturen. Samen maken we de club een plek waar iedereen met plezier en vertrouwen kan sporten.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        preventivePolicy: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'De VCP heeft ook als taak om binnen de vereniging het preventief beleid ter voorkoming van grensoverschrijdend gedrag en andere integriteitsschendingen mede te ontwikkelen en borgen en dit beleid te stimuleren en uit te dragen.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        crossingBehavior: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Grensoverschrijdend gedrag is elke vorm van handelen en/of nalaten dat als doel en/of gevolg heeft dat de waardigheid en/of veiligheid van 1 of meerdere personen wordt aangetast.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        vcpTasks: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De 1e opvang verzorgen bij signalen betreffende grensoverschrijdend gedrag op de vereniging voor iedereen die betrokken is bij de vereniging',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De VCP voert een vertrouwelijk, maar geen geheim gesprek met de betrokkene die zich meldt bij de vertrouwenscontractpersoon.',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De VCP maakt samen met de betrokkene een verslag van het gesprek en geeft dit verslag door aan het hoofd van de vereniging; de VCP heeft dus geen rol in de opvolging van een signaal',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De VCP kan bij vragen of twijfels contact opnamen met het Centrum voor Veilige Sport Nederland en heeft de mogelijkheid te sparren met een integriteitsmanager en/of VCP van de Judobond Nederland',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De VCP stimuleert basiseisen sociale veiligheid',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'De VCP adviseert over voorlichting, screening (VOG) en andere geldende reglementen en gedragscodes binnen de vereniging voor begeleiders, trainer-coaches en leden en overige vrijwilligers.',
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
        }),
      },
    })

    // Update with English translation
    await payload.updateGlobal({
      slug: 'vcp-info',
      locale: 'en',
      data: {
        introduction: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [{ type: 'text', text: 'Safe and enjoyable sports–together we make it happen!' }],
                tag: 'h3',
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'At Shi-Sei Sport, we believe it is important that everyone feels comfortable and safe. However, sometimes something can happen that doesn\'t feel right: bullying, nasty comments, exclusion, intimidation or worse. In such situations, you can always contact our confidential counselor (VCP).',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        whatDoesVcpDo: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Listens to your story–without judgment.',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Thinks along with you–what steps are possible?',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Handles everything you tell confidentially. Only in very serious situations (for example, criminal offenses or when there is danger) must the VCP inform the board or the police. But this never happens without your knowledge.',
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
        }),
        forWhom: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'For parents, children, trainers, supervisors and volunteers. Actually: for everyone involved in our club.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        whyContact: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'If your child is being bullied or excluded',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'If there are nasty comments, discrimination or intimidation',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'If you are worried about something you see or hear',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Or simply if something doesn\'t feel right',
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
        }),
        vcpBio: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Hedda Vos has been involved with Shi-Sei Sport since 2020. Initially as a parent of a judoka at the club, but later also started as a judoka herself in 2022. You will see her regularly. Feel free to approach her or send an email. Together we make the club a place where everyone can enjoy sports with pleasure and confidence.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        preventivePolicy: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The VCP also has the task to help develop and ensure preventive policy to prevent transgressive behavior and other integrity violations within the association and to stimulate and promote this policy.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        crossingBehavior: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Transgressive behavior is any form of action and/or omission that has the aim and/or consequence that the dignity and/or safety of one or more persons is affected.',
                  },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        }),
        vcpTasks: normalizeLexical({
          root: {
            type: 'root',
            children: [
              {
                type: 'list',
                children: [
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'Provide first reception for signals regarding transgressive behavior at the association for everyone involved in the association',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'The VCP conducts a confidential, but not secret conversation with the person reporting to the confidential contact person.',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'The VCP makes a report of the conversation together with the person concerned and forwards this report to the head of the association; the VCP therefore has no role in following up on a signal',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'The VCP can contact the Center for Safe Sports Netherlands in case of questions or doubts and has the opportunity to consult with an integrity manager and/or VCP of the Judo Federation Netherlands',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'The VCP stimulates basic social safety requirements',
                      },
                    ],
                  },
                  {
                    type: 'listitem',
                    children: [
                      {
                        type: 'text',
                        text: 'The VCP advises on education, screening (VOG) and other applicable regulations and codes of conduct within the association for supervisors, trainer-coaches and members and other volunteers.',
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
        }),
      },
    })

    console.info('Created localized VCP info')
  } catch (error) {
    console.error('Failed to create VCP info:', error)
  }

  console.info('VCP info seed complete.')
}
