import { motion } from 'framer-motion'
import { Sparkles, Clock, Maximize2 } from 'lucide-react'
import { PRODUCTS, type Product } from '../data/products'

interface CatalogProps {
  onSelectProduct: (product: Product) => void
}

export function Catalog({ onSelectProduct }: CatalogProps) {
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <section id="catalogo" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
        <div>
          <span className="text-xs font-bold text-[#DE5B2B] uppercase tracking-wider block mb-2">
            Catálogo Disponible
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1E24] font-display">
            Modelos listos para personalizar
          </h2>
        </div>
        <p className="mt-3 md:mt-0 text-sm text-[#64606E] max-w-md">
          Elige cualquiera de nuestros productos base para cambiar sus colores y ver cómo lucirá antes de imprimir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((prod, idx) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div>
              {/* Badge & Categoría */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#DE5B2B] bg-[#DE5B2B]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                  {prod.category}
                </span>
                {prod.badge && (
                  <span className="text-[11px] font-semibold text-[#8576EA] bg-[#9FAEE9]/20 px-2.5 py-0.5 rounded-md">
                    {prod.badge}
                  </span>
                )}
              </div>

              {/* Nombre y Tagline */}
              <h3 className="text-lg font-bold text-[#1F1E24] group-hover:text-[#DE5B2B] transition-colors font-display">
                {prod.name}
              </h3>
              <p className="text-xs text-[#64606E] mt-1 line-clamp-2">
                {prod.description}
              </p>

              {/* Atributos clave */}
              <div className="mt-4 pt-3 border-t border-black/5 space-y-1.5 text-[11px] text-[#64606E]">
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{prod.dimensions}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Despacho en {prod.leadTimeDays} días</span>
                </div>
              </div>
            </div>

            {/* Precio y CTA */}
            <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64606E] uppercase font-bold block">Desde:</span>
                <span className="text-lg font-extrabold text-[#1F1E24] font-display">
                  {formatCOP(prod.basePrice)}
                </span>
              </div>

              <button
                onClick={() => onSelectProduct(prod)}
                className="p-2.5 rounded-xl bg-[#DE5B2B] hover:bg-[#c44e23] text-white transition-all group-hover:scale-105 cursor-pointer flex items-center gap-1 text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
