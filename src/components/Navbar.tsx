import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MessageCircle, Box, Home, Sparkles, Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl transition-all duration-300">
        <div 
          className={`mx-auto rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 ${
            scrolled 
              ? 'bg-[#F6F3EF]/90 dark:bg-[#1A1922]/90 backdrop-blur-xl border border-[#1F1E24]/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/30' 
              : 'bg-white/85 dark:bg-[#181720]/85 backdrop-blur-md border border-[#1F1E24]/8 dark:border-white/8 shadow-sm'
          }`}
        >
          {/* Logo Brand (Solo el logo oficial transparente) */}
          <Link to="/" className="flex items-center group shrink-0" aria-label="Ir al inicio de nueve2siete">
            <img 
              src="/logo.svg" 
              alt="nueve2siete" 
              className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Enlaces Centrales (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#EFEDE8]/80 dark:bg-white/5 rounded-full p-1 border border-black/5 dark:border-white/8 text-xs font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-[#252432] text-[#DE5B2B] shadow-2xs font-bold'
                    : 'text-[#64606E] dark:text-[#A3A2AE] hover:text-[#1F1E24] dark:hover:text-white'
                }`
              }
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#DE5B2B] text-white shadow-xs font-bold'
                    : 'text-[#64606E] dark:text-[#A3A2AE] hover:text-[#1F1E24] dark:hover:text-white'
                }`
              }
            >
              <Box className="w-3.5 h-3.5" />
              <span>Catálogo</span>
            </NavLink>
          </nav>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Toggle Modo Oscuro / Claro */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-[#64606E] dark:text-[#A3A2AE] hover:text-[#1F1E24] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Alternar modo claro y oscuro"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#EEBA29] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#1F1E24] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Botón WhatsApp Directo */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quisiera consultar sobre un proyecto personalizado.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Toggle Menú Móvil */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full text-[#1F1E24] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dropdown flotante en móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto w-full bg-white/95 dark:bg-[#1A1922]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-3 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  isActive 
                    ? 'bg-[#DE5B2B]/10 text-[#DE5B2B]' 
                    : 'text-[#1F1E24] dark:text-[#F6F3EF] hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </NavLink>
            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  isActive 
                    ? 'bg-[#DE5B2B] text-white font-bold' 
                    : 'text-[#1F1E24] dark:text-[#F6F3EF] hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              <Box className="w-4 h-4" />
              <span>Catálogo</span>
            </NavLink>
            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-[#64606E] dark:text-[#A3A2AE] px-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#EEBA29]" />
                Objetos Personalizados
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1 text-[11px] font-bold text-[#DE5B2B] cursor-pointer"
              >
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
