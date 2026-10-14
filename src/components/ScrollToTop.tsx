import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToElement, scrollToTop } from '../lib/smoothScroll'

// New pages start at the top; links with a hash (/#como-pedir) go to that section once the page has settled.
// The garland sets its own height from its width in its first frame, which moves every section below it, so
// the scroll to a section waits for that frame.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollToTop()
      return
    }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) scrollToElement(target)
      else scrollToTop()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
