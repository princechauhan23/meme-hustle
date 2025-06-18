import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  TrendingUp,
  Heart,
  Users,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Grid,
  List,
  DollarSign,
  Zap as Lightning
} from 'lucide-react'
import { GlitchText } from '../components/GlitchText'
import { CyberButton } from '../components/CyberButton'
import { useAuthStore } from '../store/authStore'
import { useMemeStore } from '../store/memeStore'
import { MemeCard } from '../components/MemeCard'
import { toast } from 'react-hot-toast'
import { socketService } from '../services/socketService'

export function Dashboard() {
  const { user, token } = useAuthStore()
  const { memes, getRecentMemes, setMemes, setLeaderboard, leaderboard } = useMemeStore()

  const recentMemes = getRecentMemes()
  const myMemes = recentMemes.filter(meme => meme.owner_id === user.id).slice(0, 3);
  const likedMemes = memes?.filter(meme => meme.owner_id === user.id)?.reduce((acc, meme) => {
    if (meme.upvotes > 0) {
      return acc + meme.upvotes;
    }
    return acc;
  }, 0);

  const fetchAllMemes = async () => {
    try {
      const res = await fetch('https://meme-hustle-be.onrender.com/api/memes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error('Failed to fetch memes')
      }

      const data = await res.json()
      setMemes(data?.data)
    } catch (error) {
      console.error('Error fetching memes:', error)
      toast.error('Failed to load memes', {
        duration: 3000,
        style: {
          background: '#0a0a0a',
          color: '#ff006e',
          border: '1px solid #ff006e',
        }
      })
    }
  }

  useEffect(() => {
    fetchAllMemes()
  }, [])

  useEffect(() => {
    const socket = socketService.connect();
    socket.emit('leaderboard');
    // Optimistically update UI
    socket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data)
      toast.success(`LEADERBOARD REGISTERED`);
    })
  }, [setLeaderboard]);

  const stats = [
    {
      label: 'Memes Created',
      value: myMemes.length,
      icon: Zap,
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      label: 'Total Likes',
      value: likedMemes,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Followers',
      value: user.followers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Rank',
      value: '#' + Math.floor(Math.random() * 100 + 1),
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
  ]

  const quickActions = [
    {
      title: 'Create New Meme',
      description: 'Start creating your next viral meme',
      icon: Plus,
      href: '/create',
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Explore Trending',
      description: 'Discover what\'s hot right now',
      icon: TrendingUp,
      href: '/explore',
      color: 'bg-accent-600 hover:bg-accent-700',
    },
    {
      title: 'View Profile',
      description: 'Manage your profile and settings',
      icon: Users,
      href: '/profile',
      color: 'bg-secondary-600 hover:bg-secondary-700',
    },
  ]

  return (
    <div className="min-h-screen bg-cyber-darker py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full border-4 border-cyber-blue/30 shadow-neon"
            />
            <div>
              <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-4">
                WELCOME TO THE GRID
              </GlitchText>
              <p className="text-xl text-cyber-blue/70 max-w-2xl mx-auto font-mono">
                {user.name}, ready to hack the matrix?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cyber-card p-6 hover:shadow-neon transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyber-blue/70 font-mono mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-cyber-blue">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyber-dark/50 border border-cyber-blue/30">
                  <stat.icon className={`h-6 w-6 text-cyber-blue`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
            <GlitchText className="mx-6 text-2xl font-bold font-cyber">
              QUICK ACTIONS
            </GlitchText>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <Link
                  to={action.href}
                  className={`relative block p-0.5 rounded-xl bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-300 overflow-hidden ${action.hoverGlow}`}
                >
                  <div className="absolute inset-0.5 bg-cyber-dark/95 rounded-xl group-hover:bg-cyber-dark/90 transition-colors duration-300">
                    <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                  </div>
                  <div className="relative z-10 flex items-center p-5 space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-cyber-darker to-cyber-dark border border-cyber-blue/30 group-hover:border-cyber-blue/50 transition-all duration-300`}>
                      <action.icon className={`h-6 w-6 text-cyber-blue group-hover:drop-shadow-[0_0_10px_rgba(0,247,255,0.7)] transition-all duration-300`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-cyber-blue group-hover:text-white transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-sm text-cyber-blue/70">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-cyber-blue/70 group-hover:text-cyber-blue group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </Link>
                {/* Glow effect on hover */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${action.color} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* My Recent Memes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple font-mono">
                  MY RECENT MEMES
                </h2>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-pink/50 to-cyber-purple/50 rounded-full"></div>
              </div>
              <Link
                to="/profile"
                className="group flex items-center text-sm font-medium text-cyber-blue hover:text-white px-3 py-1.5 rounded-md bg-cyber-dark/50 border border-cyber-blue/30 transition-colors duration-300"
              >
                VIEW ALL
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {myMemes.length > 0 ? (
              <div className="space-y-6">
                {myMemes.map((meme) => (
                  <MemeCard key={meme.id} meme={meme} />
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  No memes yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start creating memes to see them here
                </p>
                <Link
                  to="/create"
                  className="btn btn-primary"
                >
                  Create Your First Meme
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple font-mono">
                Leaderboard
              </h2>
            </div>

            <div className="space-y-4">
              {leaderboard?.map((meme) => (
                <div key={meme.id} className="card p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={meme.image_url}
                      alt={meme.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-cyber-blue mb-1">
                        {meme.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{meme.upvotes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(meme.created_at).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}