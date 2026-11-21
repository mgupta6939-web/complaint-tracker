import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Report from './pages/Report.jsx'
import MyReports from './pages/MyReports.jsx'
import AuthPage from './pages/AuthPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/report"
          element={<ProtectedRoute><Report /></ProtectedRoute>}
        />
        <Route
          path="/my-reports"
          element={<ProtectedRoute><MyReports /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App