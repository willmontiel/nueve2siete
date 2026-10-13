import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles,
  Layers, 
  MessageCircle, 
  Palette,
  Gift,
  CheckCircle2,
  ChevronDown
} from 'lucide-react'

// Especialidades editoriales inspiradas en la imagen de referencia (01, 02, 03, 04)
const SPECIALTIES = [
  {
    number: '01',
    title: 'PORTAMICRÓFONOS',
    subtitle: 'Bases personalizadas con tu marca para streaming, podcasts y creadores.',
    image: '/photos/mic_studio.jpg',
    tag: 'STUDIO & PODCAST',
    link: '/catalogo/portamicrofono'
  },
  {
    number: '02',
    title: 'CLICKERS SENSORIALES',
    subtitle: 'Fidgets mecánicos de click táctil con ensamble en dos tonos.',
    image: '/photos/clicker_hand.jpg',
    tag: 'TACTO & FIDGET',
    link: '/catalogo/clicker-sakura'
  },
  {
    number: '03',
    title: 'PORTAFOTOS DE AUTOR',
    subtitle: 'Diseños de escritorio para exhibir tus recuerdos fotográficos favoritos.',
    image: '/photos/portafoto_desk.jpg',
    tag: 'DISEÑO & RECUERDOS',
    link: '/catalogo/portafoto-margarita'
  },
  {
    number: '04',
    title: 'PEDIDOS A MEDIDA & EVENTOS',
    subtitle: 'Merchandising exclusivo, bodas y regalos corporativos por volumen.',
    image: '/photos/regalo_empaque.jpg',
    tag: 'EMPRESAS & FIESTAS',
    link: '/catalogo'
  }
]

