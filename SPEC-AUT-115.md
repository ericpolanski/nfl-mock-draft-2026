# SPEC-AUT-115: Eric Polanski Portfolio Site

## Project Overview

- **Project:** Eric Polanski Portfolio (eric.ericpolanski.com)
- **Type:** Single-page React application with premium motion design
- **Core Functionality:** A premium creative showcase of Eric's work as an AI/Software Engineer, demonstrating cutting-edge frontend animation capabilities
- **Target Audience:** Potential employers, collaborators, and clients interested in Autono's capabilities

---

## 1. Design Direction

### Aesthetic Philosophy
**"Cinematic Engineering"** — The portfolio should feel like a movie trailer meets technical portfolio. Dark, moody backgrounds with vibrant accent colors that pop. Every scroll reveals something new, every interaction feels intentional and premium.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background Primary | Deep Navy | `#0A0E17` |
| Background Secondary | Slate | `#131B2E` |
| Surface | Dark Blue-Gray | `#1A2332` |
| Primary Accent | Electric Cyan | `#00D4FF` |
| Secondary Accent | Vivid Purple | `#8B5CF6` |
| Tertiary Accent | Hot Pink | `#F472B6` |
| Text Primary | Off-White | `#F1F5F9` |
| Text Secondary | Cool Gray | `#94A3B8` |
| Success | Emerald | `#10B981` |
| Gradient 1 | Cyan → Purple | `linear-gradient(135deg, #00D4FF, #8B5CF6)` |
| Gradient 2 | Purple → Pink | `linear-gradient(135deg, #8B5CF6, #F472B6)` |

### Typography
- **Headings:** Inter (weight 700-900) — bold, modern, clean
- **Body:** Inter (weight 400-500) — highly readable
- **Accent/Code:** JetBrains Mono — technical credibility
- **Scale:** 72px hero → 48px section → 24px subhead → 16px body

### Spatial System
- **Base unit:** 8px
- **Section padding:** 120px vertical, 5vw horizontal
- **Card padding:** 32px
- **Max content width:** 1400px
- **Grid:** 12-column with 24px gutters

---

## 2. Animation Approach

### Philosophy
"**Purposeful Motion**" — Every animation communicates something. Entrance animations reveal hierarchy. Scroll animations create narrative flow. Micro-interactions build trust through responsiveness. Nothing animates without reason.

### Animation Toolkit
| Library | Use Case |
|---------|----------|
| **Framer Motion** | Page transitions, layout animations, gestures |
| **GSAP (GreenSock)** | Scroll-triggered sequences, timelines, parallax |
| **Lenis** | Smooth scrolling (replaces native scroll) |
| **CSS Keyframes** | Simple loops, gradients, subtle pulses |

### Key Animation Setpieces

#### 1. Hero Section — "The Entrance"
```
Sequence:
1. Page load → Black screen
2. 0ms: Logo/Name fades in (scale 0.9→1, opacity 0→1, 600ms ease-out)
3. 200ms: Tagline slides up (y: 30→0, opacity 0→1, 500ms)
4. 400ms: Subtle particle/dot grid reveals (stagger 2ms per dot, 800ms total)
5. 600ms: CTA buttons fade in (opacity 0→1, 400ms)
6. Continuous: Floating gradient orbs in background (subtle parallax on mouse move)
```

#### 2. Scroll-Triggered Section Reveals
```
Pattern: "Reveal on approach"
- Each section's children animate when section enters viewport (20% threshold)
- Animation: opacity 0→1, y: 60→0, 600ms ease-out
- Stagger: 100ms between sibling elements
- Once revealed, stays visible (no reverse animation)
```

#### 3. Project Cards — "Hover Elevation"
```
On hover:
- Scale: 1→1.02 (150ms)
- Y translation: 0→-8px
- Box shadow: subtle glow using accent color (0→20px blur)
- Border: 1px subtle glow line
- Content: Image slightly zooms (scale 1→1.05)
- CTA: "View Project" slides up from bottom
```

