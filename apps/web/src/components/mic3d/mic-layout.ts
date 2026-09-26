import type { ProductSize } from '@nueve2siete/configurator'

/**
 * Where each mic part goes, in millimeters, with the end of the handle at y = 0 and the front of the box
 * facing +z. It's an approximate model until we have the CAD files.
 */
export interface MicLayout {
  head: { radius: number; y: number }
  box: { width: number; height: number; depth: number; y: number; radius: number }
  handle: { length: number; topRadius: number; bottomRadius: number }
}

/** The head sinks this fraction (of its diameter) into the box. */
const HEAD_OVERLAP = 0.1
/** The handle goes into the box so the joint isn't visible. */
const HANDLE_INSERT_MM = 4

export function micLayout(size: ProductSize): MicLayout {
  const radius = size.headDiameterMm / 2
  const boxTop = size.totalHeightMm - size.headDiameterMm * (1 - HEAD_OVERLAP)
  const boxBottom = boxTop - size.box.heightMm
  const topRadius = Math.min(size.box.widthMm, size.box.depthMm) * 0.19

  return {
    head: { radius, y: size.totalHeightMm - radius },
    box: {
      width: size.box.widthMm,
      height: size.box.heightMm,
      depth: size.box.depthMm,
      y: boxBottom + size.box.heightMm / 2,
      radius: Math.min(3, size.box.widthMm * 0.05),
    },
    handle: { length: boxBottom + HANDLE_INSERT_MM, topRadius, bottomRadius: topRadius * 0.78 },
  }
}
