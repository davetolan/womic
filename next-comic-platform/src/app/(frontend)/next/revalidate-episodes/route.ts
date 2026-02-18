import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  revalidateTag('collection_episodes')
  revalidateTag('episodes_latest')

  return Response.json({ revalidated: true, tags: ['collection_episodes', 'episodes_latest'] })
}

