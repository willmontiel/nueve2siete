import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MessageCircle, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { whatsappUrl } from '../lib/contact'

const linkClass =
  'text-[1.0625rem] font-semibold underline decoration-2 underline-offset-[0.3em] decoration-transparent transition-[text-decoration-color] duration-200 hover:decoration-current'

// A plain bar on the page ground: wordmark, two links, the theme switch and one action
export function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  // The menu belongs to the place it was opened on, so following one of its links closes it
  const here = location.pathname + location.hash
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null)
  const menuOpen = menuOpenOn === here

  return (
    <header className="relative z-50 bg-ground">
      <div className="mx-auto max-w-[90rem] h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 rounded-full" aria-label="nueve2siete, ir al inicio">
          <img src="/logo.svg" alt="" className="h-9 sm:h-11 w-auto" />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-8 text-fg">
          <Link to="/#proyectos" className={linkClass}>Proyectos</Link>
          <NavLink to="/catalogo" className={({ isActive }) => `${linkClass} ${isActive ? 'text-accent' : ''}`}>
            Catálogo
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="grid place-items-center w-11 h-11 rounded-full text-fg transition-colors duration-200 hover:bg-surface"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a
            href={whatsappUrl('¡Hola nueve2siete! Quisiera consultar sobre un proyecto personalizado.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full bg-orange text-night font-semibold transition-[transform,background-color,color] duration-200 hover:bg-fg hover:text-ground active:scale-[0.97]"
          >
            <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpenOn(menuOpen ? null : here)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            className="md:hidden h-11 px-4 rounded-full bg-surface text-fg font-semibold"
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="menu-movil" aria-label="Principal" className="md:hidden absolute inset-x-0 top-full bg-surface rounded-b-panel px-4 pt-2 pb-8 flex flex-col">
          <Link to="/#proyectos" className="font-display text-5xl leading-tight text-fg py-2">Proyectos</Link>
          <Link to="/catalogo" className="font-display text-5xl leading-tight text-fg py-2">Catálogo</Link>
        </nav>
      )}
    </header>
  )
}
