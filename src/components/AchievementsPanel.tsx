import Icon from "@/components/ui/icon";
import { Achievement } from "@/hooks/useGameState";

interface Props {
  achievements: Achievement[];
  totalClicks: number;
  credits: number;
  totalPurchases: number;
  seasonLevel: number;
}

export default function AchievementsPanel({ achievements, totalClicks, credits, totalPurchases, seasonLevel }: Props) {
  const unlocked = achievements.filter(a => a.unlocked).length;

  const getProgress = (a: Achievement) => {
    let value = 0;
    if (a.type === "clicks") value = totalClicks;
    if (a.type === "credits") value = credits;
    if (a.type === "purchases") value = totalPurchases;
    if (a.type === "season") value = seasonLevel;
    return Math.min(1, value / a.requirement);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron text-sm neon-yellow uppercase tracking-widest flex items-center gap-2">
          <Icon name="Trophy" size={14} />
          Достижения
        </h3>
        <span className="font-orbitron text-xs text-muted-foreground">{unlocked} / {achievements.length}</span>
      </div>

      <div className="h-2 bg-muted rounded-full">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all"
          style={{ width: `${(unlocked / achievements.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {achievements.map(a => {
          const progress = getProgress(a);
          return (
            <div
              key={a.id}
              className={`cyber-card p-3 flex items-center gap-3 transition-all ${a.unlocked ? "opacity-100" : "opacity-50"}`}
            >
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${
                a.unlocked
                  ? "border-yellow-500 bg-yellow-500/20"
                  : "border-gray-700 bg-muted"
              }`}>
                <Icon
                  name={a.icon as "Trophy"}
                  size={18}
                  className={a.unlocked ? "text-yellow-400" : "text-gray-600"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-orbitron text-xs text-white mb-0.5">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.description}</div>
                {!a.unlocked && (
                  <div className="mt-1 h-1 bg-muted rounded-full">
                    <div
                      className="h-full bg-yellow-500/60 rounded-full transition-all"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
              {a.unlocked && (
                <Icon name="CheckCircle2" size={16} className="text-yellow-400 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
