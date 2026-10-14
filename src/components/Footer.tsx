import { useRef, type ComponentType } from 'react'
import { useInView } from 'framer-motion'
import { Mail, MessageCircle } from 'lucide-react'
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappUrl } from '../lib/contact'
import { InstagramIcon } from './InstagramIcon'
import { Ribbon } from './Ribbon'

// Read once at load so rendering stays pure
const YEAR = new Date().getFullYear()

// The faint ribbon behind the wordmark, as on page 3 of the brand guide: it enters left, loops once above the
// letters and curls out to the right (viewBox 1600 × 820, the shape of the logo)
const WORDMARK_RIBBON =
  'M -60 700 C 200 780, 500 760, 700 600 C 820 505, 840 330, 750 280 C 650 225, 560 360, 680 420 ' +
  'C 860 510, 1100 330, 1280 250 C 1420 190, 1560 240, 1660 330'

interface Contact {
  label: string
  value: string
  href: string
  icon: ComponentType<{ className?: string }>
  external: boolean
}

const CONTACTS: Contact[] = [
  { label: 'WhatsApp', value: WHATSAPP_DISPLAY, href: whatsappUrl('¡Hola nueve2siete! Tengo una idea.'), icon: MessageCircle, external: true },
  { label: 'Correo', value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail, external: false },
  { label: 'Instagram', value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, icon: InstagramIcon, external: true },
]

// The close of every page: the three ways to write, then the name across the whole width
export function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const seen = useInView(wordmarkRef, { once: true, amount: 0.4 })

  return (
    <footer aria-labelledby="cierre-titulo" className="relative overflow-hidden px-4 sm:px-8 pt-24 sm:pt-32 pb-10">
      <div className="mx-auto max-w-[90rem]">
        <h2
          id="cierre-titulo"
          className="font-display text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.03em] text-fg"
        >
          Hablemos de tu idea
        </h2>

        <ul className="mt-12 sm:mt-16 flex flex-col md:flex-row md:flex-wrap gap-x-16 gap-y-8">
          {CONTACTS.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex flex-col gap-2 text-fg"
              >
                <span className="inline-flex items-center gap-2 text-lg font-semibold">
                  <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  {label}
                </span>
                <span className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight underline decoration-[3px] underline-offset-[0.2em] decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-accent">
                  {value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div ref={wordmarkRef} className="relative isolate mt-20 sm:mt-28">
          <Ribbon
            d={WORDMARK_RIBBON}
            viewBox="0 0 1600 820"
            strokeWidth={70}
            className="absolute inset-0 -z-10 w-full h-full text-ribbon"
            duration={2.4}
            play={seen}
          />
          <img src="/logo.svg" alt="nueve2siete" className="w-full h-auto" />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-3 text-base text-fg">
          <p>Recordatorios para fiestas, merch para empresas y piezas a medida. Hecho en Colombia.</p>
          <p>© {YEAR} nueve2siete</p>
        </div>
      </div>
    </footer>
  )
}
