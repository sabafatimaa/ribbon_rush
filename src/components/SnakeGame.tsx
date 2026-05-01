import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause, Heart, Gift, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Crown } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Point, GameStatus } from '../types';
import { neuralSynth } from '../services/neuralSynth';

function ControlButton({ icon, onClick, className = "" }: { icon: React.ReactNode, onClick: () => void, className?: string }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-black/10 shadow-lg active:scale-90 transition-transform cursor-pointer text-black/80 hover:text-black ${className}`}
    >
      {icon}
    </button>
  );
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const nextDirectionsRef = useRef<Point[]>([]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [bonusFood, setBonusFood] = useState<Point | null>(null);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState<{ point: Point; text: string; id: number } | null>(null);
  const celebrationIdRef = useRef(0);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCelebration = useCallback((point: Point, text: string) => {
    const id = ++celebrationIdRef.current;
    setCelebration({ point, text, id });
    setTimeout(() => {
      setCelebration(curr => curr?.id === id ? null : curr);
    }, 1000);
  }, []);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionsRef.current = [];
    setFood(generateFood(INITIAL_SNAKE));
    setBonusFood(null);
    setScore(0);
    setStatus('IDLE');
  };

  const handleDirectionChange = (newDir: Point) => {
    if (status !== 'PLAYING') return;
    const lastInQueue = nextDirectionsRef.current[nextDirectionsRef.current.length - 1] || direction;
    // Prevent 180 degree turns
    if (newDir.x !== 0 && lastInQueue.x === 0 && nextDirectionsRef.current.length < 2) {
      nextDirectionsRef.current.push(newDir);
    } else if (newDir.y !== 0 && lastInQueue.y === 0 && nextDirectionsRef.current.length < 2) {
      nextDirectionsRef.current.push(newDir);
    }
  };

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    setSnake((prevSnake) => {
      let nextDir = direction;
      if (nextDirectionsRef.current.length > 0) {
        nextDir = nextDirectionsRef.current.shift()!;
        setDirection(nextDir);
      }

      const head = prevSnake[0];
      const newHead = {
        x: (head.x + nextDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDir.y + GRID_SIZE) % GRID_SIZE,
      };

      const ateFood = newHead.x === food.x && newHead.y === food.y;
      const ateBonus = bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y;

      const bodyCollision = prevSnake.some((segment, index) => {
        if (ateFood || ateBonus) return segment.x === newHead.x && segment.y === newHead.y;
        return index !== prevSnake.length - 1 && segment.x === newHead.x && segment.y === newHead.y;
      });

      if (bodyCollision) {
        setStatus('GAMEOVER');
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (ateFood) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        neuralSynth.playFoodSound();
        triggerCelebration(newHead, "+10");
        if (Math.random() > 0.8) {
           setBonusFood(generateFood(newSnake));
        }
      } else if (ateBonus) {
        setScore((s) => s + 30);
        setBonusFood(null);
        neuralSynth.playFoodSound();
        triggerCelebration(newHead, "Grace! +30");
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, bonusFood, score, highScore, generateFood, status]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING' && status !== 'PAUSED') return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleDirectionChange({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  const [showProtocol, setShowProtocol] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 shrink-0" id="snake-game-container">
      {/* Refined Score HUD */}
      <div className="flex gap-10 items-center bg-white/80 backdrop-blur-md px-10 py-4 rounded-[24px] border border-black/5 relative group shadow-sm shrink-0">
        <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-sans mb-1.5 font-medium italic">Refined Score</span>
            <span className="text-3xl font-serif italic text-black leading-none font-light tracking-widest">
              {score.toString().padStart(2, '0')}
            </span>
        </div>
        
        <div className="w-[1px] h-10 bg-black/5" />
        
        <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-sans mb-1.5 font-medium italic">Peak Index</span>
            <div className="flex items-center gap-2">
                <span className="text-3xl font-serif italic text-coquette-gold leading-none font-light tracking-widest">
                  {highScore.toString().padStart(2, '0')}
                </span>
            </div>
        </div>
      </div>

      {/* Garden Game Board */}
      <div className="relative group shrink-0">
        <div 
          className="grid gap-[1px] bg-black/5 p-4 rounded-[40px] border border-black/5 shadow-inner overflow-hidden relative bg-white/20 backdrop-blur-sm"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(75vh, 420px)',
            aspectRatio: '1/1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;
            const isBonus = bonusFood?.x === x && bonusFood?.y === y;

            return (
              <div 
                key={i}
                className="relative w-full h-full border border-black/[0.01]"
                id={`cell-${x}-${y}`}
              >
                {isSnake && (
                  <motion.div 
                    className={`absolute inset-[-15%] ${isHead ? 'z-40' : 'z-20'}`}
                    style={{
                      background: isHead ? '#ff0055' : '#c2185b', // Even more vibrant pink/red for head
                      opacity: isHead ? 1 : Math.max(0.4, 1 - (snakeIndex / 25)),
                      scale: isHead ? 1.8 : 1.3,
                      boxShadow: isHead 
                        ? '0 0 25px rgba(255, 0, 85, 0.9), 0 0 50px rgba(255, 0, 85, 0.4)' 
                        : '0 2px 6px rgba(194, 24, 91, 0.3)',
                      border: isHead ? '3px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: isHead ? '20%' : '50%',
                    }}
                    initial={false}
                    animate={isHead ? {
                      scale: [1.8, 2.0, 1.8],
                      boxShadow: [
                        '0 0 20px rgba(255, 0, 85, 0.7)',
                        '0 0 45px rgba(255, 0, 85, 1)',
                        '0 0 20px rgba(255, 0, 85, 0.7)'
                      ]
                    } : {}}
                    transition={isHead ? { duration: 0.8, repeat: Infinity } : { type: "spring", stiffness: 800, damping: 50 }}
                  >
                    {isHead && (
                      <div className="w-full h-full flex flex-col items-center justify-center relative">
                         {/* Eyes that follow direction - sharper and higher contrast */}
                         <div className="absolute flex gap-1.5 transition-transform duration-150"
                           style={{ 
                             transform: direction.y === -1 ? 'translateY(-6px)' : 
                                        direction.y === 1 ? 'translateY(6px)' :
                                        direction.x === -1 ? 'translateX(-6px)' : 'translateX(6px)'
                           }}
                         >
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-md border border-black/10" />
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-md border border-black/10" />
                         </div>
                         <div className="z-10 bg-white/20 p-0.5 rounded-sm backdrop-blur-[2px]">
                            <Crown size={12} fill="white" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                         </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {isFood && (
                  <motion.div 
                    className="absolute inset-0 bg-[#0000ff] rounded-full shadow-[0_0_25px_rgba(48,79,254,1)] z-10 flex items-center justify-center"
                    style={{ 
                      border: '3px solid #fff',
                      background: 'radial-gradient(circle at 30% 30%, #a2b2ff 0%, #0000ff 100%)'
                    }}
                    animate={{ 
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        '0 0 15px rgba(48,79,254,0.5)',
                        '0 0 40px rgba(48,79,254,1)',
                        '0 0 15px rgba(48,79,254,0.5)'
                      ]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles size={12} className="text-white animate-ping" />
                  </motion.div>
                )}
                {isBonus && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center text-coquette-rose drop-shadow-[0_0_8px_rgba(240,98,146,0.6)] z-10"
                    animate={{ rotate: [-10, 10, -10], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Gift size={20} />
                  </motion.div>
                )}
              </div>
            );
          })}
          
          {/* Floating Celebrations */}
          <AnimatePresence>
            {celebration && (
              <motion.div
                key={celebration.id}
                initial={{ opacity: 0, y: celebration.point.y * (100/GRID_SIZE), x: celebration.point.x * (100/GRID_SIZE) }}
                animate={{ opacity: 1, y: celebration.point.y * (100/GRID_SIZE) - 20 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute text-coquette-rose font-serif italic text-[14px] pointer-events-none z-50 whitespace-nowrap"
                style={{ 
                  left: `${(celebration.point.x / GRID_SIZE) * 100}%`,
                  top: `${(celebration.point.y / GRID_SIZE) * 100}%`
                }}
              >
                {celebration.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-[1px] bg-white/20 rounded-[30px] flex flex-col items-center justify-center z-30 gap-6"
              onClick={(e) => {
                e.stopPropagation();
                if (status === 'IDLE' || status === 'PAUSED') setStatus('PLAYING');
              }}
            >
              {status === 'IDLE' && (
                <div className="flex flex-col items-center gap-6">
                  {showProtocol ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/90 p-6 rounded-[20px] border border-black/10 max-w-[260px] space-y-4"
                    >
                      <h3 className="text-lg font-sans tracking-[0.3em] uppercase font-black text-black border-b border-black/5 pb-2">Operation: Protocol</h3>
                      <div className="space-y-4 text-xs font-serif italic text-black/60 leading-relaxed">
                        <p>1. You are the <span className="text-coquette-rose font-bold">Crowned Head</span>. Control it via arrows or buttons.</p>
                        <p>2. Assimilate <span className="text-[#304ffe] font-bold">Blue Pearls</span> to grow. Space wraps around the grid.</p>
                        <p>3. Touching your own tail causes <span className="text-red-500">System Failure</span>.</p>
                      </div>
                      <button 
                        onClick={() => setShowProtocol(false)}
                        className="w-full py-3 bg-black text-[10px] text-white uppercase tracking-widest font-bold rounded-xl transition-all hover:bg-black/90 active:scale-95"
                      >
                        Acknowledge
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex gap-12 items-center mb-4">
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[7px] uppercase tracking-widest text-black/40">You</span>
                           <div className="w-8 h-8 bg-[#ff4081] rounded-[30%] flex items-center justify-center shadow-lg">
                              <Crown size={12} className="text-white" />
                           </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[7px] uppercase tracking-widest text-black/40">Target</span>
                           <div className="w-8 h-8 bg-[#304ffe] rounded-full flex items-center justify-center shadow-lg border border-white">
                              <Sparkles size={12} className="text-white" />
                           </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatus('PLAYING');
                        }}
                        className="group relative flex flex-col items-center gap-4 cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-black/5 soft-shadow group-hover:scale-110 transition-transform">
                           <Play fill="black" size={24} />
                        </div>
                        <span className="text-xs font-sans tracking-[0.4em] text-black/80 uppercase font-black">Begin Sequence</span>
                      </button>
                      
                      <div className="flex flex-col gap-4 items-center mt-2">
                        <p className="text-xs font-serif italic text-black/50 leading-relaxed max-w-[240px] text-center">
                          Assimilate the <span className="text-[#304ffe] font-bold">Blue Pearl</span> to expand the ribbon loop.
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProtocol(true);
                          }}
                          className="px-6 py-2 border border-black/10 rounded-full text-[9px] uppercase tracking-widest font-black hover:bg-black hover:text-white transition-all active:scale-95"
                        >
                          Access Protocol
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {status === 'PAUSED' && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-3xl font-serif italic text-black font-light tracking-tight">Repose</h2>
                  <button 
                    onClick={() => setStatus('PLAYING')}
                    className="group w-14 h-14 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play fill="black" size={20} />
                  </button>
                </div>
              )}

              {status === 'GAMEOVER' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 px-10 text-center"
                >
                  <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <h2 className="text-4xl font-serif italic text-black font-light leading-none">
                      {score > 0 && score === highScore ? 'Peak Grace' : 'The End'}
                    </h2>
                  </motion.div>
                  
                  <div className="space-y-1">
                    <p className="text-black/30 font-sans text-[9px] uppercase tracking-[0.4em]">Final Refinement: {score}</p>
                    {score === highScore && score > 0 && (
                      <p className="text-coquette-gold font-serif italic text-[11px]">A new peak of elegance reached.</p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={resetGame}
                      className="group flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-coquette-gold transition-colors cursor-pointer rounded-full shadow-lg active:scale-95"
                    >
                      <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em]">Restart</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* On-Screen Touch Controls */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <ControlButton icon={<ChevronUp size={20} />} onClick={() => handleDirectionChange({ x: 0, y: -1 })} />
        <div className="flex gap-10">
          <ControlButton icon={<ChevronLeft size={20} />} onClick={() => handleDirectionChange({ x: -1, y: 0 })} />
          <ControlButton icon={<ChevronRight size={20} />} onClick={() => handleDirectionChange({ x: 1, y: 0 })} />
        </div>
        <ControlButton icon={<ChevronDown size={20} />} onClick={() => handleDirectionChange({ x: 0, y: 1 })} />
      </div>

      {/* Manual Controls Help */}
      <div className="flex items-center gap-6 mt-1">
        <span className="text-[8px] text-black/20 uppercase tracking-[0.3em] font-sans font-bold italic">Arrow Keys or Buttons to Move</span>
        <button 
          onClick={() => setStatus('PAUSED')}
          className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center border border-black/5 hover:bg-white transition-colors cursor-pointer"
        >
          <Pause size={10} fill="black" />
        </button>
      </div>
    </div>
  );
}
