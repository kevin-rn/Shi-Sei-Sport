import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Gebruiker',
    plural: 'Gebruikers',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    description: 'Admin gebruikers met toegang tot het CMS',
  },
  access: {
    read: ({ req }: { req: { user?: unknown } }) => !!req.user,
  },
  fields: [

  ],
};