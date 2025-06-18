import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  User, 
  Menu, 
  X, 
  Home, 
  PlusCircle, 
  Compass, 
  LayoutDashboard,
  LogOut,
  Search,
  TrendingUp,
  DollarSign,
  Terminal,
  Swords
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { GlitchText } from './GlitchText'
import { CyberButton } from './CyberButton'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, credits } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileMenuOpen(false)
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    // { to: '/trending', label: 'Trending', icon: TrendingUp },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/create', label: 'Create', icon: PlusCircle },
      { to: '/memeDuel', label: 'Meme Duel', icon: Swords },
    ] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/90 backdrop-blur-md border-b border-cyber-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-cyber-pink to-cyber-blue rounded-none group-hover:shadow-neon transition-all duration-300">
              <Zap className="h-6 w-6 text-white animate-pulse" />
            </div>
            <GlitchText className="text-xl font-bold font-cyber text-cyber-blue">
              CyberMeme
            </GlitchText>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-none transition-all duration-300 font-mono text-sm uppercase tracking-wider ${
                  isActive(to)
                    ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30 shadow-neon'
                    : 'text-cyber-blue hover:text-cyber-pink hover:bg-cyber-blue/10 border border-transparent hover:border-cyber-blue/30'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Credits Display */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-cyber-dark/50 border border-cyber-green/30 rounded-none">
                <DollarSign className="h-4 w-4 text-cyber-green" />
                <span className="font-mono text-cyber-green font-semibold">{credits}</span>
                <span className="text-cyber-green/70 text-xs">CREDITS</span>
              </div>
            )}

            {/* Search Button */}
            <button className="p-2 text-cyber-blue hover:text-cyber-pink hover:bg-cyber-blue/10 rounded-none transition-colors duration-300 border border-transparent hover:border-cyber-blue/30">
              <Search className="h-5 w-5" />
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-none hover:bg-cyber-blue/10 transition-colors duration-300 border border-transparent hover:border-cyber-blue/30"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-none object-cover border border-cyber-blue/30"
                    />
                    <span className="font-mono text-cyber-blue">{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-cyber-dark border border-cyber-blue/30 shadow-neon py-2"
                      >
                        <div className="px-4 py-3 border-b border-cyber-blue/20">
                          <p className="font-mono text-cyber-green text-sm">HACKER LEVEL: {user.level || 1}</p>
                          <p className="font-mono text-cyber-blue/70 text-xs">SKILL: {user.hackingSkill || 50}/100</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-cyber-blue hover:bg-cyber-blue/10 transition-colors duration-300 font-mono"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>PROFILE</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-cyber-pink hover:bg-cyber-pink/10 transition-colors duration-300 w-full text-left font-mono"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>LOGOUT</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <CyberButton
                    variant="secondary"
                    onClick={() => navigate('/login')}
                  >
                    LOGIN
                  </CyberButton>
                  <CyberButton
                    variant="primary"
                    onClick={() => navigate('/register')}
                    glitch
                  >
                    JACK IN
                  </CyberButton>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-cyber-blue hover:text-cyber-pink hover:bg-cyber-blue/10 rounded-none transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-dark border-t border-cyber-blue/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-300 font-mono ${
                    isActive(to)
                      ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'
                      : 'text-cyber-blue hover:text-cyber-pink hover:bg-cyber-blue/10 border border-transparent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="uppercase tracking-wider">{label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-cyber-blue/20 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-none object-cover border border-cyber-blue/30"
                      />
                      <div>
                        <p className="font-mono text-cyber-blue">{user.name}</p>
                        <p className="text-sm text-cyber-green">{credits} CREDITS</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-cyber-blue hover:bg-cyber-blue/10 transition-colors duration-300 rounded-none mx-2 font-mono"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>PROFILE</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-cyber-pink hover:bg-cyber-pink/10 transition-colors duration-300 rounded-none mx-2 w-full text-left font-mono"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>LOGOUT</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-cyber-blue/20 pt-4 mt-4 space-y-2">
                  <CyberButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      navigate('/login')
                      setIsMenuOpen(false)
                    }}
                  >
                    LOGIN
                  </CyberButton>
                  <CyberButton
                    variant="primary"
                    className="w-full"
                    glitch
                    onClick={() => {
                      navigate('/register')
                      setIsMenuOpen(false)
                    }}
                  >
                    JACK IN
                  </CyberButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}