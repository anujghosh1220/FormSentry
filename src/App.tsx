import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { DashboardPage } from "./pages/DashboardPage"
import { BuilderPage } from "./pages/BuilderPage"
import { PreviewPage } from "./pages/PreviewPage"
import { TemplatesPage } from "./pages/TemplatesPage"
import { FeaturesPage } from "./pages/FeaturesPage"
import { EfferdDashboard } from "./components/ui/efferd-dashboard"

function App() {
  return (
    <Router>
      <EfferdDashboard>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/builder/:id" element={<BuilderPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EfferdDashboard>
    </Router>
  )
}

export default App
