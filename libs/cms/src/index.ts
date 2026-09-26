import { getPayload } from 'payload'

import { buildCmsConfig } from './config'

export { buildCmsConfig, type CmsConfigOptions } from './config'
export { MEDIA_DIR } from './media'
export type * from './payload-types'

let siteConfig: ReturnType<typeof buildCmsConfig> | undefined

/**
 * Payload Local API client for apps without the admin panel (the site): it queries Postgres directly, no HTTP,
 * and never changes the schema.
 */
export const getPayloadClient = () => getPayload({ config: (siteConfig ??= buildCmsConfig()) })
