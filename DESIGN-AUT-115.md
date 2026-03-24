# DESIGN-AUT-115: Eric Polanski Portfolio — Design Specification

## Overview

This document is the canonical design reference for the Eric Polanski portfolio site (eric.ericpolanski.com). It defines all SVG assets, layout wireframes, animation choreography, and design tokens. Engineering should treat this as the single source of truth for visual and motion decisions.

---

## 1. Design Tokens

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0A0E17` | Page background |
| `--color-bg-secondary` | `#131B2E` | Section alternates |
| `--color-surface` | `#1A2332` | Cards, nav glass |
| `--color-accent-cyan` | `#00D4FF` | Primary accent, CTAs, highlights |
| `--color-accent-purple` | `#8B5CF6` | Secondary accent, gradients |
| `--color-accent-pink` | `#F472B6` | Tertiary accent, decorative |
| `--color-text-primary` | `#F1F5F9` | Headings, body |
| `--color-text-secondary` | `#94A3B8` | Captions, meta |
| `--color-success` | `#10B981` | Form success states |
| `--color-border` | `rgba(0, 212, 255, 0.15)` | Subtle borders |

### Typography

| Token | Font | Weights |
|-------|------|---------|
| `--font-heading` | Inter | 700 (bold), 900 (black) |
| `--font-body` | Inter | 400 (regular), 500 (medium) |
| `--font-mono` | JetBrains Mono | 400, 500 |

**Scale:**
- Hero: `clamp(3rem, 8vw, 5rem)` / 900
- Section heading: `clamp(2rem, 5vw, 3rem)` / 700
- Subheading: `1.5rem` / 700
- Body: `1rem` / 400
- Caption: `0.875rem` / 400

### Spacing

- Base unit: `8px`
- Section padding: `120px` vertical, `5vw` horizontal
- Card padding: `32px`
- Max content width: `1400px`

### Border Radius

- Cards: `16px`
- Buttons: `8px`
- Tags/pills: `999px`
- Input fields: `8px`

### Shadows / Glows

```css
--glow-cyan: 0 0 30px rgba(0, 212, 255, 0.3);
--glow-purple: 0 0 30px rgba(139, 92, 246, 0.3);
--shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
```

---

## 2. SVG Assets

### 2a. EP Monogram Logo

**File:** `public/svg/ep-logo.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <!-- Background circle (optional, shown in dark mode) -->
  <circle cx="24" cy="24" r="22" fill="none" stroke="url(#ep-grad)" stroke-width="1.5" opacity="0.6"/>
  <!-- E letterform -->
  <path d="M10 14h20a6 6 0 0 1 0 12H10M10 26h16a6 6 0 0 1 0 12H10"
        stroke="url(#ep-grad)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"/>
  <!-- P letterform -->
  <path d="M30 14v20M30 14a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6h0"
        stroke="url(#ep-grad)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"/>
  <defs>
    <linearGradient id="ep-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00D4FF"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
</svg>
```

**Usage:** Navbar logo (24px), favicon, splash screen. Render with `currentColor` or apply gradient via `fill="url(#ep-grad)"`.

**Variant (inline wordmark):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 120 40" fill="none">
  <text x="0" y="30" font-family="Inter, sans-serif" font-weight="900" font-size="28" fill="url(#wm-grad)">EP</text>
  <defs>
    <linearGradient id="wm-grad" x1="0" y1="0" x2="60" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00D4FF"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
</svg>
```

---

### 2b. Section Divider SVGs

#### Hero → About (Wave Divider)

**File:** `public/svg/divider-hero-about.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
  <path d="M0 80V40c240 40 480-40 720 0s480 40 720 0V80H0z" fill="url(#div-grad-1)"/>
  <path d="M0 80V60c180 20 360-20 540 0s360 20 540 0 360-20 540 0v20H0z" fill="url(#div-grad-1)" opacity="0.5"/>
  <defs>
    <linearGradient id="div-grad-1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0A0E17"/>
      <stop offset="50%" stop-color="#131B2E"/>
      <stop offset="100%" stop-color="#0A0E17"/>
    </linearGradient>
  </defs>
