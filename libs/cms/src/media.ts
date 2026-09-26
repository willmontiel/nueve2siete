import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Folder where the admin saves uploaded files and the site reads them from. In development it's `.data/media`
 * at the repo root (next to the local database); on the server, set MEDIA_DIR to a folder outside the code.
 */
export const MEDIA_DIR =
  process.env.MEDIA_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.data/media')
