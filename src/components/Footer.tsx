import { Mail, MessageCircle, Heart } from 'lucide-react'
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappUrl } from '../lib/contact'
import { InstagramIcon } from './InstagramIcon'

// Read once at load so rendering stays pure
const YEAR = new Date().getFullYear()

const linkClass = 'flex items-center gap-2 font-semibold text-ink dark:text-cream hover:text-orange dark:hover:text-orange transition-colors'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/8 bg-white/50 dark:bg-night-1/60 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src="/logo.svg" alt="nueve2siete" className="h-9 w-auto" />
          <p className="text-sm text-muted dark:text-muted-night max-w-sm text-center md:text-left">
            Recordatorios para fiestas, merch para empresas y piezas a medida. Hecho en Colombia.
          </p>
        </div>

        <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} className={linkClass}>
              <Mail className="w-4 h-4 text-orange" />
              {EMAIL}
            </a>
          </li>
          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <InstagramIcon className="w-4 h-4 text-violet" />
              {INSTAGRAM_HANDLE}
            </a>
          </li>
        </ul>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-black/5 dark:border-white/8 text-center text-sm text-muted dark:text-muted-night flex items-center justify-center gap-1">
        <span>© {YEAR} nueve2siete • Hecho con</span>
        <Heart className="w-3.5 h-3.5 text-orange fill-orange" />
        <span>en Colombia</span>
      </div>
    </footer>
  )
}