</svg>
```

#### About → Projects (Angled Divider)

**File:** `public/svg/divider-about-projects.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
  <path d="M0 0l1440 60V0H0z" fill="#131B2E"/>
  <path d="M0 0l1440 40V0H0z" fill="url(#div-accent)" opacity="0.3"/>
  <defs>
    <linearGradient id="div-accent" x1="0" y1="0" x2="1440" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="30%" stop-color="#00D4FF"/>
      <stop offset="70%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
</svg>
```

#### Projects → Skills (Triangle Divider)

**File:** `public/svg/divider-projects-skills.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
  <!-- Triangle pattern -->
  <path d="M0 80L180 0h1080L1440 80H0z" fill="#0A0E17"/>
  <!-- Accent line -->
  <path d="M0 78L360 0l360 78M720 78l360-78 360 78" stroke="url(#tri-accent)" stroke-width="1" opacity="0.4"/>
  <defs>
    <linearGradient id="tri-accent" x1="0" y1="0" x2="1440" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#F472B6"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
</svg>
```

#### Skills → Contact (Wave Divider, Inverted)

**File:** `public/svg/divider-skills-contact.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
  <path d="M0 0v40c240-40 480 40 720 0s480-40 720 0v40H0V0z" fill="url(#div-grad-2)"/>
  <defs>
    <linearGradient id="div-grad-2" x1="0" y1="0" x2="1440" y2="0">
      <stop offset="0%" stop-color="#0A0E17"/>
      <stop offset="50%" stop-color="#131B2E"/>
      <stop offset="100%" stop-color="#0A0E17"/>
    </linearGradient>
  </defs>
</svg>
```

---

### 2c. Social Icons (Inline SVG)

All icons use `24x24` viewBox, `1.5px` stroke, `round` linecap/join, `currentColor`.

#### GitHub
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 19c-4 1-4-3-6-3m12 8v-4a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3c0 1 1 2 2 3"/>
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" opacity="0"/>
</svg>
```
*Note: Replace with brand icon. Simplified path for custom monogram style.*

**Preferred brand SVG (GitHub):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
</svg>
```

#### LinkedIn
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>
```

#### Twitter/X
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>
```

#### Email (Envelope)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
</svg>
```

---

### 2d. Decorative Elements

#### Floating Gradient Orbs (Hero Background)

```svg
<!-- Place in Hero section, use CSS animation for float -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none" class="hero-orbs">
  <circle cx="200" cy="200" r="300" fill="url(#orb-cyan)" opacity="0.15"/>
  <circle cx="600" cy="400" r="250" fill="url(#orb-purple)" opacity="0.12"/>
  <circle cx="400" cy="300" r="200" fill="url(#orb-pink)" opacity="0.08"/>
  <defs>
    <radialGradient id="orb-cyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00D4FF"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="orb-purple" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="orb-pink" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F472B6"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
</svg>
```

#### Dot Grid Pattern (Hero)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" class="dot-grid">
  <defs>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#00D4FF" opacity="0.15"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)"/>
</svg>
```

#### Glowing Border Card Effect

```svg
<!-- Decorative glow border for project cards on hover -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
  <defs>
    <linearGradient id="card-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D4FF" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#F472B6" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="98" height="98" rx="15" fill="none" stroke="url(#card-border-grad)" stroke-width="1"/>
</svg>
```

#### Animated Scan Line (Contact Section Accent)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 400" preserveAspectRatio="none" class="scan-line">
  <defs>
    <linearGradient id="scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#00D4FF"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
  <rect width="4" height="400" fill="url(#scan-grad)" opacity="0.4"/>
</svg>
```

---

## 3. Layout Wireframes

