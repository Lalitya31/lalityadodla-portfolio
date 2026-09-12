import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './Homepage.jsx'
import Academics from './pages/Academics.jsx'
import Achievements from './pages/Achievements.jsx'
import Balance from './pages/Balance.jsx'
import Leadership from './pages/Leadership.jsx'
import Projects from './pages/Projects.jsx'
import Research from './pages/Research.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/research" element={<Research />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/balance" element={<Balance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
