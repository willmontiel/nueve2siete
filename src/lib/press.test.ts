import { describe, expect, it } from 'vitest'
import { pressHandlers } from './press'

type Handlers = Partial<Record<'onPointerDown' | 'onPointerUp' | 'onPointerLeave' | 'onClick', (e: { stopPropagation(): void }) => void>>

const event = { stopPropagation() {} }
const fire = (handlers: Handlers, ...names: (keyof Handlers)[]) => names.forEach(name => handlers[name]?.(event))

function track() {
  let presses = 0
  const states: boolean[] = []
  const handlers = pressHandlers({ onPress: () => presses++, onPressedChange: pressed => states.push(pressed) }) as Handlers
  return { handlers, states, presses: () => presses }
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
    const { handlers, states } = track()
    fire(handlers, 'onPointerLeave', 'onPointerUp')
    expect(states).toEqual([])
  })
})
