import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onEarn: (amount: number) => void;
}

// --- Взлом: Симон ---
function HackGame({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"watch" | "input" | "success" | "fail">("watch");
  const [showIdx, setShowIdx] = useState(-1);
  const [round, setRound] = useState(1);

  const runSequence = useCallback((seq: number[]) => {
    let i = 0;
    const next = () => {
      if (i >= seq.length) { setShowIdx(-1); setPhase("input"); return; }
      setShowIdx(seq[i]);
      setTimeout(() => { setShowIdx(-1); setTimeout(() => { i++; next(); }, 250); }, 550);
    };
    setTimeout(next, 600);
  }, []);

  useEffect(() => {
    const seq = Array.from({ length: 3 + round }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setInput([]);
    setPhase("watch");
    runSequence(seq);
  }, [round, runSequence]);

  const handleBtn = (idx: number) => {
    if (phase !== "input") return;
    const next = [...input, idx];
    if (next[next.length - 1] !== sequence[next.length - 1]) { setPhase("fail"); return; }
    if (next.length === sequence.length) {
      onEarn(200 * round);
      if (round < 3) { setRound(r => r + 1); } else { setPhase("success"); }
      return;
    }
    setInput(next);
  };

  const btnStyle = (i: number) => {
    const active = showIdx === i;
    const styles = [
      { base: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400", active: "border-cyan-400 bg-cyan-500/60 text-white shadow-[0_0_20px_#00ffff]" },
      { base: "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400", active: "border-fuchsia-400 bg-fuchsia-500/60 text-white shadow-[0_0_20px_#ff00ff]" },
      { base: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400", active: "border-yellow-400 bg-yellow-500/60 text-white shadow-[0_0_20px_#ffff00]" },
      { base: "border-green-500/50 bg-green-500/10 text-green-400", active: "border-green-400 bg-green-500/60 text-white shadow-[0_0_20px_#00ff88]" },
    ];
    return `h-16 rounded border-2 flex items-center justify-center transition-all duration-100 ${active ? styles[i].active + " scale-105" : styles[i].base} ${phase === "input" ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default"}`;
  };

  const icons = ["Terminal", "Cpu", "Wifi", "Shield"] as const;

  return (
    <div className="cyber-card p-5 space-y-4 border border-cyan-500/30">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-cyan">ВЗЛОМ СЕРВЕРА</h4>
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-xs text-muted-foreground">Раунд {round}/3</span>
          <button onClick={onClose}><Icon name="X" size={16} className="text-muted-foreground hover:text-white" /></button>
        </div>
      </div>
      <div className="font-ibm text-xs text-center text-muted-foreground h-4">
        {phase === "watch" && "👁 Запоминай последовательность..."}
        {phase === "input" && "⌨ Повтори последовательность!"}
        {phase === "success" && <span className="neon-green">✓ Мастер взлома! +{200 * round} кредитов за раунд</span>}
        {phase === "fail" && <span className="text-red-400">✗ Доступ запрещён — сигнал потерян</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <button key={i} onClick={() => handleBtn(i)} disabled={phase !== "input"} className={btnStyle(i)}>
            <Icon name={icons[i]} size={26} />
          </button>
        ))}
      </div>
      {(phase === "success" || phase === "fail") && (
        <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/20 transition-all">ВЫЙТИ</button>
      )}
    </div>
  );
}

// --- Цифровой рывок ---
function NumberRush({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const target = useRef(Math.floor(Math.random() * 20) + 15);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setDone(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [done]);

  const handleBtnClick = () => {
    if (done) return;
    setCurrent(prev => {
      const next = prev + 1;
      if (next >= target.current) { setDone(true); onEarn(400); }
      return next;
    });
  };

  const progress = Math.min(100, (current / target.current) * 100);
  const success = current >= target.current;

  return (
    <div className="cyber-card p-5 space-y-4 border border-yellow-500/30">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-yellow">ЦИФРОВОЙ РЫВОК</h4>
        <button onClick={onClose}><Icon name="X" size={16} className="text-muted-foreground hover:text-white" /></button>
      </div>
      <p className="font-ibm text-xs text-muted-foreground text-center">Кликни <span className="text-white font-orbitron">{target.current}</span> раз за 8 секунд!</p>
      <div className="flex justify-between font-orbitron text-sm items-center">
        <span className="neon-cyan text-xl">{current} <span className="text-muted-foreground text-sm">/ {target.current}</span></span>
        <span className={`text-2xl font-black ${timeLeft <= 3 ? "text-red-400" : "text-white"}`}>{timeLeft}с</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-cyan-400 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>
      {!done ? (
        <button onClick={handleBtnClick}
          className="w-full py-4 font-orbitron text-lg font-black border-2 border-yellow-500 text-yellow-300 rounded bg-yellow-500/10 hover:bg-yellow-500/25 transition-all active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          ⚡ ТЫЦ!
        </button>
      ) : (
        <div className="space-y-3 text-center">
          <p className="font-orbitron text-sm">{success ? <span className="neon-green">УСПЕХ! +400 кредитов</span> : <span className="text-red-400">Время вышло!</span>}</p>
          <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-yellow-500/50 text-yellow-300 rounded hover:bg-yellow-500/20 transition-all">ВЫЙТИ</button>
        </div>
      )}
    </div>
  );
}

// --- Двоичный декодер ---
function BinaryDecoder({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const pairs = [[7, "0111"], [13, "1101"], [5, "0101"], [11, "1011"], [9, "1001"], [15, "1111"], [3, "0011"]] as const;
  const [idx] = useState(() => Math.floor(Math.random() * pairs.length));
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"" | "ok" | "fail">("");

  const check = () => {
    if (parseInt(input) === pairs[idx][0]) { setResult("ok"); onEarn(250); }
    else setResult("fail");
  };

  return (
    <div className="cyber-card p-5 space-y-4 border border-green-500/30">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-green">ДВОИЧНЫЙ ДЕКОДЕР</h4>
        <button onClick={onClose}><Icon name="X" size={16} className="text-muted-foreground hover:text-white" /></button>
      </div>
      <p className="font-ibm text-xs text-muted-foreground text-center">Переведи двоичный код в десятичное число</p>
      <div className="text-center font-orbitron text-4xl neon-cyan tracking-[0.4em] py-3 cyber-card">{pairs[idx][1]}</div>
      {result === "" ? (
        <div className="flex gap-2">
          <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && check()}
            className="flex-1 bg-muted border border-green-500/40 rounded px-3 py-2 font-orbitron text-white text-center text-lg focus:outline-none focus:border-green-400"
            placeholder="?" autoFocus />
          <button onClick={check} className="px-5 py-2 font-orbitron text-sm border border-green-500 text-green-300 rounded hover:bg-green-500/20 transition-all">OK</button>
        </div>
      ) : (
        <div className="space-y-3 text-center">
          <p className="font-orbitron text-sm">{result === "ok" ? <span className="neon-green">ВЕРНО! +250 кредитов</span> : <span className="text-red-400">Неверно! Ответ: {pairs[idx][0]}</span>}</p>
          <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-green-500/50 text-green-300 rounded hover:bg-green-500/20 transition-all">ВЫЙТИ</button>
        </div>
      )}
    </div>
  );
}

// --- Реакция: нажми цвет ---
function ReactionGame({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const colors = [
    { name: "КРАСНЫЙ", color: "#ff3366", bg: "bg-red-500/20", border: "border-red-500" },
    { name: "СИНИЙ", color: "#00ffff", bg: "bg-cyan-500/20", border: "border-cyan-500" },
    { name: "ЖЁЛТЫЙ", color: "#ffff00", bg: "bg-yellow-500/20", border: "border-yellow-500" },
    { name: "ЗЕЛЁНЫЙ", color: "#00ff88", bg: "bg-green-500/20", border: "border-green-500" },
  ];
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 4));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const total = 5;

  const handlePick = (idx: number) => {
    if (done) return;
    const correct = idx === target;
    const newScore = correct ? score + 1 : score;
    const newRound = round + 1;
    if (newRound >= total) {
      setScore(newScore);
      setRound(newRound);
      setDone(true);
      onEarn(newScore * 100);
      return;
    }
    setScore(newScore);
    setRound(newRound);
    setTarget(Math.floor(Math.random() * 4));
  };

  return (
    <div className="cyber-card p-5 space-y-4 border border-fuchsia-500/30">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-magenta">НЕЙРО-РЕАКЦИЯ</h4>
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-xs text-muted-foreground">{round}/{total}</span>
          <button onClick={onClose}><Icon name="X" size={16} className="text-muted-foreground hover:text-white" /></button>
        </div>
      </div>
      {!done ? (
        <>
          <p className="font-ibm text-xs text-muted-foreground text-center">Нажми кнопку цвета:</p>
          <div className="text-center font-orbitron text-3xl font-black py-2" style={{ color: colors[target].color, textShadow: `0 0 15px ${colors[target].color}` }}>
            {colors[target].name}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {colors.map((c, i) => (
              <button key={i} onClick={() => handlePick(i)}
                className={`h-14 rounded border-2 ${c.bg} ${c.border} font-orbitron text-sm transition-all hover:scale-105 active:scale-95`}
                style={{ color: c.color }}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < round ? "bg-fuchsia-400" : "bg-muted"}`} />
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3 text-center py-3">
          <p className="font-orbitron text-3xl font-black neon-magenta">{score}/{total}</p>
          <p className="font-orbitron text-sm text-white">+{score * 100} кредитов</p>
          <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-fuchsia-500/50 text-fuchsia-300 rounded hover:bg-fuchsia-500/20 transition-all">ВЫЙТИ</button>
        </div>
      )}
    </div>
  );
}

export default function MiniGames({ onEarn }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const t = setInterval(() => {
      setCooldowns(prev => {
        const upd = { ...prev };
        Object.keys(upd).forEach(k => { if (upd[k] > 0) upd[k]--; });
        return upd;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleEarn = useCallback((amount: number) => { onEarn(amount); }, [onEarn]);

  const handleClose = (id: string, cd: number) => {
    setActive(null);
    setCooldowns(prev => ({ ...prev, [id]: cd }));
  };

  const games = [
    { id: "hack", name: "Взлом сервера", desc: "Повтори последовательность", reward: "до +600¢", icon: "Terminal", color: "cyan", cd: 60 },
    { id: "rush", name: "Цифровой рывок", desc: "Кликай быстрее цели за 8 сек", reward: "+400¢", icon: "Zap", color: "yellow", cd: 45 },
    { id: "binary", name: "Двоичный декодер", desc: "Переведи двоичный код", reward: "+250¢", icon: "Code2", color: "green", cd: 30 },
    { id: "reaction", name: "Нейро-реакция", desc: "Жми правильный цвет", reward: "до +500¢", icon: "Eye", color: "fuchsia", cd: 40 },
  ];

  if (active === "hack") return <HackGame onEarn={handleEarn} onClose={() => handleClose("hack", 60)} />;
  if (active === "rush") return <NumberRush onEarn={handleEarn} onClose={() => handleClose("rush", 45)} />;
  if (active === "binary") return <BinaryDecoder onEarn={handleEarn} onClose={() => handleClose("binary", 30)} />;
  if (active === "reaction") return <ReactionGame onEarn={handleEarn} onClose={() => handleClose("reaction", 40)} />;

  const colorMap: Record<string, { border: string; text: string; bg: string; iconColor: string }> = {
    cyan:    { border: "border-cyan-500/40",    text: "text-cyan-300",    bg: "hover:bg-cyan-500/15",    iconColor: "text-cyan-400" },
    yellow:  { border: "border-yellow-500/40",  text: "text-yellow-300",  bg: "hover:bg-yellow-500/15",  iconColor: "text-yellow-400" },
    green:   { border: "border-green-500/40",   text: "text-green-300",   bg: "hover:bg-green-500/15",   iconColor: "text-green-400" },
    fuchsia: { border: "border-fuchsia-500/40", text: "text-fuchsia-300", bg: "hover:bg-fuchsia-500/15", iconColor: "text-fuchsia-400" },
  };

  return (
    <div className="space-y-4">
      <h3 className="font-orbitron text-sm neon-magenta uppercase tracking-widest flex items-center gap-2">
        <Icon name="Gamepad2" size={14} />
        Мини-игры
      </h3>
      {games.map(game => {
        const cd = cooldowns[game.id] || 0;
        const c = colorMap[game.color];
        return (
          <div key={game.id} className={`cyber-card p-4 flex items-center gap-4 border ${c.border}`}>
            <div className={`w-12 h-12 rounded border ${c.border} bg-opacity-10 flex items-center justify-center shrink-0`} style={{ background: "rgba(255,255,255,0.03)" }}>
              <Icon name={game.icon as "Terminal"} size={24} className={c.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-orbitron text-xs text-white mb-0.5">{game.name}</div>
              <div className="font-ibm text-xs text-muted-foreground">{game.desc}</div>
              <div className={`font-orbitron text-xs mt-1 ${c.text}`}>{game.reward}</div>
            </div>
            {cd > 0 ? (
              <div className="text-center shrink-0">
                <div className="font-orbitron text-xs text-muted-foreground">ПЕРЕЗАРЯДКА</div>
                <div className="font-orbitron text-base text-white">{cd}с</div>
              </div>
            ) : (
              <button onClick={() => setActive(game.id)}
                className={`shrink-0 px-4 py-2 font-orbitron text-xs rounded border ${c.border} ${c.text} ${c.bg} transition-all`}>
                ИГРАТЬ
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
