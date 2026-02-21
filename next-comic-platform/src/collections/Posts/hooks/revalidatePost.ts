import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

type CategoryRef = Post['categories']
type PayloadClient = Parameters<CollectionAfterChangeHook<Post>>[0]['req']['payload']

const getCategoryIds = (categories: CategoryRef | null | undefined): number[] => {
  if (!categories || categories.length === 0) return []

  return categories
    .map((category) => {
      if (typeof category === 'number') return category
      return category.id
    })
    .filter((categoryId): categoryId is number => Number.isFinite(categoryId))
}

const revalidateCategoryPaths = async ({
  categoryIds,
  payload,
}: {
  categoryIds: number[]
  payload: PayloadClient
}) => {
  if (categoryIds.length === 0) return

  const categories = await payload.find({
    collection: 'categories',
    limit: categoryIds.length,
    pagination: false,
    where: {
      id: {
        in: categoryIds,
      },
    },
    select: {
      slug: true,
    },
  })

  for (const category of categories.docs) {
    if (!category.slug) continue
    revalidatePath(`/categories/${category.slug}`)
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }

    const currentCategoryIds = doc._status === 'published' ? getCategoryIds(doc.categories) : []
    const previousCategoryIds =
      previousDoc._status === 'published' ? getCategoryIds(previousDoc.categories) : []
    const categoryIdsToRevalidate = [...new Set([...currentCategoryIds, ...previousCategoryIds])]

    void revalidateCategoryPaths({
      categoryIds: categoryIdsToRevalidate,
      payload,
    })
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')

    const categoryIds = getCategoryIds(doc?.categories)

    void revalidateCategoryPaths({
      categoryIds,
      payload,
    })
  }

  return doc
}
