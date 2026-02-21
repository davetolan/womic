import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

const EPISODES_TAG = 'collection_episodes'
const LATEST_EPISODE_TAG = 'episodes_latest'

async function getLatestEpisode() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
    limit: 1,
    sort: '-episodeNumber',
    depth: 1,
  })

  return result.docs[0]
}

async function getArchiveEpisodes() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
    depth: 1,
    limit: 100,
    sort: '-episodeNumber',
    pagination: false,
  })

  return result.docs
}

export const getCachedLatestEpisode = () =>
  unstable_cache(async () => getLatestEpisode(), [LATEST_EPISODE_TAG], {
    tags: [EPISODES_TAG, LATEST_EPISODE_TAG],
  })

export const getCachedArchiveEpisodes = () =>
  unstable_cache(async () => getArchiveEpisodes(), [EPISODES_TAG, 'episodes_archive'], {
    tags: [EPISODES_TAG],
    revalidate: 60,
  })
