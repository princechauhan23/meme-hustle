import React from 'react'
import { motion } from 'framer-motion'

export function CyberCard({ children, className = '', glitch = false, hologram = false }) {
  const cardClasses = `
    cyber-card 
    ${hologram ? 'hologram' : ''} 
    ${glitch ? 'animate-glitch' : ''} 
    ${className}
  `

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}