import { useState, useMemo } from 'react'
import { MessageCircle, Check, Sparkles, RefreshCw, Layers, ShieldCheck, Clock, Box } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PRODUCTS, FILAMENT_COLORS, type Product } from '../data/products'
import { ProductViewer3D } from './3d/ProductViewer3D'

export function Configurator() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0])
  const [selectedPartId, setSelectedPartId] = useState<string>(PRODUCTS[0].parts[0].id)
  
  // Estado de colores por parte: { [partId]: hexColor }
  const [partColors, setPartColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    PRODUCTS[0].parts.forEach(part => {
      const color = FILAMENT_COLORS.find(c => c.id === part.defaultColorId)
      initial[part.id] = color ? color.hex : '#1C1C1E'
    })
    return initial
  })

  const [autoRotate, setAutoRotate] = useState(true)

  // Al cambiar de producto, restablecer selecciones de partes y colores por defecto
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setSelectedPartId(product.parts[0].id)
    const newColors: Record<string, string> = {}
    product.parts.forEach(part => {
      const color = FILAMENT_COLORS.find(c => c.id === part.defaultColorId)
      newColors[part.id] = color ? color.hex : '#1C1C1E'
    })
    setPartColors(newColors)
  }

  // Cambiar el color de la parte actualmente activa
  const handleColorChange = (hex: string) => {
    setPartColors(prev => ({
      ...prev,
      [selectedPartId]: hex
    }))
  }

  // Lista única de colores seleccionados en la configuración actual (para simular el AMS Lite de 4 ranuras)
  const activeColorSet = useMemo(() => {
    const hexes = Object.values(partColors)
    const uniqueHexes = Array.from(new Set(hexes))
    return uniqueHexes.map(hex => {
      const found = FILAMENT_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())
      return {
        hex,
        name: found ? found.name : 'Color Personalizado',
        isBrand: found?.isBrandColor
      }
    })
  }, [partColors])

  // Formateador de moneda colombiana
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Disparar confeti y generar enlace de WhatsApp
  const handleOrderWhatsApp = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DE5B2B', '#9FAEE9', '#EEBA29', '#8576EA']
    })

    const phone = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

    const colorBreakdown = selectedProduct.parts.map(part => {
      const hex = partColors[part.id]
      const colorObj = FILAMENT_COLORS.find(c => c.hex.toLowerCase() === hex?.toLowerCase())
      return `• ${part.name}: ${colorObj?.name || 'Personalizado'} (${hex})`
    }).join('\n')

    const message = 
