/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Volume2, Activity, Zap, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="h-screen max-h-screen bg-coquette-cream text-[#2d2d2d] relative overflow-hidden flex flex-col font-sans selection:bg-coquette-pink selection:text-black paper-texture">
      {/* Decorative Floral Accents */}
      <div className="absolute inset-0 pointer-events-none watercolor-floral" />
      
      <header className="relative z-10 px-8 py-3 flex justify-between items-center border-b border-black/5 backdrop-blur-md shrink-0">
        <div className="flex gap-4 items-center font-serif">
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-coquette-gold/20 shadow-sm"
          >
            <Zap className="text-coquette-gold" size={16} />
          </motion.div>
          <div>
            <h1 className="text-xl font-light italic tracking-tight text-black leading-none">
              Ribbon Rush
            </h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 font-serif italic text-xs text-black/40">
          <div className="flex items-center gap-2">
            <span className="text-coquette-gold font-medium">Elegance Protocol Verified</span>
            <div className="w-1.5 h-1.5 rounded-full bg-coquette-gold animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 grid lg:grid-cols-[1fr_360px] gap-8 px-10 py-6 max-w-[1600px] mx-auto w-full items-center min-h-0 overflow-hidden">
        {/* Game Simulation Window */}
        <section className="flex flex-col items-center justify-center relative p-6 border border-black/5 bg-white/40 soft-shadow rounded-[50px] h-full max-h-full overflow-hidden">
          <div className="relative scale-95 flex items-center justify-center">
            <SnakeGame />
          </div>
        </section>

        {/* Sensory Sidebar */}
        <aside className="flex flex-col gap-6 h-full justify-center py-2 overflow-hidden">
          {/* Audio Interface */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-2 bg-white/60 backdrop-blur-xl rounded-[30px] border border-white shadow-sm shrink-0"
          >
            <div className="py-8">
              <MusicPlayer />
            </div>
          </motion.div>

          {/* Metrics Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-[30px] bg-white/40 backdrop-blur-xl border border-white shadow-sm flex-1 flex flex-col min-h-0"
          >
            <h4 className="text-xs font-sans tracking-[0.4em] text-black uppercase mb-4 pb-2 border-b border-black/5 flex justify-between font-black shrink-0">
              Biometrics
              <Activity size={14} className="text-coquette-rose" />
            </h4>
            
            <div className="space-y-6 font-serif italic text-black/60 overflow-y-auto no-scrollbar py-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest leading-tight">
                  <span className="font-bold">Fluidity</span>
                  <span>92%</span>
                </div>
                <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="h-full bg-coquette-rose" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest leading-tight">
                  <span className="font-bold">Grace Index</span>
                  <span>9.8/10</span>
                </div>
                <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    className="h-full bg-coquette-gold" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                <div className="flex justify-between text-[10px] uppercase tracking-widest leading-tight items-baseline">
                  <span className="font-bold">Tempo State</span>
                  <span className="text-xs text-black font-black">Allegro</span>
                </div>
                <p className="text-[9px] text-black/30 font-sans uppercase tracking-[0.3em] font-medium leading-relaxed">
                  The current cadence is synchronized with neuronal output.
                </p>
              </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="px-12 py-3 border-t border-black/5 font-serif italic text-xs text-black/20 flex justify-between shrink-0">
        <span>© MCMXXVI Whimsical Studio</span>
        <div className="flex gap-6 font-sans not-italic text-[9px] tracking-[0.3em] uppercase font-bold text-black/10">
          <span>Refinement: 1.0.0</span>
          <span>System Cache: Optimal</span>
        </div>
      </footer>
    </div>
  );
}

