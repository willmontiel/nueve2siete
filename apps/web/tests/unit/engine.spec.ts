import { EXAMPLE_FILAMENTS, MICROPHONE } from '@nueve2siete/configurator'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EngineError, analyzeLogoFile } from '@/lib/engine/client'
import { issueMessage, logoSummaryLines } from '@/lib/engine/messages'
import { engineOptions } from '@/lib/engine/options'
import type { LogoIssue } from '@/lib/engine/schema'
import { MAX_LOGO_BYTES, checkLogoFile } from '@/lib/engine/upload'

// Real engine response (flat_two_colors.png, size S), with the paths trimmed.
const ENGINE_RESPONSE = {
  status: 'viable',
  issues: [],
  width: 1024,
  height: 1024,
  background: 'uniform',
  background_hex: '#FFFFFF',
  colors: [
    { index: 0, hex: '#1F1B16', share: 0.8558, filament_id: 'black', filament_hex: '#1F1B16', filament_delta_e: 0 },
    { index: 1, hex: '#E95C21', share: 0.1442, filament_id: 'orange', filament_hex: '#E95C21', filament_delta_e: 0 },
  ],
  sizes: [
    {
      key: 'S',
      status: 'viable',
      px_per_mm: 26.62,
      lost_ratio: 0.0001,
      removed_features: 0,
      filled_ratio: 0,
      layers: [
        { color_index: 0, path: 'M481 19 473 21 Z' },
        { color_index: 1, path: 'M233 602 233 665 Z' },
      ],
      mono: { status: 'viable', lost_ratio: 0, removed_features: 0, filled_ratio: 0, simplified: false, path: 'M481 19 Z' },
    },
  ],
  mono_loses_detail: false,
  metrics: { nozzle_mm: 0.4, min_feature_mm: 0.6, min_gap_mm: 0.5 },
}

const logo = new Blob(['png'], { type: 'image/png' })
const options = engineOptions(MICROPHONE, EXAMPLE_FILAMENTS)

function mockFetch(response: Response | Error) {
  const fetchMock = vi.fn(async () => {
    if (response instanceof Error) throw response
    return response
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('engineOptions', () => {
  it('sends the logo area of each size, the filaments and the nozzle from the CMS', () => {
    expect(options.sizes[0]).toEqual({ key: 'S', logo_width_mm: 37, logo_height_mm: 37 })
    expect(options.sizes.map((s) => s.key)).toEqual(['S', 'M', 'L', 'XL'])
    expect(options.max_colors).toBe(4)
    expect(options.nozzle_mm).toBe(0.4)
    expect(options.filaments).toContainEqual({ id: 'black', hex: '#1F1B16' })
  })
})

describe('analyzeLogoFile', () => {
  it('sends the file and the options, and returns the response in camelCase', async () => {
    const fetchMock = mockFetch(Response.json(ENGINE_RESPONSE))
    const analysis = await analyzeLogoFile(logo, 'logo.png', options)

    expect(analysis.colors[1]).toEqual({ index: 1, hex: '#E95C21', share: 0.1442, filamentId: 'orange', filamentHex: '#E95C21' })
    expect(analysis.sizes[0]).toMatchObject({ key: 'S', lostRatio: 0.0001, removedFeatures: 0, filledRatio: 0 })
    expect(analysis.sizes[0]!.layers[0]).toEqual({ colorIndex: 0, path: 'M481 19 473 21 Z' })

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toMatch(/\/v1\/analyze$/)
    const body = init.body as FormData
    expect(body.get('file')).toBeInstanceOf(Blob)
    expect(JSON.parse(body.get('options') as string)).toEqual(options)
  })

  it.each([
    [415, 'unsupported'],
    [413, 'too_large'],
    [500, 'unavailable'],
  ])('maps status %i to %s', async (status, kind) => {
    mockFetch(new Response('{}', { status }))
    await expect(analyzeLogoFile(logo, 'logo.png', options)).rejects.toMatchObject({ kind })
  })

  it('reports when the engine does not respond', async () => {
    mockFetch(new TypeError('fetch failed'))
    const error = await analyzeLogoFile(logo, 'logo.png', options).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(EngineError)
    expect(error).toMatchObject({ kind: 'unavailable' })
  })

  it('rejects a response that breaks the contract', async () => {
    mockFetch(Response.json({ status: 'maybe' }))
    await expect(analyzeLogoFile(logo, 'logo.png', options)).rejects.toMatchObject({ kind: 'invalid_response' })
  })
})

describe('issueMessage', () => {
  const issue = (code: string, sizes: string[] = [], detail = {}): LogoIssue => ({
    code,
    severity: 'warning',
    sizes,
    detail,
  })

  it('names the affected sizes', () => {
    expect(issueMessage(issue('fine_detail', ['S', 'M']), MICROPHONE)).toContain('en Small y Medium')
  })

  it('does not name sizes if all are affected', () => {
    expect(issueMessage(issue('fine_detail', ['S', 'M', 'L', 'XL']), MICROPHONE)).not.toContain(' en ')
  })

  it('uses the engine data', () => {
    expect(issueMessage(issue('too_many_colors', [], { found: 6, max: 4 }), MICROPHONE)).toContain(
      'Tiene 6 colores y podemos imprimir hasta 4',
    )
  })

  it('ignores unknown codes', () => {
    expect(issueMessage(issue('something_new'), MICROPHONE)).toBeNull()
  })
})

describe('logoSummaryLines', () => {
  it('summarizes the verdict for the chosen size and the logo filaments', () => {
    expect(
      logoSummaryLines({ status: 'viable', sizeLabel: 'Medium', colorNames: ['Negro', 'Naranja'], single: false }),
    ).toEqual(['• Logo: viable en Medium (les envío el archivo por aquí)', '• Colores del logo: Negro y Naranja'])
  })

  it('notes when the logo is single-color and with which finish', () => {
    expect(
      logoSummaryLines({ status: 'viable', sizeLabel: 'Small', colorNames: ['Blanco'], single: true, finish: 'Plano' }),
    ).toEqual([
      '• Logo: viable en Small (les envío el archivo por aquí)',
      '• Color del logo: Blanco (un solo color)',
      '• Acabado del logo: plano',
    ])
  })
})

describe('checkLogoFile', () => {
  it('accepts images up to 10 MB', () => {
    expect(checkLogoFile({ size: 1000, type: 'image/png' })).toBeNull()
    expect(checkLogoFile({ size: MAX_LOGO_BYTES, type: 'image/webp' })).toBeNull()
  })

  it('lets untyped files through: the engine checks the content', () => {
    expect(checkLogoFile({ size: 1000, type: '' })).toBeNull()
  })

  it('rejects empty, oversized and other formats', () => {
    expect(checkLogoFile({ size: 0, type: 'image/png' })).toMatch(/vacío/)
    expect(checkLogoFile({ size: MAX_LOGO_BYTES + 1, type: 'image/png' })).toMatch(/10 MB/)
    expect(checkLogoFile({ size: 1000, type: 'application/pdf' })).toMatch(/PNG, JPG, WebP o GIF/)
  })
})
