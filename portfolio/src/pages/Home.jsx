import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { useEffect } from 'react'

const featuredProjects = [
  {
    slug: 'teddy-talk',
    title: 'Teddy Talk',
    image: '/projects/TeddyTalk.png',
    desc: 'An AI-powered storytelling app that generates interactive, personalized tales for children in real time.',
    badges: ['React', 'OpenAI', 'Firebase'],
    github: 'https://github.com/ericpolanski/teddy-talk',
  },
  {
    slug: 'doughjo',
    title: 'Doughjo',
    image: '/projects/Doughjo.png',
    desc: 'A personal finance tracker with smart categorization, visual spending insights, and budget goals.',
    badges: ['Next.js', 'Plaid API', 'PostgreSQL'],
    github: 'https://github.com/ericpolanski/doughjo',
    live: 'https://doughjo.app',
  },
  {
    slug: 'lumi-ride',
    title: 'Lumi-Ride',
    image: '/projects/Lumi-Ride.png',
    desc: 'Real-time e-bike sharing platform with dynamic pricing, fleet management, and rider analytics.',
    badges: ['React Native', 'Node.js', 'Mapbox'],
    github: 'https://github.com/ericpolanski/lumi-ride',
  },
]

export default function Home() {
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
      {/* Hero */}
      <section className="hero" aria-label="Introduction">
        <div className="hero-inner">
          <div className="hero-photo">
            <img
              src="/eric-images/eric-podium.jpg"
              alt="Eric Polanski"
            />
          </div>
          <div className="hero-content">
            <p className="hero-label">Developer &mdash; Creative Technologist &mdash; Trail Runner</p>
            <h1 className="hero-name">Eric<br />Polanski</h1>
            <p className="hero-title">AI Engineer</p>
            <p className="hero-bio">
              I build thoughtful digital experiences with care for craft and detail.
              Specializing in production AI systems, conversational interfaces, and
              the kind of software that just works.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn--primary">View Projects</Link>
              <Link to="/contact" className="btn btn--secondary">Contact Me</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-section" aria-label="Featured projects">
        <div className="section-header">
          <h2 className="section-heading">Featured Projects</h2>
          <Link to="/projects" className="text-link">View all projects</Link>
        </div>
        <div className="projects-grid">
          {featuredProjects.map((p) => (
            <div key={p.slug} className="reveal">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Resume Teaser */}
      <section className="resume-teaser" aria-label="Resume">
        <Link to="/resume" className="btn btn--primary">Download Resume</Link>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Interested in my background? View my full resume with experience, education, and skills.
        </p>
      </section>
    </div>
  )
}