// Fotos de trabajo real para el carrusel continuo (Marquee)
const REAL_WORK_CAROUSEL = [
  {
    title: 'Portamicrófono Podcast',
    subtitle: 'Relieve de marca personalizado',
    category: 'AUDIO & BROADCAST',
    image: '/photos/mic_studio.jpg',
    accent: '#DE5B2B'
  },
  {
    title: 'Clicker Táctil Bicolor',
    subtitle: 'Ensamble de precisión mecánica',
    category: 'FIDGETS',
    image: '/photos/clicker_hand.jpg',
    accent: '#8576EA'
  },
  {
    title: 'Portafoto Contemporáneo',
    subtitle: 'Acabado satinado mate de mesa',
    category: 'DECORACIÓN',
    image: '/photos/portafoto_desk.jpg',
    accent: '#EEBA29'
  },
  {
    title: 'Empaque de Regalo con Cinta',
    subtitle: 'Listo para sorprender y celebrar',
    category: 'REGALOS',
    image: '/photos/regalo_empaque.jpg',
    accent: '#DE5B2B'
  }
]

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeSpecialty, setActiveSpecialty] = useState<number | null>(null)
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  // Scroll sutil para el Hero
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.96])
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.3])

  return (
    <div className="relative pt-6 sm:pt-10 overflow-hidden bg-[#F6F3EF] dark:bg-[#121117] transition-colors duration-300">
      
      {/* ============================================================== */}
      {/* 1. HERO ARTÍSTICO MAXIMALISTA CON CINTA Y BUCLÉS               */}
      {/* ============================================================== */}
      <section 
        ref={heroRef} 
        className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Glows ambientales sutiles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] sm:h-[650px] bg-gradient-to-tr from-[#DE5B2B]/10 via-[#9FAEE9]/15 to-[#EEBA29]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="w-full max-w-6xl mx-auto flex flex-col items-center text-center relative z-10"
        >
          {/* Fila central: Bucles esculturales a los lados abrazando el texto */}
          <div className="w-full flex items-center justify-between gap-4 sm:gap-8 lg:gap-12">
            
            {/* ESCULTURA IZQUIERDA: Lazo escultural abstracto en Terracotta (Gira al hover) */}
            <motion.div 
              className="hidden md:flex flex-col items-center justify-center cursor-pointer select-none shrink-0"
              whileHover={{ rotate: 180, scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                rotate: { type: 'spring', stiffness: 200, damping: 15 }
              }}
              title="Lazo Nueve • Toca para girar"
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-tr from-[#DE5B2B] via-[#EE7D52] to-[#EEBA29] p-1 shadow-xl shadow-[#DE5B2B]/20 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#F6F3EF] dark:bg-[#1C1B26] flex items-center justify-center p-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#DE5B2B] fill-current">
                    {/* Bucle continuo inspirado en lazo orgánico */}
                    <path d="M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C65 85, 80 75, 85 58 C88 47, 82 35, 72 35 C60 35, 52 48, 52 60 C52 70, 60 76, 68 76 C76 76, 82 70, 82 60 C82 45, 68 25, 50 25 C36 25, 27 36, 27 50 C27 63, 37 73, 50 73" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="9" 
                          strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#DE5B2B] uppercase tracking-wider mt-2 opacity-60">
                09 • loop
              </span>
            </motion.div>

            {/* CONTENEDOR CENTRAL: Título con Cinta de Regalo por detrás */}
            <div 
              className="relative flex-1 max-w-3xl flex flex-col items-center"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              {/* LA CINTA SVG FLUIDA (Pasa por detrás de las palabras como en el logo original) */}
              <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-visible">
                <svg 
                  viewBox="0 0 700 280" 
                  className="w-[110%] sm:w-[125%] h-full max-h-[340px] overflow-visible"
                >
                  <defs>
                    <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DE5B2B" stopOpacity="0.25" />
                      <stop offset="35%" stopColor="#9FAEE9" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#EEBA29" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#DE5B2B" stopOpacity="0.25" />
                    </linearGradient>
                    <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* Cinta ondulada de regalo SVG */}
                  <motion.path
                    d="M 20,230 Q 180,260 300,160 T 520,110 T 680,60"
                    fill="none"
                    stroke="url(#ribbonGradient)"
                    strokeWidth="48"
                    strokeLinecap="round"
                    filter="url(#ribbonShadow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 1,
                      d: isTitleHovered 
                        ? "M 20,220 Q 190,240 310,150 T 530,120 T 680,70"
                        : "M 20,230 Q 180,260 300,160 T 520,110 T 680,60"
                    }}
                    transition={{ 
                      pathLength: { duration: 1.6, ease: 'easeOut' },
                      opacity: { duration: 1 },
                      d: { duration: 0.8, ease: 'easeInOut' }
                    }}
                  />
                  {/* Línea central fina de brillo en la cinta */}
                  <motion.path
                    d="M 20,230 Q 180,260 300,160 T 520,110 T 680,60"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                  />
                </svg>
              </div>

              {/* TÍTULO MAXIMALISTA (En tipografía redonda Outfit) */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#1F1E24] dark:text-[#F6F3EF] leading-[0.98] select-none cursor-default">
                Piezas únicas <br />
                <span className="text-[#DE5B2B] inline-block transition-transform hover:scale-105 duration-300">
                  que cobran
                </span> <br />
                vida.
              </h1>

              {/* Subtítulo limpio y con aire */}
              <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#64606E] dark:text-[#A3A2AE] font-normal leading-relaxed max-w-xl">
                Transformamos ideas en piezas tangibles con acabados de alta precisión. 
                Diseños de autor, regalos memorables y proyectos personalizados a tu medida.
              </p>

              {/* Botones en pastilla 100% redondeados (Pill) */}
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  to="/catalogo"
                  className="px-8 py-4 rounded-full bg-[#DE5B2B] hover:bg-[#c44e23] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#DE5B2B]/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/catalogo/portamicrofono"
                  className="px-7 py-4 rounded-full bg-white/95 dark:bg-[#252432]/95 hover:bg-white dark:hover:bg-[#2E2D3B] text-[#1F1E24] dark:text-white font-bold text-sm sm:text-base border border-black/10 dark:border-white/10 shadow-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4 text-[#DE5B2B]" />
                  <span>Personalizar en Vivo</span>
                </Link>
              </div>
            </div>

            {/* ESCULTURA DERECHA: Doble lazo entrelazado en Lavender / Studio Gold (Gira al hover) */}
            <motion.div 
              className="hidden md:flex flex-col items-center justify-center cursor-pointer select-none shrink-0"
              whileHover={{ rotate: -180, scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { type: 'spring', stiffness: 200, damping: 15 }
              }}
              title="Lazo Dos-Siete • Toca para girar"
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-tr from-[#8576EA] via-[#9FAEE9] to-[#EEBA29] p-1 shadow-xl shadow-[#8576EA]/20 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#F6F3EF] dark:bg-[#1C1B26] flex items-center justify-center p-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#8576EA] fill-current">
                    {/* Bucle entrelazado infinito / cinta continua */}
                    <path d="M25 50 C25 35, 38 25, 50 25 C62 25, 75 35, 75 50 C75 65, 62 75, 50 75 C38 75, 25 65, 25 50 Z M38 50 C38 58, 44 64, 50 64 C56 64, 62 58, 62 50 C62 42, 56 36, 50 36 C44 36, 38 42, 38 50 Z" 
                          fill="currentColor" 
                          opacity="0.9" />
                    <circle cx="50" cy="50" r="7" fill="#EEBA29" />
                  </svg>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8576EA] uppercase tracking-wider mt-2 opacity-60">
                27 • knot
              </span>
            </motion.div>

          </div>

          {/* Indicador de scroll redondeado suave */}
          <div className="mt-14 flex flex-col items-center gap-1.5 text-xs font-bold text-[#64606E] dark:text-[#A3A2AE] uppercase tracking-widest pointer-events-none opacity-80">
            <span>Desliza para ver el trabajo real</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-[#DE5B2B]" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================== */}
      {/* 2. CINTA CONTINUA (MARQUEE) DE TRABAJO REAL                    */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 overflow-hidden border-y border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DE5B2B]/10 text-xs font-bold text-[#DE5B2B] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trabajo Real de Estudio</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-[#1F1E24] dark:text-[#F6F3EF]">
              Piezas tangibles, hechas con calma
            </h2>
          </div>
          <Link 
            to="/catalogo"
            className="text-xs sm:text-sm font-bold text-[#DE5B2B] hover:text-[#c44e23] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ver todos los modelos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Riel infinito con tarjetas 100% redondeadas */}
        <div className="relative w-full flex overflow-x-auto no-scrollbar py-4 px-4 sm:px-6 gap-6">
          {REAL_WORK_CAROUSEL.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="shrink-0 w-[280px] sm:w-[340px] rounded-[36px] bg-[#FAF8F5] dark:bg-[#1C1B26] p-4 border border-black/5 dark:border-white/8 shadow-sm flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              {/* Imagen con bordes ultra redondeados */}
              <div className="w-full h-56 sm:h-64 rounded-[28px] overflow-hidden relative bg-black/5">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span 
                  style={{ backgroundColor: item.accent }}
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider shadow-sm"
                >
                  {item.category}
                </span>
              </div>

              {/* Información de la tarjeta */}
              <div className="pt-4 pb-2 px-1 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1F1E24] dark:text-[#F6F3EF]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64606E] dark:text-[#A3A2AE] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white dark:bg-[#252432] border border-black/5 flex items-center justify-center text-[#1F1E24] dark:text-white group-hover:bg-[#DE5B2B] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MENÚ INTERACTIVO DE ESPECIALIDADES (Basado en Imagen 2)     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <div>
            <span className="text-xs font-bold text-[#DE5B2B] uppercase tracking-widest block mb-2">
              04 Especialidades del Taller
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-[#1F1E24] dark:text-[#F6F3EF] tracking-tight">
              Diseño, ensamble y acabados de autor
            </h2>
          </div>
          <p className="text-sm text-[#64606E] dark:text-[#A3A2AE] max-w-md">
            Cada pieza se fabrica bajo pedido con combinaciones de color a medida, sin moldes y lista para usar o regalar.
          </p>
        </div>

        {/* Lista interactiva con numeración (01, 02, 03, 04) y preview al hover */}
        <div className="flex flex-col gap-3">
          {SPECIALTIES.map((spec, idx) => {
            const isHovered = activeSpecialty === idx
            return (
              <Link
                key={idx}
                to={spec.link}
                onMouseEnter={() => setActiveSpecialty(idx)}
                onMouseLeave={() => setActiveSpecialty(null)}
                className={`relative group p-5 sm:p-7 rounded-[32px] sm:rounded-full transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
                  isHovered 
                    ? 'bg-[#1F1E24] text-white border-transparent shadow-xl scale-[1.01]' 
                    : 'bg-white/80 dark:bg-[#1A1924]/80 text-[#1F1E24] dark:text-[#F6F3EF] border-black/5 dark:border-white/8 hover:border-black/15'
                }`}
              >
                {/* Lado izquierdo: Número + Título */}
                <div className="flex items-center gap-5 sm:gap-8">
                  <span className={`font-display text-2xl sm:text-4xl font-black transition-colors ${
                    isHovered ? 'text-[#EEBA29]' : 'text-[#DE5B2B]'
                  }`}>
                    {spec.number}.
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-xl sm:text-3xl font-black tracking-tight uppercase">
                        {spec.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase hidden sm:inline-block ${
                        isHovered 
                          ? 'bg-white/20 text-white' 
                          : 'bg-black/5 dark:bg-white/10 text-[#64606E] dark:text-[#A3A2AE]'
                      }`}>
                        {spec.tag}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 transition-colors ${
                      isHovered ? 'text-white/80' : 'text-[#64606E] dark:text-[#A3A2AE]'
                    }`}>
                      {spec.subtitle}
                    </p>
                  </div>
                </div>

                {/* Lado derecho: Miniatura flotante en cápsula redondeada */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <motion.div 
                    animate={{ scale: isHovered ? 1.08 : 1 }}
                    className="w-16 h-12 sm:w-24 sm:h-16 rounded-2xl overflow-hidden shrink-0 shadow-md bg-black/10 border border-white/20"
                  >
                    <img 
                      src={spec.image} 
                      alt={spec.title} 
                      className="w-full h-full object-cover" 
                    />
                  </motion.div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 shrink-0 ${
                    isHovered ? 'bg-[#DE5B2B] text-white' : 'bg-black/5 dark:bg-white/10 text-current'
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Botón de cierre de la lista */}
        <div className="mt-10 text-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1F1E24] dark:bg-white text-white dark:text-[#1F1E24] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <span>Ver Todos los Modelos en Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BENTO GRID 100% REDONDEADO (Cero bordes cuadrados)          */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8576EA] uppercase tracking-widest block mb-2">
            El Valor de Cada Pieza
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#1F1E24] dark:text-[#F6F3EF] tracking-tight">
            Diseñado para sentirse diferente
          </h2>
        </div>

        {/* Grid asimétrico con esquinas súper redondeadas (36px a 44px) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Tarjeta Grande A (8 cols): Listo para regalar con cinta y empaque */}
          <div className="md:col-span-8 p-8 sm:p-12 rounded-[40px] bg-gradient-to-br from-[#1F1E24] via-[#2A2933] to-[#1F1E24] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#DE5B2B]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-[#EEBA29] uppercase tracking-wider mb-4 border border-white/10">
                <Gift className="w-3.5 h-3.5" />
                <span>Listo para Regalar</span>
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                No es un plástico más. <br />
                Es un recuerdo envuelto con dedicación.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg font-light leading-relaxed">
                Cada pedido sale de nuestro taller empacado artesanalmente con cinta de autor y protegido para llegar impecable a cualquier ciudad de Colombia.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3 relative z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 font-medium">
                ✨ Sin marcas de soporte
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 font-medium">
                🎀 Cinta de regalo incluida
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 font-medium">
                📦 Despacho seguro nacional
              </span>
            </div>
          </div>

          {/* Tarjeta Squircle B (4 cols): Sello dinámico circular nueve2siete */}
          <div className="md:col-span-4 p-8 rounded-[40px] bg-[#FAF8F5] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Sello circular con rotación suave continua */}
            <motion.div 
              className="w-36 h-36 rounded-full border-2 border-dashed border-[#DE5B2B]/40 flex items-center justify-center relative cursor-pointer"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="w-24 h-24 rounded-full bg-[#DE5B2B] text-white flex flex-col items-center justify-center shadow-lg shadow-[#DE5B2B]/30 p-2">
                <span className="font-display text-sm font-black leading-none">nueve</span>
                <span className="font-display text-xl font-black text-[#EEBA29] leading-none my-0.5">2</span>
                <span className="font-display text-sm font-black leading-none">siete</span>
              </div>
            </motion.div>
            
            <h4 className="font-display text-base font-bold text-[#1F1E24] dark:text-[#F6F3EF] mt-5">
              Sello de Autor
            </h4>
            <p className="text-xs text-[#64606E] dark:text-[#A3A2AE] mt-1">
              Geometría circular y arte en cada creación.
            </p>
          </div>

          {/* Tarjeta Squircle C (4 cols): Fusión Multicolor */}
          <div className="md:col-span-4 p-8 rounded-[40px] bg-[#FAF8F5] dark:bg-[#1C1B26] border border-black/5 dark:border-white/8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#8576EA]/15 text-[#8576EA] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1F1E24] dark:text-[#F6F3EF]">
                Fusión de Colores
              </h3>
              <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] mt-2 leading-relaxed">
                Cada color se integra directamente en la pieza sólida. Cero pintura superficial que se despegue o se raye con el uso.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-xs font-bold text-[#8576EA]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Colores permanentes</span>
            </div>
          </div>

          {/* Tarjeta Grande D (8 cols): Tacto Satinado Mate */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[40px] bg-white dark:bg-[#1A1924] border border-black/5 dark:border-white/8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[11px] font-bold text-[#EEBA29] uppercase tracking-wider block mb-1">
                Textura Profesional
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-[#1F1E24] dark:text-[#F6F3EF]">
                Acabado Satinado Mate
              </h3>
              <p className="text-xs sm:text-sm text-[#64606E] dark:text-[#A3A2AE] mt-2 leading-relaxed">
                Superficies táctiles suaves que no reflejan luces de cámara ni dejan huellas marcadas. Diseñado específicamente para verse profesional en podcasts y transmisiones en vivo.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#DE5B2B]/10 border border-[#DE5B2B]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-10 h-10 text-[#DE5B2B]" />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FOOTER CON CINTA ENVOLVENTE Y LLAMADO A LA ACCIÓN           */}
      {/* ============================================================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Cinta decorativa ondulante que cruza la base de la sección */}
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none overflow-hidden -z-10 opacity-30">
          <svg viewBox="0 0 1200 200" className="w-full h-full preserve-3d">
            <path 
              d="M 0,100 Q 300,30 600,100 T 1200,100" 
              fill="none" 
              stroke="#DE5B2B" 
              strokeWidth="40" 
              strokeLinecap="round" 
            />
            <path 
              d="M 0,120 Q 350,180 700,110 T 1200,120" 
              fill="none" 
              stroke="#EEBA29" 
              strokeWidth="24" 
              strokeLinecap="round" 
            />
          </svg>
        </div>

        {/* Tarjeta de Cierre Ultra Redondeada (rounded-[48px]) */}
        <div className="max-w-5xl mx-auto rounded-[48px] bg-gradient-to-r from-[#DE5B2B] via-[#c44e23] to-[#8576EA] p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold text-white uppercase tracking-wider mb-4 border border-white/20">
              <Gift className="w-3.5 h-3.5" />
              <span>Envuelto con dedicación en Colombia</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              ¿Listo para crear tu pieza o cotizar un pedido?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/90 font-light max-w-lg mx-auto">
              Cuéntanos tu idea, tu marca o el evento que estás organizando. Te asesoramos directamente para lograr acabados y combinaciones impecables.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola nueve2siete! Quiero consultar sobre una pieza o pedido especial.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#DE5B2B] hover:bg-gray-100 font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-[#DE5B2B]" />
                <span>Hablar por WhatsApp</span>
              </a>

              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-sm sm:text-base border border-white/20 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Explorar Catálogo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
