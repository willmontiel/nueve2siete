import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MessageCircle, Box, Home, Sparkles, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
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
              ? 'bg-[#F6F3EF]/90 backdrop-blur-xl border border-[#1F1E24]/10 shadow-lg shadow-black/5' 
              : 'bg-white/85 backdrop-blur-md border border-[#1F1E24]/8 shadow-sm'
          }`}
        >
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/logo.svg" 
              alt="nueve2siete" 
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="font-['Cal_Sans',sans-serif] text-lg sm:text-xl font-bold tracking-tight text-[#1F1E24] group-hover:text-[#DE5B2B] transition-colors">
              nueve2siete
            </span>
          </Link>

          {/* Enlaces Centrales (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#EFEDE8]/80 rounded-full p-1 border border-black/5 text-xs font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#DE5B2B] shadow-2xs font-bold'
                    : 'text-[#64606E] hover:text-[#1F1E24]'
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
                    : 'text-[#64606E] hover:text-[#1F1E24]'
                }`
              }
            >
              <Box className="w-3.5 h-3.5" />
              <span>Catálogo 3D</span>
            </NavLink>
          </nav>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tag AMS Lite sutil */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEDE8] text-[10px] font-bold text-[#64606E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5B2B] animate-pulse"></span>
              <span>Bambu Lab A1</span>
            </div>

            {/* Botón WhatsApp Directo */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quisiera consultar sobre un proyecto de impresión 3D.')}`}
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
              className="md:hidden p-1.5 rounded-full text-[#1F1E24] hover:bg-black/5 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dropdown flotante en móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto w-full bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-3 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  isActive ? 'bg-[#DE5B2B]/10 text-[#DE5B2B]' : 'text-[#1F1E24] hover:bg-black/5'
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
                  isActive ? 'bg-[#DE5B2B] text-white font-bold' : 'text-[#1F1E24] hover:bg-black/5'
                }`
              }
            >
              <Box className="w-4 h-4" />
              <span>Catálogo 3D</span>
            </NavLink>
            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#64606E] px-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#EEBA29]" />
                Bambu Lab A1 AMS Lite
              </span>
              <span className="text-[10px] font-bold text-[#DE5B2B] uppercase">4 Colores</span>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
