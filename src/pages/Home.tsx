import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck, MessageCircle } from 'lucide-react'
import { PRODUCTS } from '../data/products'

export function Home() {
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  const featuredProducts = PRODUCTS.slice(0, 3)

  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow de fondo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#DE5B2B]/10 via-[#9FAEE9]/15 to-[#EEBA29]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DE5B2B]/20 shadow-xs text-xs font-bold text-[#DE5B2B] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#EEBA29]" />
          <span>Impresión 3D de Precisión • Bambu Lab A1 con AMS Lite</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1F1E24] font-display leading-[1.1] max-w-5xl mx-auto"
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
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#64606E] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Portamicrófonos para podcasts, clickers mecánicos, portarretratos y artículos personalizados. 
          Combina hasta 4 colores en tiempo real y pide directo por WhatsApp.
        </motion.p>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/catalogo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#DE5B2B] hover:bg-[#c44e23] text-white font-bold text-base shadow-lg shadow-[#DE5B2B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/catalogo/portamicrofono"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-[#EFEDE8] text-[#1F1E24] font-bold text-base border border-black/5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#DE5B2B]" />
            <span>Ver Portamicrófono 3D</span>
          </Link>
        </motion.div>

        {/* Especificaciones Técnicas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-white shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#DE5B2B]/10 flex items-center justify-center text-[#DE5B2B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">AMS Lite 4 Colores</div>
              <div className="text-[10px] text-[#64606E]">Multicolor continuo</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-white shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#9FAEE9]/20 flex items-center justify-center text-[#8576EA]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Boquillas 0.2 a 0.8</div>
              <div className="text-[10px] text-[#64606E]">Alta resolución</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-white shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#EEBA29]/15 flex items-center justify-center text-[#EEBA29]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Filamento Premium</div>
              <div className="text-[10px] text-[#64606E]">PLA biodegradable</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-white shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F1E24]">Envíos Colombia</div>
              <div className="text-[10px] text-[#64606E]">Empaque reforzado</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Banner de ¿Cómo Funciona? */}
      <section className="py-14 bg-white/60 border-y border-black/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1E24] font-display">
              ¿Cómo crear tu pedido?
            </h2>
            <p className="text-xs sm:text-sm text-[#64606E] mt-1.5">
              Sin registros complicados, rápido y con atención directa de los creadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-white border border-black/5 shadow-2xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#DE5B2B]/10 text-[#DE5B2B] font-extrabold text-lg flex items-center justify-center mx-auto mb-4 font-display">
                1
              </div>
              <h3 className="text-base font-bold text-[#1F1E24] mb-1">Elige un Producto</h3>
              <p className="text-xs text-[#64606E]">
                Visita nuestro catálogo y escoge el modelo que mejor se adapte a tu necesidad.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black/5 shadow-2xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#9FAEE9]/20 text-[#8576EA] font-extrabold text-lg flex items-center justify-center mx-auto mb-4 font-display">
                2
              </div>
              <h3 className="text-base font-bold text-[#1F1E24] mb-1">Personaliza en 3D</h3>
              <p className="text-xs text-[#64606E]">
                Asigna colores a cada zona del objeto con nuestra paleta oficial en tiempo real.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black/5 shadow-2xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4 font-display">
                3
              </div>
              <h3 className="text-base font-bold text-[#1F1E24] mb-1">Pide por WhatsApp</h3>
              <p className="text-xs text-[#64606E]">
                Envíanos tu diseño listo con un clic para coordinar pago, producción y entrega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Productos Destacados (Preview) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#DE5B2B] uppercase tracking-wider block mb-2">
              Populares
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1E24] font-display">
              Productos Destacados
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="mt-3 sm:mt-0 text-sm font-bold text-[#DE5B2B] hover:underline flex items-center gap-1.5"
          >
            <span>Ver todos los modelos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#DE5B2B] bg-[#DE5B2B]/10 px-2.5 py-0.5 rounded-md uppercase">
                    {prod.category}
                  </span>
                  {prod.badge && (
                    <span className="text-[11px] font-semibold text-[#8576EA] bg-[#9FAEE9]/20 px-2.5 py-0.5 rounded-md">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#1F1E24] group-hover:text-[#DE5B2B] transition-colors font-display">
                  {prod.name}
                </h3>
                <p className="text-xs text-[#64606E] mt-2 line-clamp-2">
                  {prod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64606E] uppercase font-bold block">
                    Desde:
                  </span>
                  <span className="text-xl font-extrabold text-[#1F1E24] font-display">
                    {formatCOP(prod.basePrice)}
                  </span>
                </div>

                <Link
                  to={`/catalogo/${prod.slug}`}
                  className="px-4 py-2 rounded-xl bg-[#DE5B2B] hover:bg-[#c44e23] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalizar 3D</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Call To Action Final */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#DE5B2B] via-[#c44e23] to-[#8576EA] p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              ¿Tienes un proyecto especial o una idea en mente?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90">
              Además de nuestro catálogo, imprimimos archivos STL/STEP personalizados y prototipos con tolerancias de alta precisión.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-[#DE5B2B] hover:bg-gray-100 font-bold text-sm shadow-sm transition-all hover:scale-105"
              >
                Explorar Catálogo
              </Link>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'}?text=${encodeURIComponent('¡Hola nueve2siete! Tengo una idea especial para imprimir en 3D.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
