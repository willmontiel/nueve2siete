const number = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 })

/** 45 → "4,5" */
export function cm(mm: number): string {
  return number.format(mm / 10)
}

/** 0.8 → "0,8" */
export function decimal(value: number): string {
  return number.format(value)
}
