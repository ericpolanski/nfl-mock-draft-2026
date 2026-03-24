# Portfolio V2 — SPEC.md

## Site Overview

- **Pages:** 5 (Home, About, Projects, Resume, Contact)
- **URL structure:** `/`, `/about`, `/projects`, `/resume`, `/contact`
- **Navigation:** Fixed top header, 64px height, full-width
- **Footer:** Minimal single-line footer, centered
- **Max content width:** 1120px (centered with auto margins)
- **Theme:** Single light theme — no toggle

---

## Global Layout

### `<header>` — Navigation

```
[Eric Polanski (left)]     [Home  About  Projects  Resume  Contact (right)]
```

- Logo: Syne 700, `--color-text`, links to `/`
- Nav items: Syne 500, 0.875rem, `--color-text-muted`
- Active page: `--color-green` text + bottom underline bar (2px, `--color-green`)
- Hover: `--color-text`
- Mobile: links wrap to a second row or scroll horizontally; no hamburger menu

### `<main>`

- Centered, `max-width: 1120px`, `padding: 0 24px`
- Top padding accounts for fixed header: `padding-top: calc(64px + var(--space-7))`
- On mobile: `padding-top: calc(64px + var(--space-5))`

### `<footer>`

```
© 2026 Eric Polanski
```
- Source Serif 4, 0.875rem, `--color-text-muted`, centered
- Top border: `1px solid var(--color-border)`
- `padding: var(--space-4) 0`

---

## Page 1: Home (`/`)

### Section 1 — Hero

**Purpose:** First impression. Name, title, brief positioning statement, and primary CTAs.

**Layout (two-column on desktop, stacked on mobile):**

```
+---------------------------+----------------------------+
|                           |                           |
|   [Photo]                 |   ERIC POLANSKI           |
|   eric-podium.jpg         |   AI Engineer             |
|   circular, ~320px        |                           |
|   border: 2px             |   Brief 2-sentence bio.   |
|   var(--color-border)     |   Source Serif 4, 18px.   |
|                           |                           |
|                           |   [View Projects] [Contact Me] |
+---------------------------+----------------------------+
```

- Left column: 1/3 width, photo centered
- Right column: 2/3 width, hero text left-aligned
- Hero name: Syne 800, 56px desktop / 40px mobile
- Hero title: Syne 600, `--color-text-muted`, 20px
- Bio paragraph: Source Serif 4, 18px, `--color-text`, line-height 1.75
- Buttons: Primary + Secondary (side by side, gap 16px)

### Section 2 — Featured Projects

**Purpose:** Quick showcase of 3 selected projects with thumbnails.

**Layout:**

```
Section heading: "Featured Projects" (Syne 700, 32px)
                  [View All Projects →] (text link, right-aligned)

+---------------------------+---------------------------+
|                           |                           |
|   [Thumbnail 16:9]        |   [Thumbnail 16:9]        |
|   Project Title           |   Project Title           |
|   Badges                  |   Badges                  |
|   One-line description    |   One-line description    |
|                           |                           |
+---------------------------+---------------------------+
|                           |                           |
|   [Thumbnail 16:9]        |   (empty or CTA card)     |
|   Project Title           |                           |
|   Badges                  |                           |
|   One-line description    |                           |
|                           |                           |
+---------------------------+---------------------------+
```

- 2-column grid
- Section heading + link row
- Featured projects: Teddy Talk, Doughjo, Lumi-Ride
- Each card: thumbnail + title + badges + description
- "View All Projects" is a text link, `--color-green`

### Section 3 — Resume Teaser

**Purpose:** Encourage downloading the resume.

```
[ Download Resume (primary button) ]

—or inline brief resume summary line—
```

---

## Page 2: About (`/about`)

### Layout

```
Page heading: "About" (Syne 800, 56px)

+---------------------------+----------------------------+
|                           |                            |
|   [Photo]                 |   My Journey into AI       |
|   eric-iceland.jpg       |   (Syne 700, 24px)         |
|   rounded-lg, ~400px      |                            |
|                           |   Source Serif 4 body text |
|                           |    (2–3 paragraphs)        |
|                           |                            |
|                           |   Education                |
|                           |   (Syne 700, 24px)         |
|                           |   Source Serif 4 body text |
|                           |                            |
|                           |   Outside of Work         |
|                           |   (Syne 700, 24px)         |
|                           |   Source Serif 4 body text |
+---------------------------+----------------------------+
```

- Left column: 2/5 width, photo (aspect ~5:4, object-fit cover)
- Right column: 3/5 width, three text sections stacked
- Each section: Syne sub-heading + Source Serif body
- Max-width: 960px
- Mobile: single column, photo on top

---

## Page 3: Projects (`/projects`)

### Layout

```
Page heading: "Projects" (Syne 800, 56px)

Section heading: "Personal Projects" (Syne 700, 24px, muted)

[Project grid — 2 columns, 24px gap]

  [Card] [Card]
  [Card] [Card]
  [Card] [Card]
  [Card] (last row, may be single)
```

**Projects to display (personal only, no course projects):**
1. Teddy Talk — thumbnail: `/projects/TeddyTalk.png`
2. Doughjo — thumbnail: `/projects/Doughjo.png`
3. Lumi-Ride — thumbnail: `/projects/Lumi-Ride.png`
4. Newsfeed — thumbnail: `/projects/Newsfeed.png`
5. BugSnacks — thumbnail: `/projects/BugSnacks.png`
6. Walkies — thumbnail: `/projects/Walkies.png`
7. FAAM Newsletter — thumbnail: `/projects/BasketballNewsletter.png`

