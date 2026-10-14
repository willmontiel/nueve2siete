import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../lib/contact'
import { BowButton } from './RibbonBurst'

const linkClass =
  'text-[1.0625rem] font-semibold underline decoration-2 underline-offset-[0.3em] decoration-transparent transition-[text-decoration-color] duration-200 hover:decoration-current'

// A plain bar on the page ground: the links on the left (the menu button on smaller screens), the wordmark large
// in the middle, the bow and WhatsApp on the right. The two sides share the leftover width equally, so the
// wordmark stays centred. The theme switch is not here: it floats at the bottom right (ThemeSwitch.tsx).
export function Navbar() {
  const location = useLocation()
  // The menu belongs to the place it was opened on, so following one of its links closes it
  const here = location.pathname + location.hash
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null)
  const menuOpen = menuOpenOn === here

  return (
    <header className="relative z-50 bg-ground">
      <div className="mx-auto max-w-[90rem] h-20 sm:h-24 px-4 sm:px-8 grid grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] items-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <nav aria-label="Principal" className="hidden lg:flex items-center gap-8 text-fg">
            <Link to="/#proyectos" className={linkClass}>Proyectos</Link>
            <Link to="/#como-pedir" className={linkClass}>Cómo pedir</Link>
            <NavLink to="/catalogo" className={({ isActive }) => `${linkClass} ${isActive ? 'text-accent' : ''}`}>
              Catálogo
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpenOn(menuOpen ? null : here)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            className="lg:hidden h-11 px-4 rounded-full bg-surface text-fg font-semibold"
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>
        </div>

        <Link to="/" className="rounded-2xl" aria-label="nueve2siete, ir al inicio">
          <img src="/wordmark.svg" alt="" width={639} height={210} className="block h-11 sm:h-14 lg:h-16 w-auto" />
        </Link>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <BowButton />
          <a
            href={whatsappUrl('¡Hola nueve2siete! Quisiera consultar sobre un proyecto personalizado.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="inline-flex items-center gap-2 h-11 px-3.5 sm:px-5 rounded-full bg-orange text-night font-semibold transition-[transform,background-color,color] duration-200 hover:bg-fg hover:text-ground active:scale-[0.97]"
          >
            <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {menuOpen && (
        <nav id="menu-movil" aria-label="Principal" className="lg:hidden absolute inset-x-0 top-full bg-surface rounded-b-panel px-4 pt-2 pb-8 flex flex-col">
          <Link to="/#proyectos" className="font-display text-5xl leading-tight text-fg py-2">Proyectos</Link>
          <Link to="/#como-pedir" className="font-display text-5xl leading-tight text-fg py-2">Cómo pedir</Link>
          <Link to="/catalogo" className="font-display text-5xl leading-tight text-fg py-2">Catálogo</Link>
        </nav>
      )}
    </header>
  )
}
