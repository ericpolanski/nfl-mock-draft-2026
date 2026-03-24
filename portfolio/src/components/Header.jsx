import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="page-wrapper">
          <NavLink to="/" className="nav-logo">Eric Polanski</NavLink>
          <ul className="nav-links" role="list">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
            <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink></li>
            <li><NavLink to="/resume" className={({ isActive }) => isActive ? 'active' : ''}>Resume</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
