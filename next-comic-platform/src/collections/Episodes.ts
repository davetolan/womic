import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  defaultSort: 'episodeNumber',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['episodeNumber', 'title', 'publishDate', 'updatedAt'],
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
      validate: (value) => {
        if (!value || typeof value !== 'string') {
          return 'Slug is required.'
        }
        return true
      },
      admin: { position: 'sidebar' },
    },

    {
      name: 'episodeNumber',
      type: 'number',
      required: true,
      unique: true,
      validate: (value) => {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
          return 'Episode number must be a whole number greater than 0.'
        }
        return true
      },
      admin: {
        position: 'sidebar',
        description: 'Episode number (used for ordering).',
      },
    },
    {
      name: 'chapter',
      type: 'relationship',
      relationTo: 'chapters',
      admin: { position: 'sidebar' },
    },

    {
      name: 'publishDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Used with draft/published status and optional scheduled publishing.',
      },
    },

    {
      name: 'startHere',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Optional: mark this as the recommended entry point for new readers.',
      },
    },

    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'pages',
      type: 'array',
      required: true,
      minRows: 1,
      validate: (value) => {
        if (!Array.isArray(value) || value.length < 1) {
          return 'At least one page is required.'
        }
        return true
      },
      admin: {
        description: 'Pages are read in this order. Drag and drop rows to reorder.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload the page image for this page index.',
          },
        },
        { name: 'altText', type: 'text' },
        {
          name: 'pageTitle',
          type: 'text',
          admin: {
            description: 'Optional short title for this page.',
          },
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Optional caption or note shown with this page.',
          },
        },
      ],
    },

    {
      name: 'authorNotes',
      type: 'richText',
    },

    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Optional. Falls back to Episode title when blank.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'Optional. Frontend can fall back to site/comic description when blank.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (
          operation === 'update' &&
          originalDoc?.slug &&
          data?.slug &&
          data.slug !== originalDoc.slug &&
          originalDoc?._status === 'published'
        ) {
          throw new Error('Slug cannot be changed after an episode has been published.')
        }

        return data
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }
        if (data?.title && !data?.seoTitle) {
          data.seoTitle = data.title
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (!doc.startHere) {
          return doc
        }

        const otherStartHereEpisodes = await req.payload.find({
          collection: 'episodes',
          depth: 0,
          limit: 1000,
          pagination: false,
          where: {
            and: [
              {
                startHere: {
                  equals: true,
                },
              },
              {
                id: {
                  not_equals: doc.id,
                },
              },
            ],
          },
        })

        await Promise.all(
          otherStartHereEpisodes.docs.map((episode) =>
            req.payload.update({
              collection: 'episodes',
              id: episode.id,
              data: {
                startHere: false,
              },
            }),
          ),
        )

        return doc
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
