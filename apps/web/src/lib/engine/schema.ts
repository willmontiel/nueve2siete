import { z } from 'zod'

/**
 * Contract for the logo engine's response (services/engine, POST /v1/analyze), validated on receipt
 * and converted to camelCase. It only includes what the website uses.
 */

export const logoStatusSchema = z.enum(['viable', 'adjust', 'not_viable'])

const issueSchema = z.object({
  // string and not enum: a new engine code must not break the website, it's just ignored when displayed.
  code: z.string(),
  severity: z.enum(['info', 'warning', 'error']),
  sizes: z.array(z.string()),
  detail: z.record(z.string(), z.union([z.number(), z.string()])),
})

const colorSchema = z
  .object({
    index: z.number().int(),
    hex: z.string(),
    share: z.number(),
    filament_id: z.string().nullable(),
    filament_hex: z.string().nullable(),
  })
  .transform(({ filament_id, filament_hex, ...color }) => ({
    ...color,
    filamentId: filament_id,
    filamentHex: filament_hex,
  }))

const monoSchema = z
  .object({
    status: logoStatusSchema,
    simplified: z.boolean(),
    path: z.string(),
  })

const sizeSchema = z
  .object({
    key: z.string(),
    status: logoStatusSchema,
    lost_ratio: z.number(),
    removed_features: z.number().int(),
    filled_ratio: z.number(),
    layers: z.array(
      z.object({ color_index: z.number().int(), path: z.string() }).transform(({ color_index, path }) => ({
        colorIndex: color_index,
        path,
      })),
    ),
    // The same size printed in a single filament: all colors merged into one shape.
    mono: monoSchema,
  })
  .transform(({ lost_ratio, removed_features, filled_ratio, ...size }) => ({
    ...size,
    lostRatio: lost_ratio,
    removedFeatures: removed_features,
    filledRatio: filled_ratio,
  }))

export const logoAnalysisSchema = z
  .object({
    status: logoStatusSchema,
    issues: z.array(issueSchema),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    colors: z.array(colorSchema),
    sizes: z.array(sizeSchema),
    // In a single color, touching colors merge; true if that loses the design (a crest, an illustration).
    mono_loses_detail: z.boolean(),
  })
  .transform(({ mono_loses_detail, ...analysis }) => ({ ...analysis, monoLosesDetail: mono_loses_detail }))

export type LogoStatus = z.infer<typeof logoStatusSchema>
export type LogoAnalysis = z.infer<typeof logoAnalysisSchema>
export type LogoIssue = LogoAnalysis['issues'][number]
export type LogoColor = LogoAnalysis['colors'][number]
export type LogoSize = LogoAnalysis['sizes'][number]
export type LogoLayer = LogoSize['layers'][number]

/** What the Server Action that analyzes the logo returns. */
export type LogoAnalysisResult = { ok: true; analysis: LogoAnalysis } | { ok: false; error: string }
