import { useEffect, useRef, useState } from 'react'
import './homepage.css'

const NAV_LINKS = [
  { label: 'Projects', href: 'pages/projects.html' },
  { label: 'Research', href: 'pages/research.html' },
  { label: 'Leadership', href: 'pages/leadership.html' },
  { label: 'Academics', href: 'pages/academics.html' },
  { label: 'Achievements', href: 'pages/achievements.html' },
  { label: 'Balance', href: 'pages/balance.html' },
]

const CONTACT_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lalitya-dodla-078aa5367/',
    ariaLabel: 'LinkedIn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Lalitya31',
    ariaLabel: 'GitHub',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:lalityadodla@gmail.com',
    ariaLabel: 'Email',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

const LAYERS = [
  {
    id: 'layer-6',
    groupClass: 'layer-group-6 rotate-cw-slow',
    className: 'layer-6',
    href: 'pages/balance.html',
    ariaLabel: 'Balance & Discipline',
    tip: 'Balance keeps performance sustainable.',
    label: null,
    curvedLabel: 'BALANCE & DISCIPLINE',
    pathId: 'g6',
    path: 'M 250,20 A 230,230 0 1,1 249.9,20',
    startOffset: '65%',
  },
  {
    id: 'layer-5',
    groupClass: 'layer-group-5 rotate-ccw-medium',
    className: 'layer-5',
    href: 'pages/achievements.html',
    ariaLabel: 'Achievements',
    tip: 'Achievements mark consistent execution and growth.',
    label: null,
    curvedLabel: 'ACHIEVEMENTS',
    pathId: 'g5',
    path: 'M 250,57.5 A 192.5,192.5 0 1,1 249.9,57.5',
    startOffset: '65%',
  },
  {
    id: 'layer-4',
    groupClass: 'layer-group-4 rotate-cw-medium',
    className: 'layer-4',
    href: 'pages/academics.html',
    ariaLabel: 'Academics',
    tip: 'Academics provide rigorous technical foundations.',
    label: null,
    curvedLabel: 'ACADEMICS',
    pathId: 'g4',
    path: 'M 250,95 A 155,155 0 1,1 249.9,95',
    startOffset: '65%',
  },
  {
    id: 'layer-3',
    groupClass: 'layer-group-3 rotate-ccw-medium',
    className: 'layer-3',
    href: 'pages/leadership.html',
    ariaLabel: 'Leadership & Project Management',
    tip: 'Leadership turns direction into team momentum.',
    label: null,
    curvedLabel: 'LEADERSHIP',
    pathId: 'g3',
    path: 'M 250,132.5 A 117.5,117.5 0 1,1 249.9,132.5',
    startOffset: '65%',
  },
  {
    id: 'layer-2',
    groupClass: 'layer-group-2 rotate-cw-slow',
    className: 'layer-2',
    href: 'pages/research.html',
    ariaLabel: 'Research & Publications',
    tip: 'Research converts curiosity into tested insight.',
    label: null,
    curvedLabel: 'RESEARCH',
    pathId: 'g2',
    path: 'M 250,170 A 80,80 0 1,1 249.9,170',
    startOffset: '65%',
  },
  {
    id: 'layer-1',
    groupClass: 'layer-group-1 rotate-ccw-fast',
    className: 'layer-1',
    href: 'pages/projects.html',
    ariaLabel: 'Engineering Projects',
    tip: 'Projects turn ideas into working systems.',
    label: 'PROJECTS',
    curvedLabel: null,
    pathId: null,
    path: null,
    startOffset: null,
  },
]

const STATUS_MESSAGES = [
  'System operational',
  'All layers synchronized',
  'Engineering excellence active',
  'Balanced state maintained',
  'Innovation in progress',
  'Knowledge systems online',
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getTooltipPosition(clientX, clientY) {
  const width = 280
  const height = 110
  const offset = 15
  let left = clientX + offset
  let top = clientY + offset

  if (left + width > window.innerWidth) {
    left = clientX - width - offset
  }

  if (top + height > window.innerHeight) {
    top = clientY - height - offset
  }

  return {
    left: clamp(left, 0, Math.max(0, window.innerWidth - width)),
    top: clamp(top, 0, Math.max(0, window.innerHeight - height)),
  }
}

function useSystemClock() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setClock(`SYSTEM TIME | ${hours}:${minutes}:${seconds}`)
    }

    updateClock()
    const intervalId = window.setInterval(updateClock, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return clock
}

