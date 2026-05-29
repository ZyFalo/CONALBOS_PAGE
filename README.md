# CONALBOS Bogotá · Sitio web

Landing page estática para la firma de abogados **CONALBOS Seccional Bogotá**.
Construida con **HTML, CSS y JavaScript puro** (sin dependencias ni paso de build).

## Estructura

```
Conalbos/
├── index.html          # Página única con todas las secciones
├── css/
│   └── styles.css      # Estilos (tema oscuro elegante + dorado)
├── js/
│   └── main.js         # Menú, animaciones, contador, validación de formulario
├── assets/
│   └── img/
│       └── logo-conalbos.png
└── README.md
```

## Secciones

1. **Hero** — titular, llamados a la acción y cifras destacadas
2. **Quiénes somos** — propósito y pilares de la firma
3. **Servicios** — 8 áreas de práctica
4. **Por qué nosotros** — beneficios y estadísticas animadas
5. **Contacto** — datos + formulario con validación
6. **Footer**

## Cómo verlo

Solo abre `index.html` en el navegador. Para una vista más fiel (rutas relativas), sirve la carpeta con un servidor local:

```bash
# Opción 1 (Python)
python3 -m http.server 8000

# Opción 2 (Node)
npx serve .
```

Luego visita `http://localhost:8000`.

## Pendientes / datos a reemplazar

Estos valores son **placeholders** y deben actualizarse con la información real:

- [ ] **Dirección** en Bogotá (en `index.html`, sección Contacto y Footer)
- [ ] **Teléfono** `(+57) 300 000 0000`
- [ ] **Correo** `info@conalbosbogota.com` (también en `js/main.js`)
- [ ] **Imágenes del carrusel del hero** — reemplazar `assets/img/hero/slide-1..4.jpg` por fotos propias (formato vertical 4:5). Las actuales son de Unsplash (uso libre)
- [ ] **Imágenes del propósito** — `assets/img/proposito/pilar-1..3.jpg` (componente circular 3D). También son de Unsplash; el texto de cada pilar vive en los atributos `data-*` del `index.html`
- [ ] **Redes sociales** — agregar enlaces si se desea
- [ ] **Políticas de privacidad / Términos** — enlazar a las páginas correspondientes

## Envío del formulario

El formulario hoy abre el cliente de correo del usuario (`mailto:`). Para recibir los
mensajes directamente, conéctalo a un servicio sin backend como
[Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com): basta con
cambiar el `action`/lógica en `js/main.js`.

## Despliegue

Al ser estático, se puede publicar tal cual en Netlify, Vercel, GitHub Pages,
Cloudflare Pages o cualquier hosting (Hostinger, etc.) subiendo la carpeta completa.
