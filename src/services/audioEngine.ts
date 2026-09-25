import { InstrumentId, NoteItem } from '../types';

// Musical frequencies map
const NOTE_FREQS: Record<string, number> = {
  G3: 196.00,
  A3: 220.00,
  B3: 246.94,
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.00,
  'G#4': 415.30,
  A4: 440.00,
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  'D#5': 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  A5: 880.00,
  REST: 0,
};

export class NurseryAudioEngine {
  private ctx: AudioContext | null = null;
  private streamDest: MediaStreamAudioDestinationNode | null = null;
  private masterGain: GainNode | null = null;

  private isPlaying = false;
  private isPaused = false;
  private playbackStartTime = 0;
  private pauseOffset = 0;
  private totalDuration = 0;

  // Custom audio buffer if user uploaded MP3 or recorded mic
  private customBuffer: AudioBuffer | null = null;
  private customSourceNode: AudioBufferSourceNode | null = null;

  // Scheduled nodes for synth
  private scheduledNodes: { stop: (time: number) => void }[] = [];

  // Mic recording state
  private mediaRecorder: MediaRecorder | null = null;
  private micChunks: Blob[] = [];

  private timerInterval: number | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.streamDest = this.ctx.createMediaStreamDestination();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Connect master gain both to speakers and to media stream (for video recorder!)
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.streamDest);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioStream(): MediaStream | null {
    this.initContext();
    return this.streamDest?.stream || null;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const safe = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setValueAtTime(safe, this.ctx.currentTime);
    }
  }

  public onTimeUpdate(cb: (time: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  public getCurrentTime(): number {
    if (!this.isPlaying) return this.pauseOffset;
    if (this.isPaused) return this.pauseOffset;
    if (!this.ctx) return 0;
    return Math.min(this.totalDuration, this.ctx.currentTime - this.playbackStartTime);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Play synthesizer melody
   */
  public playMelody(
    melody: NoteItem[],
    bpm: number,
    instrument: InstrumentId,
    startOffset = 0,
    rhythmAccompaniment = true
  ) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();

    this.isPlaying = true;
    this.isPaused = false;
    this.pauseOffset = startOffset;
    this.playbackStartTime = this.ctx.currentTime - startOffset;

    const secondsPerBeat = 60 / bpm;
    let accumulatedTime = 0;

    // Calculate total duration
    this.totalDuration = melody.reduce((acc, n) => acc + n.duration * secondsPerBeat, 0);

    const now = this.ctx.currentTime;
    const startAudioTime = now - startOffset;

    // Schedule each note
    melody.forEach((note) => {
      const noteDuration = note.duration * secondsPerBeat;
      const noteStartTime = startAudioTime + accumulatedTime;

      // Only schedule if in future or within active window
      if (noteStartTime + noteDuration >= now) {
        if (note.pitch !== 'REST') {
          const freq = NOTE_FREQS[note.pitch] || 440;
          this.scheduleInstrumentNote(instrument, freq, Math.max(now, noteStartTime), noteDuration);
        }
      }

      // Schedule soft rhythmic beat
      if (rhythmAccompaniment && noteStartTime >= now) {
        this.scheduleBeatTick(noteStartTime);
      }

      accumulatedTime += noteDuration;
    });

    this.startTracking();
  }

  /**
   * Synthesize individual notes per instrument
   */
  private scheduleInstrumentNote(
    instrument: InstrumentId,
    freq: number,
    startTime: number,
    duration: number
  ) {
    if (!this.ctx || !this.masterGain) return;

    const noteGain = this.ctx.createGain();
    noteGain.connect(this.masterGain);

    if (instrument === 'glockenspiel') {
      // Glockenspiel: clear bright sine + overtone bell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 2.76, startTime); // metallic overtone

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.55, startTime + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration * 1.5, 1.8));

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + 1.9);
      osc2.stop(startTime + 1.9);

      this.scheduledNodes.push(osc1, osc2);
    } else if (instrument === 'musicbox') {
      // Music Box: sweet bell with high chime and subtle harmonic
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.45, startTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration * 1.8, 2.2));

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + 2.3);
      osc2.stop(startTime + 2.3);

      this.scheduledNodes.push(osc1, osc2);
    } else if (instrument === 'xylophone') {
      // Xylophone / Marimba: wood percussion strike with fast attack and warm woody decay
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Wood click transient
      const click = this.ctx.createOscillator();
      click.type = 'square';
      click.frequency.setValueAtTime(freq * 4, startTime);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.2, startTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);
      click.connect(clickGain);
      clickGain.connect(noteGain);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.008);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration * 0.9, 0.7));

      osc.connect(noteGain);
      osc.start(startTime);
      click.start(startTime);
      osc.stop(startTime + 0.8);
      click.stop(startTime + 0.05);

      this.scheduledNodes.push(osc, click);
    } else if (instrument === 'celesta') {
      // Celesta: ethereal shimmering chime with warm vibrato
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 3, startTime); // 3rd harmonic

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.5, startTime + 0.025);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration * 2.2, 2.5));

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + 2.6);
      osc2.stop(startTime + 2.6);

      this.scheduledNodes.push(osc1, osc2);
    } else {
      // Toy Piano: cheerful retro blend of triangle and square
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.5, startTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration * 1.2, 1.2));

      osc.connect(noteGain);
      osc.start(startTime);
      osc.stop(startTime + 1.3);

      this.scheduledNodes.push(osc);
    }
  }

  /**
   * Subtle woodblock / percussive tick on beat to keep children engaged
   */
  private scheduleBeatTick(startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, startTime);
    osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.04);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
    this.scheduledNodes.push(osc);
  }

  /**
   * Play custom loaded or recorded audio buffer
   */
  public playCustomBuffer(startOffset = 0) {
    if (!this.customBuffer) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();

    this.isPlaying = true;
    this.isPaused = false;
    this.pauseOffset = startOffset;
    this.totalDuration = this.customBuffer.duration;
    this.playbackStartTime = this.ctx.currentTime - startOffset;

    const source = this.ctx.createBufferSource();
    source.buffer = this.customBuffer;
    source.connect(this.masterGain);
    source.start(0, startOffset);

    this.customSourceNode = source;
    this.startTracking();
  }

  public pause() {
    if (!this.isPlaying || this.isPaused) return;
    this.pauseOffset = this.getCurrentTime();
    this.isPaused = true;
    this.isPlaying = false;
    this.clearScheduledNodes();
    if (this.customSourceNode) {
      try {
        this.customSourceNode.stop();
      } catch {
        // ignore
      }
      this.customSourceNode = null;
    }
    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.pauseOffset = 0;
    this.clearScheduledNodes();

    if (this.customSourceNode) {
      try {
        this.customSourceNode.stop();
      } catch {
        // ignore
      }
      this.customSourceNode = null;
    }

    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, this.totalDuration);
    }
  }

  private clearScheduledNodes() {
    this.scheduledNodes.forEach((node) => {
      try {
        node.stop(0);
      } catch {
        // ignore
      }
    });
    this.scheduledNodes = [];
  }

  private startTracking() {
    if (this.timerInterval) window.clearInterval(this.timerInterval);

    this.timerInterval = window.setInterval(() => {
      const current = this.getCurrentTime();

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(current, this.totalDuration);
      }

      if (current >= this.totalDuration - 0.05) {
        this.stop();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    }, 40);
  }

  /**
   * Load an audio file (MP3 / WAV / OGG) from an ArrayBuffer or File
   */
  public async loadAudioFile(file: File): Promise<number> {
    this.initContext();
    if (!this.ctx) throw new Error('AudioContext not ready');

    const arrayBuffer = await file.arrayBuffer();
    const decoded = await this.ctx.decodeAudioData(arrayBuffer);
    this.customBuffer = decoded;
    this.totalDuration = decoded.duration;
    return decoded.duration;
  }

  /**
   * Microphone Recording features
   */
  public async startMicRecording(): Promise<void> {
    this.micChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.micChunks.push(e.data);
      }
    };

    this.mediaRecorder.start();
  }

  public async stopMicRecording(): Promise<{ blob: Blob; duration: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recorder'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.micChunks, { type: 'audio/webm' });
        // Stop all mic tracks
        this.mediaRecorder?.stream.getTracks().forEach((t) => t.stop());

        this.initContext();
        if (this.ctx) {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const decoded = await this.ctx.decodeAudioData(arrayBuffer);
          this.customBuffer = decoded;
          this.totalDuration = decoded.duration;
          resolve({ blob: audioBlob, duration: decoded.duration });
        } else {
          resolve({ blob: audioBlob, duration: 0 });
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public hasCustomAudio(): boolean {
    return this.customBuffer !== null;
  }
}
