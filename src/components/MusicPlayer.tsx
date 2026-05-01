import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;

  return (
    <div className="w-full max-w-sm bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden" id="music-player">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-neon-cyan neon-shadow-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="flex items-center gap-6 mt-4">
        {/* Album Art Placeholder */}
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden group"
          style={{ backgroundColor: `${currentTrack.color}22` }}
        >
          <Music2 className="w-10 h-10 text-white/20 group-hover:text-white/40 transition-colors" />
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-20"
            animate={{ 
              background: isPlaying 
                ? [
                    `radial-gradient(circle, ${currentTrack.color} 0%, transparent 70%)`,
                    `radial-gradient(circle, ${currentTrack.color} 30%, transparent 70%)`,
                    `radial-gradient(circle, ${currentTrack.color} 0%, transparent 70%)`
                  ]
                : `radial-gradient(circle, ${currentTrack.color} 0%, transparent 70%)`
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.title}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
            >
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight font-sans">
                {currentTrack.title}
              </h3>
              <p className="text-[12px] text-neon-cyan font-mono tracking-widest uppercase">
                NODE_SRC: {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30 uppercase tracking-[0.2em]">
              {currentTrack.genre}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div className="flex justify-between text-[14px] font-mono text-white/40 tabular-nums tracking-widest">
          <span className="text-neon-cyan">{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-10">
          <button 
            onClick={handlePrev}
            className="p-2 text-white/40 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_#00f2ff] transition-all cursor-pointer group"
            id="prev-btn"
          >
            <SkipBack className="group-active:scale-90 transition-transform" fill="currentColor" size={28} />
          </button>
          
          <button 
            onClick={handleTogglePlay}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-transparent border-2 border-white text-white hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all cursor-pointer relative group overflow-hidden"
            id="play-pause-btn"
          >
            <div className="absolute inset-0 bg-white/5 group-hover:bg-neon-cyan/10 transition-colors" />
            {isPlaying ? (
              <Pause fill="currentColor" size={32} className="relative z-10 drop-shadow-[0_0_10px_currentColor]" />
            ) : (
              <Play className="ml-1 relative z-10 drop-shadow-[0_0_10px_currentColor]" fill="currentColor" size={32} />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 text-white/40 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_#00f2ff] transition-all cursor-pointer group"
            id="next-btn"
          >
            <SkipForward className="group-active:scale-90 transition-transform" fill="currentColor" size={28} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-2 px-4">
          <Volume2 size={14} className="text-white/20" />
          <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
