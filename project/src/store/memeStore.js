import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Initial empty state - will be populated from API
const initialState = {
  memes: [],
  loading: false,
  error: null,
  leaderboard: [],
}

export const useMemeStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      userMemes: [],
      likedMemes: [],
      bids: {}, // memeId -> { userId, amount, timestamp }
      
      // Set memes from API response
      setMemes: (memes) => set({ memes, loading: false, error: null }),

      // Set leaderboard from socket
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      
      // Set loading state
      setLoading: (loading) => set({ loading }),
      
      // Set error state
      setError: (error) => set({ error, loading: false }),
      
      // Add a new meme (after API success)
      addMeme: (meme) => {
        const newMeme = {
          ...meme,
          // Ensure all required fields are present
          upvotes: meme.upvotes || 0,
          downvotes: meme.downvotes || 0,
          comments: 0,
          shares: 0,
          created_at: meme.created_at || new Date().toISOString(),
          tags: meme.tags || []
        }
        
        set((state) => ({
          memes: [newMeme, ...state.memes],
          userMemes: [newMeme, ...state.userMemes],
        }))
        return newMeme
      },
      
      voteMeme: (memeId, upvotes, downvotes) => {
        set((state) => {
          const memes = state.memes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                upvotes: upvotes,
                downvotes: downvotes,
              }
            }
            return meme
          })
          
          return {
            memes,
            userMemes: state.userMemes.map(meme => {
              const updated = memes.find(m => m.id === meme.id)
              return updated || meme
            })
          }
        })
      },

      placeBid: (memeId, bidAmount, userId, username) => {
        set((state) => {
          const newBids = {
            ...state.bids,
            [memeId]: {
              userId,
              amount: bidAmount,
              timestamp: Date.now()
            }
          }

          const memes = state.memes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                currentBid: bidAmount,
                bidders: username,
              }
            }
            return meme
          })

          return {
            bids: newBids,
            memes,
            userMemes: state.userMemes.map(meme => {
              const updated = memes.find(m => m.id === meme.id)
              return updated || meme
            })
          }
        })
      },
      
      likeMeme: (memeId) => {
        set((state) => {
          const likedMemes = state.likedMemes.includes(memeId)
            ? state.likedMemes.filter(id => id !== memeId)
            : [...state.likedMemes, memeId]
          
          return { likedMemes }
        })
      },
      
      getMemesByTag: (tag) => {
        const state = get()
        return state.memes.filter(meme => 
          meme.tags && meme.tags.includes(tag.toLowerCase())
        )
      },
      
      searchMemes: (query) => {
        const state = get()
        const searchTerm = query.toLowerCase()
        return state.memes.filter(meme => 
          meme.title.toLowerCase().includes(searchTerm) ||
          meme.topText?.toLowerCase().includes(searchTerm) ||
          meme.bottomText?.toLowerCase().includes(searchTerm) ||
          (meme.tags && meme.tags.some(tag => tag.includes(searchTerm))) ||
          meme.aiCaption?.toLowerCase().includes(searchTerm) ||
          meme.vibeAnalysis?.toLowerCase().includes(searchTerm)
        )
      },
      
      getTrendingMemes: () => {
        const state = get()
        return [...state.memes]
          .sort((a, b) => {
            const aScore = (a.upvotes - a.downvotes) + (a.currentBid * 0.1) + (a.glitchLevel * 0.01)
            const bScore = (b.upvotes - b.downvotes) + (b.currentBid * 0.1) + (b.glitchLevel * 0.01)
            return bScore - aScore
          })
          .slice(0, 10)
      },
      
      getPopularMemes: () => {
        const state = get()
        return [...state.memes].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)).slice(0, 10)
      },

      getleaderboard: () => {
        const state = get()
        return state.leaderboard
      },
      
      getRecentMemes: () => {
        const state = get()
        return [...state.memes].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 10)
      },

      getHighestBids: () => {
        const state = get()
        return [...state.memes].sort((a, b) => b.currentBid - a.currentBid).slice(0, 10)
      },

      generateAICaption: async (meme) => {
        // Simulate AI caption generation
        const captions = [
          'Digital consciousness emerges from meme singularity',
          'Quantum humor transcends reality barriers',
          'Neural networks achieve comedic enlightenment',
          'Cybernetic laughter protocols activated',
          'Matrix humor subroutines executing',
          'Artificial wit surpasses human comprehension',
          'Digital comedy evolution in progress',
          'Meme consciousness achieves sentience',
        ]
        
        const vibes = [
          'Neon Chaos Energy',
          'Digital Rebellion Vibe',
          'Cyber Punk Essence',
          'Matrix Glitch Mood',
          'Quantum Humor Wave',
          'Terminal Comedy Flow',
          'Hacker Meme Spirit',
          'Cybernetic Laugh Track',
        ]

        return {
          caption: captions[Math.floor(Math.random() * captions.length)],
          vibe: vibes[Math.floor(Math.random() * vibes.length)]
        }
      }
    }),
    {
      name: 'cyber-meme-storage',
    }
  )
)