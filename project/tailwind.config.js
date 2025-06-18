/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        cyber: {
          pink: '#ff0080',
          blue: '#00ffff',
          purple: '#8000ff',
          green: '#00ff41',
          yellow: '#ffff00',
          dark: '#0a0a0a',
          darker: '#050505',
          gray: '#1a1a1a',
        },
        neon: {
          pink: '#ff006e',
          blue: '#00f7ff',
          cyan: '#00f5ff',
          green: '#39ff14',
          purple: '#bf00ff',
          orange: '#ff4500',
          yellow: '#ffd700',
          teal: '#00ffcc',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        digital: ['Digital Numbers', 'monospace'],
      },
      keyframes: {
        'glitch': {
          '0%, 100%': { textShadow: '0.05em 0 0 #ff00ff, -0.05em -0.025em 0 #00ffff' },
          '14%': { textShadow: '0.05em 0 0 #ff00ff, -0.05em -0.025em 0 #00ffff' },
          '15%': { textShadow: '-0.05em -0.025em 0 #ff00ff, 0.025em 0.05em 0 #00ffff' },
          '49%': { textShadow: '-0.05em -0.025em 0 #ff00ff, 0.025em 0.05em 0 #00ffff' },
          '50%': { textShadow: '0.025em 0.05em 0 #ff00ff, 0.05em 0 0 #00ffff' },
          '99%': { textShadow: '0.025em 0.05em 0 #ff00ff, 0.05em 0 0 #00ffff' },
        },
        'glow': {
          '0%, 100%': { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00f7ff, 0 0 30px #00f7ff' },
          '50%': { textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #bf00ff, 0 0 40px #bf00ff' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'flicker': {
          '0%, 80%, 81%, 85%, 87%, 89%, 100%': { opacity: '0.4' },
          '82%, 84%, 86%, 88%, 90%': { opacity: '0.1' },
        },
      },
      animation: {
        'glitch': 'glitch 5s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 10s infinite',
      },
      boxShadow: {
        'neon': '0 0 5px #00f7ff, 0 0 10px #00f7ff, 0 0 20px #00f7ff',
        'neon-pink': '0 0 5px #ff006e, 0 0 10px #ff006e, 0 0 20px #ff006e',
        'neon-purple': '0 0 5px #bf00ff, 0 0 10px #bf00ff, 0 0 20px #bf00ff',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 247, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 247, 255, 0.1) 1px, transparent 1px)',
        'cyber-diagonal': 'linear-gradient(45deg, rgba(0, 0, 0, 0.9) 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(-45deg, rgba(0, 0, 0, 0.9) 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.9) 75%), linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.9) 75%)',
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        digital: ['Digital Numbers', 'monospace'],
        cyber: ['Orbitron', 'Exo 2', 'sans-serif'],
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px 0 rgba(0, 247, 255, 0.5)',
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00f7ff, 0 0 30px #00f7ff',
          },
          '50%': { 
            boxShadow: '0 0 20px 5px rgba(0, 247, 255, 0.8)',
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00f7ff, 0 0 40px #00f7ff',
          },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '41.99%': { opacity: 1 },
          '42%': { opacity: 0 },
          '43%': { opacity: 0 },
          '43.01%': { opacity: 1 },
          '47.99%': { opacity: 1 },
          '48%': { opacity: 0 },
          '49%': { opacity: 1 },
        },
        'text-flicker': {
          '0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100%': {
            opacity: 0.99,
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00f7ff, 0 0 30px #00f7ff',
          },
          '20%, 21.9%, 63%, 63.9%, 65%, 69.9%': {
            opacity: 0.4,
            textShadow: 'none',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'hover-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 247, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 247, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 247, 255, 0)' },
        },
      },
      animation: {
        glitch: 'glitch 0.2s infinite',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
        flicker: 'flicker 3s infinite',
        'text-flicker': 'text-flicker 8s infinite',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scanline: 'scanline 8s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'hover-glow': 'hover-glow 1.5s ease-out infinite',
      },
      boxShadow: {
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 30px currentColor, 0 0 60px currentColor',
        'cyber': '0 0 20px rgba(255, 0, 128, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, #ff006e, #0077ff, #00f5ff, #39ff14)',
        'matrix': 'linear-gradient(to bottom, transparent, rgba(0,255,65,0.1), transparent)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}