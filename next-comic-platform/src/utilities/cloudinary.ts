type TransformOptions = {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb'
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west'
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif'
}

type CloudinaryMediaLike = {
  cloudinaryPublicId?: string | null
  cloudinary?: {
    public_id?: string | null
  } | null
  filename?: string | null
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com'

const getCloudName = (): string | null => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!cloudName || cloudName.trim() === '') {
    return null
  }

  return cloudName
}

const buildTransformSegment = (options: TransformOptions): string => {
  const transforms: string[] = []

  if (options.crop) transforms.push(`c_${options.crop}`)
  if (options.gravity) transforms.push(`g_${options.gravity}`)
  if (options.width) transforms.push(`w_${options.width}`)
  if (options.height) transforms.push(`h_${options.height}`)
  if (options.quality) transforms.push(`q_${options.quality}`)
  if (options.format) transforms.push(`f_${options.format}`)

  return transforms.join(',')
}

export const buildCloudinaryImageURL = (
  publicId: string,
  options: TransformOptions = {},
): string | null => {
  const cloudName = getCloudName()

  if (!cloudName || !publicId) {
    return null
  }

  const transforms = buildTransformSegment(options)
  const encodedPublicId = publicId
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  if (!transforms) {
    return `${CLOUDINARY_BASE}/${cloudName}/image/upload/${encodedPublicId}`
  }

  return `${CLOUDINARY_BASE}/${cloudName}/image/upload/${transforms}/${encodedPublicId}`
}

export const getCloudinaryPublicIdFromMedia = (
  media: CloudinaryMediaLike | null | undefined,
): string | null => {
  if (!media || typeof media !== 'object') {
    return null
  }

  if (media.cloudinaryPublicId) {
    return media.cloudinaryPublicId
  }

  if (media.cloudinary?.public_id) {
    return media.cloudinary.public_id
  }

  if (media.filename) {
    return media.filename.replace(/\.[^/.]+$/, '')
  }

  return null
}
