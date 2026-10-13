import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { BuilderPage } from './pages/BuilderPage'
import { PreviewPage } from './pages/PreviewPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/builder/:id' element={<BuilderPage />} />
        <Route path='/preview/:id' element={<PreviewPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  )
}

export default App