#### 4. Skills Section — "Marquee Infinite"
```
Continuous horizontal scroll of skill tags
- Speed: 50px/second
- On hover: Pause animation
- Gradient fade on edges
```

#### 5. About Section — "Parallax Portrait"
```
- Eric's photo has subtle parallax (moves at 0.5x scroll speed)
- Text moves at normal speed
- Creates depth separation
```

#### 6. Contact Section — "Gradient Reveal"
```
On scroll into view:
- Gradient overlay wipes across form (clip-path animation)
- Form fields stagger in after gradient passes
- Button has magnetic pull effect on hover
```

### Scroll-Triggered Timeline (GSAP ScrollTrigger)
```
Section 1 (Hero): 0vh - 100vh
Section 2 (About): 100vh - 200vh
Section 3 (Projects): 200vh - 400vh
Section 4 (Skills): 400vh - 500vh
Section 5 (Contact): 500vh - 600vh
```

### Performance Targets
- **60fps** minimum on all animations
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- Use `will-change` sparingly and only on animating elements
- Use `transform` and `opacity` only for animations (GPU-accelerated)
- Avoid animating layout properties (width, height, margin, padding)

---

## 3. Content Plan

### Page Sections (Top to Bottom)

#### Section 0: Navigation (Fixed)
- **Logo/Name:** "EP" monogram or "Eric Polanski" — left aligned
- **Links:** About, Projects, Skills, Contact — right aligned
- **Behavior:** Transparent on hero, solid background on scroll (backdrop-blur)
- **Mobile:** Hamburger menu with slide-in drawer

#### Section 1: Hero (100vh)
```
Content:
- Large heading: "Eric Polanski"
- Subheading: "AI/ML Engineer & Software Developer"
- Tagline: "Building intelligent systems that make a difference"
- CTA: "View My Work" (scrolls to projects), "Get In Touch" (scrolls to contact)

Visual:
- Animated gradient background with floating orbs
- Subtle grid of dots that responds to mouse movement
- Particle effect (optional, performance permitting)
```

#### Section 2: About (100vh)
```
Content:
- Photo of Eric (placeholder if unavailable)
- Brief bio: Northwestern CS Dec 2025 grad, AI concentration
- Key highlights:
  • 2+ years building AI-powered applications
  • Full-stack development (React, Node.js, Python)
  • Experience with LLMs, ML pipelines, data engineering
  • Passionate about clean code and great UX
- Download Resume button → links to PDF

Visual:
- Two-column layout: Photo left, text right
- Photo has subtle parallax effect
- Key stats/highlights in accent-bordered cards
```

#### Section 3: Projects (200vh — 2 screen heights)
```
Content: 3 featured projects

1. JHunter — AI-Powered Job Hunting Platform
   - Tag: "Flagship Product"
   - Description: "Full-stack app with nightly job scraping, AI fit scoring, resume tailoring, and interview prep"
   - Tech: React, Node.js, SQLite, GPT/Claude APIs, Scrapfly
   - Link: jhunter.ericpolanski.com
   - Screenshot: Hero image of JHunter dashboard

2. NFL 2026 Mock Draft Simulator
   - Tag: "Side Project"
   - Description: "Interactive mock draft tool with AI-controlled teams, real-time decision making, and trade logic"
   - Tech: React, Vite, Tailwind, Express
   - Link: nfl.ericpolanski.com
   - Screenshot: Draft room interface

3. Autono — AI Development Company (this company)
   - Tag: "Founder"
   - Description: "Building AI-native software company that demonstrates cutting-edge capabilities"
   - Tech: React, TypeScript, Python, various AI APIs
   - Link: autono.ai
   - Visual: Autono logo/branding

Visual:
- Each project is a full-width card
- Alternating layout (image left/right)
- Project tags with gradient backgrounds
- Hover effects reveal more detail
```

