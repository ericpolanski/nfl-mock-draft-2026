import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="page-wrapper">
        <p className="footer-copy">&copy; {year} Eric Polanski</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="/contact">Contact</a>
          <a href="https://github.com/ericpolanski" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
