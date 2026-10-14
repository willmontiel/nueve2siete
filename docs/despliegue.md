# Despliegue: Cloudflare y el dominio de GoDaddy

El sitio va en Cloudflare, que es gratis y permite uso comercial. El plan gratuito de Vercel no lo permite: sus
condiciones cuentan como comercial *"advertising the sale of a product or service"*, aunque el pago no pase por
el sitio.

Cloudflare lo sirve como un **Worker** de archivos estáticos, el flujo que su panel ofrece hoy para proyectos
nuevos. La configuración está en `wrangler.jsonc`: sirve la carpeta `dist` y abre la app en cualquier dirección.

El dominio sigue comprado en GoDaddy, pero su DNS pasa a Cloudflare. Hace falta para usar `nueve2siete.com` sin
`www`, y no cuesta nada.

## 0. Antes de empezar

Cloudflare construye el sitio desde GitHub, así que el código tiene que estar allá, en `master`:

1. Haz commit y push de todo lo pendiente en `v1`, incluidos `wrangler.jsonc` y `.nvmrc`.
2. Lleva `v1` a `master`, con un merge o un pull request.

## 1. Crear el Worker

1. En dash.cloudflare.com, ve a **Workers & Pages → Create → Import a repository**. Conecta GitHub y elige
   `willmontiel/nueve2siete`.
2. En **Set up your application**:
   - Project name: `nueve2siete`.
   - Build command: `npm run build`.
   - Deploy command: `npx wrangler deploy`.
   - Preview command: deja el que trae.
   - **Enable Preview builds:** déjalo encendido. Así cada rama distinta de `master` tiene su versión de prueba.
3. Abre **Advanced settings**:
   - Si hay un campo de rama (Branch), pon `master`. Cloudflare asume `main`, y tu repo usa `master`.
   - Si aparece **Build variables**, agrega las cinco de tu `.env`, con los mismos valores:
     - `VITE_WHATSAPP_PHONE`
     - `VITE_CONTACT_EMAIL`
     - `VITE_INSTAGRAM_URL`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
4. Dale **Deploy**.
5. Si no pudiste poner las variables en el paso 3, el primer build falla a propósito, porque faltan las de
   contacto. En ese caso:
   1. Entra al Worker → **Settings → Build → Build variables and secrets**.
   2. Agrega las cinco.
   3. Ve a **Deployments** y vuelve a lanzar el build.

   Van como variables de **build**, no en "Variables and Secrets": el sitio las lee al construirse.
6. **Prueba el sitio.** Queda en una dirección como `nueve2siete.<tu-cuenta>.workers.dev`. Node 22 lo toma solo del
   archivo `.nvmrc`.

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

1. En **Workers & Pages**, abre el Worker `nueve2siete` y entra a **Settings → Domains & Routes → Add → Custom
   domain**.
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
  con su dirección en el panel del Worker.
- **Cambiar una variable:** si cambias una variable de build en Cloudflare, hay que construir de nuevo: haz un push
  o relanza el último build desde **Deployments**.
- **Supabase:** no hay que configurar nada para el dominio.
- **El correo:** `nueve2siete@outlook.com` no usa el dominio, así que el cambio de DNS no lo toca.
- **Google (opcional):** registra el sitio en Google Search Console y envía `https://nueve2siete.com/sitemap.xml`
  para que Google lo encuentre antes.
