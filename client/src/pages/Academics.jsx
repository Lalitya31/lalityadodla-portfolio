import { useEffect, useMemo, useRef, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

const KNOWLEDGE_LAYERS = [
  { depth: 1, title: 'Algorithms', details: 'Designing repeatable procedures to solve complex problems efficiently.', meta: 'Optimization Logic' },
  { depth: 2, title: 'Data Structures', details: 'Organizing information with precision so systems remain performant and scalable.', meta: 'Memory Efficiency' },
  { depth: 3, title: 'Programming', details: 'Turning architecture into reliable code with readability, modularity, and execution clarity.', meta: 'Implementation Discipline' },
  { depth: 4, title: 'Mathematics', details: 'Building analytical depth for proofs, abstractions, and computational reasoning.', meta: 'Analytical Model' },
  { depth: 5, title: 'Systems Thinking', details: 'Understanding how components interact, evolve, and remain stable under real constraints.', meta: 'Foundation Protocol' },
]

const CLUSTERS = [
  {
    title: 'Programming',
    inline: 'Python • C • C++ • Java (Basic)',
    detail: 'Python, C, and C++ build core logic and speed. Java helps me model object-oriented systems with clear abstractions.',
  },
  {
    title: 'Core Concepts',
    inline: 'Data Structures • Algorithms • Dynamic Programming • OOP',
    detail: 'I approach systems with Data Structures, Algorithms, Dynamic Programming, and OOP as design primitives, not exam topics.',
  },
  {
    title: 'Web Technologies',
    inline: 'JavaScript • TypeScript • HTML • CSS',
    detail: 'JavaScript, TypeScript, HTML, and CSS let me move from system ideas to usable interfaces and production behavior.',
  },
  {
    title: 'Tools & Libraries',
    inline: 'MySQL • Git • NumPy • Pandas • VS Code',
    detail: 'MySQL, Git, NumPy, Pandas, and VS Code support experimentation, data handling, and disciplined delivery.',
  },
]

const EDUCATION = [
  { title: 'VIT', lines: ['Vellore Institute of Technology', 'B.Tech - Computer Science (Core)', '2024 - 2028'], score: 'CGPA: 8.82 / 10' },
  { title: 'FIITJEE', lines: ['FIITJEE, Visakhapatnam', 'PCM - Senior Secondary'], score: 'Score: 97.9%' },
  { title: 'School', lines: ['The Presidential School', 'Class X'], score: 'Score: 95.2%' },
]

function Academics() {
  useDocumentTitle('Academics - Balanced Engineering')
  const stackRef = useRef(null)
  const sectionRefs = useRef([])
  const [activeLayer, setActiveLayer] = useState(KNOWLEDGE_LAYERS[4])
  const [activeCluster, setActiveCluster] = useState(CLUSTERS[0])
  const [drift, setDrift] = useState(0)
  const [revealed, setRevealed] = useState(() => {
    const revealImmediately = typeof window !== 'undefined' && !('IntersectionObserver' in window)
    return Array.from({ length: 5 }, () => revealImmediately)
  })

  useEffect(() => {
    const root = stackRef.current
    if (!root) return undefined

    const handleMouseMove = (event) => {
      const rect = root.getBoundingClientRect()
      const midpoint = rect.left + rect.width / 2
      const normal = (event.clientX - midpoint) / (rect.width / 2)
      setDrift(normal)
    }

    const handleMouseLeave = () => setDrift(0)
    root.addEventListener('mousemove', handleMouseMove)
    root.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      root.removeEventListener('mousemove', handleMouseMove)
      root.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const targets = sectionRefs.current.filter(Boolean)
    if (!targets.length) return undefined

    if (!('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const index = targets.indexOf(entry.target)
        if (index >= 0) {
          setRevealed((current) => current.map((value, currentIndex) => (currentIndex === index ? true : value)))
        }
        obs.unobserve(entry.target)
      })
    }, { threshold: 0.16 })

    targets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const layerStyle = useMemo(() => ({ '--drift': `${drift * 2.7}px` }), [drift])

  return (
    <PageShell>
      <main className="page-container academics-foundation">
        <section ref={(element) => { sectionRefs.current[0] = element }} className={`page-header academics-reveal ${revealed[0] ? 'revealed' : ''}`}>
          <h1>Academics</h1>
          <p className="foundation-kicker">The Foundation Layer</p>
          <p className="page-subtitle">Where structure, logic, and discipline are built. This layer supports every system above it.</p>
        </section>

        <section ref={(element) => { stackRef.current = element; sectionRefs.current[1] = element }} className={`foundation-grid academics-reveal ${revealed[1] ? 'revealed' : ''}`}>
          <section className="stack-shell" aria-label="Knowledge system stack">
            <h2 className="stack-title">Stacked Knowledge Layers</h2>
            <div className="stack-layers">
              {KNOWLEDGE_LAYERS.map((layer) => (
                <button
                  key={layer.depth}
                  className={`knowledge-layer ${activeLayer.depth === layer.depth ? 'active' : ''}`}
                  data-depth={layer.depth}
                  data-title={layer.title}
                  data-details={layer.details}
                  data-meta={layer.meta}
                  aria-expanded={activeLayer.depth === layer.depth}
                  type="button"
                  onClick={() => setActiveLayer(layer)}
                  style={{ '--i': layer.depth - 1, ...layerStyle }}
                >
                  <span className="layer-name">{layer.title}</span>
                </button>
              ))}
            </div>
            <article className="layer-detail" id="layerDetail" aria-live="polite">
              <h3 id="layerDetailTitle">{activeLayer.title}</h3>
              <p id="layerDetailText">{activeLayer.details}</p>
              <p className="layer-meta" id="layerDetailMeta">{activeLayer.meta}</p>
            </article>
          </section>

          <section className={`education-mesh academics-reveal ${revealed[2] ? 'revealed' : ''}`} aria-label="Education pathways" ref={(element) => { sectionRefs.current[2] = element }}>
            <h2 className="education-title">Academics - The Foundation Layer</h2>
            <div className="education-stream">
              {EDUCATION.map((entry) => (
                <article className="edu-node" key={entry.title}>
                  <h3>{entry.title}</h3>
                  {entry.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className="edu-score">{entry.score}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section ref={(element) => { sectionRefs.current[3] = element }} className={`skills-mesh academics-reveal ${revealed[3] ? 'revealed' : ''}`} aria-label="Interactive skill clusters">
          <h2 className="skills-title">Skills as Clusters</h2>
          <div className="clusters">
            {CLUSTERS.map((cluster) => (
              <button
                key={cluster.title}
                className={`skill-cluster ${activeCluster.title === cluster.title ? 'active' : ''}`}
                data-cluster={cluster.title}
                data-cluster-detail={cluster.detail}
                type="button"
                onClick={() => setActiveCluster(cluster)}
              >
                <span className="cluster-title">{cluster.title}</span>
                <span className="cluster-inline">{cluster.inline}</span>
              </button>
            ))}
          </div>
          <article className="cluster-detail" id="clusterDetail" aria-live="polite">
            <h3 id="clusterDetailTitle">{activeCluster.title}</h3>
            <p id="clusterDetailText">{activeCluster.detail}</p>
          </article>
        </section>

        <section ref={(element) => { sectionRefs.current[4] = element }} className={`author-note academics-reveal ${revealed[4] ? 'revealed' : ''}`} aria-label="Author note">
          <h2>Author's Note</h2>
          <p>Academics, to me, is not about grades - it is about building a way of thinking.</p>
          <p>It is where I learned how to approach problems, structure solutions, and understand systems at a fundamental level.</p>
          <p>Everything I build - from projects to research - is rooted in this foundation.</p>
        </section>
      </main>
    </PageShell>
  )
}

export default Academics
