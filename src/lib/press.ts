type Stoppable = { stopPropagation(): void }

// One press per pointerdown. Browsers also fire click after pointerup, so click must not count again.
export function pressHandlers({ onPress, onPressedChange }: { onPress: () => void; onPressedChange: (pressed: boolean) => void }) {
  let pressed = false

  const release = (e: Stoppable) => {
    e.stopPropagation()
    if (!pressed) return
    pressed = false
    onPressedChange(false)
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
