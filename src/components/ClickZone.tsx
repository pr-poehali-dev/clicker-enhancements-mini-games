import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { GameState } from "@/hooks/useGameState";

interface FloatScore {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface Props {
  state: GameState;
  onClick: () => void;
}

export default function ClickZone({ state, onClick }: Props) {
  const [floatScores, setFloatScores] = useState<FloatScore[]>([]);
  const [clicking, setClicking] = useState(false);
  const idRef = { current: 0 };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    idRef.current++;
    const id = Date.now() + Math.random();
    setFloatScores(prev => [...prev, { id, x, y, value: state.clickPower }]);
    setTimeout(() => setFloatScores(prev => prev.filter(s => s.id !== id)), 800);
    setClicking(true);
    setTimeout(() => setClicking(false), 150);
    onClick();
  }, [onClick, state.clickPower]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="font-orbitron text-5xl font-black neon-cyan mb-1">
          {formatNumber(state.credits)}
        </div>
        <div className="text-xs text-muted-foreground font-ibm tracking-widest uppercase">
          КРЕДИТОВ
        </div>
      </div>

      <div className="flex gap-6 text-center">
        <div className="cyber-card px-4 py-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">За клик</div>
          <div className="font-orbitron neon-green text-lg font-bold">+{state.clickPower}</div>
        </div>
        <div className="cyber-card px-4 py-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">В секунду</div>
          <div className="font-orbitron neon-magenta text-lg font-bold">{state.passiveIncome}/с</div>
        </div>
        <div className="cyber-card px-4 py-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Кликов</div>
          <div className="font-orbitron neon-yellow text-lg font-bold">{formatNumber(state.totalClicks)}</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute w-56 h-56 rounded-full border border-cyan-500/20 animate-spin-slow" />
        <div className="absolute w-48 h-48 rounded-full border border-fuchsia-500/20 animate-spin-reverse" />
        <div className="absolute w-40 h-40 rounded-full bg-cyan-500/5 animate-neon-pulse" />

        <button
          onClick={handleClick}
          className={`click-btn animate-neon-pulse relative z-10 transition-transform select-none ${clicking ? "scale-95" : "scale-100"}`}
          style={{ width: 160, height: 160 }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className={`transition-transform ${clicking ? "scale-90" : "scale-100"}`}>
              <Icon name="Zap" size={52} className="text-cyan-400 drop-shadow-[0_0_12px_#00ffff]" />
            </div>
            <span className="font-orbitron text-xs text-cyan-300 tracking-widest">CLICK</span>
          </div>

          {floatScores.map(score => (
            <span
              key={score.id}
              className="pointer-events-none absolute font-orbitron font-black text-lg neon-yellow animate-float-up"
              style={{ left: score.x - 20, top: score.y - 20 }}
            >
              +{score.value}
            </span>
          ))}
        </button>
      </div>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span className="font-ibm">СЕЗОН {state.season.current} · Ур. {state.season.level}</span>
          <span className="font-orbitron">{state.season.xp} / {state.season.xpRequired} XP</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (state.season.xp / state.season.xpRequired) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
