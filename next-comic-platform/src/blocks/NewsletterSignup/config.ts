import type { Block } from 'payload'

export const NewsletterSignup: Block = {
  slug: 'newsletterSignup',
  interfaceName: 'NewsletterSignupBlock',
  imageURL: '/block-previews/newsletter.svg',
  imageAltText: 'Newsletter signup form block with email field and button',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Newsletter',
      admin: {
        description: 'Section heading shown above the signup form.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Get notified when a new episode drops.',
      admin: {
        description: 'Short helper text shown above the signup form.',
      },
    },
  ],
}
