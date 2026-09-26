import { DEFAULT_FAQS } from './faqs-data'
import { getPayloadClient } from './payload'

export async function getFaqs(): Promise<{ question: string; answer: string }[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'faqs', sort: 'sortOrder', limit: 100 })
    if (result.docs.length) {
      return result.docs.map(({ question, answer }) => ({ question, answer }))
    }
  } catch (error) {
    console.error('[faqs] CMS unavailable, using default questions:', error)
  }
  return DEFAULT_FAQS
}
