'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const brand = data?.brand
  const style = data?.style
  const colors = data?.colors

  const isSticky = Boolean(style?.sticky)
  const showBottomBorder = Boolean(style?.showBottomBorder)
  const showSearch = style?.showSearch !== false
  const navAlignment = style?.navAlignment || 'right'
  const containerWidth = style?.containerWidth || 'default'
  const variant = style?.variant || 'default'
  const ctaLink = data?.ctaLink?.enabled ? data?.ctaLink?.link : null
  const height = style?.height?.trim()

  const logoMedia = brand?.logoMedia
  const logoMediaResource = typeof logoMedia === 'object' && logoMedia !== null ? logoMedia : null

  const headerShellClasses: Record<string, string> = {
    default: 'text-foreground',
    light: 'bg-white/95 text-zinc-900 backdrop-blur-sm shadow-sm',
    dark: 'bg-zinc-950 text-zinc-100 shadow-sm',
    glass: 'bg-white/15 text-white backdrop-blur-md shadow-sm',
  }

  const linkColorClasses: Record<string, string> = {
    default: 'text-foreground hover:text-primary',
    light: 'text-zinc-700 hover:text-zinc-900',
    dark: 'text-zinc-200 hover:text-white',
    glass: 'text-zinc-100 hover:text-white',
  }

  const searchColorClasses: Record<string, string> = {
    default: 'text-primary',
    light: 'text-zinc-700',
    dark: 'text-zinc-200',
    glass: 'text-zinc-100',
  }

  const headerInlineStyle: React.CSSProperties = {
    ...(colors?.backgroundColor ? { backgroundColor: colors.backgroundColor } : {}),
    ...(colors?.textColor ? { color: colors.textColor } : {}),
    ...(showBottomBorder && colors?.borderColor ? { borderColor: colors.borderColor } : {}),
    ...(height ? { minHeight: height } : {}),
  }

  const linkInlineStyle: React.CSSProperties | undefined = colors?.linkColor
    ? { color: colors.linkColor }
    : undefined
  const searchInlineStyle: React.CSSProperties | undefined = colors?.searchIconColor
    ? { color: colors.searchIconColor }
    : undefined
  const mutedInlineStyle: React.CSSProperties | undefined = colors?.mutedTextColor
    ? { color: colors.mutedTextColor }
    : undefined
  const ctaInlineStyle: React.CSSProperties | undefined =
    colors?.ctaBackgroundColor || colors?.ctaTextColor
      ? {
          ...(colors?.ctaBackgroundColor ? { backgroundColor: colors.ctaBackgroundColor } : {}),
          ...(colors?.ctaTextColor ? { color: colors.ctaTextColor } : {}),
        }
      : undefined

  return (
    <header
      className={cn(
        'relative z-20 transition-colors',
        isSticky ? 'sticky top-0 backdrop-blur-sm' : null,
        showBottomBorder ? 'border-b border-border/60' : null,
        headerShellClasses[variant],
      )}
      style={headerInlineStyle}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className={cn(containerWidth === 'wide' ? 'mx-auto max-w-screen-2xl px-6' : 'container')}>
        <div
          className={cn('py-6 flex items-center gap-6', navAlignment === 'left' ? 'justify-start' : 'justify-between')}
          style={height ? { minHeight: '100%' } : undefined}
        >
          <Link className="flex items-center gap-3 min-w-0" href="/">
            {logoMediaResource ? (
              <Media
                resource={logoMediaResource}
                htmlElement={null}
                alt={brand?.logoAlt || logoMediaResource.alt || 'Site logo'}
                imgClassName="h-auto w-auto max-h-20 max-w-[260px] object-contain"
                priority
              />
            ) : null}
            {brand?.showTitle ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{brand?.title || 'Site Title'}</span>
                {brand?.subtitle ? (
                  <span
                    className={cn(
                      'block truncate text-xs',
                      variant === 'dark' || variant === 'glass' ? 'text-zinc-300' : 'text-zinc-500',
                    )}
                    style={mutedInlineStyle}
                  >
                    {brand.subtitle}
                  </span>
                ) : null}
              </span>
            ) : null}
          </Link>
          <HeaderNav
            data={data}
            className={cn(navAlignment === 'left' ? 'ml-auto' : null)}
            linkClassName={linkColorClasses[variant]}
            linkStyle={linkInlineStyle}
            searchClassName={searchColorClasses[variant]}
            searchStyle={searchInlineStyle}
            showSearch={showSearch}
            ctaLink={ctaLink}
            ctaClassName="text-sm"
            ctaStyle={ctaInlineStyle}
          />
        </div>
      </div>
    </header>
  )
}
