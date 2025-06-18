import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Star,
  Terminal,
  DollarSign,
  Eye,
  Cpu
} from 'lucide-react'
import { useMemeStore } from '../store/memeStore'
import { MemeCard } from '../components/MemeCard'
import { GlitchText } from '../components/GlitchText'
import { CyberButton } from '../components/CyberButton'
import { TerminalWindow, TerminalText } from '../components/TerminalWindow'
import { MatrixRain } from '../components/MatrixRain'

export function Home() {
  const { getTrendingMemes, memes } = useMemeStore()
  const [trendingMemes, setTrendingMemes] = useState([])
  const [terminalLines, setTerminalLines] = useState([])

  useEffect(() => {
    setTrendingMemes(memes.slice(0, 3))

    // Simulate terminal boot sequence
    const lines = [
      'INITIALIZING CYBERMEME EXCHANGE...',
      'CONNECTING TO MEME MATRIX...',
      'LOADING NEURAL NETWORKS...',
      'QUANTUM HUMOR PROTOCOLS ONLINE',
      'READY TO HACK THE MEME ECONOMY',
    ]

    lines.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line])
      }, index * 1000)
    })
  }, [memes])

  const features = [
    {
      icon: Terminal,
      title: 'Neural Meme Creation',
      description: 'Advanced AI-powered meme generation with quantum humor algorithms and glitch aesthetics.',
    },
    {
      icon: DollarSign,
      title: 'Real-Time Bidding',
      description: 'Trade memes in the cyberpunk economy with live bidding wars and credit transactions.',
    },
    {
      icon: TrendingUp,
      title: 'Viral Analytics',
      description: 'Track meme performance with advanced metrics, vote tracking, and trend analysis.',
    },
    {
      icon: Cpu,
      title: 'AI Enhancement',
      description: 'Gemini-powered caption generation and vibe analysis for maximum meme impact.',
    },
  ]

  const stats = [
    { label: 'Memes Hacked', value: '10K+', icon: Zap },
    { label: 'Cyber Traders', value: '5K+', icon: Users },
    { label: 'Credits Traded', value: '1M+', icon: DollarSign },
    { label: 'Glitch Level', value: '99.9%', icon: Star },
  ]

  return (
    <div className="min-h-screen relative">
      <MatrixRain />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/10 via-transparent to-cyber-blue/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlitchText
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-cyber mb-6"
                intensity="high"
              >
                HACK THE MEME MATRIX
              </GlitchText>
              <p className="text-xl text-cyber-blue/90 mb-8 max-w-2xl leading-relaxed font-mono">
                Enter the neon-soaked world of cyberpunk meme trading. Create viral content,
                bid with credits, and dominate the digital humor economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CyberButton
                  variant="primary"
                  size="lg"
                  glitch
                  onClick={() => window.location.href = '/register'}
                >
                  JACK IN NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </CyberButton>
                <CyberButton
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = '/explore'}
                >
                  EXPLORE MATRIX
                </CyberButton>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TerminalWindow title="MEME_MATRIX.EXE" className="max-w-md">
                <div className="space-y-2">
                  {terminalLines.map((line, index) => (
                    <TerminalText key={index} typing={index === terminalLines.length - 1}>
                      {line}
                    </TerminalText>
                  ))}
                  {terminalLines.length === 5 && (
                    <div className="mt-4 p-3 border border-cyber-green/30 bg-cyber-green/10">
                      <TerminalText>
                        STATUS: ONLINE | CREDITS: 1000 | LEVEL: NEWBIE
                      </TerminalText>
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cyber-dark/50 border-y border-cyber-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-dark border border-cyber-blue/30 mb-4 group-hover:border-cyber-pink/50 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-cyber-blue group-hover:text-cyber-pink transition-colors duration-300" />
                </div>
                <div className="text-3xl font-bold text-cyber-pink mb-2 font-mono">{stat.value}</div>
                <div className="text-cyber-blue/70 font-mono text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-cyber-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-4">
                CYBERPUNK FEATURES
              </GlitchText>
              <p className="text-xl text-cyber-blue/70 max-w-3xl mx-auto font-mono">
                Advanced neural networks and quantum algorithms power the ultimate meme trading experience
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="cyber-card p-6 group hover:border-cyber-pink/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-cyber-dark border border-cyber-blue/30 mb-6 group-hover:border-cyber-pink/50 transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-cyber-blue group-hover:text-cyber-pink transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-cyber-blue mb-3 font-mono">
                  {feature.title}
                </h3>
                <p className="text-cyber-blue/70 leading-relaxed font-mono text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className="py-24 bg-cyber-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-4">
                TRENDING IN THE MATRIX
              </GlitchText>
              <p className="text-xl text-cyber-blue/70 max-w-3xl mx-auto font-mono">
                Hot memes currently dominating the cyberpunk economy
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {trendingMemes?.map((meme, index) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemeCard meme={meme} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <CyberButton
              variant="primary"
              size="lg"
              glitch
              onClick={() => window.location.href = '/explore'}
            >
              EXPLORE ALL MEMES
              <ArrowRight className="ml-2 h-5 w-5" />
            </CyberButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-cyber-pink/20 via-cyber-blue/20 to-cyber-purple/20 border-t border-cyber-blue/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlitchText className="text-3xl sm:text-4xl font-bold font-cyber mb-6">
              READY TO HACK THE ECONOMY?
            </GlitchText>
            <p className="text-xl text-cyber-blue/90 mb-8 max-w-2xl mx-auto font-mono">
              Join the cyberpunk revolution. Create viral memes, trade with credits,
              and dominate the digital humor matrix.
            </p>
            <CyberButton
              variant="primary"
              size="lg"
              glitch
              onClick={() => window.location.href = '/register'}
            >
              JACK INTO THE MATRIX
              <ArrowRight className="ml-2 h-5 w-5" />
            </CyberButton>
          </motion.div>
        </div>
      </section>
    </div>
  )
}