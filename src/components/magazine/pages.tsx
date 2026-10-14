import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Ribbon } from '../Ribbon'
import { FILAMENT_COLORS } from '../../data/products'
import type { PageColor, Project } from '../../data/projects'
import { whatsappUrl } from '../../lib/contact'
import { projectMessage } from '../../lib/order'

// Everything on a page is sized in cqi (a share of the page's width), so a page scales like print:
// the same layout on a wide spread, on a tablet and on a phone.

const FIELD: Record<PageColor, { page: string; action: string }> = {
  lavender: { page: 'bg-lavender text-night', action: 'bg-night text-cream' },
  pink: { page: 'bg-pink text-night', action: 'bg-night text-cream' },
  lime: { page: 'bg-lime text-night', action: 'bg-night text-cream' },
  pine: { page: 'bg-pine text-cream', action: 'bg-cream text-night' },
}

const COVER_TITLE = 'Lo que ya cobró vida'
const CLOSING_LINES = ['La próxima', 'página es tuya']
const CLOSING_TEXT = 'Cuéntanos qué celebras o qué necesita tu empresa, y lo hacemos en los colores que elijas.'
const CLOSING_MESSAGE = '¡Hola nueve2siete! Vi la revista y tengo una idea.'

// Ribbons drawn across a whole spread (viewBox 1500 × 1000, two pages of 3:4). Each page shows its half,
// so the ribbon runs over the spine and the turning leaf carries its half away.
const COVER_RIBBON =
  'M -80 820 C 220 900, 560 860, 700 690 C 820 545, 820 380, 730 330 C 630 275, 560 400, 660 470 ' +
  'C 790 560, 1010 520, 1180 380 C 1300 280, 1400 250, 1580 280'
const CLOSING_RIBBON =
  'M 1580 760 C 1300 700, 1100 840, 900 760 C 760 700, 700 560, 790 500 C 880 440, 960 560, 860 620 ' +
  'C 700 720, 420 560, 280 400 C 180 285, 60 240, -80 260'
// The same idea on a single phone page (viewBox 700 × 1000)
const COVER_RIBBON_SINGLE =
  'M -60 760 C 160 840, 420 800, 520 640 C 600 510, 560 400, 480 410 C 400 420, 410 540, 520 540 ' +
  'C 620 540, 680 480, 760 420'
const CLOSING_RIBBON_SINGLE =
  'M 760 860 C 560 800, 420 900, 300 800 C 200 720, 240 600, 320 620 C 400 640, 380 740, 280 740 ' +
  'C 160 740, 60 660, -60 600'

// One ribbon per project page (viewBox 750 × 1000, one page), looping through the space between the facts and
// the actions. Each enters from the spine.
const PAGE_RIBBONS = [
  'M -60 720 C 120 640, 300 780, 360 680 C 410 595, 330 530, 280 580 C 230 630, 300 720, 420 720 C 560 720, 650 640, 810 660',
  'M -60 760 C 160 820, 300 640, 440 640 C 560 640, 600 760, 520 790 C 440 820, 420 700, 520 660 C 640 610, 720 680, 810 620',
  'M -60 560 C 140 520, 220 700, 360 720 C 470 735, 520 640, 460 610 C 400 580, 360 680, 440 740 C 540 810, 680 760, 810 800',
  'M -60 700 C 100 620, 260 600, 330 680 C 390 750, 330 820, 280 780 C 230 740, 290 640, 420 620 C 560 600, 680 680, 810 640',
]

const MUSTARD_RIBBON = 'text-[color-mix(in_srgb,var(--color-mustard)_80%,var(--color-ink))]'

type Half = 'left' | 'right'

