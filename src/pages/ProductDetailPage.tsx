import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MessageCircle, Check, Sparkles, RefreshCw, Layers, ShieldCheck, Clock, Box, ArrowLeft } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PRODUCTS, FILAMENT_COLORS, findProduct, type Product } from '../data/products'
import { ProductViewer3D } from '../components/3d/ProductViewer3D'
import { buildOrderMessage, colorName, formatCOP } from '../lib/order'
import { whatsappUrl } from '../lib/contact'

function defaultColors(product: Product): Record<string, string> {
  const colors: Record<string, string> = {}
  product.parts.forEach(part => {
    const color = FILAMENT_COLORS.find(c => c.id === part.defaultColorId)
    colors[part.id] = color ? color.hex : '#1C1C1E'
  })
  return colors
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = findProduct(slug)
  if (!product) return <Navigate to="/catalogo" replace />
  // Keyed by product so moving to another model starts from that model's own defaults
  return <ProductConfigurator key={product.id} product={product} />
}

function ProductConfigurator({ product }: { product: Product }) {
  const [selectedPartId, setSelectedPartId] = useState<string>(product.parts[0].id)
  const [customText, setCustomText] = useState<string>(product.customTextConfig?.defaultText || '')
  const [partColors, setPartColors] = useState<Record<string, string>>(() => defaultColors(product))
  const [autoRotate, setAutoRotate] = useState(true)

  const handleColorChange = (hex: string) => {
    setPartColors(prev => ({
      ...prev,
      [selectedPartId]: hex
    }))
  }

  const handleOrderWhatsApp = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DE5B2B', '#9FAFE9', '#EFBB29', '#8676EA']
    })
    window.open(whatsappUrl(buildOrderMessage(product, partColors, customText)), '_blank', 'noopener')
  }

  return (
    <div className="pt-10 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Barra de Migas de Pan / Volver y otros productos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/5 dark:border-white/8">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted dark:text-muted-night hover:text-orange dark:hover:text-orange transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>

        {/* Otros productos del catálogo */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase hidden md:inline mr-1">
            Otros modelos:
          </span>
          {PRODUCTS.filter(p => !p.hidden && p.id !== product.id).map(other => (
            <Link
              key={other.id}
              to={`/catalogo/${other.slug}`}
              className="px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-night-1 text-muted dark:text-muted-night hover:text-ink dark:hover:text-cream hover:bg-sand dark:hover:bg-night-2 border border-black/5 dark:border-white/8"
            >
              <Box className="w-3.5 h-3.5" />
              <span>{other.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Principal: Visor 3D a la izquierda, Panel de personalización a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Columna Izquierda: Canvas 3D */}
        <div className="lg:col-span-7 bg-gradient-to-b from-white to-sand dark:from-night-1 dark:to-night-1 rounded-3xl border border-black/5 dark:border-white/8 p-4 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden h-[440px] sm:h-[540px]">
          {/* Barra superior del visor con controles */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-xs font-bold text-orange uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-cream font-display">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  autoRotate 
                    ? 'bg-orange/10 text-orange border-orange/30' 
                    : 'bg-white dark:bg-night-2 text-muted dark:text-muted-night border-black/10 dark:border-white/10'
                }`}
                title="Alternar rotación automática"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Girar</span>
              </button>
            </div>
          </div>

          {/* Canvas WebGL 3D */}
          <div className="w-full flex-1 my-2">
            <ProductViewer3D
              product={product}
              partColors={partColors}
              customText={customText}
              autoRotate={autoRotate}
            />
          </div>

          {/* Pie del visor: Detalles de dimensiones */}
          <div className="z-10 flex items-center justify-between text-xs text-muted dark:text-muted-night bg-white/70 dark:bg-night-1/80 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/60 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-ink dark:text-cream">Dimensiones:</span>
              <span>{product.dimensions}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-orange">
              <Clock className="w-3.5 h-3.5" />
              <span>{product.leadTimeDays} días de producción</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Configuración de Colores */}
        <div className="lg:col-span-5 bg-white dark:bg-night-1 rounded-3xl border border-black/5 dark:border-white/8 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            {/* Descripción del producto */}
            <p className="text-xs text-muted dark:text-muted-night mb-5 pb-4 border-b border-black/5 dark:border-white/8 leading-relaxed">
              {product.description}
            </p>

            {/* Texto de Marca en vivo (si el producto lo soporta) */}
            {product.customTextConfig && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-orange/5 to-transparent dark:from-orange/10 dark:to-transparent border border-orange/20">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-orange flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {product.customTextConfig.label}
                  </label>
                  <span className="text-[11px] font-semibold text-muted dark:text-muted-night">
                    {customText.length}/{product.customTextConfig.maxLength}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={product.customTextConfig.maxLength}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={product.customTextConfig.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-night-1 text-sm font-bold text-ink dark:text-cream border border-black/10 dark:border-white/10 focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-muted dark:text-muted-night mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                  Se proyecta en tiempo real sobre las 4 caras de la caja en el visor 3D.
                </p>
              </div>
            )}

            {/* Paso 1: Elegir la parte del producto */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted dark:text-muted-night mb-2.5">
                1. Selecciona la zona a personalizar:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.parts.map(part => {
                  const isActive = part.id === selectedPartId
                  const currentHex = partColors[part.id]
                  return (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPartId(part.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? 'border-orange bg-orange/5 dark:bg-orange/10 shadow-sm'
                          : 'border-black/5 dark:border-white/8 bg-cream/60 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs" 
                          style={{ backgroundColor: currentHex }}
                        />
                        {isActive && <Check className="w-3.5 h-3.5 text-orange" />}
                      </div>
                      <div className="text-xs font-bold text-ink dark:text-cream truncate">
                        {part.name}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Paso 2: Elegir Color de la paleta (Segmento Único) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted dark:text-muted-night">
                  2. Elige el color:
                </label>
                <span className="text-xs font-bold text-orange">
                  {colorName(partColors[selectedPartId]) ?? 'Seleccionado'}
                </span>
              </div>

              {/* Grilla unificada de colores disponibles */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {FILAMENT_COLORS.map(color => {
                  const isCurrent = partColors[selectedPartId]?.toLowerCase() === color.hex.toLowerCase()
                  const isLight = color.hex === '#FFFFFF' || color.hex === '#F6F3EF' || color.hex === '#F8BBD0'
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.hex)}
                      title={color.name}
                      className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-orange ring-2 ring-orange/30 bg-orange/5 dark:bg-orange/10 shadow-xs scale-[1.02]'
                          : 'border-black/5 dark:border-white/8 hover:border-black/20 dark:hover:border-white/20 bg-white dark:bg-night-2'
                      }`}
                    >
                      <span
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-inner border border-black/10 dark:border-white/20 flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isCurrent && (
                          <Check className={`w-4 h-4 drop-shadow-md ${isLight ? 'text-ink' : 'text-white'}`} />
                        )}
                      </span>
                      <span className="text-[10px] text-muted dark:text-muted-night font-medium mt-1 truncate max-w-full">
                        {color.name.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resumen de Combinación Seleccionada */}
            <div className="p-3.5 bg-cream dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/8 mb-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-ink dark:text-cream flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange" />
                  Combinación Seleccionada:
                </span>
                {customText.trim() ? (
                  <span className="text-[11px] font-bold text-orange bg-orange/10 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                    "{customText.trim()}"
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-muted dark:text-muted-night">
                    {product.parts.length} zonas
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.parts.map(part => {
                  const hex = partColors[part.id]
                  return (
                    <div 
                      key={part.id}
                      className="bg-white dark:bg-night-2 rounded-xl p-2 border border-black/5 dark:border-white/8 flex items-center gap-2 shadow-2xs"
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shrink-0" 
                        style={{ backgroundColor: hex }}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-ink dark:text-cream truncate">{part.name}</div>
                        <div className="text-[9px] text-muted dark:text-muted-night truncate">{colorName(hex) ?? 'Personalizado'}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Precio y Botón de Pedido por WhatsApp */}
          <div className="pt-4 border-t border-black/5 dark:border-white/8">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-muted dark:text-muted-night font-medium block">Precio Estimado:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-cream font-display">
                  {formatCOP(product.basePrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Acabados de Precisión
                </span>
              </div>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange hover:bg-orange-deep active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-orange/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>Pedir esta configuración por WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-muted dark:text-muted-night mt-2">
              Te responderemos de inmediato con la confirmación de pedido y despacho en Colombia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
