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
              children: [{ type: 'text', text: 'HUISHOUDELIJKE REGELS SHI-SEI SPORT' }],
              tag: 'h3',
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Ieder lid is minimaal 5 minuten voor aanvang van de training aanwezig en omgekleed in de Dojo (Gymzaal).' }] },
                { type: 'listitem', value: 2, children: [{ type: 'text', text: 'De judoka\'s dragen er zorg voor dat er voor aanvang van de les gebruik wordt gemaakt van de toiletten.' }] },
                { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Meisjes/dames en jongens/heren maken gebruik van aparte kleedkamers indien deze aanwezig zijn. Bij kinderen t/m 6 jaar mag er een begeleider (ouder) mee in de kleedkamer om te helpen en dient van hetzelfde geslacht te zijn als de judoka. Judoka\'s vanaf 7 jaar kleding zichzelf zelfstandig om in de voor zijn/haar toegankelijke kleedkamer.' }] },
                { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Voor, tijdens en na de training wordt er geen onnodige geluidsoverlast veroorzaakt door de leden en toeschouwers.' }] },
                { type: 'listitem', value: 5, children: [{ type: 'text', text: 'Leden zorgen ervoor dat de Judo-gi (judopak) tijdens, trainingen, wedstrijden en examenmomenten schoon is.' }] },
                { type: 'listitem', value: 6, children: [{ type: 'text', text: 'Dames en meisjes dragen onder hun Judo-gi (judopak) een schoon wit T-shirt en voor mannen en jongens geldt dat zij onder hun Judo-gi (judopak) geen hemd of shirt dragen.' }] },
                { type: 'listitem', value: 7, children: [{ type: 'text', text: 'De Judo-gi (judopak) heeft een witte kleur en mag alleen in overleg met de trainer afwijken van kleur (blauw bv.).' }] },
                { type: 'listitem', value: 8, children: [{ type: 'text', text: 'Buiten de judomat dragen judoka\'s slippers of anders schoeisel aan hun voeten in de ruimte en lopen niet op blote voeten alvorens de judomat op te gaan.' }] },
                { type: 'listitem', value: 9, children: [{ type: 'text', text: 'De judoka draagt er zorg voor dat nagels van handen en voeten geknipt zijn, zodat hij/zij andere judoka\'s en/of zichzelf niet verwondt.' }] },
                { type: 'listitem', value: 10, children: [{ type: 'text', text: 'Indien je een besmettelijke huidaandoening hebt verzoek wij je niet naar de training of examens te komen tot het moment dat de besmettelijke fase is afgelopen; denk hierbij bijvoorbeeld aan schimmelinfecties, koortslip, ringworm, waterpokken of krentenbaard.' }] },
                { type: 'listitem', value: 11, children: [{ type: 'text', text: 'Alle judoka\'s zorgen ervoor dat zij alle sieraden, haarspelden en overige zaken die letsel kunnen veroorzaken verwijderd hebben van het lichaam of aan het lichaam. Dit wordt gevraagd om de veiligheid van de judoka zelf en mede-judoka\'s te waarborgen.' }] },
                {
                  type: 'listitem',
                  value: 12,
                  children: [
                    { type: 'text', text: 'In verband met de veiligheid zijn alle vormen van hoofddeksel officieel verboden vanuit de Judobond. Om binnen de vereniging tegemoet te komen aan judoka\'s die in het dagelijks leven een hoofddoek dragen is enkel en alleen een karate-hijab (WKF-approved) Arawaza toegestaan. Deze is via onderstaande link aan te schaffen.' },
                    {
                      type: 'list',
                      listType: 'bullet',
                      tag: 'ul',
                      children: [
                        {
                          type: 'listitem',
                          value: 1,
                          children: [
                            {
                              type: 'link',
                              fields: { url: 'https://www.nihonsport.nl/product/karate-hijab-wkf-approved-arawaza-zwart', newTab: true },
                              children: [{ type: 'text', text: 'https://www.nihonsport.nl/product/karate-hijab-wkf-approved-arawaza-zwart' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { type: 'listitem', value: 13, children: [{ type: 'text', text: 'Als de trainer uitleg geeft zorgt de judoka ervoor dat hij/zij stil is en oplet.' }] },
                { type: 'listitem', value: 14, children: [{ type: 'text', text: 'De voertaal binnen de vereniging is Nederlands en als dit door de trainer, begeleider of andere vrijwilliger noodzakelijk geacht wordt voor de voortgang van de les, de wedstrijd of het examenmoment zal overgegaan worden tot het benaderen van de judoka en/of begeleider in een andere taal.' }] },
                { type: 'listitem', value: 15, children: [{ type: 'text', text: 'Tijdens de lessen verlaat de judoka niet zonder toestemming van de trainer de judomat.' }] },
                { type: 'listitem', value: 16, children: [{ type: 'text', text: 'Judoka\'s, trainers, begeleiders, toeschouwers en anderen betreden de judomat niet met schoeisel (schoenen, slippers, laarzen etc.) aan; dit is enkel en alleen toegestaan voor hulpdiensten zoals ambulancepersoneel en overige door de vereniging aangestelde hulpverleners (bv. EHBO).' }] },
                { type: 'listitem', value: 17, children: [{ type: 'text', text: 'Judoka\'s gebruiken tijdens de lessen eigen waterflessen en kunnen daar gebruik van maken na toestemming van de trainer en/of begeleider; hij/zij verlaat de Dojo (gymzaal) niet om te eten en te drinken tijdens de lessen.' }] },
              ],
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
              children: [{ type: 'text', text: 'HOUSE RULES SHI-SEI SPORT' }],
              tag: 'h3',
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Every member must be present and changed in the Dojo (gymnasium) at least 5 minutes before the start of training.' }] },
                { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Judokas ensure they use the toilets before the lesson begins.' }] },
                { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Girls/women and boys/men use separate changing rooms where available. For children up to age 6, a chaperone (parent) of the same gender as the judoka may assist in the changing room. Judokas aged 7 and above change independently in the changing room designated for their gender.' }] },
                { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Before, during and after training, no unnecessary noise is caused by members or spectators.' }] },
                { type: 'listitem', value: 5, children: [{ type: 'text', text: 'Members ensure their Judo-gi (judogi) is clean during training, competitions and grading moments.' }] },
                { type: 'listitem', value: 6, children: [{ type: 'text', text: 'Women and girls wear a clean white T-shirt under their Judo-gi; men and boys do not wear a shirt or vest under their Judo-gi.' }] },
                { type: 'listitem', value: 7, children: [{ type: 'text', text: 'The Judo-gi is white and may only differ in colour (e.g. blue) in consultation with the trainer.' }] },
                { type: 'listitem', value: 8, children: [{ type: 'text', text: 'Outside the judo mat, judokas wear slippers or other footwear and do not walk barefoot before stepping onto the mat.' }] },
                { type: 'listitem', value: 9, children: [{ type: 'text', text: 'Judokas ensure their finger and toenails are trimmed so they do not injure themselves or fellow judokas.' }] },
                { type: 'listitem', value: 10, children: [{ type: 'text', text: 'If you have a contagious skin condition, please do not attend training or gradings until the contagious phase has passed — this includes fungal infections, cold sores, ringworm, chickenpox or impetigo.' }] },
                { type: 'listitem', value: 11, children: [{ type: 'text', text: 'All judokas must ensure that jewellery, hair clips and any other items that could cause injury are removed from the body before training. This is required to safeguard the safety of the judoka and fellow judokas.' }] },
                {
                  type: 'listitem',
                  value: 12,
                  children: [
                    { type: 'text', text: 'For safety reasons, all forms of headwear are officially prohibited by the Judo federation. As an accommodation for judokas who wear a headscarf in daily life, only a karate hijab (WKF-approved) by Arawaza is permitted. This can be purchased via the link below.' },
                    {
                      type: 'list',
                      listType: 'bullet',
                      tag: 'ul',
                      children: [
                        {
                          type: 'listitem',
                          value: 1,
                          children: [
                            {
                              type: 'link',
                              fields: { url: 'https://www.nihonsport.nl/product/karate-hijab-wkf-approved-arawaza-zwart', newTab: true },
                              children: [{ type: 'text', text: 'https://www.nihonsport.nl/product/karate-hijab-wkf-approved-arawaza-zwart' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { type: 'listitem', value: 13, children: [{ type: 'text', text: 'When the trainer is explaining something, the judoka is quiet and pays attention.' }] },
                { type: 'listitem', value: 14, children: [{ type: 'text', text: 'The main language of the association is Dutch. If the trainer, coach or other volunteer deems it necessary for the progress of the lesson, competition or grading, communication with the judoka and/or guardian may switch to another language.' }] },
                { type: 'listitem', value: 15, children: [{ type: 'text', text: 'During lessons, the judoka does not leave the mat without permission from the trainer.' }] },
                { type: 'listitem', value: 16, children: [{ type: 'text', text: 'Judokas, trainers, coaches, spectators and others do not step onto the judo mat with footwear (shoes, slippers, boots, etc.); this is only permitted for emergency services such as paramedics and other first-aid personnel designated by the association.' }] },
                { type: 'listitem', value: 17, children: [{ type: 'text', text: 'Judokas use their own water bottles during lessons and may drink after receiving permission from the trainer and/or coach; they do not leave the Dojo to eat or drink during lessons.' }] },
              ],
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
            // --- Algemeen ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'GEDRAGSCODE Algemeen Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Met ingang van het sportseizoen 2023/2024 treedt bij Shi-Sei Sport de gedragscode in werking voor de trainers en begeleiders en overige vrijwilligers, maar ook de leden, hun ouders en overige toeschouwers bij zowel trainingen, wedstrijden en graduatiemomenten, als ook activiteiten die onder leiding staan van Shi-Sei Sport, hierna ook te noemen, de vereniging.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Er zijn een 4-tal gedragscodes opgesteld, t.w.:' }],
            },
            {
              type: 'list',
              listType: 'number',
              tag: 'ol',
              children: [
                { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Gedragscode bestuur' }] },
                { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Gedragscode voor trainers, begeleiders en overige vrijwilligers' }] },
                { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Gedragscode voor leden' }] },
                { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Gedragscode voor ouders, toeschouwers en anderen' }] },
              ],
            },
            // --- Bestuur ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'GEDRAGSCODE Bestuur Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Een bestuurder:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'zorgt voor een veilige omgeving.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij schept een omgeving en een sfeer, waarin de sociale veiligheid gewaarborgd is en ook zo wordt ervaren.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'is dienstbaar.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij handelt altijd in het belang van de vereniging en richt zich op het belang van de leden.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij handelt zo transparant mogelijk, zodat het eenvoudig is om verantwoording af te leggen en inzicht te geven in je handelen en beweegredenen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'is betrouwbaar.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij houdt zich aan de regels en afspraken, zoals de statuten en reglementen, gebruikt informatie alleen voor het doel van de vereniging en gebruikt geen vertrouwelijke informatie voor eigen gewin of ten gunste van anderen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'is zorgvuldig.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij handelt met respect en stelt gelijke behandeling voorop, weegt belangen op correcte wijze, gaat zorgvuldig en correct om met vertrouwelijke informatie.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'is een voorbeeldfunctie.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij is een voorbeeld voor anderen en onthoudt zich van gedragingen en uitlatingen waardoor de sport in diskrediet wordt gebracht. Hij/zij gedraagt zich hoffelijk en respectvol en onthoudt zich van grievende en/of beledigende opmerkingen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Zet zich intensief in.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij zorgt ervoor dat alle trainers, begeleiders, leden, ouders en toeschouwers bekend zijn met de van toepassing zijnde gedragscodes en zich aan de gedragscodes houden.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Neemt (meldingen en signalen van) onbehoorlijk gedrag en grensoverschrijdend gedrag serieus.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij spant zich in om het onderwerp integriteit bespreekbaar te maken en te houden, zorgt voor een bepaalde mate van alertheid in de organisatie voor onbehoorlijk en/of grensoverschrijdend gedrag.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij stimuleert het melden van ongewenst gedrag.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij treedt adequaat op tegen het schenden van de gedragscode door trainers, begeleiders, leden, ouders en toeschouwers en anderen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Spant zich in om te werken met integere trainers, begeleiders en overige vrijwilligers.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij zorgt ervoor dat in de vereniging gehandeld wordt met personen die van onbesproken gedrag zijn.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij draagt er zorg voor dat voor iedere trainer, begeleider en overige vrijwilliger een Verklaring Omtrent Gedrag (VOG) wordt aangevraagd, zodat een onderzoek door Justitie kan worden uitgevoerd in relatie tot de uit te voeren werkzaamheden voor de vereniging.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Trainers, begeleiders en overige vrijwilligers ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Gedragscode voor trainers, begeleiders en overige vrijwilligers' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Een trainer, begeleider en overige vrijwilliger:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Zorgt voor een veilige omgeving.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij schept een omgeving en een sfeer, waarin sociale veiligheid gewaarborgd is en ook zo wordt ervaren.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij houdt zich aan de veiligheidsnormen, en -eisen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Kent en handelt naar de regels en richtlijnen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij zorgt ervoor dat hij/zij op de hoogte is van de regels en richtlijnen én past ze ook toe.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Stelt ook de leden (judoka\'s) in staat om er meer over te weten te komen door hen gevraagd en ongevraagd hiervan op de hoogte te stellen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Is zorgvuldig en oprecht.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'bij het vermelden van ervaring en functies.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij meldt alle relevante feiten bij de aanstelling als trainer, coach of begeleider.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij kan een Verklaring Omtrent Gedrag VOG overleggen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Is zich bewust van machtsongelijkheid en (soms ook) afhankelijkheid.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij misbruikt zijn positie niet.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij gebruikt de positie niet om op onredelijke of ongepaste wijze macht uit te oefenen.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij onthoudt zich van elke vorm van (machts)misbruik, emotioneel misbruik, fysiek grensoverschrijdend gedrag, waaronder seksueel getinte opmerkingen, en seksueel getinte aanrakingen en seksueel misbruik. Alle seksuele handelingen, – contacten en – relaties met minderjarigen zijn onder geen beding geoorloofd.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Hij/zij heeft een meldplicht over seksuele intimidatie en misbruik.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Respecteert het privéleven van het lid (judoka).' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Dring niet verder in het privéleven van het lid (judoka) in dan noodzakelijk is.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Ga met respect om met het lid (judoka) en met ruimtes waarin de leden (judoka\'s) zich bevinden, zoals bijvoorbeeld de kleedkamer.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Tast niemand in zijn waarde aan.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij onthoudt zich van discriminerende, kleinerende of intimiderende opmerkingen en gedragingen.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij maakt geen onderscheid naar godsdienst, levensovertuiging, politieke gezindheid, ras, geslacht, seksuele gerichtheid, culturele achtergrond, leeftijd of andere kenmerken.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij sluit niemand buiten en is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Is een voorbeeld voor anderen en onthoudt zich van gedragingen en uitlatingen waardoor de sport in diskrediet wordt gebracht.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij gedraagt zich hoffelijk en respectvol.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij onthoudt zich van grievende, en/of beledigende opmerkingen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Neemt geen gunsten, geschenken, diensten of vergoedingen aan.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'om iets te doen of na te laten wat in strijd is met de integriteit van de sport. Word je iets aangeboden om iets te doen of na te laten, meld dit dan aan het bestuur.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Biedt geen gunsten, geschenken, diensten of vergoedingen aan.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'om iets te doen of na te laten wat in strijd is met de integriteit van de sport.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Ziet toe op naleving van regels en normen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij ziet toe op de naleving van de gedragscode door leden, de huisregels en andere normen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 11,
                  children: [
                    { type: 'text', text: 'Is open en alert op waarschuwingssignalen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij is waakzaam en alert op signalen en aarzelt niet om signalen door te geven aan het bestuur, de vertrouwens(contact)persoon en/of contact op te nemen met het Centrum Veilige Sport Nederland.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 12,
                  children: [
                    { type: 'text', text: 'Is voorzichtig.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij stelt nooit informatie beschikbaar, die nog niet openbaar is gemaakt.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 13,
                  children: [
                    { type: 'text', text: 'Is niet onder invloed van alcohol of verdovende middelen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij drinkt tijdens het lesgeven geen alcohol of maakt gebruik van verdovende middelen.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij is bij het lesgeven niet onder invloed van alcohol en/of verdovende middelen.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Leden ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Gedragscode voor leden' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Het lid:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Wanneer het lid iets wordt gevraagd en/of iets te doen wat tegen het eigen gevoel, de normen en waarden ingaat dan meldt hij/zij dit bij de trainer, bij het Bestuur, of bij de vertrouwenscontactpersoon (VCP).' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Respecteert anderen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij respecteert de tegenstander(s), trainers, begeleiders en overige vrijwilligers tijdens trainingen, wedstrijdmomenten, examenmomenten en overige momenten die door de vereniging worden georganiseerd.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij respecteert de scheidsrechters tijdens wedstrijdmomenten.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij respecteert toeschouwers en ieder ander.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Hij/zij let op zijn/haar taalgebruik.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'Hij/zij geeft iedereen het gevoel dat hij of zij zich vrij kan bewegen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Respecteert afspraken.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij komt op tijd.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij luistert naar instructies.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij houdt zich aan de regels.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Gaat netjes om met de omgeving.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij maakt niets stuk.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij respecteert ieders eigendommen.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij laat de kleedkamer netjes achter.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Hij/zij ruimt de gebruikte materialen op.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'Hij/zij gooit afval in de afvalbakken.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Blijft van anderen af.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij raakt buiten de normale sportbeoefening, niemand tegen zijn of haar wil aan.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Houdt zich aan de regels.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij leest deze gedragscode, overige regels en alle andere afspraken, en houdt zich daar ook aan.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Tast niemand in zijn waarde aan.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij onthoudt zich van discriminerende, kleinerende of intimiderende opmerkingen en gedragingen.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij sluit niemand buiten.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Discrimineert niet.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij maakt geen onderscheid naar godsdienst, levensovertuiging, politieke gezindheid, ras, geslacht, seksuele gerichtheid, culturele achtergrond, leeftijd of andere kenmerken.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Is eerlijk en sportief.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij speelt niet vals.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij gebruikt geen verbaal of fysiek geweld.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij gebruikt geen alcohol/verdovende middelen vlak voor of tijdens trainingen, wedstrijden, examenmomenten en/of overige evenementen die door de vereniging zijn georganiseerd.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Meldt overtredingen van deze gedragscode.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij meldt overtredingen van deze gedragscode bij het bestuur en/of de vertrouwenscontactpersoon van de Shi-Sei.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Ouders, toeschouwers en anderen ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'GEDRAGSCODE ouders, toeschouwers en anderen' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Een ouder, toeschouwer en/of anderen:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Wanneer een ouder, toeschouwer en/of anderen iets wordt gevraagd en/of iets te doen wat tegen het eigen gevoel, de normen en waarden ingaat dan meldt hij/zij dit bij de trainer, bij het Bestuur, of bij de vertrouwenscontactpersoon (VCP).' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Respecteert anderen.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij respecteert de leden (judoka\'s), trainers, begeleiders en overige vrijwilligers tijdens trainingen, wedstrijdmomenten, examenmomenten en overige momenten die door de vereniging worden georganiseerd.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij respecteert de scheidsrechters tijdens wedstrijdmomenten.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij respecteert toeschouwers en ieder ander.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Hij/zij let op zijn/haar taalgebruik.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'Hij/zij geeft iedereen het gevoel dat hij of zij zich vrij kan bewegen.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Respecteert afspraken.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij luistert naar instructies.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij houdt zich aan de regels.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Gaat netjes om met de omgeving.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij maakt niets stuk.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij respecteert ieders eigendommen.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij laat de kleedkamer netjes achter.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Hij/zij gooit afval in de afvalbakken.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Blijft van anderen af.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij raakt niemand tegen zijn of haar wil aan.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Houdt zich aan de regels.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij leest deze gedragscode, overige regels en alle andere afspraken, en houdt zich daar ook aan.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Tast niemand in zijn waarde aan.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij onthoudt zich van discriminerende, kleinerende of intimiderende opmerkingen en gedragingen.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij sluit niemand buiten.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Hij/zij is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Discrimineert niet.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij maakt geen onderscheid naar godsdienst, levensovertuiging, politieke gezindheid, ras, geslacht, seksuele gerichtheid, culturele achtergrond, leeftijd of andere kenmerken.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Is eerlijk en sportief.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij gebruikt geen verbaal of fysiek geweld.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Hij/zij is positief in zijn/haar ondersteuning in zowel verbale- als lichaamstaal naar de leden (judoka\'s) tijdens trainingen, wedstrijdmomenten en/of examenmomenten.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Meldt overtredingen van deze gedragscode.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Hij/zij meldt overtredingen van deze gedragscode bij het bestuur en/of de vertrouwenscontactpersoon van de Shi-Sei.' }] },
                    ]},
                  ],
                },
              ],
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
              children: [{ type: 'text', text: 'CODE OF CONDUCT General Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'As of the 2023/2024 sports season, the code of conduct comes into effect at Shi-Sei Sport for trainers, coaches and other volunteers, as well as members, their parents and other spectators at trainings, competitions and grading moments, and activities organised under the supervision of Shi-Sei Sport (hereafter also referred to as "the association").' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Four codes of conduct have been established, namely:' }],
            },
            {
              type: 'list',
              listType: 'number',
              tag: 'ol',
              children: [
                { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Code of conduct for the board' }] },
                { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Code of conduct for trainers, coaches and other volunteers' }] },
                { type: 'listitem', value: 3, children: [{ type: 'text', text: 'Code of conduct for members' }] },
                { type: 'listitem', value: 4, children: [{ type: 'text', text: 'Code of conduct for parents, spectators and others' }] },
              ],
            },
            // --- Board ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'CODE OF CONDUCT Board Shi-Sei Sport' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'A board member:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Ensures a safe environment.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she creates an environment and atmosphere in which social safety is guaranteed and experienced as such.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Is of service.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she always acts in the interest of the association and focuses on the interest of the members.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she acts as transparently as possible, making it easy to account for and provide insight into actions and motives.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Is reliable.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she adheres to the rules and agreements, such as the articles of association and regulations, uses information only for the purpose of the association, and does not use confidential information for personal gain or to benefit others.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Is careful.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she acts with respect and puts equal treatment first, weighs interests correctly, and handles confidential information carefully and properly.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Is a role model.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she sets an example for others and refrains from conduct and statements that bring the sport into disrepute. He/she behaves courteously and respectfully and refrains from hurtful and/or offensive remarks.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Is intensely committed.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she ensures that all trainers, coaches, members, parents and spectators are familiar with the applicable codes of conduct and comply with them.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Takes (reports and signals of) improper and transgressive behaviour seriously.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she works to keep the topic of integrity open for discussion and ensures a certain level of alertness within the organisation regarding improper and/or transgressive behaviour.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she encourages the reporting of undesirable behaviour.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she takes adequate action against violations of the code of conduct by trainers, coaches, members, parents, spectators and others.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Strives to work with trainers, coaches and other volunteers of integrity.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she ensures that the association only works with persons of impeccable conduct.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she ensures that a Certificate of Conduct (VOG) is requested for every trainer, coach and other volunteer, so that a background check by the Ministry of Justice can be carried out in relation to the work performed for the association.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Trainers, coaches and other volunteers ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Code of conduct for trainers, coaches and other volunteers' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'A trainer, coach or other volunteer:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Ensures a safe environment.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she creates an environment and atmosphere in which social safety is guaranteed and experienced as such.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she complies with safety standards and requirements.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Knows and acts according to the rules and guidelines.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she ensures familiarity with the rules and guidelines and applies them.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Also enables members (judokas) to learn more about them by informing them both on request and proactively.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Is careful and honest.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Regarding the statement of experience and positions.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she reports all relevant facts upon appointment as trainer, coach or supervisor.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she is able to present a Certificate of Conduct (VOG).' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Is aware of power imbalance and (sometimes) dependency.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not abuse his/her position.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she does not use the position to exercise power in an unreasonable or inappropriate manner.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she refrains from all forms of (power) abuse, emotional abuse, physical transgressive behaviour, including sexually charged remarks and sexually charged touching, and sexual abuse. All sexual acts, contacts and relationships with minors are under no circumstances permitted.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'He/she has a duty to report sexual harassment and abuse.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Respects the private life of the member (judoka).' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Does not intrude into the private life of the member (judoka) beyond what is necessary.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'Treats the member (judoka) and spaces where members are present — such as the changing room — with respect.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Does not undermine anyone\'s dignity.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she refrains from discriminatory, demeaning or intimidating remarks and behaviour.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she makes no distinction based on religion, belief, political conviction, race, gender, sexual orientation, cultural background, age or other characteristics.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she excludes no one and is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Is a role model and refrains from conduct and statements that bring the sport into disrepute.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she behaves courteously and respectfully.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she refrains from hurtful and/or offensive remarks.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Does not accept favours, gifts, services or compensation.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'To do or refrain from doing something that conflicts with the integrity of the sport. If something is offered to you to do or not do something, report this to the board.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Does not offer favours, gifts, services or compensation.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'To do or refrain from doing something that conflicts with the integrity of the sport.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Monitors compliance with rules and standards.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she monitors compliance with the code of conduct by members, the house rules and other standards.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 11,
                  children: [
                    { type: 'text', text: 'Is open and alert to warning signals.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she is vigilant and alert to signals and does not hesitate to pass them on to the board, the confidential counsellor (VCP) and/or to contact the Centre for Safe Sport Netherlands.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 12,
                  children: [
                    { type: 'text', text: 'Is cautious.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she never makes information available that has not yet been made public.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 13,
                  children: [
                    { type: 'text', text: 'Is not under the influence of alcohol or narcotics.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not consume alcohol or use narcotics while teaching.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she is not under the influence of alcohol and/or narcotics while teaching.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Members ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'Code of conduct for members' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'The member:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'When asked or told to do something that goes against their own feelings, norms and values, they report this to the trainer, the board, or the confidential counsellor (VCP).' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Respects others.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she respects opponents, trainers, coaches and other volunteers during training, competitions, grading moments and other activities organised by the association.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she respects referees during competitions.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she respects spectators and everyone else.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'He/she is mindful of their language.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'He/she makes everyone feel free to move about.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Respects agreements.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she is on time.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she listens to instructions.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she follows the rules.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Takes good care of the environment.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not break anything.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she respects everyone\'s belongings.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she leaves the changing room tidy.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'He/she tidies up the used materials.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'He/she puts rubbish in the bins.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Keeps hands to themselves.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'Outside of normal sporting practice, he/she does not touch anyone without their consent.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Follows the rules.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she reads this code of conduct, other rules and all other agreements, and also complies with them.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Does not undermine anyone\'s dignity.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she refrains from discriminatory, demeaning or intimidating remarks and behaviour.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she excludes no one.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Does not discriminate.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she makes no distinction based on religion, belief, political conviction, race, gender, sexual orientation, cultural background, age or other characteristics.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Is honest and sportsmanlike.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not cheat.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she does not use verbal or physical violence.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she does not use alcohol or narcotics immediately before or during training, competitions, grading moments and/or other events organised by the association.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Reports violations of this code of conduct.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she reports violations of this code of conduct to the board and/or the confidential counsellor of Shi-Sei.' }] },
                    ]},
                  ],
                },
              ],
            },
            // --- Parents, spectators and others ---
            {
              type: 'heading',
              children: [{ type: 'text', text: 'CODE OF CONDUCT parents, spectators and others' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'A parent, spectator and/or others:' }],
            },
            {
              type: 'list',
              listType: 'bullet',
              tag: 'ul',
              children: [
                {
                  type: 'listitem', value: 1,
                  children: [
                    { type: 'text', text: 'Is open.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'When asked or told to do something that goes against their own feelings, norms and values, they report this to the trainer, the board, or the confidential counsellor (VCP).' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 2,
                  children: [
                    { type: 'text', text: 'Respects others.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she respects members (judokas), trainers, coaches and other volunteers during training, competitions, grading moments and other activities organised by the association.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she respects referees during competitions.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she respects spectators and everyone else.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'He/she is mindful of their language.' }] },
                      { type: 'listitem', value: 5, children: [{ type: 'text', text: 'He/she makes everyone feel free to move about.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 3,
                  children: [
                    { type: 'text', text: 'Respects agreements.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she listens to instructions.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she follows the rules.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 4,
                  children: [
                    { type: 'text', text: 'Takes good care of the environment.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not break anything.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she respects everyone\'s belongings.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she leaves the changing room tidy.' }] },
                      { type: 'listitem', value: 4, children: [{ type: 'text', text: 'He/she puts rubbish in the bins.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 5,
                  children: [
                    { type: 'text', text: 'Keeps hands to themselves.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not touch anyone without their consent.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 6,
                  children: [
                    { type: 'text', text: 'Follows the rules.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she reads this code of conduct, other rules and all other agreements, and also complies with them.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 7,
                  children: [
                    { type: 'text', text: 'Does not undermine anyone\'s dignity.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she refrains from discriminatory, demeaning or intimidating remarks and behaviour.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she excludes no one.' }] },
                      { type: 'listitem', value: 3, children: [{ type: 'text', text: 'He/she is tolerant.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 8,
                  children: [
                    { type: 'text', text: 'Does not discriminate.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she makes no distinction based on religion, belief, political conviction, race, gender, sexual orientation, cultural background, age or other characteristics.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 9,
                  children: [
                    { type: 'text', text: 'Is honest and sportsmanlike.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she does not use verbal or physical violence.' }] },
                      { type: 'listitem', value: 2, children: [{ type: 'text', text: 'He/she is positive in their support — both verbally and through body language — towards members (judokas) during training, competitions and/or grading moments.' }] },
                    ]},
                  ],
                },
                {
                  type: 'listitem', value: 10,
                  children: [
                    { type: 'text', text: 'Reports violations of this code of conduct.' },
                    { type: 'list', listType: 'bullet', tag: 'ul', children: [
                      { type: 'listitem', value: 1, children: [{ type: 'text', text: 'He/she reports violations of this code of conduct to the board and/or the confidential counsellor of Shi-Sei.' }] },
                    ]},
                  ],
                },
              ],
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
              children: [{ type: 'text', text: 'VOG BELEID SHI-SEI' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Binnen Shi-Sei vinden wij het belangrijk dat er een veilig sportklimaat is, waarbij iedere judoka zich veilig voelt en veilig is en mag zijn wie hij/zij is.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Sinds het seizoen 2023/2024 voert Shi-Sei daarom een VOG-beleid waarbij er voor iedere vrijwilliger van 12 jaar en ouder een VOG wordt aangevraagd om ook preventief grensoverschrijdend gedrag tegen te gaan. Een VOG is een verklaring van het ministerie van Veiligheid en Justitie waaruit blijkt dat het gedrag van een persoon in het verleden geen bezwaar oplevert voor het gevraagde doel, zoals het werken met minderjarigen bij een sportvereniging. Een VOG staat ook wel bekend als een bewijs van goed gedrag.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Door het verplichten van een VOG te tonen, neemt Shi-Sei één van de maatregelen om de kans op grensoverschrijdend gedrag binnen de club te verkleinen. Het maakt de kans kleiner dat personen die eerder de fout in zijn gegaan een functie bij Shi-Sei kunnen uitoefenen. Het biedt geen garanties, maar hiermee laat Shi-Sei zien dat het de veiligheid van zijn leden, vrijwilligers en bezoekers serieus neemt.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Iedere 3 jaar zal voor een vrijwilliger een nieuwe VOG aangevraagd worden.' }],
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
              children: [{ type: 'text', text: 'CERTIFICATE OF CONDUCT (VOG) POLICY SHI-SEI' }],
              tag: 'h3',
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'At Shi-Sei, we believe it is important to maintain a safe sporting environment in which every judoka feels safe and is free to be who they are.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Since the 2023/2024 season, Shi-Sei has therefore implemented a VOG policy, whereby a Certificate of Conduct (VOG) is requested for every volunteer aged 12 and over, as a preventive measure against transgressive behaviour. A VOG is a declaration from the Ministry of Security and Justice confirming that a person\'s past conduct does not raise any objections for the requested purpose, such as working with minors at a sports association. A VOG is also known as a certificate of good conduct.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'By requiring a VOG, Shi-Sei takes one of the measures to reduce the likelihood of transgressive behaviour within the club. It makes it less likely that individuals who have previously offended can take up a position at Shi-Sei. It provides no guarantees, but it demonstrates that Shi-Sei takes the safety of its members, volunteers and visitors seriously.' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'A new VOG will be requested for each volunteer every 3 years.' }],
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
