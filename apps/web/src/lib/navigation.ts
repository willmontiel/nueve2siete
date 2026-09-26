import { routes } from './routes'

export interface NavItem {
  href: string
  label: string
}

export const MAIN_NAV: NavItem[] = [
  { href: routes.microphones, label: 'Micrófonos' },
  { href: routes.designYourOwn, label: 'Diseña el tuyo' },
  { href: routes.projects, label: 'Trabajos' },
  { href: routes.about, label: 'Nosotros' },
  { href: routes.contact, label: 'Contacto' },
]
