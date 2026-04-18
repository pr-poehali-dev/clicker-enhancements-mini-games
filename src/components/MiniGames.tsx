import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onEarn: (amount: number) => void;
}

function HackGame({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"watch" | "input" | "success" | "fail">("watch");
  const [showIdx, setShowIdx] = useState(-1);

  useEffect(() => {
    const seq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    let i = 0;
    const show = () => {
      if (i < seq.length) {
        setShowIdx(seq[i]);
        setTimeout(() => { setShowIdx(-1); setTimeout(() => { i++; show(); }, 200); }, 500);
      } else {
        setShowIdx(-1);
        setPhase("input");
      }
    };
    setTimeout(show, 500);
  }, []);

  const handleInput = useCallback((idx: number) => {
    if (phase !== "input") return;
    const next = [...input, idx];
    setInput(next);
    if (next[next.length - 1] !== sequence[next.length - 1]) {
      setPhase("fail");
      return;
    }
    if (next.length === sequence.length) {
      setPhase("success");
      onEarn(500);
    }
  }, [phase, input, sequence, onEarn]);

  const colors = ["bg-cyan-500", "bg-fuchsia-500", "bg-yellow-500", "bg-green-500"];
  const icons = ["Terminal", "Cpu", "Wifi", "Shield"] as const;

  return (
    <div className="cyber-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-cyan">ВЗЛОМ СЕРВЕРА</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
          <Icon name="X" size={16} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {phase === "watch" && "Запоминай последовательность..."}
        {phase === "input" && "Повтори последовательность!"}
        {phase === "success" && "✓ Взлом успешен! +500 кредитов"}
        {phase === "fail" && "✗ Доступ запрещён"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => handleInput(i)}
            disabled={phase !== "input"}
            className={`h-14 rounded border-2 transition-all flex items-center justify-center ${
              showIdx === i ? `${colors[i]} border-white scale-105` : `bg-${colors[i].replace("bg-", "")}/10 border-${colors[i].replace("bg-", "")}/40`
            } ${phase === "input" ? "hover:scale-105 cursor-pointer" : ""}`}
          >
            <Icon name={icons[i]} size={24} className="text-white" />
          </button>
        ))}
      </div>
      {(phase === "success" || phase === "fail") && (
        <button
          onClick={onClose}
          className="w-full py-2 font-orbitron text-xs border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/20 transition-all"
        >
          ЗАКРЫТЬ
        </button>
      )}
    </div>
  );
}

function NumberRush({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 50) + 10);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); setDone(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done]);

  const handleClick = useCallback(() => {
    if (done) return;
    setCurrent(prev => {
      const next = prev + 1;
      if (next >= target) { setDone(true); onEarn(300); }
      return next;
    });
  }, [done, target, onEarn]);

  return (
    <div className="cyber-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-yellow">ЦИФРОВОЙ РЫВОК</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><Icon name="X" size={16} /></button>
      </div>
      <p className="text-xs text-muted-foreground">Кликни {target} раз за 5 секунд!</p>
      <div className="flex justify-between font-orbitron text-sm">
        <span className="neon-cyan">{current} / {target}</span>
        <span className={timeLeft <= 2 ? "neon-orange" : "text-white"}>{timeLeft}с</span>
      </div>
      <div className="h-2 bg-muted rounded-full">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full transition-all" style={{ width: `${(current / target) * 100}%` }} />
      </div>
      {!done ? (
        <button onClick={handleClick} className="w-full py-3 font-orbitron text-sm border-2 border-yellow-500 text-yellow-300 rounded hover:bg-yellow-500/20 transition-all active:scale-95">
          КЛИК!
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-center font-orbitron text-xs">
            {current >= target ? <span className="neon-green">УСПЕХ! +300 кредитов</span> : <span className="text-red-400">Время вышло!</span>}
          </p>
          <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/20 transition-all">ЗАКРЫТЬ</button>
        </div>
      )}
    </div>
  );
}

function BinaryDecoder({ onEarn, onClose }: { onEarn: (n: number) => void; onClose: () => void }) {
  const answers = [7, 13, 5, 11];
  const questions = ["0111", "1101", "0101", "1011"];
  const [qIdx] = useState(() => Math.floor(Math.random() * 4));
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"" | "ok" | "fail">("");

  const check = () => {
    if (parseInt(input) === answers[qIdx]) { setResult("ok"); onEarn(200); }
    else setResult("fail");
  };

  return (
    <div className="cyber-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-orbitron text-sm neon-green">ДВОИЧНЫЙ ДЕКОДЕР</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><Icon name="X" size={16} /></button>
      </div>
      <p className="text-xs text-muted-foreground">Переведи двоичный код в десятичное число:</p>
      <div className="text-center font-orbitron text-3xl neon-cyan tracking-widest">{questions[qIdx]}</div>
      {result === "" ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-muted border border-cyan-500/30 rounded px-3 py-2 font-orbitron text-white text-center focus:outline-none focus:border-cyan-500"
            placeholder="Ответ..."
          />
          <button onClick={check} className="px-4 py-2 font-orbitron text-xs border border-cyan-500 text-cyan-300 rounded hover:bg-cyan-500/20 transition-all">
            ОК
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-center font-orbitron text-xs">
            {result === "ok" ? <span className="neon-green">ВЕРНО! +200 кредитов</span> : <span className="text-red-400">Неверно! Ответ: {answers[qIdx]}</span>}
          </p>
          <button onClick={onClose} className="w-full py-2 font-orbitron text-xs border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/20 transition-all">ЗАКРЫТЬ</button>
        </div>
      )}
    </div>
  );
}

export default function MiniGames({ onEarn }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const games = [
    { id: "hack", name: "Взлом сервера", description: "Повтори последовательность", reward: "+500 кредитов", icon: "Terminal", color: "cyan" },
    { id: "rush", name: "Цифровой рывок", description: "Кликай быстрее цели", reward: "+300 кредитов", icon: "Zap", color: "yellow" },
    { id: "binary", name: "Двоичный декодер", description: "Переведи код в число", reward: "+200 кредитов", icon: "Code2", color: "green" },
  ];

  const handleEarn = useCallback((amount: number) => {
    onEarn(amount);
  }, [onEarn]);

  if (active === "hack") return <HackGame onEarn={handleEarn} onClose={() => setActive(null)} />;
  if (active === "rush") return <NumberRush onEarn={handleEarn} onClose={() => setActive(null)} />;
  if (active === "binary") return <BinaryDecoder onEarn={handleEarn} onClose={() => setActive(null)} />;

  return (
    <div className="space-y-3">
      <h3 className="font-orbitron text-sm neon-magenta uppercase tracking-widest flex items-center gap-2">
        <Icon name="Gamepad2" size={14} />
        Мини-игры
      </h3>
      {games.map(game => (
        <div key={game.id} className="cyber-card p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded border border-${game.color}-500/40 bg-${game.color}-500/10 flex items-center justify-center shrink-0`}>
            <Icon name={game.icon as "Terminal"} size={22} className={`text-${game.color}-400`} />
          </div>
          <div className="flex-1">
            <div className="font-orbitron text-xs text-white mb-0.5">{game.name}</div>
            <div className="text-xs text-muted-foreground">{game.description}</div>
            <div className="text-xs neon-green mt-1">{game.reward}</div>
          </div>
          <button
            onClick={() => setActive(game.id)}
            className={`px-4 py-2 font-orbitron text-xs border border-${game.color}-500/60 text-${game.color}-300 rounded hover:bg-${game.color}-500/20 transition-all`}
          >
            ИГРАТЬ
          </button>
        </div>
      ))}
    </div>
  );
}
