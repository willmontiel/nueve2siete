// The part of the opentype.js 2 API this package uses (the package ships no types).
declare module 'opentype.js' {
  export interface PathCommand {
    type: 'M' | 'L' | 'Q' | 'C' | 'Z'
    x?: number
    y?: number
    x1?: number
    y1?: number
    x2?: number
    y2?: number
  }

  export interface BoundingBox {
    x1: number
    y1: number
    x2: number
    y2: number
  }

  export interface Path {
    commands: PathCommand[]
    getBoundingBox(): BoundingBox
    toPathData(decimals?: number): string
  }

  export interface Glyph {
    index: number
    advanceWidth?: number
    path: Path
    getBoundingBox(): BoundingBox
  }

  export interface RenderOptions {
    kerning?: boolean
    features?: Record<string, boolean>
  }

  export interface Font {
    unitsPerEm: number
    ascender: number
    descender: number
    tables: { os2?: { sCapHeight?: number; sxHeight?: number } }
    charToGlyph(char: string): Glyph
    hasChar(char: string): boolean
    /** Path of a text run, y down, at `fontSize` px per em. */
    getPath(text: string, x: number, y: number, fontSize: number, options?: RenderOptions): Path
    getAdvanceWidth(text: string, fontSize: number, options?: RenderOptions): number
  }

  export function parse(buffer: ArrayBuffer): Font
}

declare module 'opentype.js/dist/opentype.mjs' {
  export * from 'opentype.js'
}
