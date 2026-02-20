import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer, SocialLink } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getCachedSocialLinks } from '@/utilities/getSocialLinks'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const socialLinks = await getCachedSocialLinks()()

  type VisibleSocialLink = {
    id: string | number
    label: string
    url: string
  }

  const navItems = footerData?.navItems || []
  const legalLinks = footerData?.legal?.legalLinks || []
  const selectedSocialLinks: VisibleSocialLink[] = (footerData?.socialLinks || [])
    .filter(
      (item): item is SocialLink =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.label === 'string' &&
        typeof item.url === 'string',
    )
    .map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
    }))

  const collectionSocialLinks: VisibleSocialLink[] = socialLinks
    .filter((item) => typeof item.label === 'string' && typeof item.url === 'string')
    .map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
    }))

  const visibleSocialLinks = selectedSocialLinks.length > 0 ? selectedSocialLinks : collectionSocialLinks

  const brand = footerData?.brand
  const style = footerData?.style
  const colors = footerData?.colors
  const variant = style?.variant || 'dark'
  const showThemeSelector = style?.showThemeSelector !== false
  const height = style?.height?.trim()
  const backgroundMedia =
    typeof footerData?.backgroundMedia === 'object' && footerData.backgroundMedia !== null
      ? footerData.backgroundMedia
      : null
  const logoMedia =
    typeof brand?.logoMedia === 'object' && brand.logoMedia !== null ? brand.logoMedia : null

  const shellClasses: Record<string, string> = {
    dark: 'border-t border-border bg-black dark:bg-card text-white',
    light: 'border-t border-zinc-200 bg-zinc-50 text-zinc-900',
    minimal: 'border-t border-border bg-background text-foreground',
  }

  const mutedClasses: Record<string, string> = {
    dark: 'text-zinc-300',
    light: 'text-zinc-600',
    minimal: 'text-muted-foreground',
  }

  const linkClasses: Record<string, string> = {
    dark: 'text-white underline-offset-4 hover:underline',
    light: 'text-zinc-800 underline-offset-4 hover:underline',
    minimal: 'text-foreground underline-offset-4 hover:underline',
  }

  const footerInlineStyle: React.CSSProperties = {
    ...(colors?.backgroundColor ? { backgroundColor: colors.backgroundColor } : {}),
    ...(colors?.textColor ? { color: colors.textColor } : {}),
    ...(colors?.borderColor ? { borderColor: colors.borderColor } : {}),
    ...(height ? { minHeight: height } : {}),
  }
  const linkInlineStyle: React.CSSProperties | undefined = colors?.linkColor
    ? { color: colors.linkColor }
    : undefined
  const mutedInlineStyle: React.CSSProperties | undefined = colors?.mutedTextColor
    ? { color: colors.mutedTextColor }
    : undefined

  return (
    <footer className={cn('mt-auto relative overflow-hidden', shellClasses[variant])} style={footerInlineStyle}>
      {backgroundMedia ? (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Media
            resource={backgroundMedia}
            fill
            imgClassName="h-full w-full object-cover"
            alt={backgroundMedia.alt || 'Footer background'}
            priority
          />
        </div>
      ) : null}
      <div
        className="container relative py-8 gap-8 flex flex-col"
        style={height ? { minHeight: '100%' } : undefined}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Link className="flex items-start gap-3 max-w-xl" href="/">
            {logoMedia ? (
              <Media
                resource={logoMedia}
                htmlElement={null}
                alt={brand?.logoAlt || logoMedia.alt || 'Site logo'}
                imgClassName="h-auto w-auto max-h-20 max-w-[260px] object-contain"
                priority
              />
            ) : null}
            {(brand?.title || brand?.description) ? (
              <span className="block">
                {brand?.title ? <span className="block text-sm font-semibold">{brand.title}</span> : null}
                {brand?.description ? (
                  <span className={cn('mt-1 block text-sm leading-6', mutedClasses[variant])} style={mutedInlineStyle}>
                    {brand.description}
                  </span>
                ) : null}
              </span>
            ) : null}
          </Link>

          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            {showThemeSelector ? <ThemeSelector /> : null}
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink className={linkClasses[variant]} key={i} {...link} style={linkInlineStyle} />
              })}
            </nav>
          </div>
        </div>

        {visibleSocialLinks.length > 0 ? (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={mutedClasses[variant]} style={mutedInlineStyle}>
              {footerData?.socialHeading || 'Follow:'}
            </span>
            {visibleSocialLinks.map((item) => (
              <a
                key={String(item.id)}
                href={item.url || '#'}
                target="_blank"
                rel="noreferrer"
                className={linkClasses[variant]}
                style={linkInlineStyle}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        {(legalLinks.length > 0 || footerData?.legal?.copyright) ? (
          <div className={cn('pt-4 border-t flex flex-col gap-3 md:flex-row md:justify-between md:items-center', variant === 'light' ? 'border-zinc-200' : 'border-border/60')}>
            {footerData?.legal?.copyright ? (
              <p className={cn('text-xs', mutedClasses[variant])} style={mutedInlineStyle}>
                {footerData.legal.copyright}
              </p>
            ) : (
              <span />
            )}
            {legalLinks.length > 0 ? (
              <nav className="flex flex-wrap gap-4 text-xs">
                {legalLinks.map(({ link }, i) => {
                  return <CMSLink key={i} className={linkClasses[variant]} {...link} style={linkInlineStyle} />
                })}
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
