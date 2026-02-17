import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    hideAPIURL: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brand',
      type: 'group',
      fields: [
        {
          name: 'logoMedia',
          type: 'relationship',
          relationTo: 'media',
          admin: {
            description:
              'Upload a custom logo from Media. Recommended: 520x160px (horizontal), transparent PNG/WebP or SVG, under 200KB.',
          },
        },
        {
          name: 'logoAlt',
          type: 'text',
          admin: {
            description: 'Accessible alt text for the custom logo image.',
          },
        },
        {
          name: 'showTitle',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Brand title shown next to the logo.',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Optional subtitle shown under the title.',
          },
        },
      ],
    },
    {
      name: 'style',
      type: 'group',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Light Surface', value: 'light' },
            { label: 'Dark Surface', value: 'dark' },
            { label: 'Glass', value: 'glass' },
          ],
        },
        {
          name: 'sticky',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'showBottomBorder',
          type: 'checkbox',
          defaultValue: false,
        },
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
          name: 'navAlignment',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Right', value: 'right' },
            { label: 'Left', value: 'left' },
          ],
        },
        {
          name: 'showSearch',
          type: 'checkbox',
          defaultValue: true,
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
            description: 'Header background color (hex, rgb, hsl, or CSS color name).',
            placeholder: '#111827',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          admin: {
            description: 'Default header text color.',
            placeholder: '#f9fafb',
          },
        },
        {
          name: 'mutedTextColor',
          type: 'text',
          admin: {
            description: 'Muted text color (for subtitle).',
            placeholder: '#9ca3af',
          },
        },
        {
          name: 'linkColor',
          type: 'text',
          admin: {
            description: 'Navigation link color.',
            placeholder: '#e5e7eb',
          },
        },
        {
          name: 'searchIconColor',
          type: 'text',
          admin: {
            description: 'Search icon color.',
            placeholder: '#e5e7eb',
          },
        },
        {
          name: 'borderColor',
          type: 'text',
          admin: {
            description: 'Header border color when bottom border is enabled.',
            placeholder: '#374151',
          },
        },
        {
          name: 'ctaBackgroundColor',
          type: 'text',
          admin: {
            description: 'Optional CTA button background color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'ctaTextColor',
          type: 'text',
          admin: {
            description: 'Optional CTA button text color.',
            placeholder: '#111827',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'ctaLink',
      type: 'group',
      admin: {
        description: 'Optional call-to-action button in the header.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        link({
          overrides: {
            name: 'link',
          },
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
