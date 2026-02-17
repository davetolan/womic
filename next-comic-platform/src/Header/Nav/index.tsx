'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

type HeaderNavProps = {
  data: HeaderType
  className?: string
  linkClassName?: string
  linkStyle?: React.CSSProperties
  searchClassName?: string
  searchStyle?: React.CSSProperties
  showSearch?: boolean
  ctaLink?: React.ComponentProps<typeof CMSLink> | null
  ctaClassName?: string
  ctaStyle?: React.CSSProperties
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  className,
  linkClassName,
  linkStyle,
  searchClassName,
  searchStyle,
  showSearch = true,
  ctaLink,
  ctaClassName,
  ctaStyle,
}) => {
  const router = useRouter()
  const navItems = data?.navItems || []

  const onSearchSubmit = (formData: FormData) => {
    const query = String(formData.get('q') || '').trim()
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  return (
    <nav className={cn('flex gap-3 items-center', className)}>
      {navItems.map(({ link }, i) => {
        return <CMSLink className={linkClassName} key={i} {...link} appearance="link" style={linkStyle} />
      })}
      {ctaLink?.label ? (
        <CMSLink
          className={ctaClassName}
          {...ctaLink}
          appearance={ctaLink.appearance || 'default'}
          style={ctaStyle}
        />
      ) : null}
      {showSearch ? (
        <form action={onSearchSubmit} className="flex items-center gap-2">
          <label htmlFor="header-search" className="sr-only">
            Search
          </label>
          <Input
            id="header-search"
            name="q"
            placeholder="Search episodes"
            className="h-9 w-40 md:w-52"
          />
          <button type="submit" aria-label="Search" style={searchStyle}>
            <SearchIcon className={cn('w-5', searchClassName)} style={searchStyle} />
          </button>
          <Link href="/search" className="sr-only">
            Open search page
          </Link>
        </form>
      ) : null}
    </nav>
  )
}
