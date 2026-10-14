import { useEffect } from 'react'
import { startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll'

// Smooth scrolling is motion too, so it stays off for visitors whose system asks to reduce motion
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => (reduceMotion.matches ? stopSmoothScroll() : startSmoothScroll())
    sync()
    reduceMotion.addEventListener('change', sync)
    return () => {
      reduceMotion.removeEventListener('change', sync)
      stopSmoothScroll()
    }
  }, [])

  return null
}
