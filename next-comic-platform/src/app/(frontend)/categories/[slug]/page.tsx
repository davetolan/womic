import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { buildTabTitle, getCachedSiteSettings, getSiteTitle } from '@/utilities/siteSettings'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export const revalidate = 600

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/categories/${decodedSlug}`

  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) {
    return <PayloadRedirects url={url} />
  }

  const posts = await queryPostsByCategoryId({ categoryId: category.id })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Category: {category.title}</h1>
        </div>
      </div>

      {posts.length > 0 ? (
        <CollectionArchive posts={posts} />
      ) : (
        <div className="container">
          <p className="text-muted-foreground">No posts found in this category yet.</p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const siteSettings = await getCachedSiteSettings()()
  const siteTitle = getSiteTitle(siteSettings)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  return {
    title: buildTabTitle(siteTitle, category ? `Category: ${category.title}` : 'Category'),
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    const categories = await payload.find({
      collection: 'categories',
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return categories.docs
      .filter((category) => Boolean(category.slug))
      .map((category) => ({ slug: String(category.slug) }))
  } catch (error) {
    console.error('[generateStaticParams:/categories/[slug]] Failed to load categories during build.', error)
    return []
  }
}

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'categories',
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error(`[queryCategoryBySlug] Failed to fetch category "${slug}".`, error)
    return null
  }
})

const queryPostsByCategoryId = cache(async ({ categoryId }: { categoryId: number | string }) => {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      where: {
        categories: {
          in: [categoryId],
        },
      },
    })

    return result.docs
  } catch (error) {
    console.error(`[queryPostsByCategoryId] Failed to fetch posts for category "${categoryId}".`, error)
    return []
  }
})
