import { motion, useReducedMotion } from 'framer-motion'
import { COLORS, findColor, type PartColors, type Product } from '../../data/products'

const heading = 'font-display text-[clamp(1.9rem,2.8vw,2.6rem)] leading-none tracking-[-0.02em] text-fg'

export function PartPicker({
  product,
  colors,
  selected,
  onSelect,
}: {
  product: Product
  colors: PartColors
  selected: string
  onSelect: (partId: string) => void
}) {
  return (
    <section aria-labelledby="que-parte">
      <h2 id="que-parte" className={heading}>
        ¿Qué parte?
      </h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {product.parts.map(part => {
          const on = part.id === selected
          return (
            <button
              key={part.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(part.id)}
              className={`inline-flex items-center gap-3 min-h-14 pl-3 pr-6 rounded-full text-lg font-semibold transition-[background-color,color,transform] duration-200 active:scale-95 ${
                on ? 'bg-fg text-ground' : 'bg-surface text-fg hover:bg-fg/10'
              }`}
            >
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full border-[3px] border-current/25"
                style={{ backgroundColor: findColor(colors[part.id])?.hex }}
              />
              {part.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

// A loop of ribbon, like the ones in the letters of the logo, tied round the chosen colour (viewBox 64 × 64)
const LOOP = 'M 12 54 C 2 40, 6 10, 32 5 C 56 1, 64 26, 58 42 C 52 58, 28 63, 15 53 C 8 47, 6 38, 11 30'

export function ColorPicker({
  partName,
  current,
  onPick,
}: {
  partName: string
  /** Colour id of the selected part */
  current: string
  onPick: (colorId: string) => void
}) {
  const reduceMotion = useReducedMotion()
  return (
    <section aria-labelledby="que-color">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="que-color" className={heading}>
          ¿De qué color?
        </h2>
        <p className="text-xl text-fg" aria-live="polite">
          {partName}: <span className="font-semibold">{findColor(current)?.name}</span>
        </p>
      </div>
      <div className="mt-5 grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-x-3 gap-y-4">
        {COLORS.map(color => {
          const on = color.id === current
          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={on}
              aria-label={color.name}
              title={color.name}
              onClick={() => onPick(color.id)}
              className="relative aspect-square w-full max-w-14 justify-self-center rounded-full border-[3px] border-fg/15 transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{ backgroundColor: color.hex }}
            >
              {on && (
                <svg aria-hidden="true" viewBox="0 0 64 64" className="pointer-events-none absolute -inset-[30%] overflow-visible text-fg">
                  <motion.path
                    // A new key on each pick draws the loop again
                    key={color.id}
                    d={LOOP}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
                    strokeLinecap="round"
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function TextPicker({
  config,
  value,
  onChange,
}: {
  config: NonNullable<Product['customTextConfig']>
  value: string
  onChange: (text: string) => void
}) {
  return (
    <section aria-labelledby="que-dice">
      <h2 id="que-dice" className={heading}>
        ¿Qué dice?
      </h2>
      <input
        type="text"
        aria-labelledby="que-dice"
        aria-describedby="que-dice-nota"
        maxLength={config.maxLength}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={config.placeholder}
        className="mt-5 w-full h-16 px-7 rounded-full bg-surface text-xl font-semibold text-fg placeholder:text-fg-muted placeholder:font-normal"
      />
      <p id="que-dice-nota" className="mt-3 px-2 flex justify-between gap-4 text-base text-fg-muted">
        <span>{config.label}, en las cuatro caras de la caja.</span>
        <span>
          {value.length}/{config.maxLength}
        </span>
      </p>
    </section>
  )
}
