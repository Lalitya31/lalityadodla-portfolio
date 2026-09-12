import { useEffect, useRef, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

function Research() {
  useDocumentTitle('Research & Publications - Balanced Engineering')
  const shellRef = useRef(null)
  const splitRef = useRef(null)
  const [vars, setVars] = useState({
    '--left-x': '50%',
    '--left-y': '50%',
    '--right-x': '50%',
    '--right-y': '50%',
    '--right-snap-x': '0px',
    '--right-snap-y': '0px',
  })

  useEffect(() => {
    const split = splitRef.current
    if (!split) return undefined

    const updateVars = (clientX, clientY) => {
      const rect = split.getBoundingClientRect()
      const clampedX = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const clampedY = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
      const snapUnit = 14
      const snapX = Math.round((clampedX - 50) / snapUnit) * 6
      const snapY = Math.round((clampedY - 50) / snapUnit) * 6

      setVars({
        '--left-x': `${clampedX}%`,
        '--left-y': `${clampedY}%`,
        '--right-x': `${clampedX}%`,
        '--right-y': `${clampedY}%`,
        '--right-snap-x': `${snapX}px`,
        '--right-snap-y': `${snapY}px`,
      })
    }

    const handleMouseMove = (event) => updateVars(event.clientX, event.clientY)
    const handleTouchMove = (event) => {
      const touch = event.touches[0]
      if (!touch) return
      updateVars(touch.clientX, touch.clientY)
    }

    split.addEventListener('mousemove', handleMouseMove)
    split.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      split.removeEventListener('mousemove', handleMouseMove)
      split.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <PageShell>
      <main ref={shellRef} className="research-shell" id="researchShell" style={vars}>
        <div className="research-title">
          <h1>Research &amp; Publications</h1>
        </div>

        <div ref={splitRef} className="split-interface" id="splitInterface" aria-label="Split consciousness research interface">
          <div className="field-divider" aria-hidden="true" />

          <article className="force-field perception-field" id="perceptionField" aria-label="Cognition and perception field">
            <div className="perception-particles" aria-hidden="true" />
            <div className="perception-distort" aria-hidden="true" />
            <div className="field-content">
              <p className="field-kicker">Cognition / Perception</p>
              <h2>Transcending Visual Boundaries</h2>
              <p className="field-subline">Exploring perception beyond sight</p>
              <p>
                A neuroscientific investigation into how dreams and sensory experiences are formed in both visually challenged and sighted individuals.
                The study examines how the brain constructs perception without visual input, redefining the boundaries of human experience.
              </p>
            </div>
          </article>

          <article className="force-field crypto-field" id="cryptoField" aria-label="Computation and security field">
            <div className="crypto-grid" aria-hidden="true" />
            <div className="crypto-nodes" aria-hidden="true" />
            <div className="crypto-stream" aria-hidden="true" />
            <div className="field-content">
              <p className="field-kicker">Computation / Security</p>
              <h2>Post-Quantum Cryptography</h2>
              <p className="field-subline">Securing systems beyond classical limits</p>
              <p>
                A study of lattice-based and hash-based cryptographic algorithms, analyzing the impact of quantum computing on classical security models.
                The research focuses on building resilient systems capable of withstanding future computational paradigms.
              </p>
            </div>
          </article>
        </div>
      </main>
    </PageShell>
  )
}

export default Research
