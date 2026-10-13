import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics suaves para no dar lag ni tirones
  const springConfig = { damping: 25, stiffness: 280, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Solo activar si el dispositivo tiene puntero fino (mouse) y soporte de hover real
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setEnabled(mediaQuery.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setEnabled(e.matches)
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Detección sutil de elementos interactivos
      const target = e.target as HTMLElement | null
      const isInteractive = target?.closest('a, button, [role="button"], input, select, .interactive-card')
      setIsHovered(!!isInteractive)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, isVisible, mouseX, mouseY])

  if (!enabled || !isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 2.2 : 1,
          backgroundColor: isHovered ? 'rgba(222, 91, 43, 0.2)' : 'rgba(222, 91, 43, 0.85)',
          borderColor: isHovered ? '#DE5B2B' : 'transparent',
          borderWidth: isHovered ? 1.5 : 0,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-3.5 h-3.5 rounded-full backdrop-blur-[1px] transition-colors"
      />
    </motion.div>
  )
}
