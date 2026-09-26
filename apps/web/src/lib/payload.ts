import config from '@payload-config'
import { getPayload } from 'payload'

/** Payload Local API client (queries the database directly, no HTTP). */
export const getPayloadClient = () => getPayload({ config })
