import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Clock, Maximize2, Search, Filter, Box } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import { formatCOP } from '../lib/order'

const CATEGORIES = [
  { id: 'all', label: 'Todos los Productos' },
  { id: 'audio', label: 'Portamicrófonos' },
  { id: 'gadgets', label: 'Clickers & Fidgets' },
  { id: 'decor', label: 'Portafotos' },
]

export function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (product.hidden) return false

      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="pt-10 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[75vh]">
      {/* Header del Catálogo */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand dark:bg-white/10 border border-orange/20 text-xs font-bold text-orange mb-3">
          <Box className="w-3.5 h-3.5" />
          Catálogo Oficial nueve2siete
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink dark:text-cream font-display">
          Colección Oficial
        </h1>
        <p className="mt-3 text-base sm:text-lg text-muted dark:text-muted-night">
          Explora nuestros diseños y modelos exclusivos. 
          Selecciona cualquiera para personalizar su paleta de colores y pedirlo directamente por WhatsApp.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-black/5 dark:border-white/8">
        {/* Chips de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-orange hidden sm:block shrink-0 mr-1" />
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange text-white shadow-sm shadow-orange/25 scale-[1.02]'
                    : 'bg-white dark:bg-night-1 text-muted dark:text-muted-night hover:text-ink dark:hover:text-cream hover:bg-sand dark:hover:bg-night-2 border border-black/5 dark:border-white/8'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-night-1 text-ink dark:text-cream border border-black/10 dark:border-white/10 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
          <Box className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-ink dark:text-cream">No se encontraron productos</h3>
          <p className="text-xs text-muted dark:text-muted-night mt-1">
            Intenta con otro término de búsqueda o cambia la categoría seleccionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Categoría & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-orange bg-orange/10 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {prod.category}
                  </span>
                  {prod.badge && (
                    <span className="text-[11px] font-semibold text-violet bg-lavender/20 px-2.5 py-0.5 rounded-md">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Título y Tagline */}
                <h2 className="text-lg font-bold text-ink dark:text-cream group-hover:text-orange transition-colors font-display">
                  {prod.name}
                </h2>
                <p className="text-xs text-muted dark:text-muted-night mt-1.5 line-clamp-2">
                  {prod.description}
                </p>

                {/* Especificaciones */}
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/8 space-y-1.5 text-[11px] text-muted dark:text-muted-night">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>{prod.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Fabricación: {prod.leadTimeDays} día(s)</span>
                  </div>
                </div>
              </div>

              {/* Precio y Enlace al Personalizador */}
              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted dark:text-muted-night uppercase font-bold block">
                    Desde:
                  </span>
                  <span className="text-lg font-extrabold text-ink dark:text-cream font-display">
                    {formatCOP(prod.basePrice)}
                  </span>
                </div>

                <Link
                  to={`/catalogo/${prod.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-orange hover:bg-orange-deep text-white transition-all group-hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalizar</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
