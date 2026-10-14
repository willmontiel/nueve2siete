import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, RotateCw } from 'lucide-react'
import { Ribbon } from '../Ribbon'
import { COLORS } from '../../data/products'
import { OCCASION_LABELS, type PageColor, type Project } from '../../data/projects'
import { whatsappUrl } from '../../lib/contact'
import { projectMessage } from '../../lib/order'

// Faces of the gift tags. Everything is sized in cqi (a share of the tag's width), so a tag scales as one
// piece from a phone to a wide screen. The top of every face stays clear for the eyelet.

const TAG_FIELD: Record<PageColor | 'orange' | 'mustard', { face: string; action: string }> = {
  orange: { face: 'bg-orange text-night', action: 'bg-night text-cream' },
  mustard: { face: 'bg-mustard text-night', action: 'bg-night text-cream' },
  lavender: { face: 'bg-lavender text-night', action: 'bg-night text-cream' },
  pink: { face: 'bg-pink text-night', action: 'bg-night text-cream' },
  lime: { face: 'bg-lime text-night', action: 'bg-night text-cream' },
  pine: { face: 'bg-pine text-cream', action: 'bg-cream text-night' },
}

// Ribbons drawn on the lower half of a face (viewBox 700 × 550), each entering from an edge. They keep below
// the titles, so no heading ever sits over a ribbon.
const FACE_RIBBONS = [
  'M -60 310 C 140 230, 300 370, 360 270 C 410 185, 330 120, 280 170 C 230 220, 300 310, 420 310 C 560 310, 650 230, 760 250',
  'M 760 190 C 560 250, 420 110, 300 150 C 200 185, 210 290, 290 290 C 370 290, 380 190, 300 150 C 180 90, 60 150, -60 110',
  'M -60 150 C 140 110, 220 290, 360 310 C 470 325, 520 230, 460 200 C 400 170, 360 270, 440 330 C 540 400, 660 350, 760 390',
  'M 760 330 C 600 250, 460 250, 390 330 C 330 400, 390 450, 440 410 C 490 370, 430 270, 320 250 C 200 230, 80 290, -60 250',
]

const display = 'font-display leading-[0.95] tracking-[-0.02em]'
const actionText = 'text-[max(1rem,4.2cqi)] font-semibold'

function FaceRibbon({ d, className, play }: { d: string; className: string; play: boolean }) {
  return (
    <Ribbon
      d={d}
      viewBox="0 0 700 550"
      strokeWidth={62}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full h-[55%] ${className}`}
      delay={0.25}
      duration={1.6}
      play={play}
    />
  )
}

export function FlipButton({ label, onFlip, className }: { label: string; onFlip: () => void; className: string }) {
  return (
    <button
      type="button"
      data-flip
      onClick={onFlip}
      aria-label={label}
      className={`grid place-items-center w-12 h-12 rounded-full transition-transform duration-200 hover:rotate-90 active:scale-95 ${className}`}
    >
      <RotateCw className="w-5 h-5" aria-hidden="true" />
    </button>
  )
}

function WhatsAppAction({ message, label, className }: { message: string; label: string; className: string }) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 min-h-12 px-5 rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97] ${actionText} ${className}`}
    >
      <MessageCircle className="w-[1.1em] h-[1.1em]" aria-hidden="true" />
      {label}
    </a>
  )
}

function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={`underline decoration-2 underline-offset-[0.3em] hover:decoration-[3px] ${actionText}`}>
      {children}
    </Link>
  )
}

/* ---------------------------------------------------------------- The first tag: what the garland is */

