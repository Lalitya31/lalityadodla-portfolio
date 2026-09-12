import { useEffect, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

const DETAILS = {
  center: {
    title: 'Leadership Philosophy',
    text: 'I do not lead by instruction. I lead by alignment, trust, and shared ownership.',
    items: [
      'Leadership is not about directing people - it is about enabling them.',
      'I work alongside teams to build confidence and clarity.',
      'Shared responsibility creates stronger outcomes than command-driven delivery.',
    ],
  },
  'pod-a': {
    title: 'Pod A - Planning and Scope',
    text: 'Structured planning, milestone definition, and scope integrity across phases.',
    items: [
      'Converted broad goals into actionable sprint plans.',
      'Prioritized tasks based on system impact and dependencies.',
      'Prevented scope drift while protecting delivery quality.',
    ],
  },
  'pod-b': {
    title: 'Pod B - Execution Cadence',
    text: 'Ensured execution rhythm and cross-team momentum through active coordination.',
    items: [
      'Maintained delivery cadence across parallel work streams.',
      'Removed blockers through rapid communication loops.',
      'Aligned progress updates to shared outcomes.',
    ],
  },
  'pod-c': {
    title: 'Pod C - Quality and Validation',
    text: 'Connected validation checkpoints to delivery timelines without slowing momentum.',
    items: [
      'Integrated quality reviews into each milestone cycle.',
      'Aligned acceptance criteria with technical constraints.',
      'Reduced rework by enforcing clear verification gates.',
    ],
  },
  'pod-d': {
    title: 'Pod D - Delivery and Hand-off',
    text: 'Drove final execution and accountable hand-offs from planning to deployment.',
    items: [
      'Tracked completion against defined release outcomes.',
      'Coordinated final alignment between teams and stakeholders.',
      'Ensured hand-off readiness with clear ownership.',
    ],
  },
  'pod-e': {
    title: 'Pod E - Communication Layer',
    text: 'Served as the system bridge between teams, reducing friction and ambiguity.',
    items: [
      'Mapped dependencies across pods in real time.',
      'Created visibility loops to prevent misalignment.',
      'Kept accountability explicit at every stage.',
    ],
  },
  'pod-f': {
    title: 'Pod F - Team Enablement',
    text: 'Built confidence and ownership so teams could perform at their best.',
    items: [
      'Supported teams with context, not just directives.',
      'Encouraged autonomy while preserving shared standards.',
      'Reinforced trust to improve delivery resilience.',
    ],
  },
}

const NODES = [
  { role: 'center', className: 'center-node', label: 'Project Management Lead<br>Genesis', ariaLabel: 'Project Management Lead Genesis' },
  { role: 'pod-a', className: 'pod-a', label: 'Pod A', ariaLabel: 'Pod A' },
  { role: 'pod-b', className: 'pod-b', label: 'Pod B', ariaLabel: 'Pod B' },
  { role: 'pod-c', className: 'pod-c', label: 'Pod C', ariaLabel: 'Pod C' },
  { role: 'pod-d', className: 'pod-d', label: 'Pod D', ariaLabel: 'Pod D' },
  { role: 'pod-e', className: 'pod-e', label: 'Pod E', ariaLabel: 'Pod E' },
  { role: 'pod-f', className: 'pod-f', label: 'Pod F', ariaLabel: 'Pod F' },
]

function Leadership() {
  useDocumentTitle('Leadership & Project Management - Balanced Engineering')
  const [selectedRole, setSelectedRole] = useState('center')
  const [vars, setVars] = useState({ '--px': 50, '--py': 50 })

  const current = DETAILS[selectedRole]

  useEffect(() => {
    const center = document.getElementById('commandCenter')
    if (!center) return undefined

    const handleMouseMove = (event) => {
      const rect = center.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      setVars({ '--px': Number(x.toFixed(2)), '--py': Number(y.toFixed(2)) })
    }

    center.addEventListener('mousemove', handleMouseMove)
    return () => center.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <PageShell>
      <main className="lead-shell" id="leadShell">
        <header className="lead-header">
          <h1>Leadership &amp; Project Management</h1>
          <p>Coordinating systems. Empowering people. Delivering outcomes.</p>
        </header>

        <section className="command-center" id="commandCenter" aria-label="System command center visualization" style={vars}>
          <svg className="connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="connector" d="M50,50 L50,12" />
            <path className="connector alt" d="M50,50 L82,33" />
            <path className="connector" d="M50,50 L82,68" />
            <path className="connector alt" d="M50,50 L50,88" />
            <path className="connector" d="M50,50 L18,33" />
            <path className="connector alt" d="M50,50 L18,68" />
          </svg>

          {NODES.map((node) => (
            <button
              key={node.role}
              className={`node ${node.className}`}
              data-role={node.role}
              aria-label={node.ariaLabel}
              type="button"
              onMouseEnter={() => setSelectedRole(node.role)}
              onFocus={() => setSelectedRole(node.role)}
              onMouseLeave={() => setSelectedRole('center')}
            >
              {node.role === 'center' ? (
                <span className="node-core">
                  <strong dangerouslySetInnerHTML={{ __html: node.label }} />
                </span>
              ) : (
                <span className="pod-node">
                  <span>{node.label}</span>
                </span>
              )}
            </button>
          ))}
        </section>

        <section className="details" aria-live="polite">
          <h2 id="detailTitle">{current.title}</h2>
          <p id="detailText">{current.text}</p>
          <ul id="detailList">
            {current.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </PageShell>
  )
}

export default Leadership
