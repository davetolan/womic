import type { SiteSetting } from '@/payload-types'

export const fontOptions = [
  { label: 'Patrick Hand', value: 'patrickHand' },
  { label: 'Inter', value: 'inter' },
  { label: 'Lora', value: 'lora' },
] as const

export type FontOption = (typeof fontOptions)[number]['value']

export const defaultFont: FontOption = 'patrickHand'

export const fontOverrideOptions = [{ label: 'Use site default', value: 'default' }, ...fontOptions] as const

const fontClassMap: Record<FontOption, string> = {
  inter: 'font-theme-inter',
  lora: 'font-theme-lora',
  patrickHand: 'font-theme-patrick-hand',
}

const isFontOption = (value?: string | null): value is FontOption => {
  return Boolean(value && fontClassMap[value as FontOption])
}

export const getSiteFont = (settings?: SiteSetting | null): FontOption => {
  const selectedFont = settings?.defaultFont

  if (isFontOption(selectedFont)) {
    return selectedFont
  }

  return defaultFont
}

export const getFontClassName = (font: FontOption): string => fontClassMap[font]

export const getEffectiveFontClassName = (args: {
  defaultFont: FontOption
  override?: string | null
}): string => {
  const font = isFontOption(args.override) ? args.override : args.defaultFont

  return getFontClassName(font)
}
