'use client'

import { useFormFields } from '@payloadcms/ui'

const getPagePath = (slugValue: unknown): string => {
  if (typeof slugValue !== 'string') {
    return '/'
  }

  const trimmedSlug = slugValue.trim()

  if (!trimmedSlug || trimmedSlug === 'home') {
    return '/'
  }

  return `/${trimmedSlug}`
}

export const PageURLPreview = () => {
  const slug = useFormFields(([fields]) => fields?.slug?.value)
  const pagePath = getPagePath(slug)

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Page URL</p>
      <code
        style={{
          display: 'inline-block',
          marginTop: '0.375rem',
          padding: '0.375rem 0.5rem',
          borderRadius: 6,
          border: '1px solid var(--theme-elevation-200)',
          backgroundColor: 'var(--theme-elevation-50)',
          fontSize: '0.875rem',
        }}
      >
        {pagePath}
      </code>
    </div>
  )
}

export default PageURLPreview
