import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

const SOCIAL_LINKS_TAG = 'collection_social-links'

export const revalidateSocialLinks: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating social links')
    revalidateTag(SOCIAL_LINKS_TAG)
  }

  return doc
}

export const revalidateSocialLinksDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag(SOCIAL_LINKS_TAG)
  }

  return doc
}
