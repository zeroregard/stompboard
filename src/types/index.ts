export interface Pedal {
  name: string;
  manufacturer: string;
  type: PedalType;
  milliAmps: number;
  voltage: number;
  imageUrl: string;
  price?: number;
  description: string;
  controls: string[];
  dimensions?: string;
  weight?: string;
  bypass?: string;
  year?: number;
  slug: string; // URL-friendly version of the name
}

export type PedalType = 
  | 'fuzz'
  | 'distortion' 
  | 'overdrive'
  | 'reverb'
  | 'delay'
  | 'chorus'
  | 'phaser'
  | 'flanger'
  | 'compressor'
  | 'boost'
  | 'eq'
  | 'filter'
  | 'octave'
  | 'tremolo'
  | 'looper'
  | 'other';

export interface PedalSearchResult {
  name: string;
  manufacturer: string;
  imageUrl: string;
  description: string;
  type: string;
} 