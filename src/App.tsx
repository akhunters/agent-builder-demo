import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Workflow from './pages/Workflow'

function App() {
  return (
    <div className="font-plus-jakarta">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workflow/:id" element={<Workflow />} />
      </Routes>
    </div>
  )
}

export default App