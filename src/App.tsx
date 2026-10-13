import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { CustomCursor } from './components/CustomCursor'
import { Home } from './pages/Home'

// Lazy loading del Catálogo y del Customizer 3D (Three.js) para que el Home cargue al instante
const CatalogPage = lazy(() => 
  import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage }))
)
const ProductDetailPage = lazy(() => 
  import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage }))
)

function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#DE5B2B] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-[#64606E]">Cargando experiencia 3D...</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <div className="min-h-screen flex flex-col bg-[#F6F3EF] text-[#1F1E24]">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/catalogo/:slug" element={<ProductDetailPage />} />

              {/* Redirecciones de conveniencia */}
              <Route path="/personalizar" element={<Navigate to="/catalogo" replace />} />
              <Route path="/personalizar/:slug" element={<Navigate to="/catalogo" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
