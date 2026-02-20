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
    {
      name: 'labels',
      type: 'group',
      fields: [
        {
          name: 'emailPlaceholder',
          type: 'text',
          defaultValue: 'you@example.com',
          admin: {
            description: 'Placeholder text inside the email field.',
          },
        },
        {
          name: 'submitLabel',
          type: 'text',
          defaultValue: 'Notify Me',
          admin: {
            description: 'Button text before submit.',
          },
        },
        {
          name: 'submittingLabel',
          type: 'text',
          defaultValue: 'Submitting...',
          admin: {
            description: 'Button text while the request is in progress.',
          },
        },
        {
          name: 'successMessage',
          type: 'text',
          defaultValue: 'Subscribed successfully.',
          admin: {
            description: 'Optional success message override after signup.',
          },
        },
        {
          name: 'errorMessage',
          type: 'text',
          defaultValue: 'Something went wrong. Please try again.',
          admin: {
            description: 'Optional error message override if signup fails.',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'sectionWidth',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Narrow', value: 'narrow' },
            { label: 'Wide', value: 'wide' },
            { label: 'Full Width', value: 'full' },
          ],
          admin: {
            description: 'Controls the overall width of the newsletter section.',
          },
        },
        {
          name: 'textAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
          admin: {
            description: 'Align heading and description text.',
          },
        },
        {
          name: 'formLayout',
          type: 'select',
          defaultValue: 'row',
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Stacked', value: 'stacked' },
          ],
          admin: {
            description: 'Row keeps input and button on one line on larger screens.',
          },
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Default', value: 'default' },
            { label: 'Spacious', value: 'spacious' },
          ],
          admin: {
            description: 'Inner spacing of the signup card.',
          },
        },
        {
          name: 'cornerStyle',
          type: 'select',
          defaultValue: 'rounded',
          options: [
            { label: 'Soft Rounded', value: 'rounded' },
            { label: 'Extra Rounded', value: 'pill' },
            { label: 'Square', value: 'square' },
          ],
          admin: {
            description: 'Shape style for the card and inputs.',
          },
        },
      ],
    },
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional background image from Media. Recommended: 1800x900px minimum, JPG/WebP under 800KB.',
      },
    },
    {
      name: 'backgroundStyle',
      type: 'group',
      fields: [
        {
          name: 'showOverlay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Adds a color overlay on top of the background image for readability.',
          },
        },
        {
          name: 'overlayColor',
          type: 'text',
          admin: {
            description: 'Overlay color shown above the background image.',
            placeholder: '#000000',
            condition: (_, siblingData) => Boolean(siblingData?.showOverlay),
          },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 90,
          defaultValue: 30,
          admin: {
            description: 'Overlay opacity percentage.',
            condition: (_, siblingData) => Boolean(siblingData?.showOverlay),
          },
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'cardBackgroundColor',
          type: 'text',
          admin: {
            description: 'Card background color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          admin: {
            description: 'Heading and body text color.',
            placeholder: '#18181b',
          },
        },
        {
          name: 'mutedTextColor',
          type: 'text',
          admin: {
            description: 'Description text color.',
            placeholder: '#3f3f46',
          },
        },
        {
          name: 'borderColor',
          type: 'text',
          admin: {
            description: 'Card border color.',
            placeholder: '#e4e4e7',
          },
        },
        {
          name: 'inputBackgroundColor',
          type: 'text',
          admin: {
            description: 'Email input background color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'inputTextColor',
          type: 'text',
          admin: {
            description: 'Email input text color.',
            placeholder: '#111827',
          },
        },
        {
          name: 'inputBorderColor',
          type: 'text',
          admin: {
            description: 'Email input border color.',
            placeholder: '#d4d4d8',
          },
        },
        {
          name: 'buttonBackgroundColor',
          type: 'text',
          admin: {
            description: 'Button background color.',
            placeholder: '#18181b',
          },
        },
        {
          name: 'buttonTextColor',
          type: 'text',
          admin: {
            description: 'Button text color.',
            placeholder: '#ffffff',
          },
        },
        {
          name: 'successColor',
          type: 'text',
          admin: {
            description: 'Success message color.',
            placeholder: '#15803d',
          },
        },
        {
          name: 'errorColor',
          type: 'text',
          admin: {
            description: 'Error message color.',
            placeholder: '#dc2626',
          },
        },
      ],
    },
  ],
}
