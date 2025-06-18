import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  Type,
  Download,
  Share2,
  Save,
  Image as ImageIcon,
  Palette,
  Sliders,
  X,
  Cpu,
  Zap,
  Sparkles
} from 'lucide-react'
import { useMemeStore } from '../store/memeStore'
import { useAuthStore } from '../store/authStore'
import { aiService } from '../services/aiService'
import { toast } from 'react-hot-toast'
import { GlitchText } from '../components/GlitchText'
import { CyberButton } from '../components/CyberButton'
import { CyberCard } from '../components/CyberCard'
import { TerminalWindow, TerminalText } from '../components/TerminalWindow'

export function Create() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [aiCaption, setAiCaption] = useState('')
  const [vibeAnalysis, setVibeAnalysis] = useState('')

  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const { addMeme } = useMemeStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  // Cyberpunk meme templates
  const templates = [
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=400&fit=crop',
  ]

  const cyberColors = [
    '#00ffff', '#ff006e', '#00ff41', '#8000ff', '#ffff00', '#ff4500'
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setImageUrl('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTemplateSelect = (templateUrl) => {
    setSelectedImage(templateUrl)
    setImageUrl('')
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (imageUrl.trim()) {
      setSelectedImage(imageUrl)
    }
  }

  const enhanceWithAI = async () => {
    if (!selectedImage || !title.trim()) {
      toast.error('SELECT IMAGE AND ENTER TITLE FIRST')
      return
    }

    setIsEnhancing(true)
    try {
      const memeData = {
        title: title.trim(),
        imageUrl: selectedImage,
        topText: topText.trim(),
        bottomText: bottomText.trim(),
        tags: tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean),
      }

      const [caption, vibe] = await Promise.all([
        aiService.generateCaption(selectedImage, title, memeData.tags),
        aiService.analyzeVibe(selectedImage, title, '')
      ])

      setAiCaption(caption)
      setVibeAnalysis(vibe)
      toast.success('AI ENHANCEMENT COMPLETE')
    } catch (error) {
      toast.error('AI ENHANCEMENT FAILED')
    } finally {
      setIsEnhancing(false)
    }
  }

  const generateMeme = async () => {
    if (!selectedImage) {
      toast.error('SELECT AN IMAGE FIRST')
      return
    }

    if (!title.trim()) {
      toast.error('ENTER A TITLE FOR YOUR MEME')
      return
    }

    const memeData = {
      title: title.trim(),
      image_url: selectedImage,
      tags: tags.split(',').map(tag => tag.trim().toLowerCase()),
    }

    try {
      const response = await fetch('https://meme-hustle-backend.vercel.app/api/memes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memeData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create meme')
      }

      const newMeme = await response.json()
      addMeme(newMeme)
      toast.success('MEME CREATED SUCCESSFULLY')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'FAILED TO CREATE MEME')
    }
  }

  const downloadMeme = () => {
    if (!selectedImage) {
      toast.error('SELECT AN IMAGE FIRST')
      return
    }

    const link = document.createElement('a')
    link.href = selectedImage
    link.download = `${title || 'cybermeme'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('MEME DOWNLOADED')
  }

  const clearAll = () => {
    setSelectedImage(null)
    setImageUrl('')
    setTopText('')
    setBottomText('')
    setTitle('')
    setTags('')
    setAiCaption('')
    setVibeAnalysis('')
  }

  return (
    <div className="min-h-screen bg-cyber-darker py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-4">
            MEME CREATION LAB
          </GlitchText>
          <p className="text-xl text-cyber-blue/70 max-w-2xl mx-auto font-mono">
            Forge viral content with AI-powered enhancement and cyberpunk aesthetics
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Image Selection & Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Image Upload */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-semibold text-cyber-blue mb-4 flex items-center font-mono">
                <Upload className="h-5 w-5 mr-2" />
                IMAGE UPLOAD
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-cyber-blue/30 hover:border-cyber-pink/50 hover:bg-cyber-pink/5 transition-all duration-200 group"
                >
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-cyber-blue/50 group-hover:text-cyber-pink mx-auto mb-4" />
                    <p className="text-cyber-blue group-hover:text-cyber-pink font-mono">
                      CLICK TO UPLOAD IMAGE
                    </p>
                    <p className="text-sm text-cyber-blue/50 mt-1 font-mono">
                      PNG, JPG, GIF UP TO 10MB
                    </p>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="text-center text-cyber-blue/50 font-mono">
                  <span>OR</span>
                </div>

                <form onSubmit={handleUrlSubmit} className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="PASTE IMAGE URL"
                    className="cyber-input flex-1"
                  />
                  <CyberButton
                    type="submit"
                    variant="secondary"
                    size="sm"
                  >
                    LOAD
                  </CyberButton>
                </form>
              </div>
            </CyberCard>

            {/* Cyberpunk Templates */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-semibold text-cyber-blue mb-4 flex items-center font-mono">
                <Palette className="h-5 w-5 mr-2" />
                CYBER TEMPLATES
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template)}
                    className="aspect-square overflow-hidden border-2 border-cyber-blue/30 hover:border-cyber-pink/50 transition-all duration-200 group"
                  >
                    <img
                      src={template}
                      alt={`Template ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </CyberCard>

            {/* AI Enhancement */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-semibold text-cyber-blue mb-4 flex items-center font-mono">
                <Cpu className="h-5 w-5 mr-2" />
                AI ENHANCEMENT
              </h2>

              <CyberButton
                variant="accent"
                onClick={enhanceWithAI}
                disabled={isEnhancing || !selectedImage || !title.trim()}
                className="w-full"
                glitch
              >
                {isEnhancing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    ENHANCING...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    ENHANCE WITH AI
                  </>
                )}
              </CyberButton>

              {(aiCaption || vibeAnalysis) && (
                <div className="mt-4 p-3 bg-cyber-dark/50 border border-cyber-green/30">
                  {aiCaption && (
                    <div className="mb-2">
                      <p className="text-cyber-green text-xs font-mono mb-1">AI_CAPTION:</p>
                      <p className="text-cyber-blue text-sm">{aiCaption}</p>
                    </div>
                  )}
                  {vibeAnalysis && (
                    <div>
                      <p className="text-cyber-pink text-xs font-mono mb-1">VIBE:</p>
                      <p className="text-cyber-blue text-sm">{vibeAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </CyberCard>
          </motion.div>

          {/* Right Panel - Preview and Text Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Preview */}
            <CyberCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyber-blue font-mono">PREVIEW</h2>
                {selectedImage && (
                  <CyberButton
                    variant="secondary"
                    size="sm"
                    onClick={clearAll}
                  >
                    <X className="h-4 w-4 mr-1" />
                    CLEAR
                  </CyberButton>
                )}
              </div>

              <div className="relative bg-cyber-dark border border-cyber-blue/30 overflow-hidden" style={{ aspectRatio: '1' }}>
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage}
                      alt="Meme preview"
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cyber-blue/50">
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                      <p className="font-mono">SELECT IMAGE TO START</p>
                    </div>
                  </div>
                )}
              </div>
            </CyberCard>

            {/* Text Input */}
            <CyberCard className="p-6">
              <h2 className="text-xl font-semibold text-cyber-blue mb-4 flex items-center font-mono">
                <Type className="h-5 w-5 mr-2" />
                MEME DATA
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyber-blue mb-2 font-mono">
                    TITLE *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ENTER MEME TITLE"
                    className="cyber-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyber-blue mb-2 font-mono">
                    TAGS (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="doge, stonks, matrix, hack"
                    className="cyber-input"
                  />
                </div>
              </div>
            </CyberCard>

            {/* Action Buttons */}
            <CyberCard className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <CyberButton
                  variant="secondary"
                  onClick={downloadMeme}
                  disabled={!selectedImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  DOWNLOAD
                </CyberButton>

                <CyberButton
                  variant="primary"
                  onClick={generateMeme}
                  disabled={!selectedImage || !title.trim()}
                  glitch
                >
                  <Save className="h-4 w-4 mr-2" />
                  CREATE MEME
                </CyberButton>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}