function useSystemStatus() {
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length)
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [])

  return STATUS_MESSAGES[statusIndex]
}

function useCanvasParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let width = 0
    let height = 0
    let animationFrameId = 0
    let mouseX = -9999
    let mouseY = -9999
    const particles = []

    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.6
        this.vy = (Math.random() - 0.5) * 0.6
        this.radius = Math.random() * 1.2 + 0.4
        this.alpha = Math.random() * 0.5 + 0.2
        this.deltaAlpha = (Math.random() - 0.5) * 0.008
      }

      update() {
        const deltaX = this.x - mouseX
        const deltaY = this.y - mouseY
        const distance = Math.hypot(deltaX, deltaY)
        const repelRadius = 110
        const maxSpeed = 1.5

        if (distance < repelRadius && distance > 0) {
          const force = ((repelRadius - distance) / repelRadius) * 0.4
          this.vx += (deltaX / distance) * force
          this.vy += (deltaY / distance) * force
        }

        const speed = Math.hypot(this.vx, this.vy)
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed
          this.vy = (this.vy / speed) * maxSpeed
        }

        this.vx *= 0.995
        this.vy *= 0.995

        this.x += this.vx
        this.y += this.vy

        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0

        this.alpha += this.deltaAlpha
        if (this.alpha < 0.1 || this.alpha > 0.8) {
          this.deltaAlpha *= -1
        }
      }

      draw() {
        context.save()
        context.globalAlpha = this.alpha
        context.fillStyle = '#3B82F6'
        context.shadowColor = '#60A5FA'
        context.shadowBlur = 4
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
      }
    }

    const drawConnections = () => {
      const maxConnectDistance = 130

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const deltaX = particles[i].x - particles[j].x
          const deltaY = particles[i].y - particles[j].y
          const distance = Math.hypot(deltaX, deltaY)

          if (distance < maxConnectDistance) {
            context.save()
            context.globalAlpha = (1 - distance / maxConnectDistance) * 0.15
            context.strokeStyle = '#3B82F6'
            context.lineWidth = 0.5
            context.beginPath()
            context.moveTo(particles[i].x, particles[i].y)
            context.lineTo(particles[j].x, particles[j].y)
            context.stroke()
            context.restore()
          }
        }
      }
    }

    const animate = () => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      drawConnections()
      animationFrameId = window.requestAnimationFrame(animate)
    }

    resizeCanvas()
    particles.splice(0, particles.length, ...Array.from({ length: 70 }, () => new Particle()))

    const handleResize = () => {
      resizeCanvas()
      particles.splice(0, particles.length, ...Array.from({ length: 70 }, () => new Particle()))
    }

    const handleMouseMove = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousemove', handleMouseMove)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return canvasRef
}

