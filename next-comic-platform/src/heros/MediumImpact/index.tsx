import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText, style, colors }) => {
  const containerWidthClasses: Record<string, string> = {
    default: 'container',
    wide: 'mx-auto w-full max-w-[1400px] px-4 md:px-6',
  }
  const contentWidthClasses: Record<string, string> = {
    narrow: 'max-w-[34rem]',
    default: 'max-w-[48rem]',
    wide: 'max-w-[64rem]',
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
  const contentPaddingClass =
    verticalPadding === 'compact'
      ? 'py-8 md:py-10'
      : verticalPadding === 'spacious'
        ? 'py-16 md:py-20'
        : 'py-12 md:py-14'

  return (
    <div style={sectionInlineStyle}>
      <div
        className={`${containerWidthClasses[containerWidth] || containerWidthClasses.default} ${contentPaddingClass}`}
      >
        <div
          className={`${contentWidthClasses[contentWidth] || contentWidthClasses.default} ${contentAlignment === 'center' ? 'mx-auto text-center' : ''}`}
          style={textInlineStyle}
        >
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

          {Array.isArray(links) && links.length > 0 && (
            <ul className={`flex flex-wrap gap-4 ${contentAlignment === 'center' ? 'justify-center' : 'justify-start'}`}>
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
      <div className={containerWidthClasses[containerWidth] || containerWidthClasses.default}>
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName={`${fitClass} ${objectPositionClass}`}
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3" style={textInlineStyle}>
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
