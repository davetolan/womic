import type { CollectionConfig, PayloadRequest } from 'payload'

import { authenticated } from '../access/authenticated'
import { getServerSideURL } from '../utilities/getURL'

const RESEND_API_URL = 'https://api.resend.com/emails'

type MediaReference = {
  id?: number | null
  url?: string | null
  alt?: string | null
  filename?: string | null
}

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

const resolveNoticeImage = async ({
  imageRef,
  req,
}: {
  imageRef: number | MediaReference | null | undefined
  req: PayloadRequest
}) => {
  if (!imageRef) {
    return null
  }

  if (typeof imageRef === 'number') {
    const media = await req.payload.findByID({
      collection: 'media',
      id: imageRef,
      depth: 0,
      select: {
        url: true,
        alt: true,
        filename: true,
      },
    })

    if (!media.url) {
      return null
    }

    return {
      url: media.url,
      alt: media.alt,
      filename: media.filename,
    }
  }

  if (!imageRef.url) {
    return null
  }

  return {
    url: imageRef.url,
    alt: imageRef.alt,
    filename: imageRef.filename,
  }
}

const escapeHTML = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export const NewsletterNotices: CollectionConfig = {
  slug: 'newsletter-notices',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'sentAt', 'recipientCount', 'updatedAt'],
    group: 'Marketing',
    hideAPIURL: true,
    description: 'Create and send announcement emails to all newsletter subscribers.',
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
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Optional. Add an image to include in the notice email.',
      },
    },
    {
      name: 'appearance',
      type: 'group',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Outer card background color (hex, rgb, or any valid CSS color).',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          defaultValue: '#111827',
          admin: {
            description: 'Body text color.',
          },
        },
        {
          name: 'buttonColor',
          type: 'text',
          defaultValue: '#111827',
          admin: {
            description: 'CTA button background color.',
          },
        },
        {
          name: 'buttonTextColor',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'CTA button text color.',
          },
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Read now',
          admin: {
            description: 'Call-to-action label used in the email button.',
          },
        },
      ],
    },
    {
      name: 'emailPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/NewsletterNoticeEmailPreview',
        },
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
        const image = (data.image ?? originalDoc?.image ?? null) as number | MediaReference | null
        const appearance = {
          backgroundColor: data.appearance?.backgroundColor || originalDoc?.appearance?.backgroundColor || '#ffffff',
          textColor: data.appearance?.textColor || originalDoc?.appearance?.textColor || '#111827',
          buttonColor: data.appearance?.buttonColor || originalDoc?.appearance?.buttonColor || '#111827',
          buttonTextColor:
            data.appearance?.buttonTextColor || originalDoc?.appearance?.buttonTextColor || '#ffffff',
          ctaLabel: data.appearance?.ctaLabel || originalDoc?.appearance?.ctaLabel || 'Read now',
        }

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
        const resolvedImage = await resolveNoticeImage({ imageRef: image, req })
        const imageHTML = resolvedImage
          ? `<img src="${resolvedImage.url}" alt="${escapeHTML(resolvedImage.alt || resolvedImage.filename || 'Newsletter image')}" style="display:block;width:100%;max-width:640px;height:auto;margin:0 auto 16px;border-radius:8px;" />`
          : ''

        const ctaLabel = escapeHTML(appearance.ctaLabel)
        const messageHTML = escapeHTML(message).replaceAll('\n', '<br />')
        const html = `
          <div style="background:${appearance.backgroundColor};color:${appearance.textColor};padding:24px;border-radius:12px;">
            ${imageHTML}
            <p style="margin:0 0 16px;line-height:1.6;">${messageHTML}</p>
            <a href="${episodeURL}" style="display:inline-block;background:${appearance.buttonColor};color:${appearance.buttonTextColor};padding:12px 18px;text-decoration:none;border-radius:8px;font-weight:600;">${ctaLabel}</a>
          </div>
        `
        const text = `${message}\n\n${appearance.ctaLabel}: ${episodeURL}`

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
