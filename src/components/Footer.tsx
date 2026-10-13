import { MessageCircle, Heart } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'

export function Footer() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'

  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/8 bg-white/50 dark:bg-[#16151D]/60 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identidad */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src="/logo.svg" alt="nueve2siete" className="h-9 w-auto" />
          <p className="text-xs text-[#64606E] dark:text-[#A3A2AE] max-w-sm text-center md:text-left">
            Diseño y fabricación de objetos personalizados. Hecho en Colombia con acabados de alta precisión.
          </p>
        </div>

        {/* Estado del sistema & Enlaces */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#64606E] dark:text-[#A3A2AE]">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEDE8] dark:bg-white/10 text-[#1F1E24] dark:text-[#F6F3EF]">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
            <span>{isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Frontend / WhatsApp'}</span>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#DE5B2B] dark:hover:text-[#DE5B2B] text-[#1F1E24] dark:text-[#F6F3EF] transition-colors font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Atención por WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-black/5 dark:border-white/8 text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
        <span>© {new Date().getFullYear()} nueve2siete.com • Hecho con</span>
        <Heart className="w-3.5 h-3.5 text-[#DE5B2B] fill-[#DE5B2B]" />
        <span>en Colombia</span>
      </div>
    </footer>
  )
}
