import { useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useMatch } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FLOWER, FLOWER_MASK, bloomSize, petalCentres } from '../lib/bloom'
import { playMechanicalClick } from '../utils/sound'

const PETALS = petalCentres()
// Each press turns the petals one step on, with a little overshoot
const STEP = 360 / FLOWER.petals
const SPIN = { type: 'spring', stiffness: 260, damping: 14 } as const

// The theme switch, drawn as the clicker flower and pinned to the bottom right of every page. It clicks like
// the clicker, its face sleeps in the dark theme, and the new theme blooms out of it through a flower-shaped
// mask (View Transitions; the styles are the .blooming rules in index.css). Without View Transitions, or
// under reduced motion, the theme just changes.
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const reduceMotion = useReducedMotion()
  const [turns, setTurns] = useState(0)
  // The product page keeps its price and order button along the bottom of the screen: on a phone the switch
  // rides above that bar, and on a wide screen it moves to the left, over the corner of the piece's stage
  const productPage = useMatch('/catalogo/:slug') !== null
  const dark = theme === 'dark'

  const flip = (event: MouseEvent<HTMLButtonElement>) => {
    playMechanicalClick()
    setTurns(t => t + 1)
    if (reduceMotion || !('startViewTransition' in document)) {
      toggleTheme()
      return
    }
    const box = event.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const root = document.documentElement
    root.style.setProperty('--bloom-x', `${x}px`)
    root.style.setProperty('--bloom-y', `${y}px`)
    root.style.setProperty('--bloom-size', `${bloomSize(x, y, window.innerWidth, window.innerHeight)}px`)
    root.style.setProperty('--bloom-mask', FLOWER_MASK)
    root.classList.add('blooming')
    const transition = document.startViewTransition(() => flushSync(toggleTheme))
    transition.finished.finally(() => root.classList.remove('blooming'))
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Modo oscuro"
      title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={flip}
      className={`group fixed z-[60] w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        productPage
          ? 'right-4 sm:right-6 bottom-[calc(7rem+env(safe-area-inset-bottom))] lg:right-auto lg:left-6 lg:bottom-6'
          : 'right-4 sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" aria-hidden="true" focusable="false">
        <g className="origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:rotate-[14deg]">
          <motion.g
            initial={false}
            animate={{ rotate: turns * STEP }}
            transition={SPIN}
            className="fill-pink dark:fill-lavender stroke-ground"
            strokeWidth={5}
          >
            {PETALS.map(({ x, y }) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={FLOWER.petal} />
            ))}
          </motion.g>
        </g>
        {/* The button of the clicker sinks while it is pressed */}
        <g className="origin-center [transform-box:fill-box] transition-transform duration-100 group-active:scale-[0.86]">
          <circle cx="50" cy="50" r={FLOWER.centre} className="fill-mustard stroke-ground" strokeWidth={5} />
          <g className="stroke-ink" strokeWidth={3.2} strokeLinecap="round" fill="none">
            <g className="dark:hidden">
              <circle cx="43" cy="46" r="1.6" className="fill-ink" />
              <circle cx="57" cy="46" r="1.6" className="fill-ink" />
              <path d="M42.5 54 Q50 61 57.5 54" />
            </g>
            <g className="hidden dark:inline">
              <path d="M39 47 Q43 50.5 47 47" />
              <path d="M53 47 Q57 50.5 61 47" />
              <path d="M46 56 Q50 58.5 54 56" />
            </g>
          </g>
        </g>
      </svg>
    </button>
  )
}
