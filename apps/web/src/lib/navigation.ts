import { routes } from './routes'

export interface NavLink {
  href: string
  label: string
  /** Second line in dropdowns. */
  detail?: string
}

/** A set of links under one heading: a dropdown on desktop, a titled section on phones. */
export interface NavGroup {
  label: string
  links: NavLink[]
}

export type NavItem = NavLink | NavGroup

export const isNavGroup = (item: NavItem): item is NavGroup => 'links' in item

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Productos',
    links: [
      { href: routes.microphones, label: 'Micrófonos', detail: 'Con el logo de tu marca' },
      { href: routes.keychains, label: 'Llaveros', detail: 'Con tu nombre y un emoji' },
    ],
  },
  { href: routes.designYourOwn, label: 'Diseña el tuyo' },
  { href: routes.projects, label: 'Trabajos' },
  { href: routes.about, label: 'Nosotros' },
  { href: routes.contact, label: 'Contacto' },
]
