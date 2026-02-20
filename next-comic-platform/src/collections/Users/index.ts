import type { Access, CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

const allowUserCreation: Access = async ({ req }) => {
  if (req.user) {
    return true
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })

  return totalDocs === 0
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: allowUserCreation,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    hideAPIURL: true,
    description: 'Admin user accounts with access to edit site content.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
