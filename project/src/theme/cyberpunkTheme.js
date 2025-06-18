/**
 * Cyberpunk Theme Constants and Utilities
 * 
 * This file contains reusable theme elements, colors, and styles
 * for maintaining consistent cyberpunk aesthetics across the application.
 */

// Color Palette
export const colors = {
  // Primary Colors
  primary: '#00f0ff',    // Bright Cyan
  secondary: '#ff00ff',  // Magenta
  accent: '#00ff9d',     // Green-Cyan
  highlight: '#ff3c5f',  // Pink-Red
  
  // Background Colors
  dark: '#0a0a14',       // Dark Blue-Black
  darker: '#050509',     // Almost Black
  darkest: '#010104',    // Pure Black with blue tint
  
  // Text Colors
  text: '#e0e0ff',       // Light Blue-White
  textMuted: '#8a8a9d',  // Muted Blue-Gray
  textHighlight: '#ffffff', // Pure White
  
  // UI Colors
  success: '#00ff9d',    // Green-Cyan
  warning: '#ffcc00',    // Yellow
  danger: '#ff3c5f',     // Pink-Red
  info: '#00a1ff',       // Bright Blue
};

// Gradients
export const gradients = {
  // Background Gradients
  bgGradient: 'bg-gradient-to-br from-cyber-darker via-cyber-darker to-cyber-darker/90',
  
  // Text Gradients
  textGradient: 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-pink to-cyber-blue',
  
  // Button Gradients
  primaryButton: 'bg-gradient-to-r from-cyber-pink to-cyber-blue hover:from-cyber-blue hover:to-cyber-pink',
  secondaryButton: 'bg-gradient-to-r from-cyber-dark to-cyber-darker border border-cyber-pink/30 hover:border-cyber-pink/60',
};

// Typography
export const typography = {
  // Font Families
  fontSans: 'font-sans',
  fontMono: 'font-mono',
  fontCyber: 'font-cyber', // Make sure this font is defined in your Tailwind config
  
  // Text Sizes
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
  h2: 'text-3xl sm:text-4xl font-bold',
  h3: 'text-2xl sm:text-3xl font-bold',
  h4: 'text-xl sm:text-2xl font-semibold',
  body: 'text-base leading-relaxed',
  small: 'text-sm opacity-80',
};

// Animations
export const animations = {
  // Fade In
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  
  // Slide In From Left
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  },
  
  // Slide In From Right
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  },
  
  // Scale In
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
};

// Common UI Components
export const ui = {
  // Card
  card: 'bg-cyber-darker/80 backdrop-blur-sm border border-cyber-gray-800 rounded-lg p-6 hover:border-cyber-pink/50 transition-all duration-300',
  
  // Button
  button: 'inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-darker',
  
  // Input
  input: 'w-full px-4 py-2 bg-cyber-darker border border-cyber-gray-800 rounded-md text-cyber-gray-200 focus:outline-none focus:ring-2 focus:ring-cyber-pink/50 focus:border-transparent',
  
  // Badge
  badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
};

// Export all theme utilities as a single object
export const cyberpunkTheme = {
  colors,
  gradients,
  typography,
  animations,
  ui,
};

export default cyberpunkTheme;
