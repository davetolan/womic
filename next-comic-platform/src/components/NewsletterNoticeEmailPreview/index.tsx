'use client'

import { useFormFields } from '@payloadcms/ui'

const resolveImageURL = (image: unknown): string | null => {
  if (!image || typeof image !== 'object') {
    return null
  }

  const imageRecord = image as { url?: unknown }

  if (typeof imageRecord.url !== 'string' || imageRecord.url.length === 0) {
    return null
  }

  return imageRecord.url
}

const getStringValue = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback

export const NewsletterNoticeEmailPreview = () => {
  const subject = useFormFields(([fields]) => fields?.subject?.value)
  const message = useFormFields(([fields]) => fields?.message?.value)
  const archivePath = useFormFields(([fields]) => fields?.archivePath?.value)
  const image = useFormFields(([fields]) => fields?.image?.value)
  const backgroundColor = useFormFields(([fields]) => fields?.['appearance.backgroundColor']?.value)
  const textColor = useFormFields(([fields]) => fields?.['appearance.textColor']?.value)
  const buttonColor = useFormFields(([fields]) => fields?.['appearance.buttonColor']?.value)
  const buttonTextColor = useFormFields(([fields]) => fields?.['appearance.buttonTextColor']?.value)
  const ctaLabel = useFormFields(([fields]) => fields?.['appearance.ctaLabel']?.value)

  const resolvedMessage = getStringValue(message, 'Your newsletter message preview will appear here.')
  const resolvedArchivePath = getStringValue(archivePath, '/archive')
  const resolvedSubject = getStringValue(subject, 'Newsletter notice subject')
  const resolvedCtaLabel = getStringValue(ctaLabel, 'Read now')
  const resolvedImageURL = resolveImageURL(image)

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <h4 style={{ marginBottom: '0.5rem' }}>Email preview</h4>
      <p style={{ marginTop: 0, marginBottom: '0.75rem', opacity: 0.8 }}>
        This shows an approximation of the newsletter email for quick review before sending.
      </p>

      <div
        style={{
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: 12,
          background: 'var(--theme-bg)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--theme-elevation-200)' }}>
          <strong>Subject:</strong> {resolvedSubject}
        </div>

        <div
          style={{
            margin: '1rem',
            borderRadius: 12,
            background: getStringValue(backgroundColor, '#ffffff'),
            color: getStringValue(textColor, '#111827'),
            padding: '1rem',
          }}
        >
          {resolvedImageURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Selected newsletter preview"
              src={resolvedImageURL}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 640,
                height: 'auto',
                marginBottom: '1rem',
                borderRadius: 8,
              }}
            />
          ) : null}

          <p style={{ marginTop: 0, marginBottom: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {resolvedMessage}
          </p>

          <a
            href={resolvedArchivePath}
            style={{
              display: 'inline-block',
              background: getStringValue(buttonColor, '#111827'),
              color: getStringValue(buttonTextColor, '#ffffff'),
              padding: '0.75rem 1.125rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {resolvedCtaLabel}
          </a>
        </div>
      </div>
    </div>
  )
}

export default NewsletterNoticeEmailPreview
