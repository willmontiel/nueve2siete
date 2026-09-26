import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { translatedPages } from './src/lib/routes'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Shared code in libs/* is consumed as TypeScript source.
  transpilePackages: ['@nueve2siete/cms', '@nueve2siete/configurator'],
  experimental: {
    // The creator uploads logos up to 10 MB to a Server Action (1 MB by default), plus the multipart overhead.
    serverActions: { bodySizeLimit: '11mb' },
  },
  images: {
    // Files uploaded in the admin (see app/media). The site's own images are imported from src/assets.
    localPatterns: [{ pathname: '/media/**', search: '' }],
  },
  // Folders are in English and URLs in Spanish (src/lib/routes.ts).
  rewrites: async () => translatedPages().map(({ url, folder }) => ({ source: url, destination: folder })),
  redirects: async () =>
    translatedPages().map(({ url, folder }) => ({ source: folder, destination: url, permanent: true })),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    // Monorepo root, so Turbopack resolves the shared code in libs/*.
    root: path.resolve(dirname, '../..'),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
