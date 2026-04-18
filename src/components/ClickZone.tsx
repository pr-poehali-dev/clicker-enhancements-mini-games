import { useState, useCallback, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { GameState } from "@/hooks/useGameState";

interface Ripple { id: number; x: number; y: number; }
interface FloatScore { id: number; x: number; y: number; value: number; }

interface Props {
  state: GameState;
  onClick: () => void;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

export default function ClickZone({ state, onClick }: Props) {
  const [floats, setFloats] = useState<FloatScore[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressing, setPressing] = useState(false);
  const idRef = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;

    setFloats(prev => [...prev.slice(-8), { id, x: x + (Math.random() - 0.5) * 40, y: y - 10, value: state.clickPower }]);
    setRipples(prev => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => setFloats(prev => prev.filter(s => s.id !== id)), 900);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);

    setPressing(true);
    setTimeout(() => setPressing(false), 120);
    onClick();
  }, [onClick, state.clickPower]);

  // Auto-clicker visual pulse
  const [autoPulse, setAutoPulse] = useState(false);
  useEffect(() => {
    if (state.passiveIncome <= 0) return;
    const t = setInterval(() => {
      setAutoPulse(true);
      setTimeout(() => setAutoPulse(false), 300);
    }, 1000);
    return () => clearInterval(t);
  }, [state.passiveIncome]);

  const xpPct = Math.min(100, (state.season.xp / state.season.xpRequired) * 100);

  return (
    <div className="flex flex-col items-center gap-5 select-none">

      {/* Credits counter */}
      <div className="text-center pt-2">
        <div className="font-orbitron text-5xl font-black neon-cyan leading-none mb-1 tabular-nums">
          {fmt(state.credits)}
        </div>
        <div className="font-ibm text-xs text-muted-foreground tracking-[0.25em] uppercase">кредитов</div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        {[
          { label: "за клик", value: `+${state.clickPower}`, color: "#00ff88" },
          { label: "в секунду", value: `${state.passiveIncome}`, color: "#ff00ff" },
          { label: "всего кликов", value: fmt(state.totalClicks), color: "#ffff00" },
        ].map(s => (
          <div key={s.label} className="cyber-card px-3 py-2 text-center min-w-[72px]">
            <div className="font-orbitron text-base font-bold" style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>{s.value}</div>
            <div className="font-ibm text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main button */}
      <div className="relative flex items-center justify-center my-2" style={{ width: 260, height: 260 }}>
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/15 animate-spin-slow" />
        <div className="absolute rounded-full border border-fuchsia-500/15 animate-spin-reverse" style={{ inset: 12, borderStyle: "dashed" }} />
        <div className={`absolute rounded-full border-2 transition-all duration-300 ${autoPulse ? "border-cyan-400/60 scale-105" : "border-cyan-500/25"}`} style={{ inset: 24 }} />

        {/* Glow backdrop */}
        <div className={`absolute rounded-full transition-all duration-150 ${pressing ? "scale-90 opacity-80" : "scale-100 opacity-100"}`}
          style={{ inset: 36, background: "radial-gradient(circle, rgba(0,255,255,0.18) 0%, rgba(0,255,255,0.06) 60%, transparent 100%)" }}
        />

        {/* Ripples */}
        {ripples.map(r => (
          <div key={r.id} className="absolute pointer-events-none rounded-full border border-cyan-400/60"
            style={{ left: r.x - 40, top: r.y - 40, width: 80, height: 80, animation: "ripple-out 0.6s ease-out forwards" }}
          />
        ))}

        <button
          onMouseDown={handleClick}
          className="relative z-10 rounded-full flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden transition-transform duration-100 active:scale-90"
          style={{
            width: 170, height: 170,
            background: "radial-gradient(circle at 40% 35%, rgba(0,255,255,0.2), rgba(0,255,255,0.04) 70%)",
            border: "2px solid #00ffff",
            boxShadow: pressing
              ? "0 0 8px #00ffff, inset 0 0 20px rgba(0,255,255,0.15)"
              : "0 0 20px #00ffff88, 0 0 60px #00ffff33, inset 0 0 30px rgba(0,255,255,0.08)",
          }}
        >
          <Icon name="Zap" size={58} className="text-cyan-300 drop-shadow-[0_0_16px_#00ffff]" />
          <span className="font-orbitron text-xs text-cyan-300 tracking-[0.3em]">КЛИК</span>

          {/* Float scores */}
          {floats.map(f => (
            <span key={f.id} className="pointer-events-none absolute font-orbitron font-black text-base neon-yellow animate-float-up"
              style={{ left: f.x - 16, top: f.y - 16, zIndex: 20 }}>
              +{f.value}
            </span>
          ))}
        </button>
      </div>

      {/* Season XP bar */}
      <div className="w-full max-w-xs space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground font-ibm">
          <span>Сезон {state.season.current} · Уровень <span className="font-orbitron text-white">{state.season.level}</span></span>
          <span className="font-orbitron">{state.season.xp}/{state.season.xpRequired} XP</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${xpPct}%` }} />
          <div className="absolute inset-0 rounded-full" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 9px)" }} />
        </div>
      </div>

      <style>{`
        @keyframes ripple-out {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
