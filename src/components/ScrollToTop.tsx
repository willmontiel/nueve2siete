import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToElement, scrollToTop } from '../lib/smoothScroll'

// New pages start at the top; links with a hash (/#proyectos) go to that section once it has rendered
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) scrollToElement(target)
    else scrollToTop()
  }, [pathname, hash])

  return null
}
