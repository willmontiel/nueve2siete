# Hoja de ruta: rediseño de nueve2siete

**Objetivo:** convertir el sitio que dejó Gemini en un sitio con identidad propia: colorido, de letras grandes y
formas redondas, construido alrededor de la cinta del logo, con una guirnalda interactiva de proyectos y el
configurador de productos que ya existe.

**Cómo se usa este documento:** el trabajo va por fases. Cada fase tiene su propio plan detallado de tareas,
que escribo cuando la fase arranca, después de que resolvamos sus decisiones abiertas. Ninguna fase empieza sin
tu visto bueno.

## Reglas que aplican a todas las fases

- **Posicionamiento:** recordatorios para fiestas, merchandising para empresas y piezas a medida ("hacemos lo que
  imagines"). Los textos para el cliente no dicen "3D", "impresión 3D" ni "estudio".
- **Contacto:** WhatsApp +57 321 3527921 (`573213527921` para los enlaces de wa.me), correo
  nueve2siete@outlook.com e Instagram https://instagram.com/nueve2siete. WhatsApp sigue siendo el canal de
  pedidos; no hay pasarela de pago.
- **Modo oscuro obligatorio:** el visitante lo enciende o lo apaga; la primera vez sigue la preferencia del
  sistema. Cada sección se diseña en los dos temas desde el principio, pensando en pantallas OLED.
- **Deuda:** las promesas y datos sin confirmar viven en [docs/deuda.md](../../deuda.md). Mientras sigan
  abiertos, el sitio no los publica como hechos.
- **Paleta del PDF de marca (página 3 y 5):** crema `#F0EEE8`, naranja `#DE5B2B`, lavanda `#9FAFE9`, mostaza
  `#EFBB29`, verde `#336F52`, rosa `#E890B3`, naranja claro `#E87440`, lima `#CCD65F`.
- **Formas:** todo redondeado. Nada de bordes rectos ni esquinas en punta.
- **Tipografía:** Cal Sans para los titulares (es la base del logo y ya está instalada).
- **Intensidad:** como pictoric: letras enormes, bloques enteros de color, movimiento. El motivo propio es la
  cinta; nunca flores ni burbujas.
- **Estilo (del skill de diseño):** sin degradados, sin sombras en elementos quietos, sin etiquetas pequeñas
  encima de los títulos, sin emojis en la interfaz, sin numeración decorativa 01/02/03. Los titulares caben en
  dos líneas a cualquier ancho.
- **Movimiento:** todo lo que se anima tiene una versión quieta para quien activó "reducir movimiento" en su
  sistema, y el contenido se ve aunque falle el JavaScript de las animaciones.
- **Celular:** cada pantalla tiene una composición propia para el teléfono, no solo una versión encogida.
- **Fotos:** las 4 fotos actuales son de IA y sirven como relleno temporal de la guirnalda. No se presentan como
  fotos del producto en el catálogo.
- **Git:** no hago commit ni push salvo que me lo pidas.

## Orden y dependencias

```
Fase 0 Cimientos ──► Fase 1 Hero ──► Fases 2-3 Guirnalda ──► Fase 4 Resto del Home
       │                                    │
       ├──────────► Fase 5 Catálogo y producto (puede ir en paralelo después de la 0)
       │                                    └──────────► Fase 6 Supabase
       └──────────────────────────────────────────────────────────────────► Fase 7 Lanzamiento (al final)
```

---

## Fase 0: Cimientos

**Estado: completada el 2026-10-14.** Se verificó en el navegador:
- Cal Sans y Figtree cargan bien.
- Todos los enlaces de WhatsApp van a 573213527921, y el pedido sale con el producto.
- El footer muestra el correo y el Instagram.
- El tema oscuro aplica negro puro antes del primer pintado.
- Una dirección de producto inexistente lleva al catálogo.
- El clicker suena una vez por clic.
- El scroll suave se apaga con "reducir movimiento".

Además, 17 pruebas pasan y el lint quedó con 1 aviso preexistente en `ThemeContext`.

Pendiente para las fases que reconstruyen esas páginas: el Home, el catálogo y la página de producto de Gemini
todavía muestran promesas sin confirmar, como "Acabados de Precisión" o "sin marcas de soporte". Se reemplazan
al rediseñar cada página, según la deuda.

**Objetivo:** dejar la base correcta antes de diseñar. Al final el sitio se ve casi igual que hoy, pero con los
colores, la tipografía y los datos reales, y sin los bugs conocidos.

**Incluye:**
- **Contacto en un solo lugar:** un módulo con el número, el correo y la función que arma el enlace de WhatsApp.
  Hoy el número de prueba `573001234567` está repetido en 4 archivos (`Navbar`, `Footer`, `Home`,
  `ProductDetailPage`).
- **Paleta y formas como tokens** en `src/index.css`, con los valores exactos del PDF (los actuales están un
  poco corridos).
- **Tipografía:** Cal Sans para titulares y una segunda tipografía para párrafos. Se quita Outfit, que hoy se
  carga desde Google Fonts.
- **Bugs:**
  - El clicker suena dos veces por cada pulsación (`ProductViewer3D.tsx`).
  - El footer le muestra al cliente "Modo Frontend / WhatsApp".
  - Una dirección de producto que no existe muestra el micrófono en vez de llevar al catálogo.
  - El texto blanco sobre el verde de WhatsApp es ilegible (contraste 2:1).
- **Scroll suave** con Lenis, desactivado si el usuario pidió reducir el movimiento.
- **Pruebas automáticas** (Vitest) para la lógica pura: el mensaje de pedido de WhatsApp y la búsqueda de
  producto por dirección. Así llegan los pedidos, así que vale la pena protegerlo.

- **Paleta oscura** propia, pensada para OLED, con los mismos colores de marca ajustados para que se lean
  sobre fondo muy oscuro. El interruptor de tema que ya existe se conserva.

**Decisiones:**
1. ~~Modo oscuro~~ **Resuelto:** se queda, y el visitante decide.
2. **Resuelto:** Figtree para los párrafos, los botones y los precios.

**Lista cuando:** compila y pasa el lint y las pruebas; el botón de WhatsApp abre un chat con +57 321 3527921 y el
mensaje correcto; el clicker suena una sola vez.

---

## Fase 1: Hero (primera pantalla)

**Estado: aprobada el 2026-10-14.** También se quitó el cursor personalizado que había dejado Gemini.
- **La idea:** las cintas de las esquinas escriben los números del nombre, cada uno en su color del logo: el 9
  de "nueve" en naranja y el 2 en lavanda. Salen de su esquina al cargar y se enrollan de vuelta hacia ella
  con el scroll.
- **El inspector del skill:** el lema queda en 2 líneas a 1440, 768 y 390 px (151, 81 y 50 px), sin texto
  recortado ni tapado. Las fallas que reporta son de las secciones de Gemini que siguen debajo.
- **Cambió también:**
  - La barra de navegación ahora es simple y va en el flujo de la página.
  - Las secciones del Home llevan el ancla `#proyectos`.
  - El tema ya no guarda la preferencia del sistema como si fuera una elección del visitante.

**Objetivo:** la primera pantalla de tu boceto.

**Incluye:**
- **El lema** al centro, enorme, en Cal Sans y en dos líneas: "Piezas únicas / que cobran vida".
- **Una frase corta** debajo que diga qué hacen (recordatorios, merch para empresas, piezas a medida), para que
  la primera pantalla responda qué venden sin decir "3D".
- **La cinta tenue detrás del lema**, fiel al PDF: tono sobre tono, gruesa, redonda y con su bucle. En el PDF es
  una forma rellena con 14 a 16 % de opacidad; para que se dibuje sola al cargar la página la redibujo como una
  línea del mismo grosor. Después "respira" con el scroll.
- **Dos cintas de color** en las esquinas superior izquierda e inferior derecha, cortadas por el borde de la
  pantalla. Se dibujan al cargar y se enroscan con el scroll y el cursor.
- **Barra de navegación sencilla y redondeada:** logo, Catálogo, Proyectos y un botón de WhatsApp.
- **Versión para celular** con su propia composición.

**Decisiones:**
1. **Resuelto por ahora:** se usa el lema actual; el definitivo queda en la deuda. La frase corta la propongo
   yo al construir el hero.
2. **Resuelto:** naranja en la esquina superior izquierda y lavanda en la inferior derecha.

**Lista cuando:** el inspector del skill no marca fallas a 1440, 768 y 390 px, y tú apruebas los screenshots.

---

## Fases 2 y 3: Guirnalda de proyectos (reemplaza la revista y su coreografía)

**Estado: implementada el 2026-10-14, pendiente de tu aprobación.**

**Por qué cambió:** la revista y la transición del hero copiaban la puesta en escena de pictoric:
- el libro abierto al centro;
- el abanico de páginas a los lados;
- el marcapáginas "Abrir";
- el hero fijo con el libro subiendo a taparlo;
- el lema saliendo letra por letra.

Elegiste la opción B: algo que sale del negocio mismo (los recordatorios son regalos de fiesta, y la cinta del logo
es también la cinta de un regalo). La revista quedó en el commit `aca7009` y su coreografía en `6617b77`, por si
algún día se quiere recuperar.

**Cómo es:**
- **La transición:** el hero ya no se queda fijo. Al bajar, una cinta naranja desciende desde el hero, se estira
  en ondas suaves de lado a lado y las etiquetas caen una por una y quedan colgando.
- **La guirnalda:** mientras la sección está en pantalla, el scroll la lleva de lado.
  - Las etiquetas se mecen con el movimiento y vuelven solas a quedar rectas.
  - Se pueden mecer con el mouse o el dedo.
- **Las etiquetas:** cada una tiene su ojal de verdad (un agujero por donde se ve el fondo) y un lazo de cinta
  que la amarra.
  - **La primera** dice "Lo que ya cobró vida".
  - **Cada proyecto** muestra la foto y el título. Al tocarlo se voltea y por detrás aparecen la ocasión, los
    colores, la historia, "Quiero algo así" y "Diseña el tuyo"; su cinta se dibuja cada vez que se voltea.
  - **La última** dice "El próximo es el tuyo", con WhatsApp y el catálogo.
- **Teclado:** al recorrer las etiquetas con Tab, cada una se centra en pantalla. Al voltearla, el foco pasa al
  botón de la otra cara.
- **"Reducir movimiento":** la guirnalda es una fila que se recorre de lado, sin balanceo ni caída.

**Verificado en Chrome:**
- Escritorio y celular, en los dos temas.
- Clic, arrastre, toques y deslizamientos simulados, teclado, y "reducir movimiento".
- El inspector del skill no marca fallas en la guirnalda. Deja dos avisos que son efecto del movimiento
  horizontal: cuenta como visibles las etiquetas que ya salieron por los lados, y mide las cajas de las etiquetas
  mientras se mecen.

**Falta:** probar en Safari y en un iPhone real.

---

## Fase 4: Resto del Home

**Objetivo:** completar la página para que responda lo que un cliente necesita saber antes de escribir.

**Propuesta de secciones.** Después del hero y la guirnalda, cada sección responde una pregunta del visitante y va
sobre su propio bloque de color, no como cuadrícula de tarjetas:

1. **Ocasiones** ("¿esto es para mí?"). Cuatro palabras gigantes, una debajo de otra: Fiestas, Empresas,
   Eventos y Lo que imagines.
   - Al pasar el cursor, o al tocar en el celular, la sección entera cambia al color de esa ocasión y aparecen
     ejemplos: recordatorios temáticos, kits de bienvenida, portamicrófonos con logo, animales para una fiesta
     de la jungla.
   - Cada ocasión abre WhatsApp con un mensaje ya escrito, por ejemplo "Hola, quiero recordatorios para una
     fiesta".
2. **Pruébalo tú** ("¿cómo quedaría la mía?"). El visitante escribe el nombre de su marca y lo ve aparecer en el
   portamicrófono, y le cambia los colores.
   - Es el configurador que ya existe, en pequeño.
   - El visor se carga solo cuando el visitante llega a esta sección, así el inicio sigue cargando rápido.
   - Un botón lleva a la página completa del producto.
3. **Cómo se pide** ("¿y cómo funciona?"). La cinta recorre la sección y se dibuja con el scroll, uniendo cuatro
   pasos:
   - Nos cuentas la idea por WhatsApp.
   - Te proponemos el diseño y los colores.
   - La fabricamos.
   - Te llega.

   Los tiempos y los envíos quedan en texto neutro hasta validar la deuda.
4. **Preguntas frecuentes** ("¿y si…?"): tiempos, envíos, pagos, pedido mínimo, personalizar con logo. Depende
   por completo de la deuda: si las respuestas no están validadas, la sección no se publica.
5. **Cierre.** "nueve2siete" a todo el ancho con la cinta pasando detrás, más:
   - WhatsApp +57 321 3527921.
   - nueve2siete@outlook.com.
   - Instagram @nueve2siete.
   - "Hecho en Colombia".

El orden sigue el razonamiento del visitante: qué hacen (hero), pruebas de su trabajo (guirnalda), si sirve para su
ocasión (ocasiones), cómo quedaría lo suyo (configurador), cómo se pide, las dudas y por último el contacto.

**Decisiones:**
1. Validar estas secciones y su orden.
2. **Resuelto:** Instagram https://instagram.com/nueve2siete.
3. **Resuelto:** las promesas comerciales se validan después en equipo; están listadas en la deuda.

---

## Fase 5: Catálogo y página de producto

**Objetivo:** llevar la marca al catálogo y al configurador sin romper lo que ya funciona: el visor de las piezas,
los colores por zona, el texto de marca y el pedido por WhatsApp.

**Incluye:**
- **Catálogo** con la composición de la marca en vez de la cuadrícula genérica de tarjetas.
- **Página de producto** rediseñada con la misma lógica de hoy, y textos sin "3D".
- **El modelo del clicker** pesa 3.9 MB; lo comprimo para que cargue rápido en el celular.

**Decisión que necesito de ti:** ¿la lista de colores del configurador corresponde a los filamentos que de verdad
tienen? Esos nombres son los que le llegan al cliente en el mensaje de WhatsApp.

---

## Fase 6: Supabase

**Objetivo:** que puedas agregar proyectos y recibir pedidos sin tocar el código, con el plan gratuito.

**Propuesta mínima:**
- **Proyectos de la guirnalda** en una tabla, con las fotos en Supabase Storage. Se cargan desde el panel de
  Supabase; no hace falta un panel de administración propio todavía.
- **Registro de pedidos:** antes de abrir WhatsApp se guarda la configuración pedida, así queda un historial
  aunque se pierda el chat. Los visitantes solo pueden insertar, nunca leer.
- **Plan B:** si Supabase no responde, la guirnalda usa los datos locales y el pedido igual abre WhatsApp.

**Decisión que necesito de ti:** cuáles de estas dos funciones quieres, o si hay otra que te importe más.

---

## Fase 7: Lanzamiento

**Incluye:**
- **SEO:** título y descripción por página, y una imagen para cuando se comparte el enlace en WhatsApp o redes.
- **Imágenes optimizadas** en formatos modernos y con tamaños según la pantalla.
- **Despliegue en Vercel:** dominio, versiones de prueba por cada cambio y variables de entorno. Las tres de
  contacto (`VITE_WHATSAPP_PHONE`, `VITE_CONTACT_EMAIL`, `VITE_INSTAGRAM_URL`) son obligatorias: sin ellas el
  build falla a propósito.
- **Revisión final** con el inspector del skill y pruebas en celulares reales.
- **Fotos reales** en lugar de las de IA, a medida que las tengas.

**Decisión que necesito de ti:** el dominio. El footer actual dice nueve2siete.com; ¿ya lo tienen?

---

## Cómo trabajamos cada fase

1. Te traigo las decisiones abiertas de la fase, con mi recomendación.
2. Escribo el plan detallado de tareas de esa fase y lo revisas.
3. Lo implemento yo en esta sesión. Las fases son visuales y lo que más importa es tu ojo sobre los screenshots,
   así que recomiendo ese modo antes que delegar cada tarea a subagentes.
4. Te muestro el resultado a 1440, 768 y 390 px, con el informe del inspector.
5. Con tu aprobación pasamos a la siguiente fase.
