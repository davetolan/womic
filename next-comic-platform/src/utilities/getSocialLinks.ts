import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const SOCIAL_LINKS_TAG = 'collection_social-links'

async function getSocialLinks() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'social-links',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
    select: {
      label: true,
      url: true,
      platform: true,
      sortOrder: true,
    },
  })

  return result.docs
}

export const getCachedSocialLinks = () =>
  unstable_cache(async () => getSocialLinks(), [SOCIAL_LINKS_TAG], {
    tags: [SOCIAL_LINKS_TAG],
  })
