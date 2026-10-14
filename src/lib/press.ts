type Stoppable = { stopPropagation(): void }

interface PressOptions {
  onPress: () => void
  /** Once per press, when the button comes back up (pointer lifted or slid off) */
  onRelease?: () => void
  onPressedChange: (pressed: boolean) => void
}

// One press per pointerdown. Browsers also fire click after pointerup, so click must not count again.
export function pressHandlers({ onPress, onRelease, onPressedChange }: PressOptions) {
  let pressed = false

  const release = (e: Stoppable) => {
    e.stopPropagation()
    if (!pressed) return
    pressed = false
    onPressedChange(false)
    onRelease?.()
  }

  return {
    onPointerDown(e: Stoppable) {
      e.stopPropagation()
      pressed = true
      onPressedChange(true)
      onPress()
    },
    onPointerUp: release,
    onPointerLeave: release,
  }
}
