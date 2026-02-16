import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound, redirect } from 'next/navigation'

import type { Episode } from '@/payload-types'

type Args = {
  params: Promise<{
    slug: string
    page: string
  }>
}

const getPageImageURL = (image: Episode['pages'][number]['image']): string => {
  if (image && typeof image === 'object' && 'url' in image && image.url) {
    return image.url
  }

  return '/placeholder-thumbnail.jpg'
}

const getEpisodeBySlug = async (slug: string): Promise<Episode | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
    limit: 1,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] || null
}

const getNextEpisode = async (episodeNumber: number): Promise<Episode | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
    limit: 1,
    pagination: false,
    depth: 0,
    sort: 'episodeNumber',
    where: {
      episodeNumber: {
        greater_than: episodeNumber,
      },
    },
  })

  return result.docs[0] || null
}

export default async function EpisodePage({ params: paramsPromise }: Args) {
  const { slug, page } = await paramsPromise

  if (!slug?.trim()) {
    notFound()
  }

  const pageNumber = Number(page)
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    notFound()
  }

  const episode = await getEpisodeBySlug(slug)
  if (!episode || !episode.pages?.length) {
    notFound()
  }

  const totalPages = episode.pages.length
  if (pageNumber > totalPages) {
    redirect(`/episode/${episode.slug}/${totalPages}`)
  }
  const nextEpisode = await getNextEpisode(episode.episodeNumber)

  const currentPage = episode.pages[pageNumber - 1]
  const imageURL = getPageImageURL(currentPage.image)
  const altText = currentPage.altText || `${episode.title} page ${pageNumber}`

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm text-zinc-600">Episode {episode.episodeNumber}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{episode.title}</h1>
          <p className="mt-1 text-sm text-zinc-700">
            Page {pageNumber} of {totalPages}
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <Image
            src={imageURL}
            alt={altText}
            width={1400}
            height={2000}
            className="h-auto w-full object-contain"
            priority
          />
        </section>

        <nav className="flex items-center justify-between gap-3">
          {pageNumber > 1 ? (
            <Link
              href={`/episode/${episode.slug}/${pageNumber - 1}`}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Previous Page
            </Link>
          ) : (
            <Link
              href="/archive"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Back to Archive
            </Link>
          )}

          {pageNumber < totalPages ? (
            <Link
              href={`/episode/${episode.slug}/${pageNumber + 1}`}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Next Page
            </Link>
          ) : nextEpisode?.slug ? (
            <Link
              href={`/episode/${nextEpisode.slug}/1`}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Next Episode
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-lg bg-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-600">
              Next Episode
            </span>
          )}
        </nav>
      </div>
    </main>
  )
}
