import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles,
  Layers, 
  MessageCircle, 
  Gift,
  CheckCircle2
} from 'lucide-react'
import { whatsappUrl } from '../lib/contact'
import { Hero } from '../components/home/Hero'
import { Magazine } from '../components/magazine/Magazine'

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
    link: '/catalogo/clicker-fidget'
  },
  {
    number: '03',
    title: 'PORTAFOTOS DE AUTOR',
    subtitle: 'Diseños de escritorio para exhibir tus recuerdos fotográficos favoritos.',
    image: '/photos/portafoto_desk.jpg',
    tag: 'DISEÑO & RECUERDOS',
    link: '/catalogo/portafotos-margarita'
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

export function Home() {
  const [activeSpecialty, setActiveSpecialty] = useState<number | null>(null)

  return (
    <div className="relative overflow-hidden bg-cream dark:bg-night transition-colors duration-300">
      <Hero />

      <Magazine />

      {/* ============================================================== */}
      {/* 3. MENÚ INTERACTIVO DE ESPECIALIDADES (Basado en Imagen 2)     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <div>
            <span className="text-xs font-bold text-orange uppercase tracking-widest block mb-2">
              04 Especialidades del Taller
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-ink dark:text-cream tracking-tight">
              Diseño, ensamble y acabados de autor
            </h2>
          </div>
          <p className="text-sm text-muted dark:text-muted-night max-w-md">
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
                    ? 'bg-ink text-white border-transparent shadow-xl scale-[1.01]' 
                    : 'bg-white/80 dark:bg-night-1/80 text-ink dark:text-cream border-black/5 dark:border-white/8 hover:border-black/15'
                }`}
              >
                {/* Lado izquierdo: Número + Título */}
                <div className="flex items-center gap-5 sm:gap-8">
                  <span className={`font-display text-2xl sm:text-4xl font-black transition-colors ${
                    isHovered ? 'text-mustard' : 'text-orange'
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
                          : 'bg-black/5 dark:bg-white/10 text-muted dark:text-muted-night'
                      }`}>
                        {spec.tag}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 transition-colors ${
                      isHovered ? 'text-white/80' : 'text-muted dark:text-muted-night'
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
                    isHovered ? 'bg-orange text-white' : 'bg-black/5 dark:bg-white/10 text-current'
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink dark:bg-white text-white dark:text-ink font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
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
          <span className="text-xs font-bold text-violet uppercase tracking-widest block mb-2">
            El Valor de Cada Pieza
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-ink dark:text-cream tracking-tight">
            Diseñado para sentirse diferente
          </h2>
        </div>

        {/* Grid asimétrico con esquinas súper redondeadas (36px a 44px) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Tarjeta Grande A (8 cols): Listo para regalar con cinta y empaque */}
          <div className="md:col-span-8 p-8 sm:p-12 rounded-[40px] bg-gradient-to-br from-ink via-night-2 to-ink text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-orange/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-mustard uppercase tracking-wider mb-4 border border-white/10">
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
          <div className="md:col-span-4 p-8 rounded-[40px] bg-paper dark:bg-night-1 border border-black/5 dark:border-white/8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Sello circular con rotación suave continua */}
            <motion.div 
              className="w-36 h-36 rounded-full border-2 border-dashed border-orange/40 flex items-center justify-center relative cursor-pointer"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="w-24 h-24 rounded-full bg-orange text-white flex flex-col items-center justify-center shadow-lg shadow-orange/30 p-2">
                <span className="font-display text-sm font-black leading-none">nueve</span>
                <span className="font-display text-xl font-black text-mustard leading-none my-0.5">2</span>
                <span className="font-display text-sm font-black leading-none">siete</span>
              </div>
            </motion.div>
            
            <h4 className="font-display text-base font-bold text-ink dark:text-cream mt-5">
              Sello de Autor
            </h4>
            <p className="text-xs text-muted dark:text-muted-night mt-1">
              Geometría circular y arte en cada creación.
            </p>
          </div>

          {/* Tarjeta Squircle C (4 cols): Fusión Multicolor */}
          <div className="md:col-span-4 p-8 rounded-[40px] bg-paper dark:bg-night-1 border border-black/5 dark:border-white/8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-violet/15 text-violet flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink dark:text-cream">
                Fusión de Colores
              </h3>
              <p className="text-xs sm:text-sm text-muted dark:text-muted-night mt-2 leading-relaxed">
                Cada color se integra directamente en la pieza sólida. Cero pintura superficial que se despegue o se raye con el uso.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-xs font-bold text-violet">
              <CheckCircle2 className="w-4 h-4" />
              <span>Colores permanentes</span>
            </div>
          </div>

          {/* Tarjeta Grande D (8 cols): Tacto Satinado Mate */}
          <div className="md:col-span-8 p-8 sm:p-10 rounded-[40px] bg-white dark:bg-night-1 border border-black/5 dark:border-white/8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[11px] font-bold text-mustard uppercase tracking-wider block mb-1">
                Textura Profesional
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-ink dark:text-cream">
                Acabado Satinado Mate
              </h3>
              <p className="text-xs sm:text-sm text-muted dark:text-muted-night mt-2 leading-relaxed">
                Superficies táctiles suaves que no reflejan luces de cámara ni dejan huellas marcadas. Diseñado específicamente para verse profesional en podcasts y transmisiones en vivo.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-10 h-10 text-orange" />
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
        <div className="max-w-5xl mx-auto rounded-[48px] bg-gradient-to-r from-orange via-orange-deep to-violet p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
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
                href={whatsappUrl('¡Hola nueve2siete! Quiero consultar sobre una pieza o pedido especial.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-orange hover:bg-gray-100 font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-orange" />
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
