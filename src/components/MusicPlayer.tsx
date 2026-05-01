import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { neuralSynth } from '../services/neuralSynth';

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

  const handleTogglePlay = async () => {
    if (!isPlaying) {
      await neuralSynth.start();
    } else {
      neuralSynth.stop();
    }
    setIsPlaying(!isPlaying);
  };

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
    <div className="w-full max-w-[320px] mx-auto relative shrink-0" id="music-player">
      <div className="flex flex-col items-center gap-8">
        {/* Record/Vinyl disk feel but coquette */}
        <motion.div 
          key={currentTrack.id}
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 rounded-full flex items-center justify-center relative border-8 border-white p-2.5 bg-coquette-pink/10 shadow-lg"
          style={{ borderColor: currentTrack.color + '44' }}
        >
          <div className="w-full h-full rounded-full border border-black/10 flex items-center justify-center overflow-hidden bg-coquette-cream">
             <Music2 className="w-16 h-16 text-black/10" />
             <div className="absolute inset-6 rounded-full border border-black/5" />
             <div className="absolute inset-14 rounded-full border border-black/5" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white border border-black/10 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-inner" />
        </motion.div>

        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <h3 className="text-xl font-serif italic text-black leading-tight tracking-tight truncate px-4">
                {currentTrack.title}
              </h3>
              <p className="text-xs font-sans tracking-[0.4em] text-black/40 uppercase mt-2 font-bold">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full space-y-3 px-2">
           <div className="h-1.5 bg-black/5 rounded-full overflow-hidden shadow-inner">
             <motion.div 
               className="h-full bg-coquette-gold"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ ease: "linear" }}
             />
           </div>
           <div className="flex justify-between text-[9px] font-mono text-black/30 tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
           </div>
        </div>

        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-black/20 hover:text-coquette-gold hover:scale-110 transition-all cursor-pointer"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={handleTogglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black border border-black/5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            {isPlaying ? (
              <Pause fill="currentColor" size={24} />
            ) : (
              <Play className="ml-1.5" fill="currentColor" size={24} />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="text-black/20 hover:text-coquette-gold hover:scale-110 transition-all cursor-pointer"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
