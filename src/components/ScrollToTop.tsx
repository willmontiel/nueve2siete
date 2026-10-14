import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToElement, scrollToTop } from '../lib/smoothScroll'

// How long a section reached by a link is followed while content above it settles
const FOLLOW_MS = 3000
const VISITOR_INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

// New pages start at the top; links with a hash (/#como-pedir) go to that section once the page has settled.
// The garland sets its own height from its width in its first frame, which moves every section below it, so
// the scroll to a section waits for that frame. Its projects can also arrive later from Supabase and change its
// length, so the section is followed for a moment, until the visitor scrolls on their own.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollToTop()
      return
    }
    let target: HTMLElement | null = null
    const frame = requestAnimationFrame(() => {
      target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) scrollToElement(target)
      else scrollToTop()
    })

    const follow = new ResizeObserver(() => {
      if (target) scrollToElement(target)
    })
    follow.observe(document.body)
    const stop = () => follow.disconnect()
    const timer = setTimeout(stop, FOLLOW_MS)
    for (const type of VISITOR_INPUT) window.addEventListener(type, stop, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      stop()
      for (const type of VISITOR_INPUT) window.removeEventListener(type, stop)
    }
  }, [pathname, hash])

  return null
}