function SpreadRibbon({ d, half, className, play }: { d: string; half: Half; className: string; play: boolean }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 w-[200%] ${half === 'left' ? 'left-0' : 'right-0'}`}>
      <Ribbon d={d} viewBox="0 0 1500 1000" strokeWidth={84} className={`w-full h-full ${className}`} delay={0.4} duration={2.2} play={play} />
    </div>
  )
}

function PageRibbon({ d, className, play }: { d: string; className: string; play: boolean }) {
  return (
    <Ribbon
      d={d}
      viewBox="0 0 700 1000"
      strokeWidth={64}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      delay={0.4}
      duration={2.2}
      play={play}
    />
  )
}

function Logo({ className }: { className: string }) {
  return (
    <div
      role="img"
      aria-label="nueve2siete"
      className={`aspect-[787/402] bg-cream ${className}`}
      style={{ maskImage: 'url(/logo.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}
    />
  )
}

// The bookmark hangs from the top edge of the cover and turns with it; it slides down once the magazine is in view
function Bookmark({ onOpen, play, className }: { onOpen: () => void; play: boolean; className: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Abrir la revista"
      className={`absolute top-0 w-[max(3.75rem,14cqi)] h-[34%] rounded-b-full bg-lavender text-night font-display text-[max(1.125rem,4.4cqi)] flex flex-col items-center justify-end gap-1 pb-[5cqi] ${className}`}
      initial={reduceMotion ? false : { y: '-100%' }}
      animate={play ? { y: '0%' } : undefined}
      whileHover={{ y: '6%', transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      Abrir
      <ArrowRight className="w-[1.1em] h-[1.1em]" aria-hidden="true" />
    </motion.button>
  )
}

function CoverTitle() {
  return (
    <h2 id="revista-titulo" className="font-display text-[15cqi] leading-[0.9] tracking-[-0.03em] text-balance">
      {COVER_TITLE}
    </h2>
  )
}

const coverIntro = 'text-[max(1rem,3.9cqi)] leading-snug font-medium'
const COVER_INTRO = 'Proyectos para fiestas, empresas y eventos. Pasa la página con un clic o arrastrándola.'

/* ---------------------------------------------------------------- Open as a spread */

export function CoverLeft({ play }: { play: boolean }) {
  return (
    <div className="relative h-full bg-orange text-night p-[8cqi] flex flex-col justify-between">
      <SpreadRibbon d={COVER_RIBBON} half="left" className="text-orange-deep" play={play} />
      <div className="relative"><CoverTitle /></div>
      <p className={`relative max-w-[30ch] ${coverIntro}`}>{COVER_INTRO}</p>
    </div>
  )
}

export function CoverRight({ play, onOpen }: { play: boolean; onOpen: () => void }) {
  return (
    <div className="relative h-full bg-orange p-[8cqi] grid place-items-center">
      <SpreadRibbon d={COVER_RIBBON} half="right" className="text-orange-deep" play={play} />
      <Logo className="relative w-[72cqi]" />
      <Bookmark onOpen={onOpen} play={play} className="left-[12cqi]" />
    </div>
  )
}

export function ProjectPhoto({ project }: { project: Project }) {
  return (
    <img
      src={project.photo}
      alt={project.photoAlt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="w-full h-full object-cover"
      style={{ objectPosition: project.photoPosition }}
    />
  )
}

function Swatches({ project }: { project: Project }) {
  const colors = project.colorIds.map(id => FILAMENT_COLORS.find(c => c.id === id)!)
  return (
    <p className="flex items-center gap-[1.6cqi]">
      <span className="sr-only">Colores: {colors.map(c => c.name).join(', ')}</span>
      {colors.map(color => (
        <span
          key={color.id}
          aria-hidden="true"
          title={color.name}
          className="w-[max(1.5rem,6.5cqi)] aspect-square rounded-full border-2 border-current"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </p>
  )
}

function ProjectActions({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[5cqi] gap-y-3">
      <a
        href={whatsappUrl(projectMessage(project.title))}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 min-h-12 px-6 rounded-full font-semibold text-[max(1rem,3.6cqi)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97] ${FIELD[project.color].action}`}
      >
        <MessageCircle className="w-[1.1em] h-[1.1em]" aria-hidden="true" />
        Quiero algo así
      </a>
      {project.productSlug && !compact && (
        <Link
          to={`/catalogo/${project.productSlug}`}
          className="font-semibold text-[max(1rem,3.6cqi)] underline decoration-2 underline-offset-[0.3em] hover:decoration-[3px]"
        >
          Diseña el tuyo
        </Link>
      )}
    </div>
  )
}

