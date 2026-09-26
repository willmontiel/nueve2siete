import { getPayloadClient, MEDIA_DIR } from '@nueve2siete/cms'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Files uploaded in the admin. The admin saves them in MEDIA_DIR; the site serves only the ones registered in the
 * Media collection (the name comes from the database, never straight from the URL).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  const media = docs[0]
  if (!media?.filename) return new Response('Not found', { status: 404 })

  try {
    const file = await readFile(path.join(MEDIA_DIR, path.basename(media.filename)))
    return new Response(file, {
      headers: {
        'Content-Type': media.mimeType ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