#### Section 4: Skills (100vh)
```
Content:
- Categories:
  • Languages: JavaScript, TypeScript, Python, SQL, HTML/CSS
  • Frontend: React, Vite, Tailwind CSS, Framer Motion, GSAP
  • Backend: Node.js, Express, FastAPI
  • AI/ML: OpenAI API, Anthropic API, LLM fine-tuning, scikit-learn
  • Data: SQLite, PostgreSQL, MongoDB
  • Tools: Git, Docker, Cloudflare, AWS, Vercel

Visual:
- Skills displayed as floating tags
- Tags animate in with stagger on scroll
- Horizontal scrolling marquee for each category
- Category labels in accent color
```

#### Section 5: Contact (100vh)
```
Content:
- Heading: "Let's Connect"
- Subtext: "Interested in working together? I'm always open to discussing new opportunities."
- Email: eric@ericpolanski.com
- Social links: GitHub, LinkedIn, Twitter/X
- Contact form: Name, Email, Message, Send button

Visual:
- Gradient background matching hero
- Form has glassmorphism effect (backdrop-blur, subtle border)
- Input fields with floating labels
- Submit button with loading state
- Success/error toast notifications
```

### Footer (Minimal)
```
- Copyright: "© 2026 Eric Polanski"
- Built with: React, Framer Motion, GSAP
- "View Source" → GitHub link
```

---

## 4. Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Utility CSS |
| Framer Motion | 11.x | Animations, gestures |
| GSAP | 3.x | Scroll-triggered animations |
| Lenis | 1.x | Smooth scrolling |
| React Router | 6.x | Routing (SPA) |

### Backend (Minimal — Static Site)
```
- No backend required
- Contact form uses mailto: or third-party service (Formspree, EmailJS)
- All content is static
```

### Project Structure
```
eric-portfolio/
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
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Tag.jsx
│   │   │   ├── Input.jsx
│   │   │   └── GradientText.jsx
│   │   └── animations/
│   │       ├── FadeIn.jsx
│   │       ├── SlideIn.jsx
│   │       ├── Parallax.jsx
│   │       └── ScrollReveal.jsx
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   ├── useMousePosition.js
│   │   └── useInView.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── images/
│       └── eric-profile.jpg (placeholder)
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 5. Component Architecture

### Layout Components

#### `<Navbar />`
- Fixed position, z-50
- States: transparent (over hero), solid (scrolled)
- Mobile: hamburger → drawer animation
- Links smooth-scroll to sections

#### `<Footer />`
- Minimal, centered content
- Social icons with hover effects

#### `<Section id, children, className>`
- Wrapper for each page section
- Applies consistent padding
- Handles scroll-triggered entrance

### UI Components

#### `<Button variant, size, children />`
- Variants: `primary` (gradient), `secondary` (outline), `ghost`
- Sizes: `sm`, `md`, `lg`
- Hover: subtle scale + glow
- Loading state with spinner

#### `<Card hoverable, children />`
- Base card with border
- `hoverable` adds elevation animation

#### `<Tag children />`
- Small pill with gradient background
- Used for project tags, skill labels

#### `<GradientText children />`
- Applies gradient text effect

### Animation Components

#### `<FadeIn direction, delay, children />`
- Wraps children with fade + slide entrance
- `direction`: 'up', 'down', 'left', 'right'
- `delay`: milliseconds before animation starts

#### `<SlideIn direction, children />`
- Slides in from off-screen

#### `<Parallax speed, children />`
- Parallax wrapper using transform

#### `<ScrollReveal children />`
- Triggers animation when enters viewport

---

## 6. Deployment Configuration

### Domain & Infrastructure
- **Domain:** eric.ericpolanski.com
- **Cloudflare Tunnel:** Already configured for *.ericpolanski.com
- **Tunnel Port:** 4201 (or appropriate dev port, can be changed for production)
- **Tunnel Command:**
  ```bash
  cloudflared tunnel --url http://localhost:4201
  # Or for persistent tunnel:
  cloudflared tunnel run --token <token>
  ```

### Build & Serve
```bash
# Development
npm run dev  # Vite on port 4201

# Production build
npm run build  # Outputs to dist/

