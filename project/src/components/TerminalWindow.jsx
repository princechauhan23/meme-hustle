import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TerminalWindow({ children, title = "CYBER_TERMINAL.EXE", className = "" }) {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <motion.div 
      className={`terminal-window ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="terminal-header">
        <div className="flex items-center space-x-2">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-cyber-green font-mono text-sm">{title}</span>
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-cyber-green hover:text-cyber-pink transition-colors"
        >
          {isMinimized ? '□' : '_'}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="p-4 relative">
          <div className="scan-line"></div>
          {children}
        </div>
      )}
    </motion.div>
  )
}

export function TerminalText({ children, typing = false, delay = 0 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const text = children.toString()

  useEffect(() => {
    if (!typing) {
      setDisplayText(text)
      return
    }

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }
    }, 50 + Math.random() * 50)

    return () => clearTimeout(timer)
  }, [currentIndex, text, typing])

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0)
      }, delay)
      return () => clearTimeout(delayTimer)
    }
  }, [delay])

  return (
    <span className={`font-mono text-cyber-green ${typing ? 'terminal-typing' : ''}`}>
      {displayText}
      {typing && currentIndex < text.length && <span className="animate-blink">█</span>}
    </span>
  )
}