import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Eye,
  Users
} from 'lucide-react'
import { useMemeStore } from '../store/memeStore'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-hot-toast'
import { CyberButton } from './CyberButton'
import { GlitchText } from './GlitchText'
import { CyberCard } from './CyberCard'
import { socketService } from '../services/socketService'

export function MemeCard({ meme, className = '', showBidding = true }) {
  const [showFullImage, setShowFullImage] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [showBidInput, setShowBidInput] = useState(false)
  const { voteMeme, placeBid, likeMeme, likedMemes, bids } = useMemeStore()
  const { isAuthenticated, user, credits, spendCredits } = useAuthStore()

  // Setup real-time updates
  useEffect(() => {
    const socket = socketService.connect();

    // Listen for real-time vote updates
    socket.on('voteUpdate', (data) => {
      if (data && data.memeId && data.voteType) {
        voteMeme(data.memeId, data.upvotes, data.downvotes);
      }
    });

    // Listen for real-time bid updates
    socket.on('bidUpdate', (data) => {
      if (data && data.memeId && data.bidAmount) {
        placeBid(data.memeId, data.bidAmount, data.userId, data.username);
      }
    });

    return () => {
      if (socket && socket.off) {
        socket.off('voteUpdate');
        socket.off('bidUpdate');
      }
      socketService.disconnect();
    };
  }, [voteMeme, placeBid]);

  const handleVote = (voteType) => {
    if (!isAuthenticated) {
      toast.error('JACK IN TO VOTE');
      return;
    }
    // Emit vote event to backend
    const socket = socketService.connect();
    socket.emit('vote', {
      memeId: meme.id,
      voteType,
      userId: user?.id,
    });
    // Optimistically update UI
    voteMeme(meme.id, voteType);
    toast.success(`VOTE ${voteType.toUpperCase()} REGISTERED`);
  }

  const handleBid = () => {
    if (!isAuthenticated) {
      toast.error('JACK IN TO BID');
      return;
    }
    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      toast.error('Enter a valid bid amount');
      return;
    }
    if (Number(bidAmount) > credits) {
      toast.error('NOT ENOUGH CREDITS');
      return;
    }
    // Emit bid event to backend
    const socket = socketService.connect();
    socket.emit('bid', {
      memeId: meme.id,
      bidAmount: Number(bidAmount),
      userId: user?.id,
    });
    // Optimistically update UI
    spendCredits(Number(bidAmount));
    placeBid(meme.id, Number(bidAmount), user.id);
    setShowBidInput(false);
    setBidAmount('');
    toast.success('BID PLACED!');
  }

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('JACK IN TO LIKE');
      return;
    }

    likeMeme(meme.id)
    const isLiked = likedMemes.includes(meme.id)
    toast.success(isLiked ? 'REMOVED FROM FAVORITES' : 'ADDED TO FAVORITES')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: meme.title,
        text: `Check out this cybermeme: ${meme.title}`,
        url: window.location.href,
      })
    } catch (err) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('LINK COPIED TO CLIPBOARD')
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = meme.image_url
    link.download = `${meme.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('MEME DOWNLOADED')
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'JUST NOW'
    if (diffHours < 24) return `${diffHours}H AGO`
    if (diffDays < 7) return `${diffDays}D AGO`
    return date.toLocaleDateString()
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-cyber-pink'
      case 'epic': return 'text-cyber-purple'
      case 'rare': return 'text-cyber-blue'
      default: return 'text-cyber-green'
    }
  }

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'shadow-neon border-cyber-pink/50'
      case 'epic': return 'shadow-neon border-cyber-purple/50'
      case 'rare': return 'shadow-neon border-cyber-blue/50'
      default: return 'border-cyber-green/30'
    }
  }

  const isLikedByUser = likedMemes.includes(meme.id)
  const voteScore = meme.upvotes - meme.downvotes

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
            <p className="text-sm text-cyber-blue/70 font-mono">{formatTime(meme.created_at)}</p>
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
              onClick={() => handleVote('up')}
              className="flex items-center space-x-2 text-cyber-green hover:text-cyber-blue transition-colors duration-200"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-mono font-medium">{meme.upvotes}</span>
            </button>

            <button
              onClick={() => handleVote('down')}
              className="flex items-center space-x-2 text-cyber-pink hover:text-cyber-blue transition-colors duration-200"
            >
              <TrendingDown className="h-5 w-5" />
              <span className="font-mono font-medium">{meme.downvotes}</span>
            </button>

            <div className="flex items-center space-x-2 text-cyber-blue">
              <Zap className="h-5 w-5" />
              <span className="font-mono font-medium">{voteScore}</span>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors duration-200 ${isLikedByUser
              ? 'text-cyber-pink'
              : 'text-cyber-blue/70 hover:text-cyber-pink'
              }`}
          >
            <Heart className={`h-5 w-5 ${isLikedByUser ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bidding Section */}
        {showBidding && (
          <div className="border-t border-cyber-blue/20 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-cyber-green" />
                <span className="font-mono text-cyber-green font-bold">{bids[meme.id]?.amount || 0}</span>
                <span className="text-cyber-green/70 text-sm font-mono">BIDS</span>
              </div>
              <div className="flex items-center space-x-2 text-cyber-blue/70">
                <Users className="h-4 w-4" />
                {/* No bidders field in backend, show upvotes as participants */}
                <span className="font-mono text-sm">{meme.upvotes} UPVOTES</span>
              </div>
            </div>

            {showBidInput ? (
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={bidAmount ?? 0}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${bids[meme.id]?.amount ? bids[meme.id]?.amount + 1 : 1}`}
                  className="cyber-input flex-1 text-sm"
                  min={bids[meme.id]?.amount ? bids[meme.id]?.amount + 1 : 1}
                />
                <CyberButton
                  variant="accent"
                  size="sm"
                  onClick={handleBid}
                  disabled={!bidAmount}
                >
                  BID
                </CyberButton>
                <CyberButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowBidInput(false)}
                >
                  X
                </CyberButton>
              </div>
            ) : (
              <CyberButton
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setShowBidInput(true)}
                glitch
              >
                PLACE BID
              </CyberButton>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyber-blue/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-cyber-blue/70 hover:text-cyber-green transition-colors duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-mono text-sm">{meme.shares}</span>
            </button>

            <button className="flex items-center space-x-2 text-cyber-blue/70 hover:text-cyber-blue transition-colors duration-200">
              <MessageCircle className="h-5 w-5" />
              <span className="font-mono text-sm">{meme.comments}</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="p-2 text-cyber-blue/70 hover:text-cyber-pink hover:bg-cyber-blue/10 rounded-none transition-colors duration-200"
          >
            <Download className="h-5 w-5" />
          </button>
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