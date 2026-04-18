import Icon from "@/components/ui/icon";
import { GameState, ShopItem } from "@/hooks/useGameState";

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
}

function getItemPrice(item: ShopItem) {
  return Math.floor(item.price * Math.pow(1.15, item.owned));
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function ShopPanel({ state, onBuy }: Props) {
  const specialItems = [
    { id: "boost_click", name: "Клик x2", description: "Удваивает силу клика на 60 сек", price: 500, icon: "TrendingUp" },
    { id: "boost_passive", name: "Пассив x3", description: "Тройной пассивный доход на 30 сек", price: 1500, icon: "Activity" },
    { id: "credit_pack_s", name: "Пак «Старт»", description: "Мгновенно +1 000 кредитов", price: 800, icon: "Package" },
    { id: "credit_pack_m", name: "Пак «Мегабайт»", description: "Мгновенно +10 000 кредитов", price: 7500, icon: "Layers" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-orbitron text-sm neon-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
          <Icon name="ShoppingBag" size={14} />
          Апгрейды
        </h3>
        <div className="space-y-2">
          {state.shopItems.map(item => {
            const price = getItemPrice(item);
            const canAfford = state.credits >= price;
            return (
              <div key={item.id} className="cyber-card p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-cyan-500/30 flex items-center justify-center bg-cyan-500/10 shrink-0">
                  <Icon name={item.icon as "Cpu"} size={20} className="text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs text-white">{item.name}</span>
                    {item.owned > 0 && (
                      <span className="text-xs font-orbitron neon-magenta">×{item.owned}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <button
                  onClick={() => onBuy(item.id)}
                  disabled={!canAfford}
                  className={`shrink-0 px-3 py-1.5 font-orbitron text-xs rounded border transition-all ${
                    canAfford
                      ? "border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_10px_#00ffff55]"
                      : "border-gray-700 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {formatNumber(price)}¢
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-orbitron text-sm neon-magenta uppercase tracking-widest mb-3 flex items-center gap-2">
          <Icon name="Sparkles" size={14} />
          Специальные предметы
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {specialItems.map(item => (
            <div key={item.id} className="cyber-card p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon name={item.icon as "Package"} size={16} className="text-fuchsia-400" />
                <span className="font-orbitron text-xs text-white">{item.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <button className="w-full py-1 font-orbitron text-xs border border-fuchsia-500/50 text-fuchsia-300 rounded hover:bg-fuchsia-500/20 transition-all">
                {formatNumber(item.price)}¢
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
