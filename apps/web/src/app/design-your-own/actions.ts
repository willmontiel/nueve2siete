'use server'

import { getMicCatalog } from '@/lib/catalog'
import { EngineError, analyzeLogoFile } from '@/lib/engine/client'
import { engineOptions } from '@/lib/engine/options'
import type { LogoAnalysisResult } from '@/lib/engine/schema'
import { LOGO_FILE_ERRORS, checkLogoFile } from '@/lib/engine/upload'

const ERRORS = {
  missing: 'Elige una imagen de tu logo.',
  unreadable: 'No pudimos leer la imagen. Súbela en PNG, JPG, WebP o GIF.',
  unavailable: 'No pudimos revisar tu logo en este momento. Intenta de nuevo en un rato o escríbenos.',
}

/**
 * Checks a logo with the engine. The image isn't stored: it's analyzed and discarded.
 * The options (sizes, filaments, nozzle) come from the CMS, not the browser.
 */
export async function analyzeLogo(formData: FormData): Promise<LogoAnalysisResult> {
  const file = formData.get('logo')
  if (!(file instanceof File)) return { ok: false, error: ERRORS.missing }
  // The type is declared by the browser; the engine still checks the file's actual content.
  const invalid = checkLogoFile(file)
  if (invalid) return { ok: false, error: invalid }

  const { product, filaments } = await getMicCatalog()
  try {
    const analysis = await analyzeLogoFile(file, file.name || 'logo', engineOptions(product, filaments))
    return { ok: true, analysis }
  } catch (error) {
    if (error instanceof EngineError && error.kind === 'unsupported') return { ok: false, error: ERRORS.unreadable }
    if (error instanceof EngineError && error.kind === 'too_large') return { ok: false, error: LOGO_FILE_ERRORS.tooLarge }
    console.error('[creator] Could not analyze the logo:', error)
    return { ok: false, error: ERRORS.unavailable }
  }
}
