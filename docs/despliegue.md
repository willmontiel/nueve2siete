# Despliegue: Cloudflare Pages y el dominio de GoDaddy

El sitio va en Cloudflare Pages: es gratis y permite uso comercial. El plan gratuito de Vercel no lo permite: sus
condiciones cuentan como comercial *"advertising the sale of a product or service"*, aunque el pago no pase por
el sitio.

El dominio sigue comprado en GoDaddy, pero su DNS pasa a Cloudflare. Hace falta para usar `nueve2siete.com` sin
`www`, y no cuesta nada.

## 0. Antes de empezar

Cloudflare publica la rama `master` como el sitio oficial, y cada rama aparte (`v1`) como una versión de prueba
con su propia dirección. Antes de desplegar:

1. Haz commit y push de lo pendiente en `v1`.
2. Lleva `v1` a `master`, con un merge o un pull request.

## 1. Crear el proyecto en Cloudflare Pages

1. Crea una cuenta gratis en dash.cloudflare.com, o entra con la que tengas.
2. Ve a **Workers & Pages → Create**. Elige la pestaña **Pages** (no Workers) y luego **Connect to Git**. Si la
   pantalla te ofrece Workers, busca el enlace para Pages.
3. Conecta GitHub, elige `willmontiel/nueve2siete` y dale **Begin setup**.
4. Configura el build:
   - Production branch: `master`.
   - Framework preset: **React (Vite)**, o **None**.
   - Build command: `npm run build`.
   - Build output directory: `dist`.
5. En **Environment variables (advanced)**, agrega estas cinco, con los mismos valores de tu `.env`:
   - `VITE_WHATSAPP_PHONE`
   - `VITE_CONTACT_EMAIL`
   - `VITE_INSTAGRAM_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   Sin las tres de contacto el build falla a propósito. Node 22 lo toma solo del archivo `.nvmrc`.
6. Dale **Save and Deploy**. En unos minutos el sitio queda en `nueve2siete.pages.dev`. Ábrelo y pruébalo.
7. Ve a **Settings → Variables and Secrets** y revisa que las cinco variables estén también en **Preview**. Si
   no están, agrégalas; sin ellas fallan las versiones de prueba de `v1`.

## 2. Pasar el DNS del dominio a Cloudflare

1. **Agrega el dominio en Cloudflare:** en el inicio del panel, dale **Add a domain**, escribe `nueve2siete.com`,
   deja que revise los registros DNS que ya existen y elige el plan **Free**.
2. **Revisa los registros importados.** Borra los registros **A** de `nueve2siete.com` (`@`) y el **CNAME** de
   `www`: son de la página de estacionamiento de GoDaddy ("Parked") y chocarían con el sitio. No borres nada más.
3. **Copia los nameservers.** Cloudflare te da dos servidores de nombres, del tipo `algo.ns.cloudflare.com`.
4. **Cámbialos en GoDaddy:**
   1. Entra a **Mis productos** y, junto a nueve2siete.com, abre **DNS → Servidores de nombres**.
   2. Dale **Cambiar servidores de nombres** y elige **Usaré mis propios servidores de nombres**.
   3. Pega los dos de Cloudflare y guarda.

   Si GoDaddy tiene **DNSSEC** activo en el dominio, desactívalo antes de este cambio.
5. **Espera.** Suele tardar menos de una hora, pero puede llegar a 24. Cloudflare te avisa por correo cuando el
   dominio queda **Active**.

## 3. Conectar el dominio al sitio

1. En **Workers & Pages**, abre el proyecto y entra a **Custom domains → Set up a custom domain**.
2. Escribe `nueve2siete.com` y confirma. Cloudflare crea el registro y el certificado HTTPS solo.
3. Repite con `www.nueve2siete.com`.
4. Para que `www` lleve a la dirección sin `www`, ve a **Rules → Redirect Rules**, crea una regla desde la
   plantilla **Redirect from WWW to root** y guárdala.

## 4. Comprobar

- `https://nueve2siete.com` abre el sitio, y `https://www.nueve2siete.com` lleva al mismo.
- Una dirección interna como `https://nueve2siete.com/catalogo/clicker-fidget` abre directo, también al recargar.
- Haz un pedido de prueba. Debe aparecer en Supabase, en **Table Editor → orders**.
- Pega el enlace en un chat de WhatsApp: debe salir la imagen con el logo y la descripción. WhatsApp guarda las
  vistas previas un tiempo, así que si ya habías pegado el enlace antes puede tardar en actualizarse.

## 5. Después del lanzamiento

- **Publicar cambios:** cada push a `master` publica el sitio. Cada push a otra rama crea una versión de prueba,
  con su dirección en el panel del proyecto.
- **Cambiar una variable:** si cambias una variable en Cloudflare, hay que desplegar de nuevo (**Deployments →
  ⋯ → Retry deployment**).
- **Supabase:** no hay que configurar nada para el dominio.
- **El correo:** `nueve2siete@outlook.com` no usa el dominio, así que el cambio de DNS no lo toca.
- **Google (opcional):** registra el sitio en Google Search Console y envía `https://nueve2siete.com/sitemap.xml`
  para que Google lo encuentre antes.
