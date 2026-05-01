import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Point, GameStatus } from '../types';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

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
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('IDLE');
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAMEOVER');
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, score, highScore, generateFood]);

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
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  return (
    <div className="flex flex-col items-center gap-6" id="snake-game-container">
      {/* HUD */}
      <div className="flex gap-12 items-center bg-black/80 backdrop-blur-md px-12 py-5 rounded-none border-2 border-white/20 relative group shadow-[0_0_50px_rgba(0,0,0,1)]">
        <div className="glitch-overlay opacity-10 group-hover:opacity-30 transition-opacity" />
        
        <div className="flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-mono mb-2">SCORE_VALUE</span>
            <span className="text-6xl font-black text-neon-cyan neon-text-cyan font-mono tabular-nums tracking-tighter leading-none">
              {score.toString().padStart(3, '0')}
            </span>
        </div>
        
        <div className="w-[2px] h-16 bg-white/10" />
        
        <div className="flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-mono mb-2">MAX_INTEGRITY</span>
            <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-neon-magenta neon-text-magenta font-mono tabular-nums leading-none">
                  {highScore.toString().padStart(3, '0')}
                </span>
            </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div 
          className="grid gap-[1px] bg-white/5 p-1 rounded-xl border border-white/20 shadow-2xl overflow-hidden relative"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            aspectRatio: '1/1'
          }}
        >
          {/* Grid background effect */}
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i}
                className="relative w-full h-full rounded-[2px]"
                id={`cell-${x}-${y}`}
              >
                {isSnake && (
                  <motion.div 
                    layoutId={`snake-${isHead ? 'head' : i}`}
                    className={`absolute inset-0 rounded-[2px] ${isHead ? 'bg-neon-cyan neon-shadow-cyan z-10' : 'bg-neon-cyan/30'}`}
                    style={{
                      opacity: isHead ? 1 : Math.max(0.2, 1 - (snake.findIndex(s => s.x === x && s.y === y) / snake.length)),
                      boxShadow: isHead 
                        ? '0 0 20px #00f2ff, 0 0 40px #00f2ff' 
                        : `0 0 ${Math.max(5, 15 - snake.findIndex(s => s.x === x && s.y === y))}px rgba(0, 242, 255, 0.4)`
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  />
                )}
                {isFood && (
                  <motion.div 
                    className="absolute inset-[20%] bg-neon-magenta neon-shadow-magenta rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Overlay States */}
        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-sm bg-black/60 rounded-xl flex flex-col items-center justify-center z-20 gap-6"
            >
              {status === 'IDLE' && (
                <button 
                  onClick={() => setStatus('PLAYING')}
                  className="group relative flex items-center gap-3 px-8 py-4 bg-neon-cyan text-black font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all cursor-pointer"
                >
                  <Play fill="black" size={20} />
                  Start Game
                  <div className="absolute inset-0 rounded-full blur-xl bg-neon-cyan/50 group-hover:bg-neon-cyan/80 transition-all -z-10" />
                </button>
              )}

              {status === 'PAUSED' && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Paused</h2>
                  <button 
                    onClick={() => setStatus('PLAYING')}
                    className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors uppercase text-sm font-bold tracking-widest"
                  >
                    <Play size={16} /> Resume
                  </button>
                </div>
              )}

              {status === 'GAMEOVER' && (
                <div className="flex flex-col items-center gap-6">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-center"
                  >
                    <h2 className="text-6xl font-black text-neon-magenta neon-text-magenta italic uppercase tracking-tighter mb-2">Game Over</h2>
                    <p className="text-white/60 font-mono text-sm uppercase tracking-[0.3em]">Final Score: {score}</p>
                  </motion.div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-3 px-8 py-3 border-2 border-white text-white font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    <RefreshCcw size={20} /> Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="flex gap-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono">
        <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 border border-white/10 rounded">Arrows</span>
            Move
        </div>
        <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 border border-white/10 rounded">Space</span>
            Pause
        </div>
      </div>
    </div>
  );
}
