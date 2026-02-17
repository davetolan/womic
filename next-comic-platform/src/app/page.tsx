import configPromise from '@payload-config';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';

import type { Episode } from '@/payload-types';
import { buildCloudinaryImageURL, getCloudinaryPublicIdFromMedia } from '@/utilities/cloudinary';

type EpisodePreview = {
  title: string;
  slug: string;
  episodeNumber: number;
  publishDate: string;
  thumbnail: string;
};

const FALLBACK_EPISODE: EpisodePreview = {
  title: 'The Awakening',
  slug: 'the-awakening',
  episodeNumber: 1,
  publishDate: '2026-01-01',
  thumbnail: '/placeholder-thumbnail.jpg',
};

function getThumbnailURL(episode: Episode): string {
  const thumbnailSource =
    (episode.thumbnail && typeof episode.thumbnail === 'object' && episode.thumbnail) ||
    (episode.pages?.[0]?.image &&
      typeof episode.pages[0].image === 'object' &&
      episode.pages[0].image) ||
    null;

  if (thumbnailSource) {
    const cloudinaryPublicId = getCloudinaryPublicIdFromMedia(thumbnailSource);
    const transformedURL = cloudinaryPublicId
      ? buildCloudinaryImageURL(cloudinaryPublicId, {
          crop: 'fill',
          gravity: 'auto',
          width: 440,
          height: 620,
          quality: 'auto',
          format: 'auto',
        })
      : null;

    if (transformedURL) {
      return transformedURL;
    }

    if ('url' in thumbnailSource && thumbnailSource.url) {
      return thumbnailSource.url;
    }
  }

  return '/placeholder-thumbnail.jpg';
}

function mapEpisodeToPreview(episode?: Episode): EpisodePreview | null {
  if (!episode?.title || !episode?.slug || typeof episode.episodeNumber !== 'number') {
    return null;
  }

  return {
    title: episode.title,
    slug: episode.slug,
    episodeNumber: episode.episodeNumber,
    publishDate: episode.publishDate,
    thumbnail: getThumbnailURL(episode),
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getLatestEpisode(): Promise<EpisodePreview> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'episodes',
      limit: 1,
      sort: '-episodeNumber',
      depth: 1,
    });

    return mapEpisodeToPreview(result.docs[0]) ?? FALLBACK_EPISODE;
  } catch (error) {
    console.error('Failed to load latest episode from Payload:', error);
    return FALLBACK_EPISODE;
  }
}

export default async function Home() {
  const latestEpisode = await getLatestEpisode();
  const formattedPublishDate = formatDate(latestEpisode.publishDate);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Hell Versus You
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Two souls enter the in-between. Only one returns alive.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            An accidental murder sends both victim and killer to a realm between life and death.
            Only one may return as they compete for a final chance to win their life
            back.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Fantasy. Recommended for ages 16+. Built for readers who love D&D, deep worldbuilding,
            and character-focused narratives.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            This site exists to publish new episodes consistently and serve as portfolio exposure
            for the Hell Versus You project.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Updates are planned monthly, with at least two pages per episode update (irregular
            panel counts).
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
              <p className="text-sm font-medium text-zinc-600">Episode {latestEpisode.episodeNumber}</p>
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
