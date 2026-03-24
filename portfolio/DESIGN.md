# Portfolio V2 — DESIGN.md

## Design System Components

---

## 1. Color Palette

```css
:root {
  --color-bg:           #F7F6F2;
  --color-text:         #1C1C1A;
  --color-text-muted:   #5A5A54;
  --color-primary:      #2B5E2B;
  --color-secondary:    #4A7B4C;
  --color-accent:       #8FB573;
  --color-border:       #E2E0D9;
  --color-bg-card:      #F7F6F2;
  --color-bg-nav:       rgba(247, 246, 242, 0.92);
}
```

**Usage:**
- `--color-bg` — `background-color` on `<body>`, `<main>`, cards
- `--color-text` — `color` on headings, body paragraphs
- `--color-text-muted` — `color` on `<small>`, `.meta`, `<figcaption>`
- `--color-primary` — nav link hover, primary buttons, active states
- `--color-secondary` — `<a>` links by default
- `--color-accent` — hover glow on cards, decorative borders
- `--color-border` — `border` on cards, inputs, `<hr>`, nav

---

## 2. Typography Tokens

```css
:root {
  --font-heading: 'Syne', sans-serif;
  --font-body:    'Source Serif 4', serif;
  --font-mono:    'JetBrains Mono', monospace;

  --size-display: clamp(3rem, 8vw, 4.5rem);
  --size-h1:      clamp(2rem, 5vw, 3rem);
  --size-h2:      clamp(1.5rem, 3vw, 2rem);
  --size-h3:      1.5rem;
  --size-body:    1.125rem;
  --size-small:   0.875rem;
  --size-code:    0.9375rem;

  --weight-regular: 400;
  --weight-semibold: 600;
  --weight-bold:   700;
  --weight-black:  800;

  --leading-body:    1.7;
  --leading-heading: 1.15;
  --tracking-heading: -0.02em;
  --tracking-display: -0.03em;
}
```

---

## 3. Component Library

### 3.1 Navigation

```html
<nav class="site-nav" aria-label="Main navigation">
  <a href="/" class="nav-logo">Eric Polanski</a>
  <ul class="nav-links" role="list">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><a href="/resume">Resume</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

**Styles:**
- Sticky, backdrop-filter: blur(8px), semi-transparent background
- Logo: Syne 600, --color-text, no underline
- Links: Source Serif 4 400, --color-text-muted → --color-primary on hover
- Active link: --color-primary with bottom border 2px solid --color-primary
- Mobile: hamburger toggle → full-screen overlay menu

**States:**
- Default: muted text
- Hover: --color-primary, 200ms ease-out
- Active (current page): --color-primary, border-bottom 2px

---

### 3.2 Hero Section (Home)

```html
<section class="hero">
  <p class="hero-label">Developer — Creative Technologist — Trail Runner</p>
  <h1 class="hero-name">Eric<br>Polanski</h1>
  <p class="hero-tagline">I build thoughtful digital experiences<br>with care for craft and detail.</p>
</section>
```

**Styles:**
- Min-height: 100svh, flexbox center (column)
- hero-label: Source Serif 4, 14px, --color-text-muted, uppercase tracking
- hero-name: Syne 800, --size-display, --tracking-display, line-height 0.95
- hero-tagline: Source Serif 4 400, --size-h3, --leading-body, max-width 480px

---

### 3.3 Project Card

```html
<article class="project-card">
  <div class="project-card__image-wrap">
    <img src="..." alt="Teddy Talk app interface" class="project-card__image" loading="lazy" />
  </div>
  <div class="project-card__body">
    <h3 class="project-card__title">Teddy Talk</h3>
    <p class="project-card__desc">A short description of what this project is and who it serves.</p>
    <a href="/projects/teddy-talk" class="project-card__link">View project →</a>
  </div>
