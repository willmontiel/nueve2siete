# nueve2siete

Estudio de diseño y piezas personalizadas a medida en Colombia. Especialistas en pedidos corporativos, kits de onboarding, recordatorios para eventos y artículos exclusivos con visor y personalizador interactivo.

## Stack Tecnológico

- **Frontend:** React 19, TypeScript, Vite
- **Estilos:** Tailwind CSS v4, CSS Modules & Design Tokens
- **3D & Animaciones:** Three.js, React Three Fiber, React Three Drei, Framer Motion
- **Enrutamiento:** React Router DOM (SPA optimizada)
- **Backend / DB:** Supabase (opcional con soporte fallback)
- **Despliegue:** Vercel

## Estructura del Proyecto

```
nueve2siete/
├── public/                # Assets públicos (logo.svg, logo-mono.svg, logo-alt.svg)
├── src/
│   ├── components/        # Componentes reutilizables (Navbar, Footer, CustomCursor, 3D Viewer)
│   ├── context/           # Estado global y ThemeContext (Light / Dark mode)
│   ├── data/              # Catálogo de productos y paleta de colores de marca
│   ├── lib/               # Clientes y utilidades (Supabase)
│   ├── pages/             # Páginas principales (Home, CatalogPage, ProductDetailPage)
│   ├── App.tsx            # Enrutador principal y layout
│   ├── index.css          # Tokens de diseño, fuentes y variantes de tema
│   └── main.tsx           # Punto de entrada
└── vercel.json            # Configuración de rewrites para Vercel SPA
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Validar linter
npm run lint
```
