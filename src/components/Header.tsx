import React from 'react';
import { Video, Music2, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
  onResetDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onResetDefault,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Chantoons Studio
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-500">
              Vidéos de comptines pour enfants
            </span>
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'songs', label: 'Comptines' },
            { id: 'scenes', label: 'Décors' },
            { id: 'mascots', label: 'Mascottes' },
            { id: 'lyrics', label: 'Karaoké' },
            { id: 'audio', label: 'Audio & Micro' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefault}
            title="Réinitialiser la chanson"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Video className="w-4 h-4" />
            <span>Créer la Vidéo MP4</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
