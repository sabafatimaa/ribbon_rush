export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  color: string;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface Point {
  x: number;
  y: number;
}
