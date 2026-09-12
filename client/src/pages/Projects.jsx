import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

const PROJECTS = [
  { title: 'RushGrid', tech: [], description: 'Description coming soon.', repo: 'https://github.com/Lalitya31/RushGrid', deploy: 'https://rushgridfinal.vercel.app/' },
  { title: 'NeoPulse', tech: [], description: 'Description coming soon.', deploy: 'https://www.youtube.com/watch?v=qWQqcY_4Wjc' },
  { title: 'E.D.G.E', tech: [], description: 'Description coming soon.', repo: 'https://github.com/Lalitya31/E.D.G.E' },
  { title: 'GestALT', tech: [], description: 'Description coming soon.', repo: 'https://github.com/Lalitya31/GestALT', deploy: 'https://gest-alt.vercel.app/' },
  { title: 'Balanced Engineering Portfolio', tech: [], description: 'Description coming soon.', repo: 'https://github.com/Lalitya31/lalityadodla-portfolio' },
]

function Projects() {
  useDocumentTitle('Engineering Projects - Balanced Engineering')

  return (
    <PageShell>
      <main className="projects-container">
        <section className="left-description">
          <h1>Projects</h1>
          <h2>Projects — Concise, Practical, Ready</h2>
          <p className="subheading">Browse real builds grouped by focus:</p>
          <ul className="project-list-keys">
            <li>Web Systems</li>
            <li>Data Projects</li>
            <li>Automation</li>
          </ul>
        </section>

        <section className="vault-container">
          <div className="terminal-panel" id="terminalPanel" aria-label="Project command panel">
            <div className="terminal-navbar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="panel-title">Project Vault — command list</div>
            {PROJECTS.map((project, index) => {
              const pageHref = `#proj-${index + 1}`
              return (
                <div className="cmd-entry" key={project.title}>
                  <a className="cmd-link" href={pageHref}>
                    <span className="prompt">&gt;</span>
                    <span className="project-name">{project.title}</span>
                  </a>
                  {project.tech.length ? <div className="cmd-meta">{project.tech.join(' • ')}</div> : null}
                  <div className="cmd-links">
                    <a className="repo-link" href={project.repo || '#'} target={project.repo ? '_blank' : undefined} rel={project.repo ? 'noopener noreferrer' : undefined} aria-label="GitHub">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.286-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.382 1.235-3.222-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.912 1.23 3.222 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.096.81 2.215 0 1.6-.015 2.887-.015 3.28 0 .315.21.69.825.573C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                    {project.deploy ? (
                      <a className="meta-badge" href={project.deploy} target="_blank" rel="noopener noreferrer" aria-label="Open deployment">
                        ↗
                      </a>
                    ) : null}
                  </div>
                  <p className="cmd-meta">{project.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </PageShell>
  )
}

export default Projects
