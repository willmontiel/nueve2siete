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
  Building2,
  PartyPopper,
  Gift,
  CheckCircle2
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
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#F6F3EF] dark:bg-[#121117] transition-colors duration-300">
          
          {/* Líneas de rejilla suiza de fondo (Inspiración 1-1 a 1-3) */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full hidden sm:block" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full hidden sm:block" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full hidden lg:block" />
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] h-full hidden lg:block" />
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/10 border border-[#DE5B2B]/20 text-[11px] font-bold text-[#DE5B2B] shadow-2xs mb-3 sm:mb-4 w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#DE5B2B] animate-pulse" />
                  <span>Diseño de Autor & Personalización</span>
                </div>

                {/* Título en Cal Sans Semibold */}
                <h1 className="font-['Cal_Sans',sans-serif] text-4xl sm:text-7xl lg:text-8xl tracking-tight text-[#1F1E24] dark:text-[#F6F3EF] leading-[0.94] uppercase">
                  Piezas únicas <br />
                  <span className="text-[#DE5B2B]">que cobran</span> <br />
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
                <div className="p-5 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#1A1922]/95 backdrop-blur-md border border-[#1F1E24]/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8576EA] uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-[#EEBA29]" />
                    <span>Diseñado & Fabricado en Colombia</span>
                  </div>

                  <p className="text-sm sm:text-base lg:text-lg text-[#64606E] dark:text-[#A3A2AE] font-normal leading-relaxed">
                    Transformamos ideas en piezas tangibles con precisión micrométrica. 
                    Portamicrófonos para podcasts, accesorios para streamers y objetos de autor 
                    con acabado multicapa en <strong className="text-[#1F1E24] dark:text-white">hasta 4 colores simultáneos</strong>.
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
                      className="px-5 py-3.5 rounded-full bg-white dark:bg-[#252432] hover:bg-[#EFEDE8] dark:hover:bg-[#2E2D3B] text-[#1F1E24] dark:text-white font-bold text-sm border border-black/10 dark:border-white/10 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Palette className="w-4 h-4 text-[#DE5B2B]" />
                      <span>Personalizar en Vivo</span>
                    </Link>
                  </div>

                  {/* Muestra de Colores Oficiales */}
                  <div className="mt-5 pt-4 sm:pt-5 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64606E] dark:text-[#A3A2AE]">Paleta Oficial nueve2siete:</span>
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
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] font-bold tracking-wider text-[#64606E] dark:text-[#A3A2AE] uppercase pointer-events-none"
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
      {/* 2. PEDIDOS CORPORATIVOS & EVENTOS A MEDIDA                   */}
      {/* ============================================================== */}
      <section ref={showcaseRef} className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE5B2B]/10 dark:bg-[#DE5B2B]/20 text-xs font-bold text-[#DE5B2B] mb-3 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Empresas • Fiestas • Recordatorios</span>
          </span>
          <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] dark:text-[#F6F3EF] tracking-tight uppercase">
            ¿Tienes un diseño especial o un pedido corporativo?
          </h2>
          <p className="text-sm sm:text-base text-[#64606E] dark:text-[#A3A2AE] mt-2">
            Creamos piezas a medida para empresas, fiestas, celebraciones de marca y recordatorios memorables que nadie olvidará.
          </p>
        </div>

        {/* Tarjeta interactiva con scroll cinético */}
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
            
            {/* Columna de Enfoque y Beneficios */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white/90 border border-white/15 w-fit">
                <Gift className="w-3.5 h-3.5 text-[#EEBA29]" />
                <span>Fabricación a Medida desde 10 unidades</span>
              </div>

              <h3 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight uppercase">
                Haz que tu marca o tu evento tengan piezas que impacten de verdad
              </h3>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                Diseñamos y fabricamos objetos personalizados con tu logotipo en relieve, nombres o fechas especiales. Sin moldes costosos, con acabados impecables y combinaciones de hasta 4 colores integrados.
              </p>

              {/* Grid de 3 Pilares del Enfoque */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-[#DE5B2B] uppercase flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Empresas
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    Merchandising exclusivo, trofeos y accesorios con tu logo oficial
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-[#EEBA29] uppercase flex items-center gap-1.5">
                    <PartyPopper className="w-3.5 h-3.5" />
                    Fiestas & Eventos
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    Recordatorios para bodas, aniversarios y fiestas temáticas
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Precios por Volumen
                  </div>
                  <div className="text-[11px] text-white/70 mt-1">
                    Descuentos escalonados y muestra previa antes de producción
                  </div>
                </div>
              </div>

              {/* Botón directo de cotización por WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quisiera cotizar un pedido a medida para una empresa / evento / fiesta.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar Pedido por WhatsApp</span>
                </a>

                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  <span>Ver Modelos de Referencia</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Columna Visual: Tarjetas de Aplicaciones Reales */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-[#DE5B2B]/20 flex items-center justify-center text-[#DE5B2B] shrink-0 font-bold text-xl">
                  🏢
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Kits Corporativos</div>
                  <div className="text-[11px] text-white/70 mt-0.5">Porta-micrófonos de estudio, llaveros reforzados y stands de escritorio con tu marca.</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-[#EEBA29]/20 flex items-center justify-center text-[#EEBA29] shrink-0 font-bold text-xl">
                  💍
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Recordatorios de Bodas & Fiestas</div>
                  <div className="text-[11px] text-white/70 mt-0.5">Detalles grabados con nombres de los novios, fecha y colores de la celebración.</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-[#8576EA]/20 flex items-center justify-center text-[#8576EA] shrink-0 font-bold text-xl">
                  🎨
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Personalización Total</div>
                  <div className="text-[11px] text-white/70 mt-0.5">Si tienes un boceto o archivo, lo ajustamos y fabricamos en hasta 4 tonos continuos.</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* 3. HIGHLIGHTS DEL TALLER & CALIDAD DE ACABADOS                */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 bg-white/70 dark:bg-[#16151D]/70 border-y border-black/5 dark:border-white/8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#8576EA] uppercase tracking-wider block mb-2">
              Diseño & Calidad de Acabados
            </span>
            <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] dark:text-[#F6F3EF] tracking-tight uppercase">
              Por qué nuestras piezas se sienten diferentes
            </h2>
            <p className="text-sm sm:text-base text-[#64606E] dark:text-[#A3A2AE] mt-3">
              Combinamos tolerancias de precisión con materiales y acabados pensados para durar años.
            </p>
          </div>

          {/* Cards inspiradas en la captura 3 con pill tags nítidos y estética editorial */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-[#DE5B2B]/20 text-[10px] font-bold text-[#DE5B2B] uppercase tracking-wider mb-4">
                  TECNOLOGÍA
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF] mb-2 uppercase">
                  Fusión Multicolor
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] leading-relaxed">
                  Integración directa de hasta 4 colores en una sola pieza continua, sin pintura que se desgaste ni uniones frágiles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/8 flex items-center gap-2 text-xs font-semibold text-[#1F1E24] dark:text-[#F6F3EF]">
                <Layers className="w-4 h-4 text-[#DE5B2B]" />
                <span>Multicolor permanente</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-[#8576EA]/20 text-[10px] font-bold text-[#8576EA] uppercase tracking-wider mb-4">
                  DEFINICIÓN
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF] mb-2 uppercase">
                  Detalle Tipográfico
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] leading-relaxed">
                  Relieves ultra limpios y letras nítidas diseñadas para verse impecables en cámara, streaming y primeros planos.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/8 flex items-center gap-2 text-xs font-semibold text-[#1F1E24] dark:text-[#F6F3EF]">
                <Cpu className="w-4 h-4 text-[#8576EA]" />
                <span>Relieves nítidos</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-[#EEBA29]/30 text-[10px] font-bold text-[#B8870A] dark:text-[#EEBA29] uppercase tracking-wider mb-4">
                  ESTÉTICA
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF] mb-2 uppercase">
                  Acabado Satinado Mate
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] leading-relaxed">
                  Textura suave no reflectiva que elimina brillos indeseados bajo las luces de estudio y sets de grabación.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/8 flex items-center gap-2 text-xs font-semibold text-[#1F1E24] dark:text-[#F6F3EF]">
                <Sparkles className="w-4 h-4 text-[#EEBA29]" />
                <span>Tacto profesional</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3EF] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
                  COBERTURA
                </span>
                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF] mb-2 uppercase">
                  Envíos a Colombia
                </h3>
                <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] leading-relaxed">
                  Cada pieza se inspecciona a mano, se pule minuciosamente y se despacha en empaque protector a cualquier ciudad del país.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/8 flex items-center gap-2 text-xs font-semibold text-[#1F1E24] dark:text-[#F6F3EF]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
            <h2 className="font-['Cal_Sans',sans-serif] text-3xl sm:text-5xl text-[#1F1E24] dark:text-[#F6F3EF] tracking-tight uppercase">
              Elige tu pieza y dale color
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="mt-3 sm:mt-0 text-sm font-bold text-[#DE5B2B] hover:underline flex items-center gap-1.5"
          >
            <span>Ver catálogo completo ({PRODUCTS.filter(p => !p.hidden).length} modelos)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.filter(p => !p.hidden).map((prod) => (
            <div
              key={prod.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#1C1B26] border border-black/8 dark:border-white/8 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group interactive-card"
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

                <h3 className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF] group-hover:text-[#DE5B2B] transition-colors uppercase leading-snug">
                  {prod.name}
                </h3>
                
                <p className="text-xs text-[#64606E] dark:text-[#A3A2AE] mt-2 line-clamp-2">
                  {prod.description}
                </p>

                {/* Indicador de partes personalizables */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[#64606E] dark:text-[#A3A2AE]">
                  <Sliders className="w-3.5 h-3.5 text-[#DE5B2B]" />
                  <span>{prod.parts.length} zonas de color editables</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64606E] dark:text-[#A3A2AE] uppercase font-bold block">
                    Desde:
                  </span>
                  <span className="font-['Cal_Sans',sans-serif] text-xl text-[#1F1E24] dark:text-[#F6F3EF]">
                    {formatCOP(prod.basePrice)}
                  </span>
                </div>

                <Link
                  to={`/catalogo/${prod.slug}`}
                  className="px-3.5 py-2 rounded-full bg-[#DE5B2B] hover:bg-[#c44e23] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalizar</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PASO A PASO RÁPIDO                                         */}
      {/* ============================================================== */}
      <section className="py-14 bg-white/60 dark:bg-[#16151D]/60 border-t border-black/5 dark:border-white/8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-[#F6F3EF] dark:bg-[#1C1B26]">
            <div className="w-10 h-10 rounded-full bg-[#DE5B2B]/10 text-[#DE5B2B] font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              01
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] dark:text-[#F6F3EF] uppercase mb-1">
              Escoge el Modelo
            </h4>
            <p className="text-xs text-[#64606E] dark:text-[#A3A2AE]">
              Explora portamicrófonos, portafotos y gadgets en nuestro catálogo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F3EF] dark:bg-[#1C1B26]">
            <div className="w-10 h-10 rounded-full bg-[#8576EA]/15 text-[#8576EA] font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              02
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] dark:text-[#F6F3EF] uppercase mb-1">
              Prueba Colores en Vivo
            </h4>
            <p className="text-xs text-[#64606E] dark:text-[#A3A2AE]">
              Asigna combinaciones en tiempo real y explora la pieza en 360 grados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F6F3EF] dark:bg-[#1C1B26]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-['Cal_Sans',sans-serif] text-lg font-bold flex items-center justify-center mx-auto mb-3">
              03
            </div>
            <h4 className="font-['Cal_Sans',sans-serif] text-base text-[#1F1E24] dark:text-[#F6F3EF] uppercase mb-1">
              Pide por WhatsApp
            </h4>
            <p className="text-xs text-[#64606E] dark:text-[#A3A2AE]">
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
              ¿Listo para materializar tu proyecto?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 font-light">
              Cuéntanos sobre tu empresa, tu evento o el modelo especial que necesitas. Te asesoramos directamente para lograr acabados y combinaciones de color impecables.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quiero consultar sobre un proyecto o pedido personalizado.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#DE5B2B] hover:bg-gray-100 font-bold text-sm shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-[#DE5B2B]" />
                <span>Hablar por WhatsApp</span>
              </a>
              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 shadow-sm transition-all hover:scale-105"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
