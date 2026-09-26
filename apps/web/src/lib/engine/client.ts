import { logoAnalysisSchema, type LogoAnalysis } from './schema'
import type { EngineOptions } from './options'

/** Calls to the logo engine. Server-side only: the engine isn't exposed to the internet. */

const DEFAULT_ENGINE_URL = 'http://127.0.0.1:8000'
const TIMEOUT_MS = 30_000

export type EngineErrorKind = 'unavailable' | 'unsupported' | 'too_large' | 'invalid_response'

export class EngineError extends Error {
  constructor(
    readonly kind: EngineErrorKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'EngineError'
  }
}

function engineUrl(): string {
  return (process.env.ENGINE_URL || DEFAULT_ENGINE_URL).replace(/\/+$/, '')
}

export async function analyzeLogoFile(file: Blob, filename: string, options: EngineOptions): Promise<LogoAnalysis> {
  const body = new FormData()
  body.append('file', file, filename)
  body.append('options', JSON.stringify(options))

  let response: Response
  try {
    response = await fetch(`${engineUrl()}/v1/analyze`, {
      method: 'POST',
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    throw new EngineError('unavailable', 'The logo engine did not respond', { cause: error })
  }

  if (response.status === 415) throw new EngineError('unsupported', 'The engine could not read the image')
  if (response.status === 413) throw new EngineError('too_large', 'The image is larger than the engine accepts')
  if (!response.ok) throw new EngineError('unavailable', `The logo engine answered ${response.status}`)

  const parsed = logoAnalysisSchema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) {
    throw new EngineError('invalid_response', 'Unexpected response from the logo engine', { cause: parsed.error })
  }
  return parsed.data
}
