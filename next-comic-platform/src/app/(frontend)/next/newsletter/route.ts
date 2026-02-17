import configPromise from '@payload-config'
import { getPayload } from 'payload'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !EMAIL_REGEX.test(email)) {
      return Response.json({ message: 'Please enter a valid email address.' }, { status: 400 })
    }

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      limit: 1,
      pagination: false,
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existing.docs.length > 0) {
      return Response.json({ message: 'You are already subscribed.' }, { status: 200 })
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email,
      },
    })

    return Response.json({ message: 'Subscribed successfully.' }, { status: 201 })
  } catch (error) {
    payload.logger.error({ err: error, message: 'Failed newsletter signup request' })
    return Response.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
