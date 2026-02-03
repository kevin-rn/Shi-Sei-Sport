import type { Payload } from 'payload';

const instructorsData = [
  {
    name: 'John Lut',
    role: 'Hoofd Instructeur',
    rank: '2e Dan',
    order: 1,
    bio: 'Gediplomeerd judo-instructeur met jarenlange ervaring in het trainen van zowel beginners als gevorderden.',
    qualifications: [{ item: 'Judo Leraar A' }],
  },
  {
    name: "Lucas van der Meulen",
    role: 'Hoofd Instructeur',
    rank: '2e Dan',
    order: 1,
    bio: 'Gediplomeerd judo-instructeur met ervaring in het trainen van zowel beginners als gevorderden.',
    qualifications: [{ item: 'Judo Leraar A' }],
  }
];

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
});

export const seed = async (payload: Payload): Promise<void> => {
  console.info('Starting instructors seed...');

  for (const item of instructorsData) {
    try {
      await payload.create({
        collection: 'instructors',
        locale: 'all',
        data: {
          name: item.name,
          role: item.role,
          rank: item.rank,
          order: item.order,
          qualifications: item.qualifications,
          bio: {
            nl: formatLexical(item.bio),
            en: formatLexical(item.bio),
          },
        },
      });
      console.info(`Created instructor: ${item.name}`);
    } catch (error) {
      console.error(`Failed to create instructor ${item.name}:`, error);
    }
  }

  console.info('Instructors seed complete.');
};