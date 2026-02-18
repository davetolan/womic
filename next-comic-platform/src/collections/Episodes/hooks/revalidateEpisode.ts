import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Episode } from '../../../payload-types'

const triggerEpisodeRevalidation = async (payload: {
  logger: { info: (msg: string) => void; error: (msg: string) => void }
}) => {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL
  const secret = process.env.PAYLOAD_SECRET

  if (!serverURL || !secret) {
    payload.logger.error(
      'Skipping episode revalidation: NEXT_PUBLIC_SERVER_URL or PAYLOAD_SECRET is missing.',
    )
    return
  }

  try {
    const response = await fetch(`${serverURL}/next/revalidate-episodes`, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': secret,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      payload.logger.error(`Episode revalidation request failed with status ${response.status}.`)
      return
    }

    payload.logger.info('Episode tags revalidated via route handler.')
  } catch (error) {
    payload.logger.error(`Episode revalidation request failed: ${String(error)}`)
  }
}

export const revalidateEpisode: CollectionAfterChangeHook<Episode> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    void triggerEpisodeRevalidation(payload)
  }

  return doc
}

export const revalidateEpisodeDelete: CollectionAfterDeleteHook<Episode> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    void triggerEpisodeRevalidation(payload)
  }

  return doc
}
