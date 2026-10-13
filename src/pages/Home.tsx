import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  MessageCircle, 
  ChevronDown, 
  Palette,
  Sliders,
  Flame
} from 'lucide-react'
import { PRODUCTS, FILAMENT_COLORS } from '../data/products'

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  // 1. Scroll-driven animation para el Hero Cinético (Inspiración 1-1 a 1-3)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end']
  })

  // En scroll 0: El texto está de mayor tamaño y centrado.
  // Conforme scrollea (0 a 0.35): se reduce de escala y se desplaza hacia la columna izquierda
  const titleScale = useTransform(heroProgress, (v) => {
    const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024
    const startScale = isLg ? 1.35 : 1.1
    if (v <= 0) return startScale
    if (v >= 0.35) return 1.0
    const t = v / 0.35
    return startScale - t * (startScale - 1.0)
  })

  const titleX = useTransform(heroProgress, (v) => {
    const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024
    if (!isLg) return '0%'
    if (v <= 0) return '14%'
    if (v >= 0.35) return '0%'
    const t = v / 0.35
    return `${(1 - t) * 14}%`
  })
  
  // El bloque explicativo y CTAs de la derecha aparecen conforme el título llega a su posición
  // y se mantienen estables y legibles durante el trayecto principal (0.35 a 0.85)
  const detailsOpacity = useTransform(heroProgress, (v) => {
    if (v < 0.16) return 0
    if (v >= 0.35 && v <= 0.85) return 1
    if (v > 0.85) {
      const t = (v - 0.85) / 0.15
      return Math.max(0, 1 - t)
    }
    return (v - 0.16) / 0.19
  })

  const detailsY = useTransform(heroProgress, (v) => {
    if (v < 0.16) return 26
    if (v >= 0.35) return 0
    const t = (v - 0.16) / 0.19
    return 26 * (1 - t)
  })

  const detailsPointerEvents = useTransform(heroProgress, (v) => (v >= 0.22 ? 'auto' : 'none'))
  const scrollIndicatorOpacity = useTransform(heroProgress, (v) => {
    if (v <= 0) return 1
    if (v >= 0.12) return 0
    return 1 - v / 0.12
  })

  // 2. Scroll-driven animation para el Showcase Inmersivo (Inspiración 2-2)
  const { scrollYProgress: showcaseProgress } = useScroll({
    target: showcaseRef,
    offset: ['start end', 'center center']
  })

  const showcaseScale = useTransform(showcaseProgress, [0, 1], [0.88, 1])
  const showcaseRadius = useTransform(showcaseProgress, [0, 1], ['36px', '16px'])

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  const brandColors = FILAMENT_COLORS.filter(c => c.isBrandColor)

  return (
    <div className="relative pt-12 sm:pt-16">
      {/* ============================================================== */}
      {/* 1. HERO CINÉTICO CON SCROLL VERTICAL (Inspiración 1-1 a 1-3)  */}
      {/* ============================================================== */}
      <section ref={heroRef} className="relative h-[220vh] w-full">
        {/* Contenedor Sticky fijo a pantalla completa mientras se scrollea */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#F6F3EF]">
          
          {/* Líneas de rejilla suiza de fondo (Inspiración 1-1 a 1-3) */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-r border-black/[0.04] h-full" />
            <div className="border-r border-black/[0.04] h-full" />
            <div className="border-r border-black/[0.04] h-full" />
            <div className="border-r border-black/[0.04] h-full hidden sm:block" />
            <div className="border-r border-black/[0.04] h-full hidden sm:block" />
            <div className="border-r border-black/[0.04] h-full hidden lg:block" />
            <div className="border-r border-black/[0.04] h-full hidden lg:block" />
          </div>

          {/* Glow ambiental suave en GPU */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-gradient-to-tr from-[#DE5B2B]/10 via-[#9FAEE9]/15 to-[#EEBA29]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Contenido Hero */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[85vh] relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              
              {/* Columna Izquierda: Tipografía Gigante Cinética que se reduce */}
              <motion.div 
                style={{ 
                  scale: titleScale, 
                  x: titleX,
                  transformOrigin: 'left center'
                }}
                className="lg:col-span-7 flex flex-col justify-center will-change-transform"
              >
                {/* Badge Superior */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#DE5B2B]/20 text-[11px] font-bold text-[#DE5B2B] shadow-2xs mb-3 sm:mb-4 w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#DE5B2B] animate-pulse" />
                  <span>3D Studio & Personalización • Bambu Lab A1</span>
                </div>

                {/* Título en Cal Sans Semibold */}
                <h1 className="font-['Cal_Sans',sans-serif] text-4xl sm:text-7xl lg:text-8xl tracking-tight text-[#1F1E24] leading-[0.94] uppercase">
                  Impresión 3D <br />
                  <span className="text-[#DE5B2B]">que cobra</span> <br />
                  vida.
                </h1>
              </motion.div>

              {/* Columna Derecha: Se devela con opacidad y traslación a medida que avanza el scroll */}
              <motion.div 
                style={{ 
                  opacity: detailsOpacity, 
                  y: detailsY,
                  pointerEvents: detailsPointerEvents
                }}
                className="lg:col-span-5 flex flex-col gap-5 sm:gap-6"
              >
                <div className="p-5 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#1F1E24]/10 shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8576EA] uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-[#EEBA29]" />
                    <span>Diseñado & Fabricado en Colombia</span>
                  </div>

                  <p className="text-sm sm:text-base lg:text-lg text-[#64606E] font-normal leading-relaxed">
                    Transformamos ideas en piezas tangibles con precisión micrométrica. 
                    Portamicrófonos para podcasts, accesorios para streamers y objetos de autor 
                    con acabado multicapa en <strong className="text-[#1F1E24]">hasta 4 colores simultáneos</strong>.
                  </p>

                  {/* Botones de Acción */}
                  <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    <Link
                      to="/catalogo"
                      className="px-6 py-3.5 rounded-full bg-[#DE5B2B] hover:bg-[#c44e23] text-white font-bold text-sm shadow-md shadow-[#DE5B2B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>Explorar Catálogo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/catalogo/portamicrofono"
                      className="px-5 py-3.5 rounded-full bg-white hover:bg-[#EFEDE8] text-[#1F1E24] font-bold text-sm border border-black/10 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Palette className="w-4 h-4 text-[#DE5B2B]" />
                      <span>Personalizar en 3D</span>
                    </Link>
                  </div>

                  {/* Fila de Filamentos de la Marca */}
                  <div className="mt-5 pt-4 sm:pt-5 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64606E]">Paleta Oficial nueve2siete:</span>
                    <div className="flex items-center gap-1.5">
                      {brandColors.map(c => (
                        <span 
                          key={c.id} 
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className="w-4 h-4 rounded-full border border-black/15 shadow-2xs transition-transform hover:scale-125"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Indicador de Scroll en la parte inferior */}
            <motion.div 
              style={{ opacity: scrollIndicatorOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] font-bold tracking-wider text-[#64606E] uppercase pointer-events-none"
            >
              <span>Desliza para explorar</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-4 h-4 text-[#DE5B2B]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SHOWCASE INMERSIVO EN EXPANSIÓN (Inspiración 2-2)          */}
      {/* ============================================================== */}
      <section ref={showcaseRef} className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE5B2B]/10 text-xs font-bold text-[#DE5B2B] mb-3 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Showcase Insignia</span>
          </span>
          <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] tracking-tight uppercase">
            Cubo Portamicrófono Pro
          </h2>
          <p className="text-sm sm:text-base text-[#64606E] mt-2">
            La pieza favorita de podcasters y canales de streaming. Un solo cuerpo integrado con hasta 4 tonos simultáneos sin pegantes ni stickers frágiles.
          </p>
        </div>

        {/* Tarjeta que se expande hacia pantalla completa al scrollear */}
        <motion.div
          style={{
            scale: showcaseScale,
            borderRadius: showcaseRadius,
          }}
          className="relative overflow-hidden bg-gradient-to-br from-[#1F1E24] via-[#2A2931] to-[#1F1E24] text-white p-8 sm:p-14 lg:p-16 shadow-2xl border border-white/10 will-change-transform"
        >
          {/* Gráfico de fondo */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#DE5B2B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#8576EA]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Columna de Detalles y Especificaciones */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white/90 border border-white/15 w-fit">
                <span>Diámetro Universal: 42 mm</span>
              </div>

              <h3 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight uppercase">
                Ajuste perfecto para Shure SM58, Samson, Rode & Behringer
              </h3>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                Fabricado con paredes reforzadas y relleno giroidal para una absorción acústica óptima. 
                Cada cara lateral puede personalizarse con colores independientes o relieve tipográfico para tu logo.
              </p>

              {/* Grid de 3 pilares */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-[#EEBA29] uppercase">0 Pegamento</div>
                  <div className="text-[11px] text-white/70 mt-1">Fusión térmica entre capas continuas</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-[#9FAEE9] uppercase">Bambu Lab A1</div>
                  <div className="text-[11px] text-white/70 mt-1">AMS Lite 4 canales activos</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Listo en 48h</div>
                  <div className="text-[11px] text-white/70 mt-1">Producción y despacho ágil</div>
                </div>
              </div>

              {/* Botón directo de personalización */}
              <div className="pt-2">
                <Link
                  to="/catalogo/portamicrofono"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#DE5B2B] hover:bg-[#c44e23] text-white font-bold text-sm shadow-lg shadow-[#DE5B2B]/40 transition-all hover:scale-105"
                >
                  <Palette className="w-4 h-4" />
                  <span>Personalizar este modelo en 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Columna Visual: Render Isométrico y Paleta Interactiva */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-between shadow-inner">
                
                {/* Header del preview */}
                <div className="w-full flex items-center justify-between text-[11px] text-white/60 font-mono">
                  <span>MODEL_ID: CUBE_PRO_01</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LISTO PARA 3D
                  </span>
                </div>

                {/* Gráfico 3D Isométrico Estilizado */}
                <div className="relative my-auto flex items-center justify-center">
                  <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-[#DE5B2B] via-[#EEBA29] to-[#8576EA] p-1 shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full bg-[#1F1E24] rounded-xl flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#DE5B2B] flex items-center justify-center mb-2">
                        <span className="text-[10px] font-bold text-[#DE5B2B]">42mm</span>
                      </div>
                      <span className="font-['Cal_Sans',sans-serif] text-sm text-white uppercase tracking-wider">
                        nueve2siete
                      </span>
                      <span className="text-[9px] text-white/50 uppercase">Studio Grade</span>
                    </div>
                  </div>
                </div>

                {/* Selector visual de muestra */}
                <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-white/70">Zonas de Color:</span>
                  <span className="font-bold text-[#DE5B2B]">Cuerpo • Caras • Anillo</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* 3. HIGHLIGHTS DEL TALLER & BAMBU LAB (Inspiración 3)          */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 bg-white/70 border-y border-black/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#8576EA] uppercase tracking-wider block mb-2">
              Ingeniería & Materiales
            </span>
            <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] tracking-tight uppercase">
              Por qué nuestras impresiones se sienten diferentes
            </h2>
            <p className="text-sm sm:text-base text-[#64606E] mt-3">
              Combinamos calibración milimétrica en hardware Bambu Lab con acabados pensados para durar años.
            </p>
          </div>

          {/* Cards inspiradas en la captura 3 con pill tags nítidos y estética editorial */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] border border-black/5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#DE5B2B]/20 text-[10px] font-bold text-[#DE5B2B] uppercase tracking-wider mb-4">
                  TECNOLOGÍA
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] mb-2 uppercase">
                  AMS Lite 4 Colores
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] leading-relaxed">
                  Cambio automático de filamento en capas continuas. Los colores nacen integrados en la estructura sin debilidad en las uniones.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-[#1F1E24]">
                <Layers className="w-4 h-4 text-[#DE5B2B]" />
                <span>Multicolor real</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] border border-black/5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#8576EA]/20 text-[10px] font-bold text-[#8576EA] uppercase tracking-wider mb-4">
                  PRECISIÓN
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] mb-2 uppercase">
                  Boquillas 0.2 a 0.8 mm
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] leading-relaxed">
                  0.2mm para textos y detalles tipográficos imposibles de notar como líneas; 0.4mm a 0.8mm para rigidez estructural indestructible.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-[#1F1E24]">
                <Cpu className="w-4 h-4 text-[#8576EA]" />
                <span>Tolerancias micrométricas</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] border border-black/5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#EEBA29]/30 text-[10px] font-bold text-[#B8870A] uppercase tracking-wider mb-4">
                  SOSTENIBLE
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] mb-2 uppercase">
                  Filamento PLA Pro
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] leading-relaxed">
                  Termoplástico biodegradable derivado de recursos renovables (almidón vegetal). Seguro para el hogar y suave al tacto con acabado mate.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-[#1F1E24]">
                <Sparkles className="w-4 h-4 text-[#EEBA29]" />
                <span>Acabado premium</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] border border-black/5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white border border-emerald-500/20 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-4">
                  COBERTURA
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] mb-2 uppercase">
                  Envíos a Colombia
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] leading-relaxed">
                  Cada pieza se inspecciona a mano, se limpia de rebabas y se despacha en empaque amortiguado para entrega segura a cualquier ciudad.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-[#1F1E24]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantía de calidad</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. VITRINA DE PRODUCTOS (Acceso Directo al Catálogo & 3D)     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#DE5B2B] uppercase tracking-wider block mb-2">
              Colección Oficial
            </span>
            <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] tracking-tight uppercase">
              Elige tu pieza y dale color
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="mt-3 sm:mt-0 text-sm font-bold text-[#DE5B2B] hover:underline flex items-center gap-1.5"
          >
            <span>Ver catálogo completo ({PRODUCTS.length} modelos)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="p-6 rounded-3xl bg-white border border-black/8 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group interactive-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#DE5B2B] bg-[#DE5B2B]/10 px-2.5 py-0.5 rounded-full uppercase">
                    {prod.category}
                  </span>
                  {prod.badge && (
                    <span className="text-[10px] font-semibold text-[#8576EA] bg-[#9FAEE9]/20 px-2 py-0.5 rounded-full">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] group-hover:text-[#DE5B2B] transition-colors uppercase leading-snug">
                  {prod.name}
                </h3>
                
                <p className="text-xs text-[#64606E] mt-2 line-clamp-2">
                  {prod.description}
                </p>

                {/* Indicador de partes personalizables */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[#64606E]">
                  <Sliders className="w-3.5 h-3.5 text-[#DE5B2B]" />
                  <span>{prod.parts.length} zonas de color editables</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64606E] uppercase font-bold block">
                    Desde:
                  </span>
                  <span className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24]">
                    {formatCOP(prod.basePrice)}
                  </span>
                </div>

                <Link
                  to={`/catalogo/${prod.slug}`}
                  className="px-3.5 py-2 rounded-full bg-[#DE5B2B] hover:bg-[#c44e23] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalizar 3D</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PASO A PASO RÁPIDO                                         */}
      {/* ============================================================== */}
      <section className="py-14 bg-white/60 border-t border-black/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-[#F6F3EF]">
            <div className="w-10 h-10 rounded-full bg-[#DE5B2B]/10 text-[#DE5B2B] font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              01
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] uppercase mb-1">
              Escoge el Modelo
            </h4>
            <p className="text-xs text-[#64606E]">
              Explora portamicrófonos, portafotos y gadgets en nuestro catálogo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F3EF]">
            <div className="w-10 h-10 rounded-full bg-[#8576EA]/15 text-[#8576EA] font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              02
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] uppercase mb-1">
              Prueba Colores en 3D
            </h4>
            <p className="text-xs text-[#64606E]">
              Asigna filamentos en tiempo real y rota el modelo en 360 grados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F3EF]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              03
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] uppercase mb-1">
              Pide por WhatsApp
            </h4>
            <p className="text-xs text-[#64606E]">
              El resumen de tu diseño se envía en 1 clic para coordinar pago y entrega.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CALL TO ACTION FINAL                                       */}
      {/* ============================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#DE5B2B] via-[#c44e23] to-[#8576EA] p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl uppercase leading-tight tracking-tight">
              ¿Tienes un archivo STL propio o un pedido corporativo?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 font-light">
              Además de nuestro catálogo, imprimimos modelos 3D personalizados, prototipos mecánicos y tiradas con descuentos por volumen.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#DE5B2B] hover:bg-gray-100 font-bold text-sm shadow-sm transition-all hover:scale-105"
              >
                Explorar Catálogo
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Tengo una consulta o archivo 3D para cotizar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