export function TitleFace({ play }: { play: boolean }) {
  return (
    <div className={`relative isolate h-full pt-[17cqi] px-[8cqi] pb-[8cqi] flex flex-col ${TAG_FIELD.orange.face}`}>
      <FaceRibbon d={FACE_RIBBONS[0]} className="text-orange-deep" play={play} />
      <h2 id="guirnalda-titulo" className={`${display} text-[15cqi] text-balance`}>
        Lo que ya cobró vida
      </h2>
      <p className="mt-auto text-[max(1rem,4.4cqi)] leading-snug font-medium">
        Proyectos para fiestas, empresas y eventos. Sigue bajando para recorrer la guirnalda, y toca una etiqueta
        para darle la vuelta.
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- A project: the photo, then its story */

export function ProjectFront({ project, onFlip }: { project: Project; onFlip: () => void }) {
  const field = TAG_FIELD[project.color]
  return (
    <div className={`relative h-full pt-[17cqi] px-[5cqi] pb-[6cqi] flex flex-col ${field.face}`}>
      <img
        src={project.photo}
        alt={project.photoAlt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="flex-1 min-h-0 w-full object-cover rounded-[6cqi]"
        style={{ objectPosition: project.photoPosition }}
      />
      <h3 className={`mt-[5cqi] px-[3cqi] ${display} text-[10cqi] text-balance`}>{project.title}</h3>
      <FlipButton
        label={`Ver la historia de "${project.title}"`}
        onFlip={onFlip}
        className={`absolute top-[4cqi] right-[4cqi] ${field.action}`}
      />
    </div>
  )
}

function Swatches({ project }: { project: Project }) {
  const colors = project.colorIds.map(id => COLORS.find(c => c.id === id)!)
  return (
    <p className="flex items-center gap-[1.8cqi]">
      <span className="sr-only">Colores: {colors.map(c => c.name).join(', ')}</span>
      {colors.map(color => (
        <span
          key={color.id}
          aria-hidden="true"
          title={color.name}
          className="w-[max(1.5rem,7.5cqi)] aspect-square rounded-full border-2 border-current"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </p>
  )
}

interface ProjectBackProps {
  project: Project
  /** Its place among the projects, which picks its ribbon */
  index: number
  flipped: boolean
  /** Times the tag has been turned over; each new turn draws the ribbon again */
  turns: number
  onFlip: () => void
}

export function ProjectBack({ project, index, flipped, turns, onFlip }: ProjectBackProps) {
  const field = TAG_FIELD[project.color]
  return (
    <div className={`relative isolate h-full pt-[17cqi] px-[8cqi] pb-[6cqi] flex flex-col ${field.face}`}>
      {/* Its ribbon draws itself each time the tag is turned over */}
      <FaceRibbon
        key={Math.ceil(turns / 2)}
        d={FACE_RIBBONS[index % FACE_RIBBONS.length]}
        className="text-night/10"
        play={flipped}
      />
      <p className={`${display} text-[9cqi] text-balance`}>{project.title}</p>
      <div className="mt-[5cqi] flex flex-wrap items-center gap-[3cqi]">
        <span className="inline-flex items-center min-h-[max(2rem,8cqi)] px-[4cqi] rounded-full border-2 border-current font-semibold text-[max(1rem,4cqi)]">
          {OCCASION_LABELS[project.occasion]}
        </span>
        <Swatches project={project} />
      </div>
      <p className="mt-[5cqi] text-[max(1rem,4.4cqi)] leading-snug">{project.summary}</p>
      <div className="mt-auto pt-[5cqi] flex flex-wrap items-center gap-x-[5cqi] gap-y-3">
        <WhatsAppAction message={projectMessage(project.title)} label="Quiero algo así" className={field.action} />
        {project.productSlug && <TextLink to={`/catalogo/${project.productSlug}`}>Diseña el tuyo</TextLink>}
      </div>
      <FlipButton
        label={`Ver la foto de "${project.title}"`}
        onFlip={onFlip}
        className={`absolute top-[4cqi] right-[4cqi] ${field.action}`}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- The last tag: the visitor's turn */

export function ClosingFace({ play }: { play: boolean }) {
  return (
    <div className={`relative isolate h-full pt-[17cqi] px-[8cqi] pb-[8cqi] flex flex-col ${TAG_FIELD.mustard.face}`}>
      <FaceRibbon
        d={FACE_RIBBONS[3]}
        className="text-[color-mix(in_srgb,var(--color-mustard)_80%,var(--color-ink))]"
        play={play}
      />
      <h3 className={`${display} text-[14cqi]`}>El próximo es el tuyo</h3>
      <p className="mt-auto text-[max(1rem,4.4cqi)] leading-snug font-medium">
        Cuéntanos qué celebras o qué necesita tu empresa, y lo hacemos en los colores que elijas.
      </p>
      <div className="mt-[6cqi] flex flex-wrap items-center gap-x-[5cqi] gap-y-3">
        <WhatsAppAction
          message="¡Hola nueve2siete! Vi sus proyectos y tengo una idea."
          label="Cuéntanos tu idea"
          className={TAG_FIELD.mustard.action}
        />
        <TextLink to="/catalogo">Ver el catálogo</TextLink>
      </div>
    </div>
  )
}
