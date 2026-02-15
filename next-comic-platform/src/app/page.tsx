import Image from "next/image";
import Link from "next/link";

type EpisodePreview = {
  title: string;
  slug: string;
  episodeNumber: number;
  publishDate: string;
  thumbnail: string;
};

export default function Home() {
  const latestEpisode: EpisodePreview = {
    title: "The Awakening",
    slug: "the-awakening",
    episodeNumber: 1,
    publishDate: "2026-01-01",
    thumbnail: "/placeholder-thumbnail.jpg",
  };

  const formattedPublishDate = new Date(latestEpisode.publishDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Next Comic Platform
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            A page-by-page comic reading experience.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            Follow the latest episodes, read each page in sequence, and stay updated as new chapters are published.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/episode/${latestEpisode.slug}/1`}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Read Latest Episode
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              View Archive
            </Link>
          </div>
        </header>

        <section
          aria-labelledby="latest-episode-heading"
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 id="latest-episode-heading" className="text-2xl font-semibold tracking-tight">
            Latest Episode
          </h2>
          <article className="mt-6 grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              <Image
                src={latestEpisode.thumbnail}
                alt={`${latestEpisode.title} thumbnail`}
                width={440}
                height={620}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-zinc-600">
                Episode {latestEpisode.episodeNumber}
              </p>
              <h3 className="text-xl font-semibold">{latestEpisode.title}</h3>
              <p className="text-sm text-zinc-700">Published {formattedPublishDate}</p>
              <div className="pt-2">
                <Link
                  href={`/episode/${latestEpisode.slug}/1`}
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section
          aria-labelledby="newsletter-heading"
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 id="newsletter-heading" className="text-2xl font-semibold tracking-tight">
            Newsletter
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-700">
            Get notified when a new episode drops. Newsletter signup wiring is coming soon.
          </p>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup placeholder">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none ring-zinc-300 placeholder:text-zinc-500 focus:ring-2"
              disabled
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700"
              disabled
            >
              Coming Soon
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
