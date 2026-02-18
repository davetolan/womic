import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { Media } from '@/components/Media'
import type { Search as SearchResult } from '@/payload-types'
import { buildTabTitle, getCachedSiteSettings, getSiteTitle } from '@/utilities/siteSettings'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const results = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {results.totalDocs > 0 ? (
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(results.docs as SearchResult[]).map((item) => {
              const relationTo = item.doc?.relationTo
              const href =
                relationTo === 'episodes'
                  ? `/episode/${item.slug}/1`
                  : relationTo === 'posts'
                    ? `/posts/${item.slug}`
                    : null

              if (!href || !item.slug) {
                return null
              }

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {item.meta?.image && typeof item.meta.image === 'object' ? (
                    <div className="mb-3 overflow-hidden rounded-lg border border-zinc-200">
                      <Media resource={item.meta.image} imgClassName="h-40 w-full object-cover" />
                    </div>
                  ) : null}
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {relationTo === 'episodes' ? 'Episode' : 'Post'}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                    {item.meta?.title || item.title || item.slug}
                  </h2>
                  {item.meta?.description ? (
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-700">{item.meta.description}</p>
                  ) : null}
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getCachedSiteSettings()()
  const siteTitle = getSiteTitle(siteSettings)

  return {
    title: buildTabTitle(siteTitle, 'Search'),
  }
}
