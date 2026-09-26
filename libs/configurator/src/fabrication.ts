import type { LogoRules } from './types'

export type FabricationMode = 'integrated' | 'separate'

export interface FabricationDecision {
  /** null: the logo needs more colors than the AMS Lite supports. */
  mode: FabricationMode | null
  /** Filaments used by the print that carries the logo. */
  filamentsInPrint: number
}

/**
 * integrated: box + logo in a single print → box color + up to N extra colors.
 * separate: the logo is printed as a separate piece (up to M colors) and glued onto the box.
 * A logo color equal to the box color doesn't count in integrated mode.
 * The system picks the mode; the customer doesn't choose it (the admin can change it).
 */
export function chooseFabricationMode(
  logoColors: string[],
  boxColor: string,
  rules: Pick<LogoRules, 'integratedMaxExtraColors' | 'separateMaxLogoColors'>,
): FabricationDecision {
  const distinct = [...new Set(logoColors)]
  const extra = distinct.filter((color) => color !== boxColor)

  if (extra.length <= rules.integratedMaxExtraColors) {
    return { mode: 'integrated', filamentsInPrint: 1 + extra.length }
  }
  if (distinct.length <= rules.separateMaxLogoColors) {
    return { mode: 'separate', filamentsInPrint: distinct.length }
  }
  return { mode: null, filamentsInPrint: distinct.length }
}
