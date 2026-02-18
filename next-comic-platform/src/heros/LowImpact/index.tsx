import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      style?: Page['hero']['style']
      colors?: Page['hero']['colors']
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, style, colors }) => {
  const containerWidthClasses: Record<string, string> = {
    default: 'container',
    wide: 'mx-auto w-full max-w-[1400px] px-4 md:px-6',
  }
  const contentWidthClasses: Record<string, string> = {
    narrow: 'max-w-[34rem]',
    default: 'max-w-[48rem]',
    wide: 'max-w-[64rem]',
  }

  const contentAlignment = style?.contentAlignment || 'left'
  const containerWidth = style?.containerWidth || 'default'
  const contentWidth = style?.contentWidth || 'default'
  const verticalPadding = style?.verticalPadding || 'default'

  const sectionInlineStyle: React.CSSProperties = {
    ...(colors?.backgroundColor ? { backgroundColor: colors.backgroundColor } : {}),
    ...(colors?.textColor ? { color: colors.textColor } : {}),
  }

  const contentPaddingClass =
    verticalPadding === 'compact'
      ? 'py-10 md:py-12'
      : verticalPadding === 'spacious'
        ? 'py-20 md:py-24'
        : 'py-16 md:py-18'

  return (
    <div
      className={`${containerWidthClasses[containerWidth] || containerWidthClasses.default} ${contentPaddingClass}`}
      style={sectionInlineStyle}
    >
      <div
        className={`${contentWidthClasses[contentWidth] || contentWidthClasses.default} ${contentAlignment === 'center' ? 'mx-auto text-center' : ''}`}
      >
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
