import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Patrick_Hand } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { buildTabTitle, getCachedSiteSettings, getSiteFaviconURL, getSiteTitle } from '@/utilities/siteSettings'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-patrick-hand',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(patrickHand.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getCachedSiteSettings()()
  const siteTitle = getSiteTitle(siteSettings)
  const faviconURL = getSiteFaviconURL(siteSettings)

  return {
    metadataBase: new URL(getServerSideURL()),
    title: buildTabTitle(siteTitle),
    description:
      'Fantasy comic for ages 16+, built for readers interested in D&D, worldbuilding, and character-focused narratives.',
    keywords: ['fantasy comic', 'D&D', 'worldbuilding', 'character-focused narratives', '16+', siteTitle],
    openGraph: mergeOpenGraph({
      siteName: siteTitle,
      title: siteTitle,
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
    ...(faviconURL ? { icons: { icon: [{ url: faviconURL }] } } : {}),
  }
}
