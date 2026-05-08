# Contexto del proyecto — Digital View Web

## Qué se hizo

Se creó una landing page completa para **Digital View**, agencia de marketing digital especializada en inmobiliarias.

### Archivos creados

```
Web digital/
├── index.html    → Estructura HTML completa (8 secciones)
├── styles.css    → Estilos, colores, responsive, animaciones
├── script.js     → Navbar scroll, menú mobile, reveal on scroll, formulario
└── context.md    → Este archivo
```

---

## La marca

- **Nombre:** Digital View
- **Instagram:** @digitalviewagency
- **Email:** digitalviewstrategies@gmail.com
- **Brochure fuente:** PDF de 14 páginas hecho en Canva (Presentación DV)

### Colores
| Rol | Hex |
|---|---|
| Fondo | `#0D0D0D` |
| Azul primario | `#1B38E8` |
| Verde lima (acento) | `#C8FF00` |
| Texto | `#FFFFFF` |
| Cards | `#161616` / `#1A1A1A` |

### Tipografía
- **Headings:** Bebas Neue (Google Fonts)
- **Cuerpo:** Inter (Google Fonts)

---

## Secciones de la web

1. **Navbar** — Logo + links ancla + CTA "Trabajemos juntos", fijo con efecto blur al hacer scroll
2. **Hero** — "Tu inmobiliaria no necesita más suerte." + stats (+20 inmobiliarias, +1000M invertidos)
3. **El Problema** — "El boca a boca no es una estrategia" + 3 pain points
4. **Servicios** — 6 cards: Análisis & Estrategia, Planificación, Fotografía & Videos, Meta Ads, Base de Datos, Análisis y Reportes
5. **Proceso** — Timeline de 5 etapas: Análisis → Planificación → Implementación → Activación → Ajustes y Métricas
6. **Testimonios** — 3 clientes con métricas reales:
   - Viviana Sasía (ZipCode): +1500 leads, 900K U$S captados, 5 ventas
   - Jose M. Chaher (Soldati Vista): +400 leads, primera venta en 10 días, 3500%
   - Abitat (Nordelta): 240 leads, 1400% alcance, 633% contactos
7. **Contacto** — Formulario (Formspree) + Instagram + email
8. **Footer** — Logo, links, copyright

---

## Decisiones técnicas

- **Stack:** HTML5 + CSS3 + JS vanilla (sin frameworks, sin Node)
- **Formulario:** Formspree — reemplazar `YOUR_FORM_ID` en el `action` del `<form>` en `index.html`
- **Animaciones:** Intersection Observer API (fade-in al hacer scroll)
- **Responsive:** Mobile-first, breakpoints en 900px y 600px
- **Deploy:** Se puede hostear gratis en Netlify, Vercel o GitHub Pages arrastrando la carpeta

---

## Pendiente

- [ ] Crear cuenta en [formspree.io](https://formspree.io) y reemplazar `YOUR_FORM_ID` en `index.html`
- [ ] Agregar logo oficial si existe como imagen (actualmente es texto)
- [ ] Elegir dominio y hacer deploy
