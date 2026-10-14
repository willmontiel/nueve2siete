# Deuda: pendientes por validar

Datos que el sitio necesita y que todavía no están confirmados. Mientras un punto siga abierto aquí, el sitio no
lo publica como un hecho: usa un texto neutro o lo omite. Cuando se valide, se marca y se anota la respuesta.

## Promesas comerciales (validar en equipo)

- [ ] **Envíos:** ¿a qué ciudades?, ¿quién paga el envío?, ¿con qué transportadora?, ¿cuánto tarda?
- [ ] **Tiempos de fabricación por producto.** Gemini decía portamicrófono 2 días, clicker 1 día y portafotos
      2 días, sin confirmar. El sitio y el mensaje de pedido ya no los mencionan.
- [ ] **Precios.** Portamicrófono $55.000, clicker $22.000, portafotos $28.000 y llavero $15.000 (de Gemini).
      Se quedan por ahora (decidido el 2026-10-14) y salen como "valor de referencia"; falta confirmarlos.
- [ ] **Formas de pago** (por ejemplo transferencia, Nequi, Daviplata, efectivo) y si se cobra un anticipo antes
      de fabricar.
- [ ] **Pedido mínimo** para empresas y eventos, y descuentos por volumen.
- [ ] **Empaque:** ¿el pedido incluye empaque de regalo o cinta? Gemini lo prometía.
- [ ] **Tiempo de respuesta** por WhatsApp. Gemini decía "te respondemos de inmediato".
- [ ] **Garantía y cambios.**
- [ ] **Afirmaciones de calidad** que dejó Gemini: "sin marcas de soporte", "acabado satinado mate", "colores
      permanentes, cero pintura que se despegue", "acabados de precisión", "switch de alta durabilidad". El
      sitio ya no muestra ninguna.

## Contenido

- [ ] **Lema definitivo.** Por ahora se usa "Piezas únicas que cobran vida".
- [ ] **Proyectos reales y sus fotos** para la guirnalda. Por ahora hay cuatro proyectos ficticios con fotos de
      IA en `src/data/projects.ts`: portamicrófonos para un podcast, clickers para un cumpleaños, portafotos
      para una boda y un kit de bienvenida para una empresa. Por cada proyecto real hace falta:
      - Un título corto (máximo 28 caracteres).
      - La ocasión: fiesta, empresa o evento.
      - Una o dos frases sobre lo que se hizo.
      - Los colores usados.
      - Una foto vertical u horizontal.
      - Si corresponde a un producto del catálogo, cuál.

      El de los animales para la fiesta de la jungla es buen candidato.
- [x] **Colores del configurador:** una lista de colores comunes; si el cliente elige uno que no tienen, lo
      compran (confirmado el 2026-10-14).
- [ ] **Las ocasiones de cada pieza** en el catálogo las escribí yo: "Para tu podcast, tu canal o tu empresa",
      "Un recordatorio para cumpleaños y fiestas" y "Para bodas, bautizos y primeras comuniones". También los
      ejemplos del último cartel (animales para una fiesta de la jungla, el logo en un llavero, la inicial de
      cada invitado). Confirmar que son ocasiones y piezas que quieren ofrecer.
- [ ] **Lista local de proyectos:** cuando los proyectos reales estén en Supabase, cambiar los 4 inventados de
      `src/data/projects.ts` por una copia de los reales, o vaciarla. Esa lista es la que se ve si Supabase no
      responde.
- [ ] **Fotos o un video corto de las piezas reales** para el catálogo. Hoy solo se ven en 3D.

## Lanzamiento

- [ ] **Títulos y descripciones** de cada página (`src/lib/meta.ts`) y el texto que sale al compartir el enlace
      (`index.html`): los escribí yo, provisionales. Revisarlos.
- [x] **El plan de hosting:** Cloudflare Pages, gratis y con uso comercial permitido. El plan gratuito de Vercel
      lo prohíbe (decidido el 2026-10-14).
- [x] **Dominio:** nueve2siete.com, comprado en GoDaddy (confirmado el 2026-10-14).
