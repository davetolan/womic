import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description:
          'Select from Media. Recommended: High Impact 2400x1400px+, Medium Impact 1600x1000px+, JPG/WebP under 800KB.',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'style',
      type: 'group',
      fields: [
        {
          name: 'containerWidth',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Wide', value: 'wide' },
          ],
        },
        {
          name: 'contentAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
        {
          name: 'contentWidth',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Narrow', value: 'narrow' },
            { label: 'Default', value: 'default' },
            { label: 'Wide', value: 'wide' },
          ],
        },
        {
          name: 'verticalPadding',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Default', value: 'default' },
            { label: 'Spacious', value: 'spacious' },
          ],
        },
        {
          name: 'mediaHeight',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Short', value: 'short' },
            { label: 'Default', value: 'default' },
            { label: 'Tall', value: 'tall' },
            { label: 'Full Viewport', value: 'full' },
          ],
          admin: {
            condition: (_, { type } = {}) => type === 'highImpact',
          },
        },
        {
          name: 'mediaFit',
          type: 'select',
          defaultValue: 'cover',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
          ],
          admin: {
            condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
          },
        },
        {
          name: 'mediaPosition',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
          },
        },
        {
          name: 'showOverlay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (_, { type } = {}) => type === 'highImpact',
          },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 90,
          defaultValue: 45,
          admin: {
            condition: (_, { type, style } = {}) =>
              type === 'highImpact' && (style?.showOverlay ?? true),
            description: 'Overlay darkness percentage for high impact hero.',
          },
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          admin: {
            description: 'Hero background color (hex, rgb, hsl, or CSS color name).',
            placeholder: '#111827',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          admin: {
            description: 'Hero text color.',
            placeholder: '#f9fafb',
          },
        },
        {
          name: 'linkColor',
          type: 'text',
          admin: {
            description: 'Hero link/button text color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'overlayColor',
          type: 'text',
          admin: {
            condition: (_, { type } = {}) => type === 'highImpact',
            description: 'Overlay color for high impact hero.',
            placeholder: '#000000',
          },
        },
      ],
    },
  ],
  label: false,
}
