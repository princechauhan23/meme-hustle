import React from 'react'

export function GlitchText({ children, className = '', intensity = 'normal' }) {
  const intensityClasses = {
    low: 'animate-pulse',
    normal: 'glitch-text',
    high: 'glitch-text animate-glitch-fast',
    extreme: 'glitch-text animate-glitch-fast animate-flicker'
  }

  return (
    <span 
      className={`${intensityClasses[intensity]} ${className}`}
      data-text={children}
    >
      {children}
    </span>
  )
}