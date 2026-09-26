import { MICROPHONE } from '@nueve2siete/configurator'
import { describe, expect, it } from 'vitest'

import { micLayout } from '@/components/mic3d/mic-layout'

describe('micLayout', () => {
  it.each(MICROPHONE.sizes.map((size) => [size.key, size] as const))('builds the %s with the total height from the CMS', (_, size) => {
    const layout = micLayout(size)
    // The head reaches the total height and the handle reaches the box.
    expect(layout.head.y + layout.head.radius).toBeCloseTo(size.totalHeightMm)
    expect(layout.handle.length).toBeGreaterThan(layout.box.y - layout.box.height / 2)
    expect(layout.handle.length).toBeLessThan(layout.box.y)
    // The head rests on the box, without floating.
    expect(layout.head.y - layout.head.radius).toBeLessThan(layout.box.y + layout.box.height / 2)
  })
})
