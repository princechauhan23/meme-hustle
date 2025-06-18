import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../Navbar';
import { MatrixRain } from '../MatrixRain';

const CyberLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    // Fade in effect on mount
    setIsVisible(true);

    // Scanline animation
    const interval = setInterval(() => {
      setScanlinePosition((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-darker text-cyber-gray-200 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-darker via-cyber-darker to-cyber-darker/90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20" />
        <MatrixRain className="opacity-5" />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-cyber-blue/5 via-transparent to-cyber-purple/5 pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      </div>

      {/* Scanline effect */}
      <div 
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 255, 255, 0) 0%, rgba(0, 255, 255, 0.05) 50%, rgba(0, 255, 255, 0) 100%)',
          backgroundSize: '100% 4px',
          height: '100vh',
          transform: `translateY(${scanlinePosition}%)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Main content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col min-h-screen"
          >
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
              <Outlet />
            </main>
            
            {/* Footer */}
            <footer className="py-6 border-t border-cyber-gray-800 mt-12">
              <div className="container mx-auto px-4 text-center text-cyber-gray-400 text-sm">
                <p>© {new Date().getFullYear()} CyberMeme Exchange. All rights reserved.</p>
                <p className="mt-1 text-xs">Built with ❤️ and <span className="text-cyber-pink">neon</span></p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global hover effect */}
      <div className="fixed inset-0 pointer-events-none z-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default CyberLayout;
