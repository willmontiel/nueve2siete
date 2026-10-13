import { MessageCircle, Sparkles } from 'lucide-react'

interface NavbarProps {
  onScrollToConfigurator: () => void
  onScrollToCatalog: () => void
}

export function Navbar({ onScrollToConfigurator, onScrollToCatalog }: NavbarProps) {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm">
        {/* Logo con link al home */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <img 
              src="/logo.svg" 
              alt="nueve2siete 3d studio" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </a>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEDE8] border border-[#DE5B2B]/20 text-[11px] font-semibold text-[#1F1E24]">
            <span className="w-2 h-2 rounded-full bg-[#DE5B2B] animate-pulse"></span>
            Bambu Lab A1 AMS Lite • 4 Colores
          </div>
        </div>

        {/* Enlaces y Acciones */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-[#64606E]">
            <button 
              onClick={onScrollToCatalog}
              className="hover:text-[#DE5B2B] transition-colors cursor-pointer"
            >
              Catálogo
            </button>
            <button 
              onClick={onScrollToConfigurator}
              className="hover:text-[#DE5B2B] transition-colors cursor-pointer flex items-center gap-1 text-[#DE5B2B] font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Visor 3D
            </button>
          </nav>

          {/* Botón WhatsApp Directo */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quisiera consultar sobre un proyecto de impresión 3D personalizada.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}
