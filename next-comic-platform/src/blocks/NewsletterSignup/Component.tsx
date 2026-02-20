import React from 'react'

import type { NewsletterSignupBlock as NewsletterSignupBlockProps } from '@/payload-types'

import { NewsletterSignupForm } from '@/components/NewsletterSignupForm'

export const NewsletterSignupBlock: React.FC<NewsletterSignupBlockProps> = ({ heading, description }) => {
  return (
    <section className="container">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">{heading || 'Newsletter'}</h2>
        {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-700">{description}</p> : null}
        <NewsletterSignupForm />
      </div>
    </section>
  )
}
