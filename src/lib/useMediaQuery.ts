import { useSyncExternalStore } from 'react'

// Whether a media query matches, kept live as the window or the system settings change
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    onChange => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
