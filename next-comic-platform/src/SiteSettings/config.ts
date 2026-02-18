import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    hideAPIURL: true,
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      defaultValue: 'Hell Versus You',
      admin: {
        description: 'Default site title used in browser tabs and metadata.',
      },
    },
    {
      name: 'favicon',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description:
          'Optional favicon from Media. Recommended: square PNG/WebP/SVG at 64x64 or 128x128.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
