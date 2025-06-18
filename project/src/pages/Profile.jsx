import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Heart,
  Users,
  Zap,
  Settings,
  Share2,
  Award,
  Camera,
  Mail,
  MapPin,
  Link as LinkIcon,
  Edit
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useMemeStore } from '../store/memeStore'
import { MemeCard } from '../components/MemeCard'
import { toast } from 'react-hot-toast'

export function Profile() {
  const [activeTab, setActiveTab] = useState('memes') // memes, liked, stats
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  const { user, updateProfile, token } = useAuthStore()
  const { memes, setMemes } = useMemeStore()

  // User's memes based on owner_id
  const myMemes = memes.filter(meme => meme.owner_id === user.id)

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
  }, [token])

  // Stats: Only show memes created and optionally followers/following
  const stats = [
    {
      label: 'Memes Created',
      value: myMemes.length,
      icon: Zap,
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      label: 'Followers',
      value: user.followers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Following',
      value: user.following || 0,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ]

  const achievements = [
    { title: 'First Meme', description: 'Created your first meme', earned: true },
    { title: 'Getting Popular', description: 'Received 100+ likes', earned: memes.filter(meme => meme.owner_id === user.id).some(meme => meme.likes >= 100) },
    { title: 'Viral Creator', description: 'Reached 1000+ likes on a single meme', earned: memes.filter(meme => meme.owner_id === user.id).some(meme => meme.likes >= 1000) },
    { title: 'Prolific Creator', description: 'Created 10+ memes', earned: memes.filter(meme => meme.owner_id === user.id).length >= 10 },
    { title: 'Community Favorite', description: 'Liked 50+ memes', earned: memes.filter(meme => meme.owner_id === user.id).some(meme => meme.likes >= 50) },
  ]

  const tabs = [
    { id: 'memes', label: 'My Memes', count: memes.filter(meme => meme.owner_id === user.id).length },
    { id: 'stats', label: 'Statistics', count: null },
  ]

  const handleEdit = () => {
    setEditForm({
      name: user.name,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    updateProfile(editForm)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="min-h-screen bg-cyber-darker py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-cyber-pink shadow-lg"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-cyber-pink text-white rounded-full hover:bg-cyber-purple transition-colors duration-200 shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input text-xl font-bold"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="input"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="input"
                      placeholder="Your location"
                    />
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="input"
                      placeholder="Your website"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSave} className="btn btn-primary">
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <h1 className="text-3xl font-bold text-cyber-blue font-display">
                      {user.name}
                    </h1>
                    <button
                      onClick={handleEdit}
                      className="p-2 text-cyber-blue hover:text-cyber-pink hover:bg-cyber-blue rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>

                  {user.bio && (
                    <p className="text-cyber-blue mb-4 text-lg leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-cyber-blue">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>

                    {user.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}

                    {user.website && (
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4" />
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyber-blue hover:text-cyber-pink"
                        >
                          {user.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.joinedDate)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex space-x-3">
                <button className="btn btn-secondary">
                  <Share2 className="h-4 w-4 mr-1 text-cyber-blue" />
                </button>
                <button className="btn btn-ghost">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyber-blue mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-cyber-blue">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                    ? 'border-cyber-blue text-cyber-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'memes' && (
              <div>
                {memes.filter(meme => meme.owner_id === user.id).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {memes.filter(meme => meme.owner_id === user.id).map((meme) => (
                      <MemeCard key={meme.id} meme={meme} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No memes yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't created any memes yet. Start creating to see them here!
                    </p>
                    <button className="btn btn-primary">
                      Create Your First Meme
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Achievements */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-cyber-blue mb-6 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${achievement.earned
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${achievement.earned
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${achievement.earned ? 'text-green-900' : 'text-gray-600'
                              }`}>
                              {achievement.title}
                            </h4>
                            <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'
                              }`}>
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Chart Placeholder */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-cyber-blue mb-6">
                    Activity Overview
                  </h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Activity chart coming soon...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}