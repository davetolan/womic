import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Chapter, Episode, Page } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  style?: React.CSSProperties
  reference?: {
    relationTo: 'pages' | 'episodes' | 'chapters'
    value: Page | Episode | Chapter | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    style,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? reference?.relationTo === 'episodes'
        ? `/episode/${reference.value.slug}/1`
        : reference?.relationTo === 'chapters'
          ? `/chapter/${reference.value.slug}`
          : reference.value.slug === 'home'
            ? '/'
            : `/${reference.value.slug}`
      : url

  const normalizedHref =
    typeof href === 'string'
      ? href.startsWith('/') ||
        href.startsWith('#') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
        ? href
        : /^localhost(?::\d+)?(\/.*)?$/i.test(href)
          ? `http://${href}`
          : `/${href.replace(/^\/+/, '')}`
      : href

  if (!normalizedHref) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={normalizedHref} style={style} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={normalizedHref} style={style} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
