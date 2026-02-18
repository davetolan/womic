import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'
import { revalidateEpisode, revalidateEpisodeDelete } from './Episodes/hooks/revalidateEpisode'

type EpisodePageRow = {
  altText?: string | null
  image?: number | string | { id?: number | string; alt?: string | null } | null
}

const populatePageAltTextFromMedia = async <
  TData extends {
    pages?: EpisodePageRow[] | null
  } | null,
>(
  data: TData,
  payload: {
    findByID: (args: { collection: 'media'; id: number | string; depth?: number }) => Promise<{
      alt?: string | null
    }>
  },
): Promise<TData> => {
  if (!data || !Array.isArray(data.pages) || data.pages.length === 0) {
    return data
  }

  const mediaAltByID = new Map<number | string, string>()

  const pages = await Promise.all(
    data.pages.map(async (page) => {
      if (!page || typeof page !== 'object') {
        return page
      }

      if (typeof page.altText === 'string' && page.altText.trim().length > 0) {
        return page
      }

      const image = page.image
      if (!image) {
        return page
      }

      if (typeof image === 'object') {
        const mediaAlt = typeof image.alt === 'string' ? image.alt.trim() : ''
        if (mediaAlt) {
          return { ...page, altText: mediaAlt }
        }
      }

      const mediaID =
        typeof image === 'object'
          ? image?.id
          : typeof image === 'number' || typeof image === 'string'
            ? image
            : undefined

      if (mediaID === undefined || mediaID === null || mediaID === '') {
        return page
      }

      let mediaAlt = mediaAltByID.get(mediaID)
      if (mediaAlt === undefined) {
        const mediaDoc = await payload.findByID({
          collection: 'media',
          id: mediaID,
          depth: 0,
        })
        mediaAlt = typeof mediaDoc?.alt === 'string' ? mediaDoc.alt.trim() : ''
        mediaAltByID.set(mediaID, mediaAlt)
      }

      if (!mediaAlt) {
        return page
      }

      return { ...page, altText: mediaAlt }
    }),
  )

  return { ...data, pages }
}

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  defaultSort: 'episodeNumber',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['episodeNumber', 'title', 'publishDate', 'updatedAt'],
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
      async ({ data, originalDoc, operation, req }) => {
        if (
          operation === 'update' &&
          originalDoc?.slug &&
          data?.slug &&
          data.slug !== originalDoc.slug &&
          originalDoc?._status === 'published'
        ) {
          throw new Error('Slug cannot be changed after an episode has been published.')
        }

        return populatePageAltTextFromMedia(data, req.payload)
      },
    ],
    beforeValidate: [
      async ({ data, req }) => {
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }
        if (data?.title && !data?.seoTitle) {
          data.seoTitle = data.title
        }
        return populatePageAltTextFromMedia(data, req.payload)
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
      revalidateEpisode,
    ],
    afterDelete: [revalidateEpisodeDelete],
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
