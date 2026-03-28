import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Minimal 1×1 transparent PNG — injected as placeholder when saving a video embed
// record so Payload's upload collection file requirement is satisfied.
// The placeholder is never displayed; the frontend uses the YouTube/Vimeo CDN URL.
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjkB6QAAAABJRU5ErkJggg==',
  'base64',
)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mediabestand',
    plural: 'Mediabestanden',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'createdAt'],
    description: 'Afbeeldingen, PDF\'s en andere bestanden',
    group: 'Nieuws & Media',
  },
  defaultSort: '-createdAt',
  timestamps: true,
  upload: {
    staticDir: path.resolve(__dirname, '../../../assets/media'),
    // Cap the stored original to 2K (2048px on the longest side) and convert to WebP.
    resizeOptions: {
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        // Tiny blur placeholder (~20px wide). Used by LazyImage as the blurred preview.
        name: 'placeholder',
        width: 20,
        height: undefined,
        withoutEnlargement: false,
        formatOptions: {
          format: 'webp',
          options: { quality: 30 },
        },
      },
      {
        // Scaled-down preview for admin panel and LazyImage full-res display.
        name: 'thumbnail',
        width: 720,
        height: 720,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
      {
        // Full-resolution JPEG copy, used for album photo downloads.
        name: 'jpeg',
        width: 2560,
        height: 2560,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: {
          format: 'jpeg',
          options: { quality: 90 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/*',
      'image/heic',
      'image/heif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'uploadTypeHint',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/UploadTypeHint',
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: false,
      admin: {
        description: 'YouTube of Vimeo URL (bijv. https://www.youtube.com/watch?v=...). Laat leeg voor normale bestanden.',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Tekst / Titel',
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Onderschrift',
      localized: true,
      required: false,
      admin: {
        description: 'Optionele bijschrift die onder de afbeelding wordt getoond (bijv. op de nieuwspagina).',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Algemeen', value: 'general' },
        { label: 'Instructeur Foto', value: 'instructor' },
        { label: 'Nieuws', value: 'news' },
        { label: 'Album', value: 'album' },
        { label: 'Locatie', value: 'location' },
        { label: 'Document', value: 'document' },
        { label: 'Video (embed)', value: 'embed' },
      ],
      defaultValue: 'general',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation !== 'create') return args;

        const videoUrl: string | undefined = args.req?.data?.videoUrl;

        // When saving a video embed (videoUrl set, no file uploaded), inject a tiny
        // transparent placeholder so Payload's upload requirement is satisfied.
        // The placeholder is never shown — the frontend uses the YouTube/Vimeo CDN URL.
        if (videoUrl && !args.req?.file) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args.req.file = {
            data: PLACEHOLDER_PNG,
            name: 'video-placeholder.png',
            mimetype: 'image/png',
            size: PLACEHOLDER_PNG.length,
          } as any;
        }

        // HEIC → WebP conversion for regular file uploads
        const file = args.req?.file;
        if (!file) return args;
        const mime: string = file.mimetype ?? '';
        const ext = ((file.name ?? '') as string).split('.').pop()?.toLowerCase() ?? '';
        if (mime === 'image/heic' || mime === 'image/heif' || ext === 'heic' || ext === 'heif') {
          try {
            const sharpMod = (await import('sharp')).default;
            const converted = await sharpMod(file.data as Buffer).webp({ quality: 82 }).toBuffer();
            file.data = converted;
            file.mimetype = 'image/webp';
            file.name = (file.name as string).replace(/\.(heic|heif)$/i, '.webp');
          } catch (err) {
            console.error('[Media] HEIC conversion failed:', err);
          }
        }
        return args;
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Auto-set category to embed when videoUrl is present
        if (data.videoUrl) {
          data.category = 'embed';
        }
        // Auto-fill alt from filename for regular uploads
        if (!data.alt && data.filename) {
          data.alt = data.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        }
        return data;
      },
    ],
  },
}