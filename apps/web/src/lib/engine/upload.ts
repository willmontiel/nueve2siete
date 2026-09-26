/** Logo image limits, shared by the browser (instant feedback) and the server. */

export const MAX_LOGO_BYTES = 10 * 1024 * 1024

export const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export const LOGO_FILE_ERRORS = {
  empty: 'El archivo está vacío.',
  tooLarge: 'La imagen pesa más de 10 MB. Prueba con una versión más liviana.',
  type: 'Sube tu logo en PNG, JPG, WebP o GIF.',
}

/** Error message if the file is unusable, or null if it can be sent. */
export function checkLogoFile(file: { size: number; type: string }): string | null {
  if (file.size === 0) return LOGO_FILE_ERRORS.empty
  if (file.size > MAX_LOGO_BYTES) return LOGO_FILE_ERRORS.tooLarge
  if (file.type && !ACCEPTED_LOGO_TYPES.includes(file.type)) return LOGO_FILE_ERRORS.type
  return null
}
