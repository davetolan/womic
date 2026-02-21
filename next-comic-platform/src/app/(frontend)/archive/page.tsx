import Image from 'next/image'
import Link from 'next/link'

import type { Episode } from '@/payload-types'
import { buildCloudinaryImageURL, getCloudinaryPublicIdFromMedia } from '@/utilities/cloudinary'
import { getCachedArchiveEpisodes } from '@/utilities/getEpisodes'
import ArchivePageClient from './page.client'

const FALLBACK_THUMBNAIL = '/placeholder-thumbnail.jpg'
export const dynamic = 'force-dynamic'

const getThumbnailURL = (episode: Episode): string => {
  const thumbnailSource =
    (episode.thumbnail && typeof episode.thumbnail === 'object' && episode.thumbnail) ||
    (episode.pages?.[0]?.image &&
      typeof episode.pages[0].image === 'object' &&
      episode.pages[0].image) ||
    null

  if (thumbnailSource) {
    const cloudinaryPublicId = getCloudinaryPublicIdFromMedia(thumbnailSource)
    const transformedURL = cloudinaryPublicId
      ? buildCloudinaryImageURL(cloudinaryPublicId, {
          crop: 'fill',
          gravity: 'auto',
          width: 600,
          height: 840,
          quality: 'auto',
          format: 'auto',
        })
      : null

    if (transformedURL) {
      return transformedURL
    }

    if ('url' in thumbnailSource && thumbnailSource.url) {
      return thumbnailSource.url
    }
  }

  return FALLBACK_THUMBNAIL
}

const formatDate = (value: string): string => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArchivePage() {
  let episodeDocs: Episode[] = []

  try {
    episodeDocs = await getCachedArchiveEpisodes()()
  } catch (error) {
    console.error('[archive/page] Failed to fetch episodes. Rendering empty archive.', error)
  }

  const episodes = episodeDocs.filter((episode) => episode.slug && episode.title)

  return (
    <>
      <ArchivePageClient />
      <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Archive</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
              Browse all published episodes and jump to page one of any release.
            </p>
          </header>

          {episodes.length === 0 ? (
            <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 shadow-sm sm:p-8">
              No episodes published yet.
            </section>
          ) : (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {episodes.map((episode) => (
                <article
                  key={episode.id}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                  <Image
                    src={getThumbnailURL(episode)}
                    alt={`${episode.title} thumbnail`}
                    width={640}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                  <div className="flex flex-col gap-3 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Episode {episode.episodeNumber}
                    </p>
                    <h2 className="text-lg font-semibold">{episode.title}</h2>
                    <p className="text-sm text-zinc-600">
                      Published {formatDate(episode.publishDate)}
                    </p>
                    <Link
                      href={`/episode/${episode.slug}/1`}
                      className="mt-1 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                    >
                      Start Reading
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  )
}
