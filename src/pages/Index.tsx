import { useState, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ClickZone from "@/components/ClickZone";
import ShopPanel from "@/components/ShopPanel";
import MiniGames from "@/components/MiniGames";
import AchievementsPanel from "@/components/AchievementsPanel";
import SeasonPanel from "@/components/SeasonPanel";
import SettingsPanel from "@/components/SettingsPanel";
import { useGameState } from "@/hooks/useGameState";

type Tab = "game" | "shop" | "minigames" | "achievements" | "season" | "settings";

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "game", label: "Клик", icon: "Zap" },
  { id: "shop", label: "Магазин", icon: "ShoppingBag" },
  { id: "minigames", label: "Игры", icon: "Gamepad2" },
  { id: "achievements", label: "Итоги", icon: "Trophy" },
  { id: "season", label: "Сезон", icon: "Star" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("game");
  const { state, handleClick, buyItem, updateSettings, newAchievement, setNewAchievement } = useGameState();

  const handleMinigameEarn = useCallback((amount: number) => {
    handleClick();
    for (let i = 0; i < amount - 1; i++) handleClick();
  }, [handleClick]);

  useEffect(() => {
    if (newAchievement) {
      const t = setTimeout(() => setNewAchievement(null), 3000);
      return () => clearTimeout(t);
    }
  }, [newAchievement, setNewAchievement]);

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <header className="border-b border-cyan-500/20 bg-[var(--dark-card)]/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded border border-cyan-500/60 bg-cyan-500/10 flex items-center justify-center">
            <Icon name="Hexagon" size={14} className="text-cyan-400" />
          </div>
          <span className="font-orbitron text-sm font-black neon-cyan tracking-widest">NEXUS</span>
          <span className="font-orbitron text-sm text-muted-foreground tracking-widest">CLICKER</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="cyber-card px-3 py-1 flex items-center gap-1.5">
            <Icon name="Coins" size={12} className="text-yellow-400" />
            <span className="font-orbitron text-xs text-yellow-300">{state.credits >= 1000 ? (state.credits / 1000).toFixed(1) + "K" : state.credits}</span>
          </div>
          <div className="cyber-card px-3 py-1 flex items-center gap-1.5">
            <Icon name="Star" size={12} className="text-fuchsia-400" />
            <span className="font-orbitron text-xs text-fuchsia-300">S{state.season.current} · {state.season.level}ур</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 px-4 py-5">
        {tab === "game" && <ClickZone state={state} onClick={handleClick} />}
        {tab === "shop" && <ShopPanel state={state} onBuy={buyItem} />}
        {tab === "minigames" && <MiniGames onEarn={handleMinigameEarn} />}
        {tab === "achievements" && (
          <AchievementsPanel
            achievements={state.achievements}
            totalClicks={state.totalClicks}
            credits={state.credits}
            totalPurchases={state.totalPurchases}
            seasonLevel={state.season.level}
          />
        )}
        {tab === "season" && <SeasonPanel season={state.season} />}
        {tab === "settings" && <SettingsPanel settings={state.settings} onUpdate={updateSettings} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--dark-card)]/95 backdrop-blur-sm border-t border-cyan-500/20 px-2 py-2">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded transition-all ${
                  isActive ? "text-cyan-300" : "text-muted-foreground hover:text-white"
                }`}
              >
                <div className={`relative ${isActive ? "drop-shadow-[0_0_6px_#00ffff]" : ""}`}>
                  <Icon name={item.icon as "Zap"} size={20} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                  )}
                </div>
                <span className="font-orbitron text-[9px] leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="cyber-card border border-yellow-500/60 px-5 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <Icon name="Trophy" size={20} className="text-yellow-400" />
            <div>
              <div className="font-orbitron text-xs text-yellow-400 uppercase tracking-wider">Достижение!</div>
              <div className="font-orbitron text-sm text-white">{newAchievement.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
