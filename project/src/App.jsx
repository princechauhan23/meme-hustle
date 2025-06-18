import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { Navbar } from './components/Navbar'
import { MatrixRain } from './components/MatrixRain'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Create } from './pages/Create'
import { Explore } from './pages/Explore'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './components/ProtectedRoute'
import { MemeDuel } from './pages/MemeDuel'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-cyber-darker text-cyber-blue relative">
      <MatrixRain />
      <Navbar />
      <main className="pt-16 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Explore />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/memeDuel" 
            element={
              <ProtectedRoute>
                <MemeDuel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App