### 3a. Section Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, 72px height)                               │
│  ┌──────────┬────────────────────────────────────────────┐ │
│  │ EP Logo  │        About  Projects  Skills  Contact   │ │
│  └──────────┴────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  HERO (100vh)                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │              "Eric Polanski"                         │  │
│  │         "AI/ML Engineer & Software Developer"        │  │
│  │        "Building intelligent systems that..."        │  │
│  │                                                      │  │
│  │        [View My Work]    [Get In Touch]              │  │
│  │                                                      │  │
│  │           ~~~~ floating gradient orbs ~~~~            │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ABOUT (100vh, 2-col)                                      │
│  ┌───────────────────┬──────────────────────────────────┐  │
│  │                   │  "About Me"                      │  │
│  │    [Eric Photo]   │  Bio text...                     │  │
│  │    (parallax)     │                                  │  │
│  │                   │  ┌────────┐ ┌────────┐          │  │
│  │                   │  │ Card 1│ │ Card 2│          │  │
│  │                   │  └────────┘ └────────┘          │  │
│  │                   │  [Download Resume]              │  │
│  └───────────────────┴──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  PROJECTS (200vh, 3 stacked cards)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ JHunter                              [image left]   │  │
│  │ "AI-Powered Job Hunting Platform"                   │  │
│  │ Tech tags... | View Project →                       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         [image right]  NFL Mock Draft Simulator     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Autono                                  [image left] │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  SKILLS (100vh)                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         "Skills & Technologies"                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ →→→ Languages  →→→  Frontend  →→→  Backend →→│  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ →→→ AI/ML  →→→  Data  →→→  Tools  →→→        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  CONTACT (100vh, glassmorphism)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              "Let's Connect"                         │  │
│  │         Subtext + email + socials                    │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  [ Name                        ]             │    │  │
│  │  │  [ Email                       ]             │    │  │
│  │  │  [ Message                                         ]│    │  │
│  │  │  [           Send Message    ]                │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (minimal)                                           │
│  © 2026 Eric Polanski | Built with React, Framer Motion    │
└─────────────────────────────────────────────────────────────┘
```

### 3b. Mobile Layout (< 768px)

```
┌─────────────────────────┐
│  NAVBAR (hamburger)     │
│  [EP]              [≡]  │
├─────────────────────────┤
│  HERO (100vh)           │
│  "Eric Polanski"        │
│  Sub + tagline          │
│  [CTA] [CTA]            │
│  (orbs/dots bg)         │
├─────────────────────────┤
│  ABOUT (auto height)    │
│  [Photo - full width]   │
│  "About Me"             │
│  Bio text...            │
│  [Card] [Card]          │
│  [Download Resume]      │
├─────────────────────────┤
│  PROJECTS               │
│  [Image - full width]  │
│  JHunter                │
│  Description...         │
│  ─────────────────────  │
│  [Image - full width]  │
│  NFL Mock Draft...      │
│  ─────────────────────  │
│  [Image - full width]  │
│  Autono...               │
├─────────────────────────┤
│  SKILLS                 │
│  Categories →           │
│  (horizontal scroll)    │
│  Category 2 →           │
│  Category 3 →           │
├─────────────────────────┤
│  CONTACT                │
│  "Let's Connect"         │
│  Email / Socials       │
│  [Name field]           │
│  [Email field]          │
│  [Message field]        │
│  [Send]                 │
├─────────────────────────┤
│  FOOTER                 │
└─────────────────────────┘
```

### 3c. Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Mobile | `< 640px` | Single column, hamburger nav, stacked project cards |
| Tablet | `640px–1024px` | 2-column grids where applicable |
| Desktop | `> 1024px` | Full layouts, hover effects enabled |

---

## 4. Animation Specifications

### 4a. Hero Section — "The Entrance"

**Trigger:** Page load

**Sequence (GSAP Timeline):**
```
T+0ms    → Black screen holds
T+100ms  → Logo/Name fades in: scale(0.9→1), opacity(0→1), 600ms ease-out
T+300ms  → Tagline slides up: y(30→0), opacity(0→1), 500ms ease-out
T+500ms  → Sub-tagline fades: opacity(0→1), 400ms
T+700ms  → Dot grid reveals: stagger 2ms per dot, 800ms total (Framer Motion)
T+900ms  → CTA buttons fade in: opacity(0→1), 400ms
T+1000ms → Continuous: floating orbs parallax on mouse move (GSAP)
```

**Mouse-follow orb implementation:**
```javascript
// GSAP quickTo for performance
const moveOrbs = (x, y) => {
  gsap.to('.orb-1', { x: x * 0.05, y: y * 0.05, duration: 1, ease: 'power1.out' });
  gsap.to('.orb-2', { x: x * 0.03, y: y * 0.03, duration: 1.2, ease: 'power1.out' });
  gsap.to('.orb-3', { x: x * 0.07, y: y * 0.07, duration: 0.8, ease: 'power1.out' });
};
document.addEventListener('mousemove', (e) => moveOrbs(e.clientX, e.clientY));
```

### 4b. Scroll-Triggered Section Reveals

**Trigger:** Element enters viewport (Intersection Observer at 20% threshold)

**Animation for all section children:**
```javascript
// Framer Motion variant
const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};
```

**Usage pattern:**
```jsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {children.map(child => (
    <motion.div key={child.id} variants={fadeUpVariant} />
  ))}
