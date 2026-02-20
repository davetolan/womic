import React from 'react'
import type { CSSProperties } from 'react'

import type { NewsletterSignupBlock as NewsletterSignupBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { NewsletterSignupForm } from '@/components/NewsletterSignupForm'
import { cn } from '@/utilities/ui'

export const NewsletterSignupBlock: React.FC<NewsletterSignupBlockProps> = ({
  heading,
  description,
  labels,
  layout,
  colors,
  backgroundMedia,
  backgroundStyle,
}) => {
  const widthClasses: Record<string, string> = {
    default: 'container',
    narrow: 'mx-auto w-full max-w-3xl px-4 sm:px-6',
    wide: 'mx-auto w-full max-w-6xl px-4 sm:px-6',
    full: 'w-full px-4 sm:px-6',
  }

  const cardPaddingClasses: Record<string, string> = {
    compact: 'p-4 sm:p-6',
    default: 'p-6 sm:p-8',
    spacious: 'p-8 sm:p-12',
  }

  const cardRadiusClasses: Record<string, string> = {
    rounded: 'rounded-2xl',
    pill: 'rounded-3xl',
    square: 'rounded-none',
  }

  const inputRadiusClasses: Record<string, string> = {
    rounded: 'rounded-lg',
    pill: 'rounded-full',
    square: 'rounded-none',
  }

  const sectionWidth = layout?.sectionWidth || 'default'
  const textAlignment = layout?.textAlignment || 'left'
  const formLayout = layout?.formLayout || 'row'
  const padding = layout?.padding || 'default'
  const cornerStyle = layout?.cornerStyle || 'rounded'

  const hasBackgroundMedia = backgroundMedia && typeof backgroundMedia === 'object'
  const overlayOpacity = typeof backgroundStyle?.overlayOpacity === 'number' ? backgroundStyle.overlayOpacity : 30

  const cardStyle: CSSProperties = {
    ...(colors?.cardBackgroundColor ? { backgroundColor: colors.cardBackgroundColor } : {}),
    ...(colors?.textColor ? { color: colors.textColor } : {}),
    ...(colors?.borderColor ? { borderColor: colors.borderColor } : {}),
  }

  const headingStyle: CSSProperties | undefined = colors?.textColor ? { color: colors.textColor } : undefined
  const bodyStyle: CSSProperties | undefined = colors?.mutedTextColor
    ? { color: colors.mutedTextColor }
    : colors?.textColor
      ? { color: colors.textColor }
      : undefined

  const inputStyle: CSSProperties = {
    ...(colors?.inputBackgroundColor ? { backgroundColor: colors.inputBackgroundColor } : {}),
    ...(colors?.inputTextColor ? { color: colors.inputTextColor } : {}),
    ...(colors?.inputBorderColor ? { borderColor: colors.inputBorderColor } : {}),
  }

  const buttonStyle: CSSProperties = {
    ...(colors?.buttonBackgroundColor ? { backgroundColor: colors.buttonBackgroundColor } : {}),
    ...(colors?.buttonTextColor ? { color: colors.buttonTextColor } : {}),
  }

  const overlayStyle: CSSProperties = {
    backgroundColor: backgroundStyle?.overlayColor || '#000000',
    opacity: Math.max(0, Math.min(90, overlayOpacity)) / 100,
  }

  return (
    <section className={widthClasses[sectionWidth] || widthClasses.default}>
      <div
        className={cn(
          'relative overflow-hidden border border-zinc-200 shadow-sm',
          cardPaddingClasses[padding] || cardPaddingClasses.default,
          cardRadiusClasses[cornerStyle] || cardRadiusClasses.rounded,
        )}
        style={cardStyle}
      >
        {hasBackgroundMedia ? (
          <div className="absolute inset-0 pointer-events-none">
            <Media
              resource={backgroundMedia}
              fill
              imgClassName="h-full w-full object-cover object-center"
              alt={backgroundMedia.alt || 'Newsletter background'}
              priority
            />
            {backgroundStyle?.showOverlay !== false ? <div className="absolute inset-0" style={overlayStyle} /> : null}
          </div>
        ) : null}

        <div className="relative z-10">
          <h2
            className={cn('text-2xl font-semibold tracking-tight', textAlignment === 'center' ? 'text-center' : 'text-left')}
            style={headingStyle}
          >
            {heading || 'Newsletter'}
          </h2>

          {description ? (
            <p
              className={cn(
                'mt-3 text-sm leading-6',
                textAlignment === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl text-left',
              )}
              style={bodyStyle}
            >
              {description}
            </p>
          ) : null}

          <NewsletterSignupForm
            emailPlaceholder={labels?.emailPlaceholder || undefined}
            submitLabel={labels?.submitLabel || undefined}
            submittingLabel={labels?.submittingLabel || undefined}
            successMessage={labels?.successMessage || undefined}
            errorMessage={labels?.errorMessage || undefined}
            successColor={colors?.successColor || undefined}
            errorColor={colors?.errorColor || undefined}
            formClassName={cn(
              formLayout === 'stacked' ? 'sm:flex-col' : '',
              textAlignment === 'center' ? 'sm:justify-center' : '',
            )}
            inputClassName={inputRadiusClasses[cornerStyle] || inputRadiusClasses.rounded}
            buttonClassName={inputRadiusClasses[cornerStyle] || inputRadiusClasses.rounded}
            inputStyle={inputStyle}
            buttonStyle={buttonStyle}
          />
        </div>
      </div>
    </section>
  )
}
