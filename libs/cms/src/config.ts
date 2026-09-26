import { postgresAdapter } from '@payloadcms/db-postgres'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Faqs } from './collections/Faqs'
import { Filaments } from './collections/Filaments'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export interface CmsConfigOptions {
  /**
   * The admin app owns the schema: in development it syncs the tables with the collections and regenerates
   * payload-types.ts when it starts. The site only reads and writes data, so the two apps don't race to change
   * the database when they start together.
   */
  ownsSchema?: boolean
  /** Folder the admin's custom components are resolved from (the admin app passes its src folder). */
  importMapBaseDir?: string
}

/** Payload config shared by the admin (panel + API) and the site (Local API only). */
export function buildCmsConfig({ ownsSchema = false, importMapBaseDir }: CmsConfigOptions = {}) {
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: importMapBaseDir ?? dirname,
        autoGenerate: ownsSchema,
      },
      meta: {
        titleSuffix: ' · nueve2siete',
      },
    },
    i18n: {
      supportedLanguages: { es },
      fallbackLanguage: 'es',
    },
    collections: [Leads, Products, Filaments, Projects, Faqs, Media, Users],
    globals: [SiteSettings],
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
      autoGenerate: ownsSchema,
    },
    db: postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL || '',
      },
      push: ownsSchema,
    }),
    sharp,
    plugins: [],
  })
}
