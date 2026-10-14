import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../../lib/contact'
import { threadPath } from '../../lib/thread'

// Lead times, shipping and payment are still open (docs/deuda.md), so the steps promise none of them
const STEPS = [
  {
    title: 'Nos cuentas la idea',
    text: 'Escríbenos por WhatsApp qué celebras o qué necesitas, cuántas piezas y los colores que te gustan. Si tienes un logo o una foto de referencia, mándala también.',
    field: 'bg-lavender text-night',
  },
  {
    title: 'Te proponemos el diseño',
    text: 'Te mostramos cómo quedaría y lo ajustamos contigo: la forma, el tamaño y los colores.',
    field: 'bg-pink text-night',
  },
  {
    title: 'La hacemos',
    text: 'Fabricamos cada pieza, una por una, en los colores que elegiste.',
    field: 'bg-lime text-night',
  },
  {
    title: 'La recibes',
    text: 'Coordinamos contigo cómo y cuándo te llega.',
    field: 'bg-mustard text-night',
  },
]

const EASE_OUT = [0.22, 1, 0.36, 1] as const

interface Thread {
  width: number
  height: number
  d: string
  /** Thinner on phones, so a small loop keeps its hole */
  stroke: number
}

// "Cómo se pide": four steps on fields of colour, threaded by one ribbon that ties a loop between each pair
// and ends wrapping the last step like a present. The ribbon draws itself with the scroll.
export function HowToOrder() {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)
  const [thread, setThread] = useState<Thread | null>(null)
  const [wrapped, setWrapped] = useState(false)

  useLayoutEffect(() => {
    const list = listRef.current!
    const measure = () => {
      const steps = [...list.querySelectorAll<HTMLElement>('[data-step]')]
      const stops = steps.map(step => ({ x: step.offsetLeft + step.offsetWidth / 2, y: step.offsetTop + step.offsetHeight / 2 }))
      const wide = window.matchMedia('(min-width: 768px)').matches
      // It comes in from the left edge of the screen, at the height of the heading
      const from = { x: -list.getBoundingClientRect().left - 20, y: -48 }
      setThread({
        width: list.offsetWidth,
        height: list.offsetHeight,
        d: threadPath(from, stops, wide ? 100 : 44),
        stroke: wide ? 26 : 18,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.75', 'end 0.7'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0, 1])
  // A zero-length path with round caps still paints a dot
  const opacity = useTransform(pathLength, [0, 0.005], [0, 1])

  return (
    <section id="como-pedir" aria-labelledby="como-pedir-titulo" className="relative px-4 sm:px-8 pt-24 sm:pt-32 pb-4 sm:pb-8">
      <div className="mx-auto max-w-6xl">
        <h2 id="como-pedir-titulo" className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[-0.03em] text-fg max-w-[12ch]">
          Del WhatsApp a tus manos
        </h2>
        <p className="mt-6 text-xl sm:text-2xl leading-snug text-fg max-w-[34ch]">Así funciona un pedido, de la idea a la entrega.</p>

        <ol ref={listRef} className="relative isolate mt-16 sm:mt-24 flex flex-col gap-28 md:gap-12">
          {thread && (
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${thread.width} ${thread.height}`}
              width={thread.width}
              height={thread.height}
              className="pointer-events-none absolute top-0 left-0 -z-10 overflow-visible text-orange"
            >
              <motion.path
                d={thread.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={thread.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength, opacity }}
              />
            </svg>
          )}

          {STEPS.map((step, i) => {
            const last = i === STEPS.length - 1
            return (
              <motion.li
                key={step.title}
                data-step
                className={`relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 md:w-[46%] md:min-h-[17rem] flex flex-col ${
                  i % 2 ? 'md:self-end' : 'md:self-start'
                } ${last ? 'pr-[28%] sm:pr-[28%]' : ''} ${step.field}`}
                initial={reduceMotion ? false : { opacity: 0, y: 48, rotate: i % 2 ? 2.5 : -2.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                onViewportEnter={last ? () => setWrapped(true) : undefined}
              >
                {last && <GiftWrap wrapped={wrapped || !!reduceMotion} />}
                <h3 className={`relative font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.02em] max-w-[12ch] ${last ? 'mt-12' : ''}`}>
                  {step.title}
                </h3>
                <p className="relative mt-5 text-lg sm:text-xl leading-snug max-w-[32ch]">{step.text}</p>
                {i === 0 && (
                  <a
                    href={whatsappUrl('¡Hola nueve2siete! Tengo una idea: ')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-auto pt-8 self-start"
                  >
                    <span className="inline-flex items-center gap-2.5 min-h-14 px-7 rounded-full bg-night text-cream text-lg font-semibold transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]">
                      <MessageCircle className="w-5 h-5" aria-hidden="true" />
                      Escribir por WhatsApp
                    </span>
                  </a>
                )}
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

// The ribbon arrives at the last step and ties it up: one band across, one down, and a bow where they cross
function GiftWrap({ wrapped }: { wrapped: boolean }) {
  const transition = (delay: number) => ({ duration: 0.7, delay, ease: EASE_OUT })
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute left-0 right-0 top-[3.25rem] h-6 bg-orange origin-left"
        initial={false}
        animate={{ scaleX: wrapped ? 1 : 0 }}
        transition={transition(0.1)}
      />
      <motion.div
        className="absolute top-0 bottom-0 right-[18%] w-6 bg-orange origin-top"
        initial={false}
        animate={{ scaleY: wrapped ? 1 : 0 }}
        transition={transition(0.4)}
      />
      <svg viewBox="-80 -60 160 130" className="absolute right-[18%] top-[3.25rem] w-36 translate-x-[calc(50%-0.75rem)] -translate-y-[calc(50%-0.75rem)] overflow-visible text-orange">
        <motion.path
          d="M 0 0 C -30 -42, -74 -34, -62 -2 C -54 22, -20 14, 0 0 C 20 14, 54 22, 62 -2 C 74 -34, 30 -42, 0 0 M 0 0 C -8 22, -22 40, -34 58 M 0 0 C 8 22, 24 40, 30 62"
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: wrapped ? 1 : 0, opacity: wrapped ? 1 : 0 }}
          transition={{ pathLength: transition(0.8), opacity: { duration: 0.01, delay: 0.8 } }}
        />
      </svg>
    </div>
  )
}
