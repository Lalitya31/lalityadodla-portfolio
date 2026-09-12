# Balanced Engineering

**Balanced Engineering** is a systems-inspired personal portfolio that visualizes an engineer as a **multi-layered operating system**.  
Instead of presenting information linearly, the website models technical skills, research, leadership, academics, achievements, and personal balance as **interacting architectural layers**, inspired by operating-system and system-design principles.

The project is developed in **three progressive stages** to demonstrate structured growth from static web design to interactive behavior and scalable architecture.

---

## 🔹 Concept Overview

The core idea of this project is to **represent an engineer as a system**, not a résumé.

Each concentric layer represents a critical dimension of engineering growth:
- **Projects** – practical implementation and problem solving
- **Research** – analytical and investigative thinking
- **Leadership** – coordination, ownership, and decision-making
- **Academics** – foundational knowledge
- **Achievements** – milestones and recognition
- **Balance** – discipline, sustainability, and personal growth

This metaphor is reflected both visually and functionally across the website.

---

## 🔹 Technology Stack

| Stage | Technologies Used |
|-----|------------------|
| 1 | HTML5, CSS3 |
| 2 | HTML5, CSS3, Vanilla JavaScript |
| 3 | React.js |

No external UI frameworks are used.

---

## 🔹 1. Static Website (HTML & CSS)

**Objective:** Build a fully functional multi-page static website using semantic HTML and modern CSS.

### Features Implemented
- Semantic HTML5 structure (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Multi-page navigation:
  - `index.html` (Landing page)
  - `projects.html`
  - `research.html`
  - `leadership.html`
  - `academics.html`
  - `achievements.html`
  - `balance.html`
- Dark theme with blue monochromatic color palette
- CSS custom properties for consistent theming
- Two-column landing layout
- Concentric circular system visualization
- Pure CSS animations:
  - Rotating layers
  - Glimmering background particles
  - Hover glow effects
- Static content sections and placeholder cards
- Fully responsive layout using Flexbox and Grid

 **complete without JavaScript** and satisfies all static web development requirements.

---

## 🔹2. Interactive Enhancements (JavaScript)

**Objective:** Enhance the static system with meaningful interaction and behavior using Vanilla JavaScript.

### Features Added
- Layer focus mode (click to isolate and highlight system layers)
- Hover-based contextual descriptions
- Scroll-driven section highlighting
- Dynamic information panels
- Keyboard navigation for system layers
- System status indicator (rotating operational states)
- Page-transition memory using `sessionStorage`

All interactions are **non-intrusive**, concept-driven, and preserve design intent.

---

## 🔹React Implementation

**Objective:** Refactor the project into a scalable, component-based architecture with a CMS-backed portfolio.

### Current Enhancements
- React componentization of system layers
- State-driven interactions
- Dynamic rendering from structured data
- Client-side routing
- Performance optimizations
- Improved maintainability and extensibility
- Express API backend
- MongoDB Atlas persistence
- Admin authentication for CMS writes
- Project and blog CMS functionality


---

## 🔹 Design Philosophy

- Minimalistic
- System-oriented
- Concept-first, not decoration-first
- Behavior over gimmicks
- Accessibility-aware
- Scalable by design

---

## 🔹 How to Run Locally

The current deployable frontend is the React/Vite app in `client/`. The older root-level static portfolio files are still present for historical GitHub Pages deployment, but the active application lives in `client/` and `server/`.

### Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on `process.env.PORT` and defaults to `5001` for local development.

Required backend environment variables:

```bash
MONGODB_URI=
JWT_SECRET=
PORT=5001
FRONTEND_URL=http://localhost:5173
```

Use `server/.env.example` as the template. Do not commit actual `.env` files.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend reads its API base URL from `VITE_API_URL`. If the variable is not set, it falls back to `http://localhost:5001`.

Required frontend environment variable:

```bash
VITE_API_URL=http://localhost:5001
```

Use `client/.env.example` as the template. Do not commit actual `.env` files.

## 🔹 Deployment

### React/Vite Frontend

Deploy the `client/` directory as the frontend application.

Build command:

```bash
cd client
npm run build
```

Build output directory:

```bash
client/dist
```

Set the production frontend environment variable to the deployed backend URL:

```bash
VITE_API_URL=https://your-backend-domain.example
```

Do not include secrets in `VITE_API_URL`; it is exposed to the browser.

### SPA Routing Requirement

The React app uses client-side routes:

- `/`
- `/projects`
- `/research`
- `/leadership`
- `/academics`
- `/achievements`
- `/balance`
- `/blog`
- `/admin/login`
- `/admin`

The static host must rewrite all unmatched routes to `index.html`. For Netlify-style hosts, `client/public/_redirects` provides:

```text
/* /index.html 200
```

For other hosts, configure the equivalent SPA fallback/rewrite rule.

### Express Backend

Deploy the `server/` directory as the backend service.

Start command:

```bash
cd server
npm start
```

Required production backend environment variables:

```bash
MONGODB_URI=
JWT_SECRET=
PORT=
FRONTEND_URL=https://your-frontend-domain.example
```

`FRONTEND_URL` must match the deployed frontend origin so CORS allows browser requests. Localhost origins remain supported for development.

### MongoDB Atlas

Create or use an existing MongoDB Atlas cluster and set `MONGODB_URI` on the backend host. Keep the Atlas URI private and never add it to frontend environment variables.

After deployment, create the first admin from the backend environment:

```bash
cd server
node scripts/createAdmin.js <username> <password>
```

### Production API URL

In production, the frontend should call the deployed backend through:

```bash
VITE_API_URL=https://your-backend-domain.example
```

The backend should allow that frontend through:

```bash
FRONTEND_URL=https://your-frontend-domain.example
```

---

## 🔹 Author

**Lalitya Dodla**  
Balanced Engineering — 2026

> *“Built as a system, not a surface.”*
