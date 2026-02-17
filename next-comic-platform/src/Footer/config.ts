import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
              'Upload a custom footer logo from Media. Recommended: 520x200px max, transparent PNG/WebP or SVG, under 200KB.',
          },
        },
        {
          name: 'logoAlt',
          type: 'text',
          admin: {
            description: 'Accessible alt text for the custom footer logo image.',
          },
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
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
          defaultValue: 'dark',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
            { label: 'Minimal', value: 'minimal' },
          ],
        },
        {
          name: 'showThemeSelector',
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
            description: 'Footer background color (hex, rgb, hsl, or CSS color name).',
            placeholder: '#000000',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          admin: {
            description: 'Default footer text color.',
            placeholder: '#f9fafb',
          },
        },
        {
          name: 'mutedTextColor',
          type: 'text',
          admin: {
            description: 'Muted footer text color.',
            placeholder: '#d4d4d8',
          },
        },
        {
          name: 'linkColor',
          type: 'text',
          admin: {
            description: 'Footer link color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'borderColor',
          type: 'text',
          admin: {
            description: 'Footer border color.',
            placeholder: '#27272a',
          },
        },
      ],
    },
    {
      name: 'backgroundMedia',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description:
          'Optional footer background image from Media. Recommended: 2400x1200px (2:1) minimum, JPG/WebP, under 800KB.',
      },
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
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socialHeading',
      type: 'text',
      defaultValue: 'Follow:',
    },
    {
      name: 'socialLinks',
      type: 'relationship',
      relationTo: 'social-links',
      hasMany: true,
      admin: {
        description:
          'Optional: choose specific social links for the global footer. Leave empty to show all.',
      },
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          admin: {
            description: 'Example: © 2026 Hell Versus You. All rights reserved.',
          },
        },
        {
          name: 'legalLinks',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 6,
          admin: {
            initCollapsed: true,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
