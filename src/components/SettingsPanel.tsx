import Icon from "@/components/ui/icon";
import { GameSettings } from "@/hooks/useGameState";

interface Props {
  settings: GameSettings;
  onUpdate: (patch: Partial<GameSettings>) => void;
}

export default function SettingsPanel({ settings, onUpdate }: Props) {
  return (
    <div className="space-y-5">
      <h3 className="font-orbitron text-sm neon-cyan uppercase tracking-widest flex items-center gap-2">
        <Icon name="Settings" size={14} />
        Настройки
      </h3>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground font-ibm uppercase tracking-wider mb-2">Звук</div>
        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Volume2" size={16} className="text-cyan-400" />
            <span className="font-ibm text-sm text-white">Звуковые эффекты</span>
          </div>
          <button
            onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-6 rounded-full border transition-all relative ${
              settings.soundEnabled ? "border-cyan-500 bg-cyan-500/20" : "border-gray-600 bg-muted"
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
              settings.soundEnabled ? "left-6 bg-cyan-400" : "left-0.5 bg-gray-500"
            }`} />
          </button>
        </div>
        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Music" size={16} className="text-fuchsia-400" />
            <span className="font-ibm text-sm text-white">Музыка</span>
          </div>
          <button
            onClick={() => onUpdate({ musicEnabled: !settings.musicEnabled })}
            className={`w-12 h-6 rounded-full border transition-all relative ${
              settings.musicEnabled ? "border-fuchsia-500 bg-fuchsia-500/20" : "border-gray-600 bg-muted"
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
              settings.musicEnabled ? "left-6 bg-fuchsia-400" : "left-0.5 bg-gray-500"
            }`} />
          </button>
        </div>
        <div className="cyber-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Volume1" size={16} className="text-cyan-400" />
            <span className="font-ibm text-sm text-white">Громкость: {settings.volume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.volume}
            onChange={e => onUpdate({ volume: parseInt(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground font-ibm uppercase tracking-wider mb-2">Геймплей</div>
        <div className="cyber-card p-3">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Gauge" size={16} className="text-yellow-400" />
            <span className="font-ibm text-sm text-white">Сложность</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["easy", "normal", "hard"] as const).map(d => {
              const labels = { easy: "Лёгкая", normal: "Нормал.", hard: "Хардкор" };
              const colors = { easy: "cyan", normal: "yellow", hard: "red" };
              const isActive = settings.difficulty === d;
              return (
                <button
                  key={d}
                  onClick={() => onUpdate({ difficulty: d })}
                  className={`py-2 font-orbitron text-xs rounded border transition-all ${
                    isActive
                      ? `border-${colors[d]}-500 text-${colors[d]}-300 bg-${colors[d]}-500/20`
                      : "border-gray-700 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {labels[d]}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {settings.difficulty === "easy" && "×1.5 кредитов за клик"}
            {settings.difficulty === "normal" && "Стандартный множитель ×1"}
            {settings.difficulty === "hard" && "×0.7 кредитов — больше испытаний"}
          </p>
        </div>

        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-fuchsia-400" />
            <span className="font-ibm text-sm text-white">Частицы / эффекты</span>
          </div>
          <button
            onClick={() => onUpdate({ particles: !settings.particles })}
            className={`w-12 h-6 rounded-full border transition-all relative ${
              settings.particles ? "border-fuchsia-500 bg-fuchsia-500/20" : "border-gray-600 bg-muted"
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
              settings.particles ? "left-6 bg-fuchsia-400" : "left-0.5 bg-gray-500"
            }`} />
          </button>
        </div>
      </div>

      <div className="cyber-card p-3 border border-red-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="AlertTriangle" size={14} className="text-red-400" />
          <span className="font-orbitron text-xs text-red-400">Опасная зона</span>
        </div>
        <button
          onClick={() => {
            if (confirm("Сбросить весь прогресс? Это нельзя отменить.")) {
              localStorage.clear();
              location.reload();
            }
          }}
          className="w-full py-2 font-orbitron text-xs border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-all"
        >
          СБРОСИТЬ ПРОГРЕСС
        </button>
      </div>
    </div>
  );
}
