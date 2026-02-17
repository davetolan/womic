import type { CollectionConfig, PayloadRequest } from 'payload'

import { authenticated } from '../access/authenticated'
import { getServerSideURL } from '../utilities/getURL'

const RESEND_API_URL = 'https://api.resend.com/emails'

const getPathFromSlug = (
  slug: string | null | undefined,
  archivePath: string | null | undefined,
): string => {
  if (slug) {
    return `/episode/${slug}/1`
  }

  if (archivePath && archivePath.startsWith('/')) {
    return archivePath
  }

  return '/archive'
}

const sendEmail = async ({
  from,
  to,
  subject,
  html,
  text,
  apiKey,
}: {
  from: string
  to: string
  subject: string
  html: string
  text: string
  apiKey: string
}) => {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Resend error (${response.status}): ${errorBody}`)
  }
}

const resolveEpisodePath = async ({
  episode,
  archivePath,
  req,
}: {
  episode: { slug?: string | null } | number | null | undefined
  archivePath: string | null | undefined
  req: PayloadRequest
}) => {
  if (episode && typeof episode === 'object') {
    return getPathFromSlug(episode.slug, archivePath)
  }

  if (typeof episode === 'number') {
    const resolvedEpisode = await req.payload.findByID({
      collection: 'episodes',
      id: episode,
      depth: 0,
      select: {
        slug: true,
      },
    })

    return getPathFromSlug(resolvedEpisode?.slug, archivePath)
  }

  return getPathFromSlug(null, archivePath)
}

export const NewsletterNotices: CollectionConfig = {
  slug: 'newsletter-notices',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'sentAt', 'recipientCount', 'updatedAt'],
    group: 'Marketing',
    hideAPIURL: true,
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main notice body sent to all subscribers.',
      },
    },
    {
      name: 'episode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: {
        description: 'Optional. If selected, email CTA links to page 1 of this episode.',
      },
    },
    {
      name: 'archivePath',
      type: 'text',
      defaultValue: '/archive',
      admin: {
        description: 'Used when no episode is selected. Must be a relative path.',
      },
    },
    {
      name: 'sendNotice',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check and save to send this notice to all newsletter subscribers.',
      },
    },
    {
      name: 'recipientCount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ context, data, originalDoc, req }) => {
        if (context?.skipNewsletterSend || !data?.sendNotice) {
          return data
        }

        const resendApiKey = process.env.RESEND_API_KEY
        const resendFromEmail = process.env.RESEND_FROM_EMAIL

        if (!resendApiKey || !resendFromEmail) {
          throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL in environment.')
        }

        const emails: string[] = []
        let page = 1
        let totalPages = 1

        do {
          const result = await req.payload.find({
            collection: 'newsletter-subscribers',
            depth: 0,
            limit: 100,
            page,
            select: {
              email: true,
            },
          })

          emails.push(
            ...result.docs
              .map((subscriber) => subscriber.email?.trim().toLowerCase())
              .filter((email): email is string => Boolean(email)),
          )

          totalPages = result.totalPages
          page += 1
        } while (page <= totalPages)

        const uniqueEmails = [...new Set(emails)]
        const subject = data.subject || originalDoc?.subject
        const message = data.message || originalDoc?.message
        const archivePath = data.archivePath || originalDoc?.archivePath
        const episode = data.episode ?? originalDoc?.episode

        if (!subject || !message) {
          throw new Error('Subject and message are required to send a newsletter notice.')
        }

        const sentAt = new Date().toISOString()

        if (uniqueEmails.length === 0) {
          return {
            ...(data || {}),
            sendNotice: false,
            recipientCount: 0,
            sentAt,
          }
        }

        const targetPath = await resolveEpisodePath({
          episode: episode as { slug?: string | null } | number | null | undefined,
          archivePath,
          req,
        })
        const episodeURL = new URL(targetPath, getServerSideURL()).toString()
        const html = `<p>${message}</p><p><a href="${episodeURL}">Read now</a></p>`
        const text = `${message}\n\nRead now: ${episodeURL}`

        for (const email of uniqueEmails) {
          await sendEmail({
            from: resendFromEmail,
            to: email,
            subject,
            html,
            text,
            apiKey: resendApiKey,
          })
        }

        return {
          ...(data || {}),
          sendNotice: false,
          recipientCount: uniqueEmails.length,
          sentAt,
        }
      },
    ],
  },
}
