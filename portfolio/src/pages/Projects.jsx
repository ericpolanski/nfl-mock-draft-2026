import { useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'

const allProjects = [
  {
    slug: 'teddy-talk',
    title: 'Teddy Talk',
    image: '/projects/TeddyTalk.png',
    desc: 'An AI-powered storytelling app that generates interactive, personalized tales for children in real time. Features dynamic character customization, moral lesson threading, and parent dashboards.',
    badges: ['React', 'OpenAI', 'Firebase', 'Node.js'],
    github: 'https://github.com/ericpolanski/teddy-talk',
  },
  {
    slug: 'doughjo',
    title: 'Doughjo',
    image: '/projects/Doughjo.png',
    desc: 'A personal finance tracker with smart transaction categorization, visual spending insights, and budget goal tracking. Built with a focus on clarity and simplicity.',
    badges: ['Next.js', 'Plaid API', 'PostgreSQL', 'Prisma'],
    github: 'https://github.com/ericpolanski/doughjo',
    live: 'https://doughjo.app',
  },
  {
    slug: 'lumi-ride',
    title: 'Lumi-Ride',
    image: '/projects/Lumi-Ride.png',
    desc: 'Real-time e-bike sharing platform with dynamic pricing, fleet management dashboards, and rider analytics. Designed for urban mobility operators.',
    badges: ['React Native', 'Node.js', 'Mapbox', 'MongoDB'],
    github: 'https://github.com/ericpolanski/lumi-ride',
  },
  {
    slug: 'newsfeed',
    title: 'Newsfeed',
    image: '/projects/Newsfeed.png',
    desc: 'A personalized news aggregator that uses NLP to cluster and summarize articles by topic, with a clean reading interface and topic兴趣 ranking.',
    badges: ['React', 'NewsAPI', 'OpenAI', 'Redis'],
    github: 'https://github.com/ericpolanski/newsfeed',
  },
  {
    slug: 'bugsnacks',
    title: 'BugSnacks',
    image: '/projects/BugSnacks.png',
    desc: 'A gamified bug reporting tool where points are earned for quality submissions. Integrates with GitHub Issues and uses AI to auto-triage incoming reports.',
    badges: ['Vue.js', 'FastAPI', 'GitHub API', 'SQLite'],
    github: 'https://github.com/ericpolanski/bugsnacks',
    live: 'https://bugsnacks.io',
  },
  {
    slug: 'walkies',
    title: 'Walkies',
    image: '/projects/Walkies.png',
    desc: 'A dog walking scheduling app that matches dog owners with verified walkers. Features real-time GPS tracking, walk summaries, and automatic payment splits.',
    badges: ['Flutter', 'Firebase', 'Google Maps API', 'Stripe'],
    github: 'https://github.com/ericpolanski/walkies',
  },
  {
    slug: 'faam-newsletter',
    title: 'FAAM Newsletter',
    image: '/projects/BasketballNewsletter.png',
    desc: 'A weekly basketball analytics newsletter delivering data-driven player projections, lineup insights, and game recaps to over 2,000 subscribers.',
    badges: ['Python', 'SendGrid', 'Pandas', 'BeautifulSoup'],
    github: 'https://github.com/ericpolanski/faam-newsletter',
    live: 'https://faam.substack.com',
  },
]

export default function Projects() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          A collection of personal projects built with curiosity and care.
        </p>
      </header>

      <section aria-label="Personal projects">
        <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="section-heading" style={{ fontSize: '1.25rem' }}>Personal Projects</h2>
        </div>
        <div className="projects-grid">
          {allProjects.map((p, i) => (
            <div key={p.slug} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