**Card contents:**
- Title (Syne 600, 20px)
- Course tag (optional — Syne 500, 12px, muted, uppercase)
- Description (Source Serif 4, 16px, 2–3 lines max)
- Badges: technology tags
- Links: "GitHub" and/or "Live" (text links, `--color-green`)
- No emoji in any card content

---

## Page 4: Resume (`/resume`)

### Layout

```
Page heading: "Resume" (Syne 800, 56px)

[Download Resume (primary button)]

+------------------------------------------+
|  Inline Resume Content (styled <dl>)     |
|  max-width: 960px                        |
+------------------------------------------+

PDF Preview
+------------------------------------------+
|  iframe embed of resume PDF              |
|  height: 70vh                            |
|  border: 1px solid var(--color-border) |
+------------------------------------------+
```

**Inline Resume Sections (styled `<dl>`):**

```
EDUCATION
  B.S. Computer Science, AI Concentration          Dec 2025
  Northwestern University
  — detail line

EXPERIENCE
  AI Engineer (Intern)                             Summer 2024
  AbbVie
  — bullet

  AI Engineer (Intern)                             Summer 2023
  AbbVie
  — bullet

SKILLS
  Python  •  JavaScript  •  React  •  Next.js  •  ...
```

- Section headers: Syne 700, 24px, `--space-4` top margin, bottom border
- Entry rows: two columns on desktop (title left, date right, both aligned)
- Bullets: Source Serif 4, indented 2em
- Skills: comma-separated inline list, Syne 400

---

## Page 5: Contact (`/contact`)

### Layout

```
Page heading: "Contact" (Syne 800, 56px)

Intro paragraph: 1–2 sentences (Source Serif 4, 18px)

+------------------------------------------+
|  Name        [input                     ]|
|  Email       [input                     ]|
|  Message     [textarea, 5 rows          ]|
|              [Send Message (primary btn) ]|
+------------------------------------------+

—or after send—

Success message: "Thanks for reaching out. I'll get back to you soon."
Error message: "Something went wrong. Please try again or email directly."

Contact info (below or beside form):
  Email: ericchrispolanski@gmail.com
  GitHub: github.com/ericpolanski
  LinkedIn: (if applicable)
```

- Form: centered, max-width 640px
- Labels: Syne 500, 14px, above each input
- Inputs: full width, 1px border, 4px radius
- Submit: primary button, full width on mobile
- Contact info: Source Serif 4, small text, muted, below form

---

## Interaction States

### Navigation
| State    | Style                                     |
|----------|-------------------------------------------|
| Default  | `--color-text-muted`, Syne 500           |
| Hover    | `--color-text`                           |
| Active   | `--color-green`, bottom underline 2px    |
| Focus    | `2px solid var(--color-green)` outline   |

### Project Card
| State    | Style                                          |
|----------|------------------------------------------------|
| Default  | `border: 1px solid var(--color-border)`        |
| Hover    | border `--color-green-2`, inner body lifts 2px|

### Form Input
| State    | Style                                          |
|----------|------------------------------------------------|
| Default  | `border: 1px solid var(--color-border)`        |
| Focus    | `border-color: var(--color-green)`             |
| Error    | `border-color: #B91C1C` + red error text below |
| Disabled | `opacity: 0.5`                                 |

### Button
| State    | Style                                          |
|----------|------------------------------------------------|
| Default  | Primary: `--color-green` bg                   |
| Hover    | `--color-green-2` bg, `translateY(-1px)`       |
| Active   | `--color-green` bg, no lift                   |
| Disabled | `opacity: 0.5`, no pointer events             |

---

## Responsive Breakpoints

| Breakpoint | Width       | Key Changes                                      |
|------------|-------------|--------------------------------------------------|
| Mobile     | < 640px     | Single column, stacked layouts, reduced padding  |
| Tablet     | 640–1023px  | 2-col project grid, adjusted spacing             |
| Desktop    | >= 1024px   | Full 2-col hero, full project grid, max-width    |

---

## Assets (from `/public/`)

### Images
| File                        | Usage                              |
|-----------------------------|------------------------------------|
| `eric-images/eric-podium.jpg` | Home hero photo (circular)        |
| `eric-images/eric-iceland.jpg`| About page photo (rounded-lg)     |
| `projects/TeddyTalk.png`    | Project thumbnail                  |
| `projects/Doughjo.png`      | Project thumbnail                  |
| `projects/Lumi-Ride.png`    | Project thumbnail                  |
| `projects/Newsfeed.png`    | Project thumbnail                  |
| `projects/BugSnacks.png`   | Project thumbnail                  |
| `projects/Walkies.png`      | Project thumbnail                  |
| `projects/BasketballNewsletter.png` | FAAM Newsletter thumbnail |

### Documents
| File                                  | Usage                   |
|---------------------------------------|-------------------------|
| `eric_polanski_resume_january_2026.pdf`| Resume download + embed |

---

## Metadata

```js
// layout.js
export const metadata = {
  title: "Eric Polanski — AI Engineer",
  description: "Personal portfolio of Eric Polanski, AI Engineer specializing in production AI systems, RAG pipelines, and conversational AI.",
  keywords: "Eric Polanski, AI Engineer, portfolio, Northwestern, Next.js, Python",
};
```

---

## Component Inventory

| Component      | File                    | Notes                                                    |
|---------------|-------------------------|----------------------------------------------------------|
| `<Header>`    | `components/Header.js`  | Fixed nav, Syne font, active state via router            |
| `<Footer>`    | `components/Footer.js`  | Single line, centered                                    |
| `<ProjectCard>`| `components/ProjectCard.js` | Accepts `title`, `tag`, `description`, `thumbnails`, `badges`, `links` |
| `<ResumeView>`| `components/ResumeView.js`| Styled `<dl>` — education, experience, skills sections  |
| Contact form  | inline in `contact/page.js` | `use client`, FormSubmit.co or server action           |
