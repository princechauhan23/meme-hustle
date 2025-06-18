import React, { useState } from 'react'
import {
  MoreVertical,
  TrendingUp,
} from 'lucide-react'
import { CyberCard } from './CyberCard'

export function MemeDuelCard({ meme, className = '', battle, upvoteMeme, count }) {
  const [showFullImage, setShowFullImage] = useState(false)

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'shadow-neon border-cyber-pink/50'
      case 'epic': return 'shadow-neon border-cyber-purple/50'
      case 'rare': return 'shadow-neon border-cyber-blue/50'
      default: return 'border-cyber-green/30'
    }
  }

  return (
    <CyberCard className={`${className} ${getRarityGlow(meme.rarity)}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-cyber-blue/20">
        <div className="flex items-center space-x-3">
          <img
            src={meme.author_avatar}
            alt={meme.author}
            className="h-10 w-10 rounded-none object-cover border border-cyber-blue/30"
          />
          <div>
            <h3 className="font-mono font-semibold text-cyber-blue">{meme.author}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <span className={`text-xs font-mono uppercase px-2 py-1 border ${getRarityColor(meme.rarity)} border-current`}>
              {meme.rarity}
            </span> */}
          <button className="p-2 text-cyber-blue/70 hover:text-cyber-pink hover:bg-cyber-blue/10 rounded-none transition-colors duration-200">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Meme Image */}
      <div className="relative group cursor-pointer" onClick={() => setShowFullImage(true)}>
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-64 sm:h-80 object-cover"
        />

        {/* Text Overlays */}
        {/* No topText/bottomText in backend data, so skip overlays */}

        {/* Glitch Level Indicator - not in backend, skip or show AI info instead */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/70 px-2 py-1 border border-cyber-green/50">
            <span className="text-cyber-green font-mono text-xs">
              AI
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-cyber-blue/0 group-hover:bg-cyber-blue/10 transition-all duration-200" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-cyber-blue mb-2 font-mono text-ellipsis overflow-hidden line-clamp-1 hover:line-clamp-none transition-all duration-200">{meme.title}</h2>

        {/* AI Caption & Vibe */}
        {(meme.ai_caption || meme.vibe_analysis) && (
          <div className="mb-3 p-3 bg-cyber-dark/50 border border-cyber-green/30">
            {meme.ai_caption && (
              <>
                <p className="text-cyber-green text-sm font-mono mb-1">AI_CAPTION:</p>
                <p className="text-cyber-blue/90 text-sm text-ellipsis overflow-hidden line-clamp-1 hover:line-clamp-none transition-all duration-200">{meme.ai_caption}</p>
              </>
            )}
            {meme.vibe_analysis && (
              <p className="text-cyber-pink text-xs font-mono mt-1 text-ellipsis overflow-hidden line-clamp-1 hover:line-clamp-none transition-all duration-200">VIBE: {meme.vibe_analysis}</p>
            )}
          </div>
        )}

        {/* Tags */}
        {meme.tags && meme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {meme.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-cyber-dark border border-cyber-blue/30 text-cyber-blue text-xs font-mono hover:border-cyber-pink/50 transition-colors duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Voting */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => upvoteMeme(meme.id, battle.id)}
              className="flex items-center space-x-2 text-cyber-green hover:text-cyber-blue transition-colors duration-200"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-mono font-medium">{count}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={meme.image_url}
              alt={meme.title}
              className="max-w-full max-h-full object-contain border border-cyber-blue/30"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 p-2 bg-black/70 text-cyber-pink border border-cyber-pink/50 hover:bg-cyber-pink/20 transition-colors duration-200 font-mono"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </CyberCard>
  )
}