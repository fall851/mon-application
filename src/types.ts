export type AspectRatio = '16:9' | '9:16' | '1:1';

export type SceneId = 'meadow' | 'space' | 'underwater' | 'forest' | 'party';

export type MascotId = 'souris' | 'crocodile' | 'escargot' | 'etoile' | 'ourson' | 'caneton' | 'tortue';

export type InstrumentId = 'glockenspiel' | 'musicbox' | 'xylophone' | 'celesta' | 'toypiano';

export type LyricThemeId = 'rainbow' | 'gold' | 'candy' | 'neon' | 'ocean';

export interface NoteItem {
  pitch: string; // e.g. "C4", "D4", "E4", "G4", "REST"
  duration: number; // in beats (e.g. 1 = quarter note, 0.5 = eighth note)
}

export interface LyricWord {
  word: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
  words: LyricWord[];
}

export interface SongPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  defaultScene: SceneId;
  defaultMascot: MascotId;
  defaultInstrument: InstrumentId;
  bpm: number;
  duration: number; // seconds
  melody: NoteItem[];
  lyrics: LyricLine[];
}

export interface StudioConfig {
  selectedSongId: string;
  title: string;
  dedication: string;
  showDedication: boolean;
  scene: SceneId;
  mascot: MascotId;
  mascotScale: number; // 0.6 to 1.4
  mascotX: number; // 0.2 to 0.8 (fraction of canvas width)
  mascotY: number; // 0.4 to 0.8
  instrument: InstrumentId;
  bpm: number;
  volume: number; // 0 to 1
  aspectRatio: AspectRatio;
  showBouncingBall: boolean;
  lyricTheme: LyricThemeId;
  particlesEnabled: boolean;
  audioMode: 'synth' | 'custom' | 'mic';
  customAudioUrl?: string;
  customAudioDuration?: number;
}