`👋 ¡Hola nueve2siete! Quiero realizar un pedido personalizado:

📦 *Producto:* ${selectedProduct.name}
📐 *Dimensiones:* ${selectedProduct.dimensions}
🎨 *Colores Seleccionados:*
${colorBreakdown}

💰 *Valor estimado:* ${formatCOP(selectedProduct.basePrice)}
⏱️ *Tiempo estimado:* ${selectedProduct.leadTimeDays} día(s) hábil(es)

¿Podrían confirmarme disponibilidad y coordinar el envío? ¡Gracias!`

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section id="configurador" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Título de la sección */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEDE8] border border-[#DE5B2B]/20 text-xs font-bold text-[#DE5B2B] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Personalizador 3D en Vivo
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F1E24] font-display">
          Diseña tu pieza, elige tus colores
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#64606E]">
          Rotación en 360°, previsualización de colores y combinación de tonos en tiempo real.
        </p>
      </div>

      {/* Selector de Producto (Tabs superiores) */}
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {PRODUCTS.map(product => {
          const isSelected = product.id === selectedProduct.id
          return (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-[#DE5B2B] text-white shadow-md shadow-[#DE5B2B]/25 scale-[1.02]'
                  : 'bg-white text-[#64606E] hover:text-[#1F1E24] hover:bg-[#EFEDE8]/80 border border-black/5'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{product.name}</span>
              {product.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EFEDE8] text-[#DE5B2B]'
                }`}>
                  {product.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Grid Principal: Visor 3D a la izquierda, Panel de personalización a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Columna Izquierda: Canvas 3D */}
        <div className="lg:col-span-7 bg-gradient-to-b from-white to-[#EFEDE8] rounded-3xl border border-black/5 p-4 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden h-[420px] sm:h-[520px]">
          {/* Barra superior del visor con controles */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-xs font-bold text-[#DE5B2B] uppercase tracking-wider">
                {selectedProduct.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F1E24] font-display">
                {selectedProduct.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  autoRotate 
                    ? 'bg-[#DE5B2B]/10 text-[#DE5B2B] border-[#DE5B2B]/30' 
                    : 'bg-white text-[#64606E] border-black/10'
                }`}
                title="Alternar autorotación"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Girar</span>
              </button>
            </div>
          </div>

          {/* Canvas WebGL 3D */}
          <div className="w-full flex-1 my-2">
            <ProductViewer3D
              product={selectedProduct}
              partColors={partColors}
              autoRotate={autoRotate}
            />
          </div>

          {/* Pie del visor: Detalles de dimensiones */}
          <div className="z-10 flex items-center justify-between text-xs text-[#64606E] bg-white/70 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/60">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#1F1E24]">Dimensiones:</span>
              <span>{selectedProduct.dimensions}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-[#DE5B2B]">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedProduct.leadTimeDays} días de producción</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Configuración de Colores */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-black/5 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            {/* Paso 1: Elegir la parte del producto */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64606E] mb-2.5">
                1. Selecciona la zona a personalizar:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.parts.map(part => {
                  const isActive = part.id === selectedPartId
                  const currentHex = partColors[part.id]
                  return (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPartId(part.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#DE5B2B] bg-[#DE5B2B]/5 shadow-sm'
                          : 'border-black/5 bg-[#F6F3EF]/60 hover:bg-[#F6F3EF]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" 
                          style={{ backgroundColor: currentHex }}
                        />
                        {isActive && <Check className="w-3.5 h-3.5 text-[#DE5B2B]" />}
                      </div>
                      <div className="text-xs font-bold text-[#1F1E24] truncate">
                        {part.name}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Paso 2: Elegir Color de la paleta */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64606E]">
                  2. Elige el color:
                </label>
                <span className="text-xs font-semibold text-[#DE5B2B]">
                  {FILAMENT_COLORS.find(c => c.hex.toLowerCase() === partColors[selectedPartId]?.toLowerCase())?.name || 'Seleccionado'}
                </span>
              </div>

              {/* Colores Oficiales nueve2siete */}
              <div className="mb-3.5">
                <span className="text-[11px] font-bold text-[#DE5B2B] uppercase tracking-wide block mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Paleta Oficial nueve2siete
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {FILAMENT_COLORS.filter(c => c.isBrandColor).map(color => {
                    const isCurrent = partColors[selectedPartId]?.toLowerCase() === color.hex.toLowerCase()
                    return (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(color.hex)}
                        title={color.name}
                        className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-[#DE5B2B] ring-2 ring-[#DE5B2B]/30 bg-[#DE5B2B]/5'
                            : 'border-black/5 hover:border-black/20 bg-white'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isCurrent && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </span>
                        <span className="text-[10px] text-[#64606E] font-medium mt-1 truncate max-w-full">
                          {color.name.split(' ')[0]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Otros Colores de Paleta */}
              <div>
                <span className="text-[11px] font-bold text-[#64606E] uppercase tracking-wide block mb-2">
                  Colores Esenciales
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {FILAMENT_COLORS.filter(c => !c.isBrandColor).map(color => {
                    const isCurrent = partColors[selectedPartId]?.toLowerCase() === color.hex.toLowerCase()
                    return (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(color.hex)}
                        title={color.name}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                          isCurrent
                            ? 'border-[#DE5B2B] ring-2 ring-[#DE5B2B]/20 bg-[#DE5B2B]/5'
                            : 'border-black/5 hover:border-black/20'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shadow-inner border border-black/10 flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isCurrent && (
                            <Check className={`w-3 h-3 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Simulación AMS Lite: 4 Ranuras */}
            <div className="p-3.5 bg-[#F6F3EF] rounded-2xl border border-black/5 mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#1F1E24] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#DE5B2B]" />
                  Zonas de color ({activeColorSet.length} seleccionadas):
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const item = activeColorSet[slotIdx]
                  return (
                    <div 
                      key={slotIdx}
                      className="bg-white rounded-xl p-2 border border-black/5 flex flex-col items-center text-center shadow-2xs"
                    >
                      {item ? (
                        <>
                          <span 
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs mb-1" 
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-[10px] font-bold text-[#1F1E24] truncate w-full">
                            {item.name.split(' ')[0]}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 rounded-full border border-dashed border-black/20 mb-1" />
                          <span className="text-[10px] text-gray-400">Libre</span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Precio y Botón de Pedido por WhatsApp */}
          <div className="pt-4 border-t border-black/5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-[#64606E] font-medium block">Precio Final Estimado:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1F1E24] font-display">
                  {formatCOP(selectedProduct.basePrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Garantía de Calidad 3D
                </span>
              </div>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#DE5B2B] hover:bg-[#c44e23] active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-[#DE5B2B]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>Pedir esta configuración por WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-[#64606E] mt-2">
              Te responderemos al instante con la cotización formal y tiempos de despacho en Colombia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
