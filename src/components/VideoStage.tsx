import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Smile,
  Zap,
  Sparkles,
} from 'lucide-react';
import { AspectRatio } from '../types';

interface VideoStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  aspectRatio: AspectRatio;
  volume: number;
  onPlayPause: () => void;
  onRestart: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onTriggerMascotAction: (action: 'idle' | 'wave' | 'spin' | 'jump') => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  canvasRef,
  isPlaying,
  currentTime,
  duration,
  aspectRatio,
  volume,
  onPlayPause,
  onRestart,
  onSeek,
  onVolumeChange,
  onAspectRatioChange,
  onTriggerMascotAction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction * duration);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white"
    >
      {/* Top stage controls bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Format :</span>
          {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                aspectRatio === ratio
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {ratio === '16:9' ? '16:9 Paysage' : ratio === '9:16' ? '9:16 Shorts' : '1:1 Carré'}
            </button>
          ))}
        </div>

        {/* Mascot Quick Action Triggers */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 hidden md:inline">Mascotte :</span>
          <button
            onClick={() => onTriggerMascotAction('wave')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs cursor-pointer"
            title="Faire coucou"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Coucou</span>
          </button>

          <button
            onClick={() => onTriggerMascotAction('jump')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs cursor-pointer"
            title="Sauter de joie"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sauter</span>
          </button>

          <button
            onClick={() => onTriggerMascotAction('spin')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs cursor-pointer"
            title="Pirouette"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Tourner</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            title="Plein écran"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with aspect ratio framing */}
      <div className="relative flex-1 min-h-[380px] md:min-h-[460px] max-h-[580px] bg-slate-950 flex items-center justify-center p-3 overflow-hidden select-none">
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-all ${
            aspectRatio === '16:9'
              ? 'aspect-video w-full'
              : aspectRatio === '9:16'
              ? 'aspect-[9/16] h-full'
              : 'aspect-square h-full'
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-xl shadow-2xl bg-black"
          />

          {/* Large Overlay Play button if stopped */}
          {!isPlaying && (
            <button
              onClick={onPlayPause}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-rose-500/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Lancer la vidéo"
            >
              <Play className="w-9 h-9 fill-white ml-1.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Bottom Control Deck */}
      <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex flex-col gap-3">
        {/* Timeline Slider */}
        <div
          onClick={handleSeek}
          className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 rounded-full relative transition-all"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Playback Controls & Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play / Pause button */}
            <button
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Restart button */}
            <button
              onClick={onRestart}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Timecode */}
            <div className="font-mono text-xs tabular-nums text-slate-300">
              <span className="font-bold text-white">{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 md:w-28 accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
