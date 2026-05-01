import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Mastermind',
    duration: 184,
    genre: 'Synthwave',
    color: '#00f2ff', // Cyan neon
  },
  {
    id: '2',
    title: 'Digital Pulse',
    artist: 'Neural Beats',
    duration: 212,
    genre: 'Techno',
    color: '#ff00ff', // Magenta neon
  },
  {
    id: '3',
    title: 'Cyber Runner',
    artist: 'Synth Soul',
    duration: 156,
    genre: 'Electro',
    color: '#39ff14', // Green neon
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving Up
export const GAME_SPEED = 150; // Slower cadence for better control
