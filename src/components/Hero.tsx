import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react'

interface HeroProps {
  onExplore: () => void
}

export function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8">
      {/* Círculos decorativos de fondo con los colores de marca */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#DE5B2B]/10 via-[#9FAEE9]/15 to-[#EEBA29]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DE5B2B]/20 shadow-xs text-xs font-bold text-[#DE5B2B] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#EEBA29]" />
          <span>Impresión 3D de Precisión • Bambu Lab A1 con AMS Lite</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1F1E24] font-display leading-[1.1]"
        >
          Diseño y fabricación 3D <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE5B2B] via-[#8576EA] to-[#EEBA29]">
            con tus colores y estilo
          </span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#64606E] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Creamos cubos para micrófonos, fidget clickers, portarretratos y artículos a medida. 
          Combina hasta 4 colores en vivo con nuestro visor 3D y recibe tu pedido listo para usar.
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#DE5B2B] hover:bg-[#c44e23] text-white font-bold text-base shadow-lg shadow-[#DE5B2B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Configurar en 3D Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#catalogo"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-[#EFEDE8] text-[#1F1E24] font-bold text-base border border-black/5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            Ver Catálogo
          </a>
        </motion.div>

        {/* Pills de tecnología y confianza */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-white">
            <div className="w-8 h-8 rounded-lg bg-[#DE5B2B]/10 flex items-center justify-center text-[#DE5B2B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">AMS Lite 4 Colores</div>
              <div className="text-[10px] text-[#64606E]">Multicolor continuo</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-white">
            <div className="w-8 h-8 rounded-lg bg-[#9FAEE9]/20 flex items-center justify-center text-[#8576EA]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Boquillas 0.2 a 0.8</div>
              <div className="text-[10px] text-[#64606E]">Alta resolución</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-white">
            <div className="w-8 h-8 rounded-lg bg-[#EEBA29]/15 flex items-center justify-center text-[#EEBA29]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Filamento Premium</div>
              <div className="text-[10px] text-[#64606E]">PLA biodegradable</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Envíos Colombia</div>
              <div className="text-[10px] text-[#64606E]">Empaque reforzado</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
