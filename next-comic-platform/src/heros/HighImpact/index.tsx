'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText, style, colors }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')

    return () => {
      setHeaderTheme(null)
    }
  }, [setHeaderTheme])

  const containerWidthClasses: Record<string, string> = {
    default: 'container',
    wide: 'mx-auto w-full max-w-[1400px] px-4 md:px-6',
  }
  const contentWidthClasses: Record<string, string> = {
    narrow: 'max-w-[28rem]',
    default: 'max-w-[36.5rem]',
    wide: 'max-w-[52rem]',
  }
  const mediaHeightClasses: Record<string, string> = {
    short: 'min-h-[55vh]',
    default: 'min-h-[80vh]',
    tall: 'min-h-[92vh]',
    full: 'min-h-screen',
  }
  const objectPositionClasses: Record<string, string> = {
    center: 'object-center',
    top: 'object-top',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right',
  }

  const contentAlignment = style?.contentAlignment || 'left'
  const containerWidth = style?.containerWidth || 'default'
  const contentWidth = style?.contentWidth || 'default'
  const verticalPadding = style?.verticalPadding || 'default'
  const mediaHeight = style?.mediaHeight || 'default'
  const showOverlay = style?.showOverlay !== false
  const overlayOpacity = typeof style?.overlayOpacity === 'number' ? style.overlayOpacity : 45
  const fitClass = style?.mediaFit === 'contain' ? 'object-contain' : 'object-cover'
  const objectPositionClass = objectPositionClasses[style?.mediaPosition || 'center'] || 'object-center'

  const sectionInlineStyle: React.CSSProperties = {
    ...(colors?.backgroundColor ? { backgroundColor: colors.backgroundColor } : {}),
    ...(colors?.textColor ? { color: colors.textColor } : {}),
  }
  const textInlineStyle: React.CSSProperties | undefined = colors?.textColor
    ? { color: colors.textColor }
    : undefined
  const linkInlineStyle: React.CSSProperties | undefined = colors?.linkColor
    ? { color: colors.linkColor }
    : undefined
  const overlayStyle: React.CSSProperties = {
    backgroundColor: colors?.overlayColor || '#000000',
    opacity: Math.max(0, Math.min(90, overlayOpacity)) / 100,
  }
  const contentPaddingClass =
    verticalPadding === 'compact'
      ? 'py-16 md:py-20'
      : verticalPadding === 'spacious'
        ? 'py-28 md:py-36'
        : 'py-24 md:py-28'

  return (
    <div
      className="relative flex items-center justify-center text-white"
      data-theme="dark"
      style={sectionInlineStyle}
    >
      {showOverlay ? <div className="absolute inset-0 z-0" style={overlayStyle} /> : null}
      <div
        className={`${containerWidthClasses[containerWidth] || containerWidthClasses.default} mb-8 z-10 relative flex ${contentAlignment === 'center' ? 'items-center justify-center text-center' : 'items-center justify-start text-left'} ${contentPaddingClass}`}
      >
        <div className={contentWidthClasses[contentWidth] || contentWidthClasses.default} style={textInlineStyle}>
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul
              className={`flex flex-wrap gap-4 ${contentAlignment === 'center' ? 'justify-center' : 'justify-start'}`}
            >
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} style={linkInlineStyle} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className={`${mediaHeightClasses[mediaHeight] || mediaHeightClasses.default} w-full select-none`}>
        {media && typeof media === 'object' && (
          <Media fill imgClassName={`-z-10 ${fitClass} ${objectPositionClass}`} priority resource={media} />
        )}
      </div>
    </div>
  )
}