function useLayerTilt() {
  const systemContainerRef = useRef(null)

  useEffect(() => {
    const container = systemContainerRef.current
    if (!container) return undefined

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animationFrameId = 0

    const handleMouseMove = (event) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      targetX = ((event.clientY - centerY) / centerY) * 8
      targetY = -((event.clientX - centerX) / centerX) * 8
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      container.style.transform = `perspective(900px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`
      animationFrameId = window.requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return systemContainerRef
}

function useTooltip() {
  const [tooltip, setTooltip] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const showTooltip = (text, event) => {
    window.clearTimeout(timeoutRef.current)
    const position = getTooltipPosition(event.clientX, event.clientY)

    timeoutRef.current = window.setTimeout(() => {
      setTooltip({ text, ...position })
    }, 300)
  }

  const moveTooltip = (event) => {
    setTooltip((current) => {
      if (!current) return current
      const position = getTooltipPosition(event.clientX, event.clientY)
      return { ...current, ...position }
    })
  }

  const hideTooltip = () => {
    window.clearTimeout(timeoutRef.current)
    setTooltip(null)
  }

  return { tooltip, showTooltip, moveTooltip, hideTooltip }
}

function BackgroundParticles() {
  const canvasRef = useCanvasParticles()

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
}

function NavItem({ label, href, onNavigate }) {
  return (
    <li>
      <a href={href} onClick={(event) => onNavigate(event, href)}>
        {label}
      </a>
    </li>
  )
}

function ContactLink({ href, label, ariaLabel, icon }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="contact-icon" aria-label={ariaLabel}>
      {icon}
      <span>{label}</span>
    </a>
  )
}

function LayerRing({ layer, onNavigate, onHoverStart, onHoverMove, onHoverEnd }) {
  return (
    <div className={`layer-group ${layer.groupClass}`} data-layer={layer.id}>
      <a
        href={layer.href}
        className={`layer ${layer.className}`}
        aria-label={layer.ariaLabel}
        data-tip={layer.tip}
        onClick={(event) => onNavigate(event, layer.href)}
        onMouseEnter={(event) => onHoverStart(layer.tip, event)}
        onMouseMove={onHoverMove}
        onMouseLeave={onHoverEnd}
      >
        {layer.label ? <span className="layer-label">{layer.label}</span> : null}
      </a>

      {layer.curvedLabel ? (
        <svg className="curved-text-svg local" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <path id={layer.pathId} d={layer.path} fill="none" />
          </defs>
          <text className="curved-label">
            <textPath href={`#${layer.pathId}`} startOffset={layer.startOffset}>
              {layer.curvedLabel}
            </textPath>
          </text>
        </svg>
      ) : null}
    </div>
  )
}

function Homepage() {
  const clock = useSystemClock()
  const systemStatus = useSystemStatus()
  const systemContainerRef = useLayerTilt()
  const { tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip()

  const handleNavigate = (event, href) => {
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      return
    }

    event.preventDefault()
    document.body.classList.add('page-transition-out')
    window.setTimeout(() => {
      window.location.href = href
    }, 320)
  }

  return (
    <div className="app-shell">
      <BackgroundParticles />

      <nav className="navbar">
        <div className="nav-container">
          <a href="index.html" className="nav-brand" onClick={(event) => handleNavigate(event, 'index.html')}>
            Balanced Engineering
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.href} label={link.label} href={link.href} onNavigate={handleNavigate} />
            ))}
          </ul>

          <div className="system-clock" aria-live="polite" aria-label="System time">
            {clock}
          </div>
        </div>
      </nav>

      <header className="center-header" aria-hidden="true">
        <div className="background-text">MULTILAYERED OPERATING SYSTEM</div>
      </header>

      <main className="container">
        <section className="left-section">
          <article className="text-content">
            <div className="status-pill">
              <span className="status-dot" />
              <span>Available for internships</span>
            </div>

            <h1>
              Lalitya
              <br />
              Dodla
            </h1>

            <p className="about-text">CS student at VIT Chennai. I build things I need that don't exist yet.</p>

            <div className="left-divider" />

            <div className="contact-links">
              {CONTACT_LINKS.map((link) => (
                <ContactLink key={link.label} {...link} />
              ))}
            </div>
          </article>
        </section>

        <section className="right-section">
          <div className="system-container" ref={systemContainerRef}>
            {LAYERS.map((layer) => (
              <LayerRing
                key={layer.id}
                layer={layer}
                onNavigate={handleNavigate}
                onHoverStart={showTooltip}
                onHoverMove={moveTooltip}
                onHoverEnd={hideTooltip}
              />
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Balanced Engineering</p>
      </footer>

      {tooltip ? (
        <div className="hover-description-box" style={{ left: `${tooltip.left}px`, top: `${tooltip.top}px` }}>
          {tooltip.text}
        </div>
      ) : null}

      <div className="system-status-indicator" aria-live="polite">
        <span className="status-indicator-dot" />
        <span className="status-text">{systemStatus}</span>
      </div>
    </div>
  )
}

export default Homepage