export function ProjectText({ project, index, play }: { project: Project; index: number; play: boolean }) {
  return (
    <article className={`relative isolate h-full p-[8cqi] flex flex-col ${FIELD[project.color].page}`}>
      <Ribbon
        d={PAGE_RIBBONS[index % PAGE_RIBBONS.length]}
        viewBox="0 0 750 1000"
        strokeWidth={64}
        className="pointer-events-none absolute inset-0 -z-10 w-full h-full text-night/10"
        delay={0.5}
        duration={1.8}
        play={play}
      />
      <h3 className="font-display text-[10.5cqi] leading-[0.95] tracking-[-0.02em] text-balance">{project.title}</h3>
      <p className="mt-[5cqi] max-w-[34ch] text-[max(1rem,3.9cqi)] leading-snug">{project.summary}</p>
      <div className="mt-[6cqi] flex flex-wrap items-center gap-[3cqi]">
        <span className="inline-flex items-center min-h-[max(2rem,7cqi)] px-[3.5cqi] rounded-full border-2 border-current font-semibold text-[max(1rem,3.4cqi)]">
          {project.occasion}
        </span>
        <Swatches project={project} />
      </div>
      <div className="mt-auto pt-[6cqi]">
        <ProjectActions project={project} />
      </div>
    </article>
  )
}

export function ClosingLeft({ play }: { play: boolean }) {
  return (
    <div className="relative h-full bg-mustard text-night p-[8cqi] flex flex-col">
      <SpreadRibbon d={CLOSING_RIBBON} half="left" className={MUSTARD_RIBBON} play={play} />
      <h3 className="relative font-display text-[13cqi] leading-[0.92] tracking-[-0.03em]">
        {CLOSING_LINES.map(line => <span key={line} className="block">{line}</span>)}
      </h3>
    </div>
  )
}

function ClosingActions() {
  return (
    <div className="flex flex-wrap items-center gap-x-[5cqi] gap-y-3">
      <a
        href={whatsappUrl(CLOSING_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-night text-cream font-semibold text-[max(1rem,3.6cqi)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
      >
        <MessageCircle className="w-[1.1em] h-[1.1em]" aria-hidden="true" />
        Cuéntanos tu idea
      </a>
      <Link
        to="/catalogo"
        className="font-semibold text-[max(1rem,3.6cqi)] underline decoration-2 underline-offset-[0.3em] hover:decoration-[3px]"
      >
        Ver el catálogo
      </Link>
    </div>
  )
}

export function ClosingRight({ play }: { play: boolean }) {
  return (
    <div className="relative h-full bg-mustard text-night p-[8cqi] flex flex-col justify-end gap-[6cqi]">
      <SpreadRibbon d={CLOSING_RIBBON} half="right" className={MUSTARD_RIBBON} play={play} />
      <p className="relative max-w-[30ch] text-[max(1rem,4.2cqi)] leading-snug font-medium">{CLOSING_TEXT}</p>
      <div className="relative"><ClosingActions /></div>
    </div>
  )
}

/* ---------------------------------------------------------------- One page at a time (phones) */

export function CoverSingle({ play, onOpen }: { play: boolean; onOpen: () => void }) {
  return (
    <div className="relative h-full bg-orange text-night p-[8cqi] flex flex-col">
      <PageRibbon d={COVER_RIBBON_SINGLE} className="text-orange-deep" play={play} />
      <Logo className="relative w-[46cqi]" />
      <div className="relative mt-auto">
        <CoverTitle />
        <p className={`mt-[5cqi] ${coverIntro}`}>{COVER_INTRO}</p>
      </div>
      <Bookmark onOpen={onOpen} play={play} className="right-[9cqi]" />
    </div>
  )
}

export function ProjectSingle({ project }: { project: Project }) {
  return (
    <article className={`h-full flex flex-col ${FIELD[project.color].page}`}>
      <div className="h-[44%] shrink-0">
        <ProjectPhoto project={project} />
      </div>
      <div className="flex-1 p-[7cqi] flex flex-col">
        <h3 className="font-display text-[9.5cqi] leading-[0.95] tracking-[-0.02em] text-balance">{project.title}</h3>
        <p className="mt-[4cqi] text-base leading-snug">{project.summary}</p>
        <div className="mt-auto pt-[5cqi]">
          <ProjectActions project={project} compact />
        </div>
      </div>
    </article>
  )
}

export function ClosingSingle({ play }: { play: boolean }) {
  return (
    <div className="relative h-full bg-mustard text-night p-[8cqi] flex flex-col">
      <PageRibbon d={CLOSING_RIBBON_SINGLE} className={MUSTARD_RIBBON} play={play} />
      <h3 className="relative font-display text-[13cqi] leading-[0.92] tracking-[-0.03em]">
        {CLOSING_LINES.map(line => <span key={line} className="block">{line}</span>)}
      </h3>
      <p className="relative mt-auto text-base leading-snug font-medium">{CLOSING_TEXT}</p>
      <div className="relative mt-[6cqi]"><ClosingActions /></div>
    </div>
  )
}
