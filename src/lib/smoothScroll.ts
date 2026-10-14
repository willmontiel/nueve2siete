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

// A link to a section (/#proyectos) glides there, or jumps when smooth scrolling is off
export function scrollToElement(element: HTMLElement) {
  if (lenis) lenis.scrollTo(element)
  else element.scrollIntoView()
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y)
  else window.scrollTo({ top: y })
}
