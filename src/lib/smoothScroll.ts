import Lenis from 'lenis'

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis) return
  lenis = new Lenis({ autoRaf: true })
}

export function stopSmoothScroll() {
  lenis?.destroy()
  lenis = null
}

// A route change lands at the top at once, without the smooth glide
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

// A link to a section (/#proyectos) glides there, or jumps when smooth scrolling is off. Arriving from a
// shorter page, Lenis still holds that page's height as its limit, so it measures again first.
export function scrollToElement(element: HTMLElement) {
  if (!lenis) return element.scrollIntoView()
  lenis.resize()
  lenis.scrollTo(element)
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y)
  else window.scrollTo({ top: y })
}
