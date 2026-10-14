# nueve2siete

Sitio de nueve2siete, un emprendimiento de Colombia: recordatorios para fiestas, merch para empresas y piezas a medida, con un visor 3D para elegir los colores de cada pieza. Los pedidos terminan en WhatsApp. La guía para quien trabaja en el código es `CLAUDE.md`.

## Stack Tecnológico

- **Frontend:** React 19, TypeScript, Vite
- **Estilos:** Tailwind CSS v4, CSS Modules & Design Tokens
- **3D & Animaciones:** Three.js, React Three Fiber, React Three Drei, Framer Motion
- **Enrutamiento:** React Router DOM (SPA optimizada)
- **Backend / DB:** Supabase (opcional con soporte fallback)
- **Despliegue:** Cloudflare Pages (ver `docs/despliegue.md`)

## Estructura del Proyecto

```
nueve2siete/
├── public/                # Assets públicos (logo.svg, logo-mono.svg, logo-alt.svg)
├── src/
│   ├── components/        # Componentes reutilizables (Navbar, Footer, guirnalda, catálogo, visor 3D)
│   ├── context/           # Estado global y ThemeContext (Light / Dark mode)
│   ├── data/              # Catálogo de productos y paleta de colores de marca
│   ├── lib/               # Lógica pura con pruebas, Supabase, pedidos
│   ├── pages/             # Páginas principales (Home, CatalogPage, ProductDetailPage)
│   ├── App.tsx            # Enrutador principal y layout
│   ├── index.css          # Tokens de diseño, fuentes y variantes de tema
│   └── main.tsx           # Punto de entrada
├── models/                # Modelos 3D originales; `npm run models` los comprime en public/models
└── supabase/migrations/   # Tablas y permisos de Supabase (ver docs/supabase.md)
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
