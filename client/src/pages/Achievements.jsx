import { useEffect, useRef, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

function Achievements() {
  useDocumentTitle('Achievements - Balanced Engineering')
  const zoneRef = useRef(null)
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))

  useEffect(() => {
    const zone = zoneRef.current
    if (!zone) return undefined

    if (!('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        obs.unobserve(entry.target)
      })
    }, { threshold: 0.16 })

    observer.observe(zone)
    return () => observer.disconnect()
  }, [])

  return (
    <PageShell>
      <main className="page-container achievements-signal">
        <section className="page-header">
          <h1>Achievements</h1>
          <p className="page-subtitle">System signal detection. Minimal, focused markers of progress.</p>
        </section>

        <section ref={zoneRef} className="signal-zone" aria-label="Achievement signal timeline">
          <div className="signal-timeline">
            <span className="timeline-line-top" aria-hidden="true" />
            <span className="timeline-node" aria-hidden="true" />
            <p className="signal-title">Apertre 3.0</p>
            <p className="signal-rank">Rank 30 / 229</p>
            <span className="timeline-line-bottom" aria-hidden="true" />
          </div>

          <p className={`author-note-signal ${visible ? 'revealed' : ''}`}>Achievements are not endpoints — they are signals of progress within a larger system of growth.</p>
        </section>
      </main>
    </PageShell>
  )
}

export default Achievements
