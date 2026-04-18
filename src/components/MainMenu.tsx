import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface SaveInfo {
  credits: number;
  totalClicks: number;
  seasonLevel: number;
  savedAt?: number;
}

interface Props {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
  saveInfo: SaveInfo | null;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative text-center">
      <h1
        className="font-orbitron text-5xl sm:text-7xl font-black neon-cyan tracking-widest"
        style={glitch ? {
          textShadow: "3px 0 #ff00ff, -3px 0 #00ffff, 0 0 40px #00ffff",
          transform: "skewX(-2deg)",
        } : {}}
      >
        NEXUS
      </h1>
      <div className="font-orbitron text-lg sm:text-2xl text-fuchsia-400 tracking-[0.5em] mt-1"
        style={{ textShadow: "0 0 10px #ff00ff" }}>
        CLICKER
      </div>
      <div className="font-ibm text-xs text-muted-foreground tracking-widest mt-1">v1.0 · CYBERPUNK EDITION</div>
    </div>
  );
}

export default function MainMenu({ onStart, onContinue, hasSave, saveInfo }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanY(y => (y + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  const timeAgo = saveInfo?.savedAt
    ? (() => {
        const diff = Math.floor((Date.now() - saveInfo.savedAt) / 1000);
        if (diff < 60) return `${diff}с назад`;
        if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
        return `${Math.floor(diff / 3600)}ч назад`;
      })()
    : null;

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{ top: `${scanY}%`, background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent)" }} />

      {/* Corner decorations */}
      {[["top-4 left-4", "border-t-2 border-l-2"], ["top-4 right-4", "border-t-2 border-r-2"], ["bottom-4 left-4", "border-b-2 border-l-2"], ["bottom-4 right-4", "border-b-2 border-r-2"]].map(([pos, border], i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 border-cyan-500/50 ${border}`} />
      ))}

      {/* Logo */}
      <div className="mb-10">
        <GlitchTitle />
      </div>

      {/* Save info */}
      {hasSave && saveInfo && (
        <div className="cyber-card px-6 py-3 mb-8 flex items-center gap-4 border border-cyan-500/20 w-full max-w-sm">
          <Icon name="Save" size={18} className="text-cyan-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-ibm text-xs text-muted-foreground">Сохранение найдено {timeAgo && `· ${timeAgo}`}</div>
            <div className="flex gap-3 mt-0.5">
              <span className="font-orbitron text-xs text-yellow-300">⚡{fmt(saveInfo.credits)}</span>
              <span className="font-orbitron text-xs text-fuchsia-300">👆{fmt(saveInfo.totalClicks)}</span>
              <span className="font-orbitron text-xs text-cyan-300">Ур.{saveInfo.seasonLevel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {hasSave && (
          <button
            onClick={onContinue}
            className="w-full py-4 font-orbitron text-sm font-bold rounded border-2 border-cyan-500 text-cyan-300 bg-cyan-500/15 transition-all hover:bg-cyan-500/25 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] active:scale-95"
          >
            <Icon name="Play" size={16} className="inline mr-2" />
            ПРОДОЛЖИТЬ
          </button>
        )}

        <button
          onClick={() => hasSave ? setShowConfirm(true) : onStart()}
          className="w-full py-4 font-orbitron text-sm font-bold rounded border-2 transition-all active:scale-95"
          style={{
            borderColor: hasSave ? "#ff00ff" : "#00ffff",
            color: hasSave ? "#ff00ff" : "#00ffff",
            background: hasSave ? "rgba(255,0,255,0.1)" : "rgba(0,255,255,0.15)",
          }}
        >
          <Icon name={hasSave ? "RefreshCw" : "Zap"} size={16} className="inline mr-2" />
          {hasSave ? "НОВАЯ ИГРА" : "НАЧАТЬ ИГРУ"}
        </button>
      </div>

      {/* Status line */}
      <div className="absolute bottom-6 font-ibm text-xs text-muted-foreground/40 tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        СИСТЕМА ГОТОВА
      </div>

      {/* Confirm new game */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="cyber-card p-6 max-w-sm w-full mx-4 border border-red-500/40 space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={18} className="text-red-400" />
              <span className="font-orbitron text-sm text-red-400">ВНИМАНИЕ</span>
            </div>
            <p className="font-ibm text-sm text-white">Начать новую игру? Весь текущий прогресс будет удалён безвозвратно.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 font-orbitron text-xs border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/10 transition-all">
                ОТМЕНА
              </button>
              <button
                onClick={() => { localStorage.clear(); onStart(); }}
                className="flex-1 py-2 font-orbitron text-xs border border-red-500 text-red-400 rounded hover:bg-red-500/15 transition-all">
                УДАЛИТЬ И НАЧАТЬ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
