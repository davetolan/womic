import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getCachedSocialLinks } from '@/utilities/getSocialLinks'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const socialLinks = await getCachedSocialLinks()()

  const navItems = footerData?.navItems || []
  const visibleSocialLinks = socialLinks.filter((item) => item?.label && item?.url)

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
      {visibleSocialLinks.length > 0 ? (
        <div className="container pb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-zinc-300">Follow:</span>
            {visibleSocialLinks.map((item) => (
              <a
                key={item.id}
                href={item.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-white underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  )
}
