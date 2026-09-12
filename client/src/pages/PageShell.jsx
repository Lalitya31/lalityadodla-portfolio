import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Projects', path: '/projects' },
  { label: 'Research', path: '/research' },
  { label: 'Leadership', path: '/leadership' },
  { label: 'Academics', path: '/academics' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Balance', path: '/balance' },
]

export function PageShell({ children }) {
  const location = useLocation()

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            Balanced Engineering
          </Link>

          <ul className="nav-links">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link to={item.path} className={active ? 'active' : undefined}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {children}

      <footer>
        <p>&copy; 2026 Balanced Engineering</p>
      </footer>
    </>
  )
}

export default PageShell
