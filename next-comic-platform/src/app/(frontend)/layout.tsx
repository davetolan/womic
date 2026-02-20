import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import {
  Inter,
  Lato,
  Lora,
  Merriweather,
  Montserrat,
  Nunito,
  Open_Sans,
  Oswald,
  Patrick_Hand,
  Poppins,
  Raleway,
  Roboto,
  Source_Sans_3,
  Spectral,
} from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getFontClassName, getSiteFont } from '@/utilities/fonts'
import { buildTabTitle, getCachedSiteSettings, getSiteFaviconURL, getSiteTitle } from '@/utilities/siteSettings'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'


const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-patrick-hand',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

const spectral = Spectral({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-spectral',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteSettings = await getCachedSiteSettings()()
  const siteFontClassName = getFontClassName(getSiteFont(siteSettings))

  return (
    <html
      className={cn(
        roboto.variable,
        openSans.variable,
        lato.variable,
        montserrat.variable,
        oswald.variable,
        sourceSans3.variable,
        raleway.variable,
        poppins.variable,
        merriweather.variable,
        nunito.variable,
        patrickHand.variable,
        inter.variable,
        lora.variable,
        spectral.variable,
        GeistMono.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
      </head>
      <body className={siteFontClassName}>
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
