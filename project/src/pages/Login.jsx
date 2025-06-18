import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-hot-toast'
import { MatrixRain } from '../components/MatrixRain'
import { CyberButton } from '../components/CyberButton'

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://meme-hustle-backend.vercel.app/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()

      // Transform API response to match our store's expected format
      const userData = {
        id: data.data?.user?.id,
        name: data.data?.user?.username,
        email: data.data?.user?.email,
        avatar: data.data?.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        joinedDate: data.data?.user?.joinedDate || new Date().toISOString(),
        memesCreated: data.data?.user?.memesCreated || 0,
        following: data.data?.user?.following || 0,
        followers: data.data?.user?.followers || 0,
        credits: data.data?.user?.credits || 1000
      }

      login(userData, data.data?.token)
      toast.success('Welcome back!')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen relative">
      <MatrixRain />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-cyber-blue">MH</span>
            </div>
            <h2 className="text-3xl font-bold text-cyber-blue font-display">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to your MemeHustle account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyber-blue mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyber-blue mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10 pr-10 w-full"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyber-blue focus:ring-cyber-blue border-cyber-blue rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cyber-blue">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-cyber-blue hover:text-cyber-blue">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-lg py-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
              ) : (
                <CyberButton
                  variant="secondary"
                  size="lg"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </CyberButton>
              )}
            </button>

            <div className="text-center">
              <p className="text-cyber-blue">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-cyber-blue hover:text-cyber-pink">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-cyber-blue-50 rounded-lg border border-cyber-blue">
            <h3 className="text-sm font-medium text-cyber-blue mb-2">Demo Credentials</h3>
            <p className="text-sm text-cyber-blue">
              E-mail: meme@example.com , Pass: meme
            </p>
            <p className="text-sm text-cyber-blue">
              E-mail: nft@example.com , Pass: meme
            </p>
          </div>
        </motion.div>
      </div>
    </div >
  )
}