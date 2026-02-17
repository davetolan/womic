'use client'

import { FormEvent, useState } from 'react'

type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

export const NewsletterSignupForm = () => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmissionState>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('loading')
    setMessage('')

    try {
      const response = await fetch('/next/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setState('error')
        setMessage(data?.message || 'Something went wrong. Please try again.')
        return
      }

      setState('success')
      setMessage(data?.message || 'Subscribed successfully.')
      setEmail('')
    } catch {
      setState('error')
      setMessage('Network error. Please try again.')
    }
  }

  const isLoading = state === 'loading'
  const feedbackColorClass = state === 'error' ? 'text-red-600' : 'text-green-700'

  return (
    <>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit} aria-label="Newsletter signup">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none ring-zinc-300 placeholder:text-zinc-500 focus:ring-2"
          required
          autoComplete="email"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Notify Me'}
        </button>
      </form>

      {message ? (
        <p className={`mt-3 text-sm ${feedbackColorClass}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </>
  )
}
