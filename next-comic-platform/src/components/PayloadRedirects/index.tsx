import type React from 'react'
import type { Chapter, Episode } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Chapter | Episode
      redirectUrl =
        collection === 'episodes'
          ? `/episode/${document?.slug || ''}/1`
          : collection === 'chapters'
            ? `/chapter/${document?.slug || ''}`
            : ''
    } else {
      const collection = redirectItem.to?.reference?.relationTo
      const slug =
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : ''
      redirectUrl =
        collection === 'episodes'
          ? `/episode/${slug || ''}/1`
          : collection === 'chapters'
            ? `/chapter/${slug || ''}`
            : ''
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
