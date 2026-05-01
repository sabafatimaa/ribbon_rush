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
    <div className="min-h-screen bg-cyber-black text-white relative overflow-hidden flex flex-col font-sans scanlines">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden blur-[80px] opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.15)_0,transparent_70%)]" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-noise" />

      {/* Header */}
      <header className="relative z-10 px-10 py-8 flex justify-between items-start border-b border-white/10 backdrop-blur-md">
        <div className="flex gap-6 items-center">
          <motion.div 
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-white text-black flex items-center justify-center border-4 border-neon-cyan neon-shadow-cyan"
          >
            <Cpu size={28} />
          </motion.div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-[-0.1em] italic text-neon-magenta neon-text-magenta leading-none">
              NEON_PULSE.exe
            </h1>
            <p className="text-[12px] font-mono tracking-[0.4em] text-neon-cyan mt-2">
              STATUS: [FRAGMENTED_REALITY_STABLE]
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-3 font-mono text-[10px] tracking-widest text-white/30">
          <div className="flex items-center gap-3">
            <span className="text-neon-cyan border border-neon-cyan/20 px-2 py-0.5">CORE_01: ONLINE</span>
            <span className="animate-pulse">_</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neon-magenta border border-neon-magenta/20 px-2 py-0.5">BUFFER: 1024KB</span>
            <Activity size={14} className="text-neon-magenta" />
          </div>
        </div>
      </header>

      {/* Main Grid Interface */}
      <main className="flex-1 relative z-10 grid lg:grid-cols-[1fr_400px] gap-12 p-10 max-w-[1600px] mx-auto w-full">
        {/* Primary Simulation Window */}
        <section className="flex flex-col items-center justify-center relative p-8 border-4 border-white/5 bg-black/40">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            SIMULATION_TARGET: SNAKE_03
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
            <div className="w-2 h-2 bg-neon-magenta rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <SnakeGame />
          </motion.div>
          
          <div className="mt-8 border-t border-white/10 pt-4 w-full flex justify-between text-[10px] font-mono text-white/20 italic">
            <span>[CRITICAL_ERROR_LOG: NONE]</span>
            <span>OS_REVISION: B7-X99</span>
          </div>
        </section>

        {/* Neural Audio & Data Sidebar */}
        <aside className="flex flex-col gap-10">
          {/* Audio Interface */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-1 bg-white/5 backdrop-blur-xl border-l-[10px] border-neon-cyan"
          >
            <div className="bg-black/60 p-6">
              <div className="mb-4 text-[11px] font-mono text-neon-cyan flex items-center gap-2 uppercase tracking-widest">
                <Volume2 size={14} /> AUDIO_SYNC_LINK
              </div>
              <MusicPlayer />
            </div>
          </motion.div>

          {/* Logic Modules */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 p-6 border-l-[10px] border-neon-magenta bg-white/5 backdrop-blur-xl group"
          >
            <div className="glitch-overlay opacity-0 group-hover:opacity-20 transition-opacity" />
            
            <h4 className="text-[12px] font-mono tracking-[0.3em] text-white uppercase mb-8 pb-2 border-b border-white/10 flex justify-between">
              DATA_STACK 
              <Zap size={14} className="text-neon-yellow" />
            </h4>
            
            <div className="space-y-8 font-mono">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-white/40 uppercase">
                  <span>Memory_Buffer</span>
                  <span>78%</span>
                </div>
                <div className="h-2 bg-white/5 border border-white/10 p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    className="h-full bg-neon-cyan" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-white/40 uppercase">
                  <span>Logic_Integrity</span>
                  <span>Verified</span>
                </div>
                <div className="h-2 bg-white/5 border border-white/10 p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-neon-magenta shadow-[0_0_10px_rgba(255,0,255,0.5)]" 
                  />
                </div>
              </div>

              <div className="mt-12 text-[11px] leading-relaxed text-neon-cyan/40 p-4 border border-neon-cyan/10 bg-neon-cyan/5">
                // SYSTEM_MESSAGE: <br />
                PRIORITY_ALERT: THE GRID IS FOLDING. <br />
                MAINTAIN_SYNC_AT_ALL_COSTS.
              </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Terminal Footer */}
      <footer className="mt-auto px-10 py-6 border-t border-white/5 font-mono text-[10px] tracking-widest text-white/10 flex justify-between uppercase">
        <span>©2026_NEURAL_RECORDS_INC</span>
        <div className="flex gap-8">
          <span>IP_67.44.21.XX</span>
          <span className="text-white/20">EST_TIME: 08:18:44</span>
        </div>
      </footer>
    </div>
  );
}