# Preview production build locally
npm run preview
```

### Environment Variables
```
VITE_APP_TITLE=Eric Polanski Portfolio
VITE_APP_EMAIL=eric@ericpolanski.com
VITE_APP_GITHUB=https://github.com/ericpolanski
VITE_APP_LINKEDIN=https://linkedin.com/in/ericpolanski
```

### Deployment Options (Pick One)

**Option A: Cloudflare Pages (Recommended)**
1. Push to GitHub repo
2. Connect to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Custom domain: eric.ericpolanski.com
6. Done — global CDN, fast, secure

**Option B: Cloudflare Tunnel (Current Setup)**
1. Keep tunnel running: `cloudflared tunnel --url http://localhost:4201`
2. Or create persistent tunnel for 24/7 availability
3. Tunnel provides URL like `https://random-name.trycloudflare.com`
4. DNS points eric.ericpolanski.com to this

**Option C: Vercel**
1. `npm i -g vercel`
2. `vercel --prod`
3. Custom domain in Vercel dashboard

---

## 7. Implementation Phases

### Phase 1: Foundation
- [ ] Scaffold React + Vite + Tailwind project
- [ ] Set up project structure (components, hooks, styles)
- [ ] Configure Tailwind with custom colors/fonts
- [ ] Create base layout components (Navbar, Footer, Section)
- [ ] Set up Lenis for smooth scrolling
- [ ] Verify dev server runs on port 4201

### Phase 2: Hero Section
- [ ] Build Hero component with content
- [ ] Implement gradient background animation
- [ ] Add mouse-following orb effect
- [ ] Add entrance animation sequence
- [ ] Test scroll behavior

### Phase 3: About Section
- [ ] Build About component
- [ ] Add parallax to photo
- [ ] Create highlight cards
- [ ] Add scroll-triggered reveal

### Phase 4: Projects Section
- [ ] Build Projects component
- [ ] Create project cards (JHunter, NFL Mock Draft, Autono)
- [ ] Add hover elevation effects
- [ ] Add scroll-triggered staggered reveal
- [ ] Ensure responsive layout (mobile stack)

### Phase 5: Skills Section
- [ ] Build Skills component
- [ ] Implement horizontal marquee animation
- [ ] Add skill tags with categories
- [ ] Pause on hover

### Phase 6: Contact Section
- [ ] Build Contact component
- [ ] Add form with validation
- [ ] Style with glassmorphism
- [ ] Add gradient reveal animation
- [ ] Integrate EmailJS or Formspree for form submission

### Phase 7: Polish & Performance
- [ ] Add scroll progress indicator
- [ ] Optimize animations for 60fps
- [ ] Test on mobile devices
- [ ] Add loading states
- [ ] Verify accessibility (focus states, ARIA labels)

### Phase 8: Deploy
- [ ] Build production bundle
- [ ] Configure Cloudflare Pages or tunnel
- [ ] Verify eric.ericpolanski.com is accessible
- [ ] Submit to search engines if needed

---

## 8. NOT IN SCOPE

- **Blog or articles section** — Can be added later as a separate route
- **Dark/light mode toggle** — Single dark theme is the design intent
- **Analytics dashboard** — Static portfolio, no user data
- **Multi-language support** — English only for now
- **User authentication** — No protected routes
- **CMS integration** — Content is hardcoded for simplicity
- **Image optimization pipeline** — Use optimized placeholder images initially

---

## 9. Success Metrics

1. **Performance:** Lighthouse score > 90 on all metrics
2. **Animation:** Consistent 60fps throughout scroll
3. **Responsiveness:** Fully functional on mobile (320px) to desktop (4K)
4. **Accessibility:** Keyboard navigable, screen reader friendly
5. **Deployment:** Site live at eric.ericpolanski.com with < 2s load time

---

## 10. Reference Files

- `jhunter/SPEC.md` — For JHunter project content
- `nfl-mock-draft-2026/SPEC.md` — For NFL Mock Draft content
- `~/ai-company/skills/frontend-design/SKILL.md` — For design guidance
- `~/ai-company/skills/animate/SKILL.md` — For animation best practices
