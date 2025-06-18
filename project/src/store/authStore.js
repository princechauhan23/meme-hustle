import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      credits: 1000, // Starting credits for bidding
      
      login: (userData, token) => {
        set({ 
          user: userData, 
          isAuthenticated: true,
          credits: userData.credits || 1000,
          token: token
        })
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          credits: 0,
          token: null
        })
      },
      
      register: (userData) => {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
          joinedDate: new Date().toISOString(),
          memesCreated: 0,
          totalLikes: 0,
          following: 0,
          followers: 0,
          credits: 1000,
          level: 1,
          hackingSkill: Math.floor(Math.random() * 100) + 1,
        }
        set({ 
          user: newUser, 
          isAuthenticated: true,
          credits: 1000
        })
        return newUser
      },
      
      updateProfile: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({ user: updatedUser })
          return updatedUser
        }
      },

      updateCredits: (amount) => {
        const currentUser = get().user
        const newCredits = Math.max(0, get().credits + amount)
        set({ credits: newCredits })
        if (currentUser) {
          set({ 
            user: { ...currentUser, credits: newCredits }
          })
        }
      },

      spendCredits: (amount) => {
        const currentCredits = get().credits
        if (currentCredits >= amount) {
          get().updateCredits(-amount)
          return true
        }
        return false
      }
    }),
    {
      name: 'cyber-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        credits: state.credits,
        token: state.token
      }),
    }
  )
)