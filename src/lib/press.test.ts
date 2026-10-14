import { describe, expect, it } from 'vitest'
import { pressHandlers } from './press'

type Handlers = Partial<Record<'onPointerDown' | 'onPointerUp' | 'onPointerLeave' | 'onClick', (e: { stopPropagation(): void }) => void>>

const event = { stopPropagation() {} }
const fire = (handlers: Handlers, ...names: (keyof Handlers)[]) => names.forEach(name => handlers[name]?.(event))

function track() {
  let presses = 0
  let releases = 0
  const states: boolean[] = []
  const handlers = pressHandlers({
    onPress: () => presses++,
    onRelease: () => releases++,
    onPressedChange: pressed => states.push(pressed),
  }) as Handlers
  return { handlers, states, presses: () => presses, releases: () => releases }
}

describe('pressHandlers', () => {
  it('counts one press when the browser fires pointerdown, pointerup and click', () => {
    const { handlers, presses } = track()
    fire(handlers, 'onPointerDown', 'onPointerUp', 'onClick')
    expect(presses()).toBe(1)
  })

  it('pushes the button down and lets it back up', () => {
    const { handlers, states } = track()
    fire(handlers, 'onPointerDown', 'onPointerUp')
    expect(states).toEqual([true, false])
  })

  it('lets the button back up when the pointer slides off while pressing', () => {
    const { handlers, states } = track()
    fire(handlers, 'onPointerDown', 'onPointerLeave')
    expect(states).toEqual([true, false])
  })

  it('ignores a release that never had a press', () => {
    const { handlers, states, releases } = track()
    fire(handlers, 'onPointerLeave', 'onPointerUp')
    expect(states).toEqual([])
    expect(releases()).toBe(0)
  })

  it('lets the button go once per press, however the pointer leaves', () => {
    const { handlers, releases } = track()
    fire(handlers, 'onPointerDown', 'onPointerUp', 'onPointerLeave', 'onClick')
    expect(releases()).toBe(1)
    fire(handlers, 'onPointerDown', 'onPointerLeave', 'onPointerUp')
    expect(releases()).toBe(2)
  })
})
