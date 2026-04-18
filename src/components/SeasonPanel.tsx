import Icon from "@/components/ui/icon";
import { SeasonData } from "@/hooks/useGameState";

interface Props {
  season: SeasonData;
}

const MILESTONE_LEVELS = [5, 10, 20, 35, 50];

export default function SeasonPanel({ season }: Props) {
  const progressPercent = Math.min(100, (season.xp / season.xpRequired) * 100);

  const tracks = [
    { level: 1, name: "Новобранец", reward: "Неоновый облик", icon: "User" },
    { level: 5, name: "Оперативник", reward: "x2 клик на 1 час", icon: "Zap" },
    { level: 10, name: "Хакер", reward: "Эксклюзивный значок", icon: "Shield" },
    { level: 20, name: "Кибервоин", reward: "Бонус пассивного дохода", icon: "Sword" },
    { level: 35, name: "Призрак сети", reward: "Легендарный скин", icon: "Ghost" },
    { level: 50, name: "Цифровой Бог", reward: "Легендарный ИИ-агент", icon: "Crown" },
  ];

  return (
    <div className="space-y-5">
      <div className="cyber-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-orbitron text-xs text-muted-foreground uppercase tracking-wider">Сезон {season.current}</div>
            <div className="font-orbitron text-base neon-cyan">{season.name}</div>
          </div>
          <div className="text-right">
            <div className="font-orbitron text-2xl font-black text-white">{season.level}</div>
            <div className="font-orbitron text-xs text-muted-foreground">/ {season.maxLevel}</div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-ibm">
          <span>Опыт сезона</span>
          <span className="font-orbitron">{season.xp} / {season.xpRequired}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-1">
          {[0, 25, 50, 75, 100].map(p => (
            <div key={p} className={`w-1 h-1 rounded-full ${progressPercent >= p ? "bg-cyan-400" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-orbitron text-xs neon-magenta uppercase tracking-widest mb-3 flex items-center gap-2">
          <Icon name="Gift" size={12} />
          Награды сезона
        </h3>
        <div className="space-y-2">
          {tracks.map(track => {
            const reached = season.level >= track.level;
            const isCurrent = season.level >= track.level - 4 && season.level < track.level;
            return (
              <div
                key={track.level}
                className={`cyber-card p-3 flex items-center gap-3 transition-all ${reached ? "opacity-100" : "opacity-40"}`}
              >
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${
                  reached
                    ? "border-fuchsia-500 bg-fuchsia-500/20"
                    : isCurrent
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : "border-gray-700 bg-muted"
                }`}>
                  <Icon name={track.icon as "User"} size={14} className={reached ? "text-fuchsia-400" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-white">{track.name}</span>
                    {MILESTONE_LEVELS.includes(track.level) && (
                      <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-orbitron rounded">
                        Ур.{track.level}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{track.reward}</div>
                </div>
                {reached && <Icon name="CheckCircle2" size={14} className="text-fuchsia-400 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
