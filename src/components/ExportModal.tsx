import React, { useState } from 'react';
import {
  X,
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Share2,
} from 'lucide-react';
import { AspectRatio } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isExporting: boolean;
  progress: number; // 0 to 1
  remainingSeconds: number;
  videoUrl: string | null;
  videoBlob: Blob | null;
  aspectRatio: AspectRatio;
  songTitle: string;
  onStartExport: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  isExporting,
  progress,
  remainingSeconds,
  videoUrl,
  videoBlob,
  aspectRatio,
  songTitle,
  onStartExport,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileSizeMB = videoBlob ? (videoBlob.size / (1024 * 1024)).toFixed(1) : '0';
  const formatName =
    aspectRatio === '16:9'
      ? '16:9 Paysage (YouTube / TV)'
      : aspectRatio === '9:16'
      ? '9:16 Portrait (TikTok / Shorts / Reels)'
      : '1:1 Carré (Instagram)';

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    const safeTitle = songTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `comptine_${safeTitle}_${aspectRatio.replace(':', 'x')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                Exporter la Vidéo de Comptine
              </h3>
              <p className="text-xs text-slate-500">{formatName}</p>
            </div>
          </div>

          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* Phase 1: Ready to start */}
          {!isExporting && !videoUrl && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Rendu haute définition en temps réel
                </div>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  L'application va capturer l'animation du décor à 60 FPS, la mascotte qui danse et chante en rythme, le karaoké synchronisé avec l'étoile dorée, ainsi que la mélodie audio.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Chanson :</span>
                  <span className="font-semibold text-slate-800">{songTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format d'export :</span>
                  <span className="font-semibold text-slate-800">{formatName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fréquence :</span>
                  <span className="font-semibold text-slate-800">30 FPS Haute Qualité</span>
                </div>
                <div className="flex justify-between">
                  <span>Piste sonore :</span>
                  <span className="font-semibold text-slate-800">Mélodie Web Audio intégrée</span>
                </div>
              </div>

              <button
                onClick={onStartExport}
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-sm transition-all hover:shadow hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Lancer la création de la vidéo</span>
              </button>
            </div>
          )}

          {/* Phase 2: Currently rendering */}
          {isExporting && (
            <div className="space-y-5 py-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 animate-bounce">
                <Film className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Enregistrement de la vidéo en cours...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Temps restant estimé : ~{remainingSeconds} seconde{remainingSeconds > 1 ? 's' : ''}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 transition-all duration-200 rounded-full"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono tabular-nums text-slate-400">
                  <span>Progression</span>
                  <span className="font-bold text-slate-800">{Math.round(progress * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Complete with preview and download */}
          {!isExporting && videoUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Votre vidéo est prête ! Taille : {fileSizeMB} Mo</span>
              </div>

              {/* Video Player */}
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner max-h-[260px] flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[260px] object-contain"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all hover:shadow hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger la Vidéo</span>
                </button>

                <button
                  onClick={onStartExport}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="Générer à nouveau"
                >
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