</motion.div>
```

### 4c. Project Cards — Hover Elevation

**CSS hover state:**
```css
.project-card {
  transition: transform 150ms ease, box-shadow 150ms ease;
  will-change: transform;
}

.project-card:hover {
  transform: scale(1.02) translateY(-8px);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.2),
              0 8px 40px rgba(0, 0, 0, 0.4);
}

/* Border glow on hover */
.project-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid transparent;
  background: linear-gradient(135deg, #00D4FF, #8B5CF6, #F472B6) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 200ms ease;
}

.project-card:hover::after {
  opacity: 0.6;
}

/* Image zoom */
.project-card .project-image img {
  transition: transform 400ms ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

/* CTA slide up */
.project-card .project-cta {
  transform: translateY(100%);
  transition: transform 250ms ease;
}

.project-card:hover .project-cta {
  transform: translateY(0);
}
```

### 4d. Skills Marquee

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.skill-marquee-track {
  animation: marquee 20s linear infinite;
  display: flex;
  width: max-content;
}

.skill-marquee-track:hover {
  animation-play-state: paused;
}

/* Fade edges */
.skill-marquee-wrapper::before,
.skill-marquee-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.skill-marquee-wrapper::before {
  left: 0;
  background: linear-gradient(to right, #0A0E17, transparent);
}

.skill-marquee-wrapper::after {
  right: 0;
  background: linear-gradient(to left, #0A0E17, transparent);
}
```

### 4e. About Section Parallax

```javascript
// GSAP ScrollTrigger for parallax photo
ScrollTrigger.create({
  trigger: '.about-section',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.set('.about-photo', {
      y: progress * 100 - 50, // -50 to +50 range
    });
  }
});
```

### 4f. Contact Section — Gradient Reveal

```javascript
// GSAP clip-path wipe
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 80%',
  }
});

tl.fromTo('.contact-gradient-wipe',
  { clipPath: 'inset(0 100% 0 0)' },
  { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.out' }
)
.fromTo('.contact-form .form-field',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 },
  '-=0.4'
)
.fromTo('.contact-submit',
  { opacity: 0, scale: 0.95 },
  { opacity: 1, scale: 1, duration: 0.3 },
  '-=0.2'
);
```

### 4g. Magnetic Button Effect (Contact CTA)

```javascript
// Magnetic hover for submit button
const magneticBtn = document.querySelector('.contact-submit');
if (magneticBtn) {
  magneticBtn.addEventListener('mousemove', (e) => {
    const rect = magneticBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(magneticBtn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  magneticBtn.addEventListener('mouseleave', () => {
    gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
}
```

### 4h. Navbar State Transition

```javascript
// Navbar background on scroll
ScrollTrigger.create({
  trigger: 'body',
  start: 'top -72px',
  onUpdate: (self) => {
    const scrolled = self.scroll() > 72;
    navbar.classList.toggle('navbar--solid', scrolled);
    navbar.classList.toggle('navbar--transparent', !scrolled);
  }
});
```

```css
.navbar {
  transition: background 300ms ease, backdrop-filter 300ms ease;
}

.navbar--transparent {
  background: transparent;
}

.navbar--solid {
  background: rgba(10, 14, 23, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}
```

### 4i. Floating Label Inputs

```css
.form-field {
  position: relative;
}

.form-field input,
.form-field textarea {
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 8px;
  padding: 16px;
  color: var(--color-text-primary);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: var(--color-accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-field label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: all 200ms ease;
}

.form-field input:focus ~ label,
.form-field input:not(:placeholder-shown) ~ label,
.form-field textarea:focus ~ label,
.form-field textarea:not(:placeholder-shown) ~ label {
  top: 0;
  font-size: 0.75rem;
  background: var(--color-surface);
  padding: 0 4px;
  color: var(--color-accent-cyan);
}
```

---

## 5. Component Visual Specifications

### Navbar

- Height: `72px`
- Logo: `EP` wordmark or icon (24px)
- Links: `About`, `Projects`, `Skills`, `Contact` — right-aligned
- Font: Inter 500, `0.875rem`, `letter-spacing: 0.05em`, uppercase
- Hover: underline slide from left, color → `--color-accent-cyan`
- Mobile breakpoint: `768px` → hamburger drawer
- Hamburger → X animated icon (CSS transform)

### Hero

- Background: `--color-bg-primary` + floating orbs SVG + dot grid overlay
- Heading: `clamp(3rem, 8vw, 5rem)`, Inter 900, gradient text (cyan → purple)
- Subheading: `1.5rem`, Inter 500, `--color-text-secondary`
- CTA buttons: Primary gradient, Secondary outline
- Minimum height: `100vh`

### About

- Photo: `400x500px` max, `border-radius: 16px`, subtle box-shadow
- Stats cards: 2-column grid, `border: 1px solid var(--color-border)`, hover glow
- Resume button: Secondary/outline style with download icon

### Projects

- Card: Full-width, `border-radius: 16px`, dark surface bg
- Image: `aspect-ratio: 16/9`, `object-fit: cover`
- Alternating layout (even/odd flip image side)
- Tags: Pill style, gradient backgrounds
- On hover: All elevations specified in 4c

### Skills

- Marquee wrapper: `overflow: hidden`, `position: relative`
- Category label: `font-size: 0.75rem`, uppercase, `--color-accent-cyan`, left-aligned
- Skill tag: Pill, `padding: 8px 16px`, `border-radius: 999px`, `--color-surface` bg

### Contact

- Glassmorphism card: `background: rgba(26, 35, 50, 0.4)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(0, 212, 255, 0.1)`
- Card max-width: `600px`, centered
- Gradient accent line at top of card
- Input/textarea: See 4i floating label spec
- Submit button: Primary gradient, full-width

### Footer

- Minimal: single row, centered
- Links: GitHub source, social icons
- Social icons: `24px`, `opacity: 0.6` → `1.0` on hover, 200ms transition

---

## 6. Animation Performance Rules

1. **Only animate `transform` and `opacity`** — these are GPU-composited and do not trigger layout recalculations
2. **Use `will-change` sparingly** — apply only to actively animating elements, remove after animation completes
3. **Target 60fps** — use `requestAnimationFrame` via GSAP/Framer Motion, never raw `setInterval`
4. **Lazy-load animations** — use Intersection Observer to only start animations when near viewport
5. **Reduce motion for `prefers-reduced-motion`** — wrap all animations in `@media (prefers-reduced-motion: no-preference)`
6. **Debounce scroll handlers** — always use GSAP ScrollTrigger or Intersection Observer, never raw `window.scroll`

---

## 7. Accessibility

- All interactive elements must have `:focus-visible` outlines using `--color-accent-cyan`
- Color contrast: text on background must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- Motion: respect `prefers-reduced-motion` media query — disable or reduce animations
- Form fields: proper `<label>` association via `htmlFor`
- Images: descriptive `alt` text
- Navigation: keyboard-navigable menu, `aria-label` on hamburger button

---

## 8. File Structure

```
eric-portfolio/
├── public/
│   └── svg/
│       ├── ep-logo.svg
│       ├── ep-wordmark.svg
│       ├── divider-hero-about.svg
│       ├── divider-about-projects.svg
│       ├── divider-projects-skills.svg
│       ├── divider-skills-contact.svg
│       └── social/
│           ├── github.svg
│           ├── linkedin.svg
│           ├── twitter.svg
│           └── email.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Section.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Skills.jsx
│   │   │   └── Contact.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Tag.jsx
│   │       ├── Input.jsx
│   │       └── GradientText.jsx
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   ├── useMousePosition.js
│   │   └── useInView.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── DESIGN-AUT-115.md ← this file (in repo root)
└── package.json
```
