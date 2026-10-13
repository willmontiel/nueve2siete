import { Link, NavLink } from 'react-router-dom'
import { MessageCircle, Box, Home } from 'lucide-react'

export function Navbar() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm">
        {/* Logo con enlace al home */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.svg" 
              alt="nueve2siete 3d studio" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEDE8] border border-[#DE5B2B]/20 text-[11px] font-semibold text-[#1F1E24]">
            <span className="w-2 h-2 rounded-full bg-[#DE5B2B] animate-pulse"></span>
            Bambu Lab A1 AMS Lite • 4 Colores
          </div>
        </div>

        {/* Enlaces de Navegación Simplificados */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#DE5B2B] shadow-2xs font-bold'
                    : 'text-[#64606E] hover:text-[#1F1E24] hover:bg-black/5'
                }`
              }
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#DE5B2B] text-white shadow-xs font-bold'
                    : 'text-[#64606E] hover:text-[#1F1E24] hover:bg-black/5'
                }`
              }
            >
              <Box className="w-3.5 h-3.5" />
              <span>Catálogo</span>
            </NavLink>
          </nav>

          {/* Botón WhatsApp Directo */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quisiera consultar sobre un proyecto de impresión 3D.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}
