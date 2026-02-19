import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateSocialLinks,
  revalidateSocialLinksDelete,
} from './SocialLinks/hooks/revalidateSocialLinks'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'platform', 'url', 'updatedAt'],
    group: 'Marketing',
    hideAPIURL: true,
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name shown to users (for example: Instagram).',
      },
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'X / Twitter', value: 'twitter' },
        { label: 'Threads', value: 'threads' },
        { label: 'Bluesky', value: 'bluesky' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Patreon', value: 'patreon' },
        { label: 'Discord', value: 'discord' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return 'URL is required.'

        try {
          const parsed = new URL(value)
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return 'URL must start with http:// or https://'
          }
          return true
        } catch {
          return 'Enter a valid URL.'
        }
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
  ],
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateSocialLinks],
    afterDelete: [revalidateSocialLinksDelete],
  },
}
