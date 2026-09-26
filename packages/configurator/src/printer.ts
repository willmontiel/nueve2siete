/**
 * Bambu Lab A1 nozzles and what each one prints in the logo plane.
 * Copy of services/engine/src/engine/printing.py: if you change one, change the other.
 */
export const NOZZLES = [0.4, 0.6, 0.8] as const

export type Nozzle = (typeof NOZZLES)[number]

export interface NozzleLimits {
  /** The finest feature that prints: 1.5 times the nozzle. */
  minFeatureMm: number
  /** The narrowest channel between two raised parts that doesn't close up: 1.25 times the nozzle. */
  minGapMm: number
}

export const NOZZLE_LIMITS: Record<Nozzle, NozzleLimits> = {
  0.4: { minFeatureMm: 0.6, minGapMm: 0.5 },
  0.6: { minFeatureMm: 0.9, minGapMm: 0.75 },
  0.8: { minFeatureMm: 1.2, minGapMm: 1.0 },
}

export function isNozzle(value: unknown): value is Nozzle {
  return NOZZLES.includes(value as Nozzle)
}