</article>
```

**Styles:**
- Card: background --color-bg, border 1px solid --color-border, border-radius 8px
- Image: aspect-ratio 16/9, object-fit cover, border-radius 6px 6px 0 0
- Body padding: 24px
- Title: Syne 600, 20px
- Description: Source Serif 4 400, 16px, --color-text-muted, line-height 1.6
- Link: Source Serif 4 600, 14px, --color-secondary → --color-primary on hover

**States:**
- Default: subtle border
- Hover: border-color --color-accent, box-shadow 0 4px 24px rgba(43,94,43,0.08), translateY -2px, 200ms ease-out

---

### 3.4 Buttons

```html
<a href="..." class="btn btn--primary">Download Resume</a>
<a href="..." class="btn btn--secondary">View Live</a>
<a href="..." class="btn btn--ghost">Learn more</a>
```

**Styles:**
- Padding: 12px 24px, border-radius: 6px, font: Syne 600, 15px
- Primary: background --color-primary, color white, no border
- Secondary: background transparent, color --color-primary, border 1.5px solid --color-primary
- Ghost: background transparent, color --color-secondary, no border
- Transition: 200ms ease-out on all properties

**States:**
- Hover (primary): background --color-secondary, 200ms
- Hover (secondary): background --color-primary, color white, 200ms
- Focus: outline 2px solid --color-accent, outline-offset 2px

---

### 3.5 Contact Form

```html
<form class="contact-form" action="https://formspree.io/..." method="POST">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required autocomplete="name" />
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required autocomplete="email" />
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn btn--primary">Send message</button>
</form>
```

**Styles:**
- Labels: Syne 600, 14px, display block, margin-bottom 8px
- Inputs/textarea: 100% width, padding 12px 16px, border 1.5px solid --color-border, border-radius 6px, Source Serif 4 400, 16px
- Focus: border-color --color-primary, outline none
- Error: border-color #C0392B, small error message below in same red
- Textarea: resize vertical only, min-height 120px

---

### 3.6 Footer

```html
<footer class="site-footer">
  <p class="footer-copy">© 2026 Eric Polanski</p>
  <nav class="footer-nav" aria-label="Footer navigation">
    <a href="/contact">Contact</a>
    <a href="https://github.com/ericpolanski" target="_blank" rel="noopener">GitHub</a>
  </nav>
</footer>
```

**Styles:**
- Background: --color-border (subtle)
- Padding: 48px vertical
- Flex layout: logo/copy left, nav links right
- Links: Source Serif 4 400, 14px, --color-text-muted → --color-primary on hover
- Border-top: 1px solid --color-border

---

## 4. Page Layouts

### Home Page
```
[NAV]
[HERO] — full viewport, centered
[FEATURED PROJECTS] — "Selected Work" heading + 3 project cards in grid
[FOOTER]
```

### About Page
```
[NAV]
[PAGE HEADER] — "About" + subtitle
[BIO SECTION] — 2-col: photo (40%) + bio text (60%), stacked on mobile
[EXPERIENCE] — clean list, company + role + duration
[FOOTER]
```

### Projects Page
```
[NAV]
[PAGE HEADER] — "Projects"
[PROJECT GRID] — 2-col on desktop, 1-col on mobile, 7 project cards
[FOOTER]
```

### Resume Page
```
[NAV]
[PAGE HEADER] — "Resume"
[CTA] — Download PDF button
[INLINE RESUME] — semantic HTML: section for each role, ul for bullets
[FOOTER]
```

### Contact Page
```
[NAV]
[PAGE HEADER] — "Get in touch"
[2-COL LAYOUT] — left: contact info/email, right: contact form
[FOOTER]
```

---

## 5. Animation & Motion

### Global
- * transition: 200ms ease-out for color and opacity only
- No global animation on page load

### Scroll Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```
- Trigger: Intersection Observer at 10% threshold
- Stagger: JS adds transition-delay: ${index * 80}ms per item

### Project Card Hover
```css
.project-card {
  transition: border-color 200ms ease-out,
              box-shadow 200ms ease-out,
              transform 200ms ease-out;
}
.project-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 24px rgba(43, 94, 43, 0.08);
  transform: translateY(-2px);
}
```

### Navigation Link Hover
```css
.nav-links a {
  transition: color 200ms ease-out;
}
.nav-links a:hover {
  color: var(--color-primary);
}
```

---

## 6. Responsive Breakpoints

```css
/* Mobile first */
@media (max-width: 640px)  { /* sm  */ }
@media (max-width: 768px)  { /* md  */ }
@media (max-width: 1024px) { /* lg  */ }
@media (max-width: 1280px) { /* xl  */ }
```

- Single column layout below 768px
- Nav collapses to hamburger at 768px
- Type scale uses clamp() so no breakpoint overrides needed for font sizes
- Section padding reduces to 64px on mobile

---

## 7. Accessibility

- All images have descriptive alt text
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Focus states visible on all interactive elements
- Skip-to-content link at top of page
- prefers-reduced-motion: disable all transitions/animations
- Semantic landmarks: nav, main, article, section, footer
- Form labels explicitly associated with inputs via for/id
