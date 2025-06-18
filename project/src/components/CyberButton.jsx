import React from 'react'
import { motion } from 'framer-motion'

export function CyberButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  glitch = false,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'cyber-btn-primary',
    secondary: 'cyber-btn-secondary', 
    accent: 'cyber-btn-accent',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const glitchProps = glitch ? {
    'data-text': children,
    className: `${variants[variant]} ${sizes[size]} glitch-hover ${className}`,
  } : {
    className: `${variants[variant]} ${sizes[size]} ${className}`,
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      {...glitchProps}
      {...props}
    >
      {children}
    </motion.button>
  )
}