import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Heart,
  Hash,
  Grid,
  List,
  DollarSign,
  Zap,
  Eye
} from 'lucide-react'
import { useMemeStore } from '../store/memeStore'
import { MemeCard } from '../components/MemeCard'
import { GlitchText } from '../components/GlitchText'
import { CyberButton } from '../components/CyberButton'
import { socketService } from '../services/socketService'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortBy, setSortBy] = useState('trending') // trending, recent, popular, bids
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [showFilters, setShowFilters] = useState(false)
  const [liveUpdates, setLiveUpdates] = useState(true)
  const { token } = useAuthStore()

  const { memes, setMemes } = useMemeStore()

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set()
    memes.forEach(meme => {
      if (meme.tags) {
        meme.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).slice(0, 12) // Show top 12 tags
  }, [memes])

  const fetchAllMemes = async () => {
    try {
      const res = await fetch('https://meme-hustle-backend.vercel.app/api/memes/', {
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

  // Filter and sort memes
  const filteredMemes = useMemo(() => {
    let result = memes || []

    // Apply search (search title, ai_caption, and vibe_analysis fields)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(meme =>
        (meme.title && meme.title.toLowerCase().includes(q)) ||
        (meme.ai_caption && meme.ai_caption.toLowerCase().includes(q)) ||
        (meme.vibe_analysis && meme.vibe_analysis.toLowerCase().includes(q))
      )
    }

    // Apply tag filter
    if (selectedTag) {
      result = result.filter(meme =>
        Array.isArray(meme.tags) && meme.tags.includes(selectedTag)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        result = [...result].sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
        break
      case 'trending':
        // Fallback: trending = most upvotes - downvotes
        result = [...result].sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
        break
      case 'bids':
        result = [...result].sort((a, b) => {
          const bidsA = Array.isArray(a.bids) && a.bids.length > 0 ? a.bids[0].count || 0 : 0
          const bidsB = Array.isArray(b.bids) && b.bids.length > 0 ? b.bids[0].count || 0 : 0
          return bidsB - bidsA
        })
        break
      case 'recent':
      default:
        result = [...result].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        )
        break
    }

    return result
  }, [memes, searchQuery, selectedTag, sortBy])

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTag('')
    setSortBy('trending')
  }

  const sortOptions = [
    { value: 'trending', label: 'TRENDING', icon: TrendingUp },
    { value: 'recent', label: 'RECENT', icon: Clock },
    { value: 'popular', label: 'POPULAR', icon: Heart },
    { value: 'bids', label: 'HIGHEST BIDS', icon: DollarSign },
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
          <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-4">
            EXPLORE THE MATRIX
          </GlitchText>
          <p className="text-xl text-cyber-blue/70 max-w-2xl mx-auto font-mono">
            Discover viral memes, place bids, and dominate the cyberpunk economy
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="cyber-card p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-cyber-blue/50" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH MEMES, CREATORS, TAGS..."
                className="cyber-input pl-10 pr-4 text-lg font-mono"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-cyber-blue">SORT:</span>
                  <div className="flex space-x-1">
                    {sortOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value)}
                        className={`flex items-center space-x-1 px-3 py-2 text-xs font-mono transition-all duration-200 ${sortBy === value
                          ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50'
                          : 'text-cyber-blue/70 hover:text-cyber-blue border border-cyber-blue/20 hover:border-cyber-blue/50'
                          }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-cyber-dark border border-cyber-blue/30 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors duration-200 ${viewMode === 'grid'
                      ? 'bg-cyber-pink/20 text-cyber-pink'
                      : 'text-cyber-blue/70 hover:text-cyber-blue'
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors duration-200 ${viewMode === 'list'
                      ? 'bg-cyber-pink/20 text-cyber-pink'
                      : 'text-cyber-blue/70 hover:text-cyber-blue'
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Live Updates Toggle */}
                <button
                  onClick={() => setLiveUpdates(!liveUpdates)}
                  className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono transition-all duration-200 ${liveUpdates
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/50'
                    : 'text-cyber-blue/70 hover:text-cyber-blue border border-cyber-blue/20'
                    }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>LIVE</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {(searchQuery || selectedTag) && (
                  <CyberButton
                    variant="secondary"
                    size="sm"
                    onClick={clearFilters}
                  >
                    CLEAR
                  </CyberButton>
                )}
                <span className="text-sm text-cyber-blue/70 font-mono">
                  {filteredMemes.length} MEMES
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center font-mono">
            <Hash className="h-5 w-5 mr-2" />
            POPULAR TAGS
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-2 text-sm font-mono transition-all duration-200 ${selectedTag === tag
                  ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50'
                  : 'bg-cyber-dark border border-cyber-blue/30 text-cyber-blue hover:border-cyber-pink/50 hover:text-cyber-pink'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredMemes.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredMemes.map((meme, index) => (
                <motion.div
                  key={meme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MemeCard
                    meme={meme}
                    className={viewMode === 'list' ? 'max-w-2xl mx-auto' : ''}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cyber-dark border border-cyber-blue/30 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-cyber-blue/50" />
              </div>
              <GlitchText className="text-xl font-semibold font-cyber mb-2">
                NO MEMES FOUND
              </GlitchText>
              <p className="text-cyber-blue/70 mb-6 font-mono">
                Adjust your search parameters or explore different tags
              </p>
              <CyberButton
                variant="primary"
                onClick={clearFilters}
                glitch
              >
                RESET FILTERS
              </CyberButton>
            </div>
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredMemes.length >= 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <CyberButton
              variant="secondary"
              size="lg"
              className="px-8 py-3"
            >
              LOAD MORE MEMES
            </CyberButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}