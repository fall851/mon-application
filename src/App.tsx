import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoStage } from './components/VideoStage';
import { ControlDeck } from './components/ControlDeck';
import { ExportModal } from './components/ExportModal';
import { SONG_PRESETS } from './data/presets';
import {
  StudioConfig,
  SongPreset,
  LyricLine,
  AspectRatio,
} from './types';
import { NurseryAudioEngine } from './services/audioEngine';
import {
  getResolutionForAspectRatio,
  renderStageFrame,
} from './services/videoRenderer';
import { BrowserVideoRecorder } from './services/videoRecorder';
import heroBannerImg from './assets/images/kids_song_hero_banner_1790371793947.jpg';
import mouseMascotImg from './assets/images/mascot_green_mouse_1790371804745.jpg';
import crocoMascotImg from './assets/images/mascot_friendly_croco_1790371816031.jpg';

const DEFAULT_SONG = SONG_PRESETS[0];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioEngineRef = useRef<NurseryAudioEngine | null>(null);
  const recorderRef = useRef<BrowserVideoRecorder | null>(null);

  // Studio configuration state
  const [config, setConfig] = useState<StudioConfig>({
    selectedSongId: DEFAULT_SONG.id,
    title: DEFAULT_SONG.title,
    dedication: 'Pour les p\'tits loups 🎈',
    showDedication: true,
    scene: DEFAULT_SONG.defaultScene,
    mascot: DEFAULT_SONG.defaultMascot,
    mascotScale: 1.0,
    mascotX: 0.5,
    mascotY: 0.55,
    instrument: DEFAULT_SONG.defaultInstrument,
    bpm: DEFAULT_SONG.bpm,
    volume: 0.85,
    aspectRatio: '16:9',
    showBouncingBall: true,
    lyricTheme: 'rainbow',
    particlesEnabled: true,
    audioMode: 'synth',
  });

  const [currentLyrics, setCurrentLyrics] = useState<LyricLine[]>(DEFAULT_SONG.lyrics);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(DEFAULT_SONG.duration);
  const [activeTab, setActiveTab] = useState('songs');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [mascotAction, setMascotAction] = useState<'idle' | 'wave' | 'spin' | 'jump'>('idle');

  // Export states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportRemaining, setExportRemaining] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedVideoBlob, setExportedVideoBlob] = useState<Blob | null>(null);

  // Initialize audio engine
  useEffect(() => {
    const engine = new NurseryAudioEngine();
    audioEngineRef.current = engine;
    recorderRef.current = new BrowserVideoRecorder();

    engine.onTimeUpdate((time, totalDur) => {
      setCurrentTime(time);
      if (totalDur > 0) setDuration(totalDur);
    });

    engine.onEnded(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      engine.stop();
    };
  }, []);

  // Update canvas resolution whenever aspect ratio changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = getResolutionForAspectRatio(config.aspectRatio);
    canvas.width = width;
    canvas.height = height;
  }, [config.aspectRatio]);

  // Main 60 FPS animation render loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // If not playing via synth or custom audio, time is currentTime state
        const timeToRender = audioEngineRef.current?.getCurrentTime() ?? currentTime;

        renderStageFrame({
          canvas,
          config,
          lyrics: currentLyrics,
          currentTime: timeToRender,
          mascotAction,
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [config, currentLyrics, currentTime, mascotAction]);

  // Handle Play / Pause toggle
  const handlePlayPause = useCallback(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.pause();
      setIsPlaying(false);
    } else {
      if (config.audioMode === 'custom' && engine.hasCustomAudio()) {
        engine.playCustomBuffer(currentTime);
      } else {
        const song = SONG_PRESETS.find((s) => s.id === config.selectedSongId) || DEFAULT_SONG;
        engine.playMelody(song.melody, config.bpm, config.instrument, currentTime, true);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, config, currentTime]);

  // Handle Restart
  const handleRestart = useCallback(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;
    engine.stop();
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  // Handle Seek
  const handleSeek = useCallback(
    (time: number) => {
      const engine = audioEngineRef.current;
      if (!engine) return;
      setCurrentTime(time);

      if (isPlaying) {
        if (config.audioMode === 'custom' && engine.hasCustomAudio()) {
          engine.playCustomBuffer(time);
        } else {
          const song = SONG_PRESETS.find((s) => s.id === config.selectedSongId) || DEFAULT_SONG;
          engine.playMelody(song.melody, config.bpm, config.instrument, time, true);
        }
      }
    },
    [isPlaying, config]
  );

  // Handle Song selection
  const handleSongSelect = (songId: string) => {
    const song = SONG_PRESETS.find((s) => s.id === songId);
    if (!song) return;

    if (isPlaying && audioEngineRef.current) {
      audioEngineRef.current.stop();
      setIsPlaying(false);
    }

    setConfig((prev) => ({
      ...prev,
      selectedSongId: song.id,
      title: song.title,
      scene: song.defaultScene,
      mascot: song.defaultMascot,
      instrument: song.defaultInstrument,
      bpm: song.bpm,
      audioMode: 'synth',
    }));

    setCurrentLyrics(song.lyrics);
    setCurrentTime(0);
    setDuration(song.duration);
  };

  // Reset to default
  const handleResetDefault = () => {
    handleSongSelect('souris_verte');
  };

  // Trigger temporary mascot action
  const handleTriggerMascotAction = (action: 'idle' | 'wave' | 'spin' | 'jump') => {
    setMascotAction(action);
    setTimeout(() => {
      setMascotAction('idle');
    }, 1800);
  };

  // Audio Upload
  const handleUploadAudio = async (file: File) => {
    if (!audioEngineRef.current) return;
    try {
      const dur = await audioEngineRef.current.loadAudioFile(file);
      setConfig((prev) => ({ ...prev, audioMode: 'custom' }));
      setDuration(dur);
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (err) {
      console.error('Audio upload failed:', err);
    }
  };

  // Mic Recording
  const handleStartMicRecord = async () => {
    if (!audioEngineRef.current) return;
    try {
      await audioEngineRef.current.startMicRecording();
      setIsRecordingMic(true);
    } catch (err) {
      console.error('Mic recording error:', err);
    }
  };

  const handleStopMicRecord = async () => {
    if (!audioEngineRef.current) return;
    try {
      const { duration: recDur } = await audioEngineRef.current.stopMicRecording();
      setIsRecordingMic(false);
      setConfig((prev) => ({ ...prev, audioMode: 'custom' }));
      setDuration(recDur);
      setCurrentTime(0);
    } catch (err) {
      console.error('Stop mic error:', err);
      setIsRecordingMic(false);
    }
  };

  // Start Video Export
  const handleStartExport = async () => {
    const canvas = canvasRef.current;
    const engine = audioEngineRef.current;
    const recorder = recorderRef.current;

    if (!canvas || !engine || !recorder) return;

    // Reset playback
    engine.stop();
    setCurrentTime(0);
    setIsPlaying(false);

    setIsExporting(true);
    setExportProgress(0);
    setExportRemaining(Math.ceil(duration));
    setExportedVideoUrl(null);
    setExportedVideoBlob(null);

    // Start playing audio from 0
    if (config.audioMode === 'custom' && engine.hasCustomAudio()) {
      engine.playCustomBuffer(0);
    } else {
      const song = SONG_PRESETS.find((s) => s.id === config.selectedSongId) || DEFAULT_SONG;
      engine.playMelody(song.melody, config.bpm, config.instrument, 0, true);
    }
    setIsPlaying(true);

    try {
      const { blob, url } = await recorder.startRecording({
        canvas,
        audioStream: engine.getAudioStream(),
        duration,
        onProgress: (prog, remaining) => {
          setExportProgress(prog);
          setExportRemaining(remaining);
        },
      });

      engine.stop();
      setIsPlaying(false);
      setCurrentTime(0);

      setIsExporting(false);
      setExportedVideoBlob(blob);
      setExportedVideoUrl(url);
    } catch (err) {
      console.error('Video recording failed:', err);
      engine.stop();
      setIsPlaying(false);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setExportModalOpen(true)}
        onResetDefault={handleResetDefault}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Whimsical Hero Banner with Generated Storybook Artwork */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 text-white shadow-sm p-6 md:p-8">
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <span>🎈 Studio Vidéo Enfantin</span>
              <span>·</span>
              <span>Karaoké 60 FPS</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display drop-shadow-xs">
              Créez des Vidéos de Chansons & Comptines pour Enfants
            </h1>

            <p className="text-sm md:text-base text-white/95 leading-relaxed font-medium">
              Choisissez votre comptine préférée ou composez la vôtre, personnalisez la mascotte dansante et le décor, et téléchargez une vidéo prête pour YouTube Kids, la télé ou la famille.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-white/90">
              <span className="flex items-center gap-1">✨ Étoile rebondissante synchronisée</span>
              <span>·</span>
              <span className="flex items-center gap-1">🐭 Mascottes vectorielles animées</span>
              <span>·</span>
              <span className="flex items-center gap-1">🎥 Export WebM / MP4 instantané</span>
            </div>
          </div>

          {/* Storybook Hero Art Illustration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-40 mix-blend-overlay pointer-events-none">
            <img
              src={heroBannerImg}
              alt="Comptines pour enfants"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 2-Zone Studio Sandbox Layout: Left (Interactive Stage 60%) / Right (Control Deck 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Video Stage */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            <VideoStage
              canvasRef={canvasRef}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              aspectRatio={config.aspectRatio}
              volume={config.volume}
              onPlayPause={handlePlayPause}
              onRestart={handleRestart}
              onSeek={handleSeek}
              onVolumeChange={(vol) => {
                setConfig((prev) => ({ ...prev, volume: vol }));
                audioEngineRef.current?.setVolume(vol);
              }}
              onAspectRatioChange={(ratio) => setConfig((prev) => ({ ...prev, aspectRatio: ratio }))}
              onTriggerMascotAction={handleTriggerMascotAction}
            />

            {/* Quick Tips & Mascot Avatars */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={mouseMascotImg}
                  alt="Souris Verte"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Mascotte active : {config.mascot === 'souris' ? 'Souris Verte' : config.mascot === 'crocodile' ? 'Crocodile Rigolo' : 'Ami des enfants'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Ouvre la bouche quand les paroles sont actives et sautille au tempo de {config.bpm} BPM.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExportModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Exporter la Vidéo
              </button>
            </div>
          </div>

          {/* Right Zone: Control & Concept Deck */}
          <div className="lg:col-span-5 xl:col-span-4 min-h-[580px]">
            <ControlDeck
              config={config}
              songs={SONG_PRESETS}
              currentLyrics={currentLyrics}
              onConfigChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              onSongSelect={handleSongSelect}
              onLyricsChange={setCurrentLyrics}
              onUploadAudio={handleUploadAudio}
              onStartMicRecord={handleStartMicRecord}
              onStopMicRecord={handleStopMicRecord}
              isRecordingMic={isRecordingMic}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTriggerMascotAction={handleTriggerMascotAction}
            />
          </div>
        </div>
      </main>

      {/* Export Modal with progress, preview player, and direct download */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        isExporting={isExporting}
        progress={exportProgress}
        remainingSeconds={exportRemaining}
        videoUrl={exportedVideoUrl}
        videoBlob={exportedVideoBlob}
        aspectRatio={config.aspectRatio}
        songTitle={config.title}
        onStartExport={handleStartExport}
      />
    </div>
  );
}
