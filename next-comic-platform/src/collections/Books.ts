import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const Books: CollectionConfig = {
  slug: 'books',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
}
