import { useEffect, useRef, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

function Balance() {
  useDocumentTitle('Balance & Discipline - Balanced Engineering')
  const revealRef = useRef([])
  const [visible, setVisible] = useState(() => {
    const revealImmediately = typeof window !== 'undefined' && !('IntersectionObserver' in window)
    return Array.from({ length: 3 }, () => revealImmediately)
  })

  useEffect(() => {
    const targets = revealRef.current.filter(Boolean)
    if (!targets.length) return undefined

    if (!('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const index = targets.indexOf(entry.target)
        if (index >= 0) {
          setVisible((current) => current.map((value, currentIndex) => (currentIndex === index ? true : value)))
        }
        obs.unobserve(entry.target)
      })
    }, { threshold: 0.16 })

    targets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <PageShell>
      <main className="page-container balance-system">
        <div className="floating-status" aria-label="System status">
          <span className="dot" aria-hidden="true" />
          <span>System Stable</span>
        </div>

        <section ref={(element) => { revealRef.current[0] = element }} className={`page-header reveal-balance ${visible[0] ? 'visible' : ''}`}>
          <h1>Balance &amp; Discipline</h1>
          <p className="page-subtitle">A controlled operating model for sustainability, clarity, and long-horizon execution.</p>
        </section>

        <section ref={(element) => { revealRef.current[1] = element }} className={`stability-zone reveal-balance ${visible[1] ? 'visible' : ''}`} aria-label="Input output flow">
          <div className="flow-line">
            <span className="flow-part">Effort + Time</span>
            <span className="flow-arrow" aria-hidden="true">→</span>
            <span className="flow-part">Performance + Growth</span>
          </div>
        </section>

        <section ref={(element) => { revealRef.current[2] = element }} className={`balance-flow reveal-balance ${visible[2] ? 'visible' : ''}`} aria-label="Balance framework">
          <div className="timeline-line" aria-hidden="true" />
          <div className="balance-blocks">
            <article className="balance-block">
              <h3>Core Statement</h3>
              <p>Balance is not a goal — it is a system constraint.</p>
              <p>It ensures sustainability, clarity, and consistent performance.</p>
            </article>

            <article className="balance-block">
              <h3>Work</h3>
              <p>Building and executing ideas through structured problem-solving and disciplined effort.</p>
            </article>

            <article className="balance-block">
              <h3>Learning</h3>
              <p>Continuously expanding knowledge across domains, driven by curiosity and long-term growth.</p>
            </article>

            <article className="balance-block">
              <h3>Health</h3>
              <p>Maintaining physical and mental energy to sustain high performance over time.</p>
            </article>

            <article className="balance-block">
              <h3>Mind</h3>
              <p>Developing focus, clarity, and discipline to navigate complexity and make effective decisions.</p>
            </article>
          </div>
        </section>

        <section className={`author-note-balance reveal-balance ${visible[2] ? 'visible' : ''}`} aria-label="Author note">
          <h2>Author’s Note</h2>
          <p>Without this foundation, everything else becomes unstable.</p>
        </section>
      </main>
    </PageShell>
  )
}

export default Balance
