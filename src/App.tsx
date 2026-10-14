import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { SmoothScroll } from './components/SmoothScroll'
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
      <div className="w-8 h-8 rounded-full border-2 border-orange border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-muted dark:text-muted-night">Cargando experiencia...</span>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScroll />
        <ScrollToTop />
        <div className="min-h-svh flex flex-col bg-cream dark:bg-night text-ink dark:text-cream transition-colors duration-300">
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
  </ThemeProvider>
)
}
