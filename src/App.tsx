import { useRef } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Configurator } from './components/Configurator'
import { Catalog } from './components/Catalog'
import { Footer } from './components/Footer'
import type { Product } from './data/products'

export default function App() {
  const configuratorRef = useRef<HTMLDivElement>(null)
  const catalogRef = useRef<HTMLDivElement>(null)

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSelectProductFromCatalog = (_product: Product) => {
    // Al hacer clic en un producto del catálogo, desplazamos suavemente al personalizador 3D
    scrollToConfigurator()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EF] text-[#1F1E24]">
      <Navbar
        onScrollToConfigurator={scrollToConfigurator}
        onScrollToCatalog={scrollToCatalog}
      />

      <main className="flex-1">
        <Hero onExplore={scrollToConfigurator} />

        <div ref={configuratorRef}>
          <Configurator />
        </div>

        <div ref={catalogRef}>
          <Catalog onSelectProduct={handleSelectProductFromCatalog} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
