import { useRef } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'
import { Hero } from './Hero'
import { Magazine } from '../magazine/Magazine'

// The first two screens of the Home, choreographed on scroll:
// 1. The hero holds still while its corner ribbons wind back and the sentence under the motto steps aside.
// 2. The magazine rises over it like a sheet of paper, and the motto leaves letter by letter before the
//    sheet's edge reaches it.
// Under reduced motion the hero does not hold and the magazine simply follows it.
export function Opening() {
  const reduceMotion = useReducedMotion()
  const holdRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: hold } = useScroll({ target: holdRef, offset: ['start end', 'end end'] })
  const { scrollYProgress: cover } = useScroll({ target: sheetRef, offset: ['start end', 'start start'] })

  return (
    // The hero is sticky inside this box, so it stays pinned while the magazine scrolls over it
    <div className="relative">
      <Hero hold={hold} cover={cover} />
      <div ref={holdRef} aria-hidden="true" className={reduceMotion ? 'h-0' : 'h-[50svh] sm:h-[70svh]'} />
      <div ref={sheetRef} className="relative z-10 min-h-svh bg-surface rounded-t-[2.5rem] sm:rounded-t-[4rem]">
        <Magazine />
      </div>
    </div>
  )
}
