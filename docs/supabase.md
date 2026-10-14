# Supabase: proyectos de la guirnalda y registro de pedidos

El sitio usa Supabase para dos cosas:

- **Los proyectos de la guirnalda** del inicio, que se agregan desde el panel sin tocar el código.
- **El registro de pedidos:** cada vez que alguien toca "Pedir por WhatsApp", queda una fila con la pieza, los
  colores y un código (por ejemplo `N2S-7KQ3`). El mismo código va en el mensaje de WhatsApp, así se puede
  cruzar el chat con la fila aunque el chat se pierda.

## 1. Crear las tablas (una sola vez)

1. En supabase.com, abre el proyecto y entra a **SQL Editor**.
2. Copia completo el archivo `supabase/migrations/20261014120000_projects_and_orders.sql`, pégalo y dale **Run**.
3. Debe terminar en "Success". Crea:
   - la tabla `projects`;
   - la tabla `orders`;
   - el bucket de fotos `projects`, en Storage.

   Se puede correr otra vez sin dañar nada.

## 2. Agregar un proyecto

1. **La foto:** en **Storage → projects**, sube la foto.
   - JPG o WebP, de 1200 px en el lado largo.
   - Menos de 500 KB. El bucket no acepta más de 2 MB, y el plan gratuito no redimensiona fotos.
   - La etiqueta recorta la foto en vertical, así que el sujeto debe quedar más o menos al centro.
2. **La fila:** en **Table Editor → projects**, dale **Insert row** y llena:

| Columna | Qué va | Ejemplo |
|---|---|---|
| `title` | Título de la etiqueta, máximo 28 caracteres | `Animales para la jungla` |
| `occasion` | `party` (Fiesta), `business` (Empresa) o `event` (Evento) | `party` |
| `summary` | La historia, por detrás de la etiqueta. Máximo 160 caracteres | `Un león, una jirafa y un mono para cada invitado.` |
| `photo` | El nombre del archivo que subiste | `jungla.jpg` |
| `photo_alt` | Qué muestra la foto, para quien no la ve | `Animales de colores sobre una mesa de fiesta` |
| `photo_position` | Qué parte de la foto queda en el recorte. `50% 50%` es el centro; `30% 50%` corre el recorte a la izquierda | `50% 50%` |
| `color` | Color de la etiqueta: `lavender`, `pink`, `lime` o `pine` | `lime` |
| `color_ids` | Colores de las piezas, con los ids del catálogo (`src/data/products.ts`) | `{mostaza,verde}` |
| `product_slug` | Opcional: la pieza del catálogo para "Diseña el tuyo" | `clicker-fidget` |
| `sort_order` | Posición en la guirnalda; el menor va primero | `10` |
| `published` | Desmárcalo para esconder la etiqueta sin borrarla | ✓ |

Los ids de las columnas `id` y `created_at` se llenan solos.

Ids de colores: `rojo`, `vinotinto`, `naranja`, `durazno`, `mostaza`, `amarillo`, `verde-limon`, `verde`,
`verde-oscuro`, `turquesa`, `azul-cielo`, `azul`, `azul-oscuro`, `lavanda`, `morado`, `fucsia`, `rosado`, `cafe`,
`beige`, `blanco`, `gris`, `negro`.

Las piezas del catálogo: `portamicrofono`, `clicker-fidget`, `portafotos-margarita`.

El cambio se ve en el sitio en la siguiente visita; no hay que publicar nada.

## 3. Ver los pedidos

En **Table Editor → orders**. Cada fila tiene:
- la fecha;
- el código;
- la pieza;
- los colores por parte;
- el texto de la caja;
- el precio de referencia;
- el mensaje completo que se envió.

Los visitantes pueden agregar filas pero nunca leerlas. Solo se ven desde el panel.

## Qué tener en cuenta

- **Si Supabase no responde** (caído, pausado o sin internet):
  - La guirnalda muestra la lista local de `src/data/projects.ts`.
  - El pedido igual abre WhatsApp; solo no queda registrado.
- **La lista local hoy son los 4 proyectos inventados.** Cuando estén los reales en Supabase, conviene cambiarla por
  una copia de los reales o vaciarla, para que una caída nunca muestre proyectos que no existen.
- **El plan gratuito pausa el proyecto después de 7 días sin actividad.** Supabase avisa por correo y se reactiva
  desde el panel. Mientras esté pausado aplica lo de arriba.
- **Llaves:**
  - El sitio usa solo la llave pública (publishable o anon), en `VITE_SUPABASE_ANON_KEY`.
  - La `secret` o `service_role` nunca va en el `.env` ni en Cloudflare: salta todos los permisos.
- **Cloudflare** necesita las mismas dos variables como variables de build: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
  (ver `docs/despliegue.md`).
