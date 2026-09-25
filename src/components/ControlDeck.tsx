import React, { useState } from 'react';
import {
  Music,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Type,
  Mic,
  Upload,
  Heart,
  Plus,
  Trash2,
  Check,
  Disc,
} from 'lucide-react';
import {
  StudioConfig,
  SceneId,
  MascotId,
  InstrumentId,
  LyricThemeId,
  SongPreset,
  LyricLine,
} from '../types';

interface ControlDeckProps {
  config: StudioConfig;
  songs: SongPreset[];
  currentLyrics: LyricLine[];
  onConfigChange: (updates: Partial<StudioConfig>) => void;
  onSongSelect: (songId: string) => void;
  onLyricsChange: (lyrics: LyricLine[]) => void;
  onUploadAudio: (file: File) => void;
  onStartMicRecord: () => void;
  onStopMicRecord: () => void;
  isRecordingMic: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerMascotAction: (action: 'idle' | 'wave' | 'spin' | 'jump') => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  config,
  songs,
  currentLyrics,
  onConfigChange,
  onSongSelect,
  onLyricsChange,
  onUploadAudio,
  onStartMicRecord,
  onStopMicRecord,
  isRecordingMic,
  activeTab,
  setActiveTab,
  onTriggerMascotAction,
}) => {
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);

  const scenesList: { id: SceneId; name: string; desc: string; icon: string; bg: string }[] = [
    {
      id: 'meadow',
      name: 'Prairie Ensoleillée',
      desc: 'Soleil souriant, collines vertes et moulin',
      icon: '🌻',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    },
    {
      id: 'space',
      name: 'Nuit Étoilée & Espace',
      desc: 'Croissant de lune, étoiles et planète violette',
      icon: '🌙',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-950',
    },
    {
      id: 'underwater',
      name: 'Monde Sous-Marin',
      desc: 'Océan turquoise, bulles et petits poissons',
      icon: '🐠',
      bg: 'bg-sky-50 border-sky-200 text-sky-950',
    },
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      desc: 'Champignons géants, arbres et lucioles dorées',
      icon: '🍄',
      bg: 'bg-teal-50 border-teal-200 text-teal-950',
    },
    {
      id: 'party',
      name: 'Fête & Arc-en-Ciel',
      desc: 'Grand arc-en-ciel, ballons et confettis',
      icon: '🌈',
      bg: 'bg-rose-50 border-rose-200 text-rose-950',
    },
  ];

  const mascotsList: { id: MascotId; name: string; tag: string; emoji: string }[] = [
    { id: 'souris', name: 'Souris Verte', tag: 'Chanteuse joyeuse', emoji: '🐭' },
    { id: 'crocodile', name: 'Crocodile Rigolo', tag: 'Nœud papillon rouge', emoji: '🐊' },
    { id: 'escargot', name: 'Petit Escargot', tag: 'Coquille à pois', emoji: '🐌' },
    { id: 'etoile', name: 'Étoile Dorée', tag: 'Berceuse scintillante', emoji: '⭐' },
    { id: 'ourson', name: 'Ourson Câlin', tag: 'Pot de miel sucré', emoji: '🧸' },
    { id: 'caneton', name: 'Petit Caneton', tag: 'Plumes jaunes vives', emoji: '🐥' },
    { id: 'tortue', name: 'Maman Tortue', tag: 'Petite marche tranquille', emoji: '🐢' },
  ];

  const instrumentsList: { id: InstrumentId; name: string; desc: string; icon: string }[] = [
    { id: 'glockenspiel', name: 'Glockenspiel', desc: 'Clochettes cristallines et douces', icon: '🔔' },
    { id: 'musicbox', name: 'Boîte à Musique', desc: 'Son de carillon poétique et berceuse', icon: '✨' },
    { id: 'xylophone', name: 'Xylophone / Marimba', desc: 'Percussion chaleureuse en bois', icon: '🪵' },
    { id: 'celesta', name: 'Célesta Doux', desc: 'Harmoniques féeriques et aériennes', icon: '🪄' },
    { id: 'toypiano', name: 'Piano Jouet', desc: 'Son rétro sautillant et espiègle', icon: '🎹' },
  ];

  const lyricThemesList: { id: LyricThemeId; name: string; color: string }[] = [
    { id: 'rainbow', name: 'Arc-en-Ciel Doré', color: 'from-amber-400 to-rose-400' },
    { id: 'gold', name: 'Or & Étoiles', color: 'from-yellow-300 to-amber-500' },
    { id: 'candy', name: 'Bonbon Rose', color: 'from-pink-400 to-rose-500' },
    { id: 'ocean', name: 'Bleu Océan', color: 'from-cyan-400 to-blue-500' },
    { id: 'neon', name: 'Vert Prairie', color: 'from-lime-400 to-emerald-500' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Tab Navigation header */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-1.5 gap-1 select-none">
        {[
          { id: 'songs', label: 'Comptines', icon: Music },
          { id: 'scenes', label: 'Décors', icon: ImageIcon },
          { id: 'mascots', label: 'Mascottes', icon: Sparkles },
          { id: 'lyrics', label: 'Karaoké', icon: Type },
          { id: 'audio', label: 'Audio & Micro', icon: Mic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 md:p-5 overflow-y-auto flex-1 text-slate-800 space-y-5">
        {/* ==================== 1. TAB COMPTINES ==================== */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Catalogue de Comptines & Chansons
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choisissez une chanson prête à chanter ou personnalisez les paroles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {songs.map((song) => {
                const isSelected = config.selectedSongId === song.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => onSongSelect(song.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{song.title}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{song.description}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span>{song.duration} sec</span>
                      <span>·</span>
                      <span>{song.bpm} BPM</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Song quick banner */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                <Disc className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-900">Vous avez votre propre chanson ?</h4>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  Allez dans l'onglet <strong>Audio & Micro</strong> pour importer un MP3 ou enregistrer votre voix, et dans l'onglet <strong>Karaoké</strong> pour taper vos paroles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. TAB DÉCORS ==================== */}
        {activeTab === 'scenes' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Décor & Ambiance Animée
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez le monde féerique dans lequel évolue la mascotte à 60 FPS.
              </p>
            </div>

            <div className="space-y-2">
              {scenesList.map((sc) => {
                const isSelected = config.scene === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => onConfigChange({ scene: sc.id })}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sc.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{sc.name}</div>
                        <div className="text-xs text-slate-500">{sc.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Title & Dedication Options */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Bandeau Titre & Dédicace Enfant
                </label>
                <input
                  type="checkbox"
                  checked={config.showDedication}
                  onChange={(e) => onConfigChange({ showDedication: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {config.showDedication && (
                <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Titre de la chanson
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => onConfigChange({ title: e.target.value })}
                      placeholder="Ex: Une souris verte"
                      className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Message / Dédicace personnalisée
                    </label>
                    <input
                      type="text"
                      value={config.dedication}
                      onChange={(e) => onConfigChange({ dedication: e.target.value })}
                      placeholder="Ex: Pour Lucas 🎈 ou Chantons avec Emma 💖"
                      className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* Floating particles toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-700">Notes de musique magiques qui s'envolent</span>
                <input
                  type="checkbox"
                  checked={config.particlesEnabled}
                  onChange={(e) => onConfigChange({ particlesEnabled: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-400 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. TAB MASCOTTES ==================== */}
        {activeTab === 'mascots' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Mascotte Vectorielle & Danse
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                La mascotte danse en rythme et ouvre la bouche automatiquement pour chanter !
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mascotsList.map((m) => {
                const isSelected = config.mascot === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onConfigChange({ mascot: m.id })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-1.5">{m.emoji}</span>
                    <span className="text-xs font-bold text-slate-900">{m.name}</span>
                    <span className="text-[10px] text-slate-500">{m.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Position and Scale Sliders */}
            <div className="pt-3 border-t border-slate-200 space-y-3 bg-slate-50 p-3.5 rounded-xl border">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                Ajustement de la Mascotte
              </h4>

              {/* Scale slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Taille de la mascotte</span>
                  <span className="font-mono">{Math.round(config.mascotScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={config.mascotScale}
                  onChange={(e) => onConfigChange({ mascotScale: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Horizontal Position X */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Position Horizontale</span>
                  <span className="font-mono">{Math.round(config.mascotX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.02"
                  value={config.mascotX}
                  onChange={(e) => onConfigChange({ mascotX: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Vertical Position Y */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Position Verticale</span>
                  <span className="font-mono">{Math.round(config.mascotY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.35"
                  max="0.75"
                  step="0.02"
                  value={config.mascotY}
                  onChange={(e) => onConfigChange({ mascotY: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Tester une réaction :</span>
              <button
                onClick={() => onTriggerMascotAction('wave')}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                👋 Coucou
              </button>
              <button
                onClick={() => onTriggerMascotAction('jump')}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                ⚡ Saut
              </button>
              <button
                onClick={() => onTriggerMascotAction('spin')}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 cursor-pointer"
              >
                🔄 Pirouette
              </button>
            </div>
          </div>
        )}

        {/* ==================== 4. TAB KARAOKÉ & PAROLES ==================== */}
        {activeTab === 'lyrics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Karaoké & Boule Rebondissante
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Les paroles sont synchronisées mot par mot avec une étoile dorée qui rebondit pour aider les enfants à chanter.
              </p>
            </div>

            {/* Bouncing star toggle */}
            <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div>
                <span className="text-xs font-bold text-amber-950 block">Étoile / Boule rebondissante</span>
                <span className="text-[11px] text-amber-800">
                  Saute de mot en mot au rythme exact de la mélodie
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.showBouncingBall}
                onChange={(e) => onConfigChange({ showBouncingBall: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Color themes */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                Palette de couleurs des paroles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {lyricThemesList.map((theme) => {
                  const isSelected = config.lyricTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onConfigChange({ lyricTheme: theme.id })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.color} shrink-0`} />
                      <span className="text-xs font-semibold text-slate-800">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lyrics Line Editor */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Lignes de paroles</span>
                <button
                  onClick={() => {
                    const newLine: LyricLine = {
                      text: 'Nouvelle ligne de comptine',
                      startTime: currentLyrics.length > 0 ? currentLyrics[currentLyrics.length - 1].endTime : 0,
                      endTime: currentLyrics.length > 0 ? currentLyrics[currentLyrics.length - 1].endTime + 3 : 3,
                      words: [
                        { word: 'Nouvelle', startTime: 0, endTime: 1 },
                        { word: 'ligne', startTime: 1, endTime: 2 },
                        { word: 'de', startTime: 2, endTime: 2.4 },
                        { word: 'comptine', startTime: 2.4, endTime: 3 },
                      ],
                    };
                    onLyricsChange([...currentLyrics, newLine]);
                  }}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter une ligne
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {currentLyrics.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400">Ligne {idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">
                          {line.startTime.toFixed(1)}s - {line.endTime.toFixed(1)}s
                        </span>
                        <button
                          onClick={() => {
                            const updated = currentLyrics.filter((_, i) => i !== idx);
                            onLyricsChange(updated);
                          }}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={line.text}
                      onChange={(e) => {
                        const newText = e.target.value;
                        const wordsArr = newText.split(/\s+/).filter(Boolean);
                        const duration = line.endTime - line.startTime;
                        const wordDuration = wordsArr.length > 0 ? duration / wordsArr.length : 1;

                        const newWords = wordsArr.map((w, wIdx) => ({
                          word: w,
                          startTime: line.startTime + wIdx * wordDuration,
                          endTime: line.startTime + (wIdx + 1) * wordDuration,
                        }));

                        const updated = [...currentLyrics];
                        updated[idx] = {
                          ...line,
                          text: newText,
                          words: newWords,
                        };
                        onLyricsChange(updated);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. TAB AUDIO & MICRO ==================== */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Moteur Audio, Instruments & Voix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Personnalisez l'instrumentation, le tempo, ou enregistrez votre voix au micro.
              </p>
            </div>

            {/* Instrument selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                Instrument de la mélodie synthétisée
              </label>
              <div className="space-y-1.5">
                {instrumentsList.map((inst) => {
                  const isSelected = config.instrument === inst.id;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => onConfigChange({ instrument: inst.id, audioMode: 'synth' })}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{inst.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{inst.name}</span>
                          <span className="text-[11px] text-slate-500">{inst.desc}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tempo BPM Slider */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1">
                <span>Tempo de la comptine (BPM)</span>
                <span className="font-mono text-indigo-600">{config.bpm} BPM</span>
              </div>
              <input
                type="range"
                min="70"
                max="160"
                step="2"
                value={config.bpm}
                onChange={(e) => onConfigChange({ bpm: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Douce berceuse (70)</span>
                <span>Enlevé (120)</span>
                <span>Très rapide (160)</span>
              </div>
            </div>

            {/* Voice Recorder & Custom Audio */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Chanter vous-même ou importer une chanson
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Mic Record Button */}
                <button
                  onClick={isRecordingMic ? onStopMicRecord : onStartMicRecord}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isRecordingMic
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Mic className={`w-5 h-5 mb-1 ${isRecordingMic ? 'text-white' : 'text-rose-500'}`} />
                  <span className="text-xs font-bold">
                    {isRecordingMic ? 'Arrêter l\'enregistrement' : 'Enregistrer au Micro'}
                  </span>
                  <span className="text-[10px] opacity-80">Chantez pour votre enfant</span>
                </button>

                {/* Upload MP3/WAV Button */}
                <label className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-center flex flex-col items-center justify-center transition-all cursor-pointer">
                  <Upload className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-xs font-bold text-slate-900">Importer un fichier audio</span>
                  <span className="text-[10px] text-slate-500">MP3, WAV ou OGG</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onUploadAudio(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {config.audioMode !== 'synth' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <span>Piste audio personnalisée active</span>
                  <button
                    onClick={() => onConfigChange({ audioMode: 'synth' })}
                    className="text-emerald-700 underline font-semibold hover:text-emerald-950 cursor-pointer"
                  >
                    Revenir au synthé
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
