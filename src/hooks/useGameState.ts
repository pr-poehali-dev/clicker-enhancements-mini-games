import { useState, useEffect, useCallback, useRef } from "react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  type: "clicks" | "credits" | "purchases" | "season";
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  owned: number;
  clickBonus: number;
  passiveBonus: number;
  icon: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: "easy" | "normal" | "hard";
  particles: boolean;
  volume: number;
}

export interface SeasonData {
  current: number;
  name: string;
  xp: number;
  xpRequired: number;
  level: number;
  maxLevel: number;
  rewards: string[];
}

export interface GameState {
  credits: number;
  totalClicks: number;
  clicksPerSecond: number;
  clickPower: number;
  passiveIncome: number;
  shopItems: ShopItem[];
  achievements: Achievement[];
  settings: GameSettings;
  season: SeasonData;
  totalPurchases: number;
}

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  { id: "cursor", name: "Авто-курсор", description: "Автоматически кликает раз в секунду", price: 15, owned: 0, clickBonus: 0, passiveBonus: 1, icon: "MousePointer" },
  { id: "chip", name: "Нейрочип", description: "+2 кредита за клик", price: 100, owned: 0, clickBonus: 2, passiveBonus: 0, icon: "Cpu" },
  { id: "server", name: "Сервер", description: "+5 кредитов в секунду", price: 500, owned: 0, clickBonus: 0, passiveBonus: 5, icon: "Server" },
  { id: "drone", name: "Нано-дрон", description: "+10 кредитов за клик", price: 2000, owned: 0, clickBonus: 10, passiveBonus: 0, icon: "Zap" },
  { id: "matrix", name: "Матрица данных", description: "+50 кредитов в секунду", price: 10000, owned: 0, clickBonus: 0, passiveBonus: 50, icon: "Database" },
  { id: "ai", name: "ИИ-агент", description: "+100 кредитов за клик и в секунду", price: 50000, owned: 0, clickBonus: 100, passiveBonus: 100, icon: "Bot" },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_click", name: "Первый контакт", description: "Сделать первый клик", icon: "Hand", unlocked: false, requirement: 1, type: "clicks" },
  { id: "clicks_100", name: "Новобранец", description: "100 кликов", icon: "Target", unlocked: false, requirement: 100, type: "clicks" },
  { id: "clicks_1000", name: "Оперативник", description: "1 000 кликов", icon: "Shield", unlocked: false, requirement: 1000, type: "clicks" },
  { id: "clicks_10000", name: "Киберволк", description: "10 000 кликов", icon: "Sword", unlocked: false, requirement: 10000, type: "clicks" },
  { id: "clicks_100000", name: "Легенда сети", description: "100 000 кликов", icon: "Crown", unlocked: false, requirement: 100000, type: "clicks" },
  { id: "credits_1000", name: "Богатей", description: "Заработать 1 000 кредитов", icon: "Coins", unlocked: false, requirement: 1000, type: "credits" },
  { id: "credits_100000", name: "Хакер-миллионер", description: "Заработать 100 000 кредитов", icon: "Banknote", unlocked: false, requirement: 100000, type: "credits" },
  { id: "purchases_1", name: "Покупатель", description: "Первая покупка в магазине", icon: "ShoppingCart", unlocked: false, requirement: 1, type: "purchases" },
  { id: "purchases_10", name: "Коллекционер", description: "10 покупок в магазине", icon: "Package", unlocked: false, requirement: 10, type: "purchases" },
  { id: "season_5", name: "Ветеран сезона", description: "Достичь 5 уровня сезона", icon: "Star", unlocked: false, requirement: 5, type: "season" },
];

const SAVE_KEY = "nexus_clicker_save";

function loadState(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch (_e) {
    void _e;
  }
}

export function useGameState() {
  const saved = loadState();

  const [credits, setCredits] = useState<number>(saved.credits ?? 0);
  const [totalClicks, setTotalClicks] = useState<number>(saved.totalClicks ?? 0);
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    if (saved.shopItems) {
      return INITIAL_SHOP_ITEMS.map(item => ({
        ...item,
        owned: saved.shopItems?.find(s => s.id === item.id)?.owned ?? 0,
      }));
    }
    return INITIAL_SHOP_ITEMS;
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (saved.achievements) {
      return INITIAL_ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: saved.achievements?.find(s => s.id === a.id)?.unlocked ?? false,
      }));
    }
    return INITIAL_ACHIEVEMENTS;
  });
  const [settings, setSettings] = useState<GameSettings>(saved.settings ?? {
    soundEnabled: true,
    musicEnabled: false,
    difficulty: "normal",
    particles: true,
    volume: 70,
  });
  const [season, setSeason] = useState<SeasonData>(saved.season ?? {
    current: 1,
    name: "Кибер Рассвет",
    xp: 0,
    xpRequired: 1000,
    level: 1,
    maxLevel: 50,
    rewards: ["Неоновый облик", "x2 клик на 1 час", "Эксклюзивный значок", "Бонус пассивного дохода", "Легендарный ИИ-агент"],
  });
  const [totalPurchases, setTotalPurchases] = useState<number>(saved.totalPurchases ?? 0);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const clickPower = 1 + shopItems.reduce((sum, item) => sum + item.clickBonus * item.owned, 0);
  const passiveIncome = shopItems.reduce((sum, item) => sum + item.passiveBonus * item.owned, 0);
  const clicksPerSecond = passiveIncome;

  const difficultyMultiplier = settings.difficulty === "easy" ? 1.5 : settings.difficulty === "hard" ? 0.7 : 1;

  const totalCreditsEarned = useRef(0);
  totalCreditsEarned.current = credits;

  const checkAchievements = useCallback((
    currentClicks: number,
    currentCredits: number,
    currentPurchases: number,
    currentSeasonLevel: number,
    currentAchievements: Achievement[]
  ) => {
    let updated = false;
    const newList = currentAchievements.map(a => {
      if (a.unlocked) return a;
      let value = 0;
      if (a.type === "clicks") value = currentClicks;
      if (a.type === "credits") value = currentCredits;
      if (a.type === "purchases") value = currentPurchases;
      if (a.type === "season") value = currentSeasonLevel;
      if (value >= a.requirement) {
        updated = true;
        setNewAchievement({ ...a, unlocked: true });
        return { ...a, unlocked: true };
      }
      return a;
    });
    if (updated) setAchievements(newList);
    return newList;
  }, []);

  const handleClick = useCallback(() => {
    const earned = Math.floor(clickPower * difficultyMultiplier);
    setCredits(prev => prev + earned);
    setTotalClicks(prev => {
      const next = prev + 1;
      return next;
    });
    setSeason(prev => {
      const xpGain = Math.floor(earned * 0.1) + 1;
      const newXp = prev.xp + xpGain;
      if (newXp >= prev.xpRequired && prev.level < prev.maxLevel) {
        return { ...prev, xp: newXp - prev.xpRequired, level: prev.level + 1, xpRequired: Math.floor(prev.xpRequired * 1.5) };
      }
      return { ...prev, xp: newXp };
    });
  }, [clickPower, difficultyMultiplier]);

  const earnCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
    setSeason(prev => {
      const newXp = prev.xp + Math.floor(amount * 0.05) + 1;
      if (newXp >= prev.xpRequired && prev.level < prev.maxLevel) {
        return { ...prev, xp: newXp - prev.xpRequired, level: prev.level + 1, xpRequired: Math.floor(prev.xpRequired * 1.5) };
      }
      return { ...prev, xp: newXp };
    });
  }, []);

  const buyItem = useCallback((itemId: string) => {
    setShopItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      const price = Math.floor(item.price * Math.pow(1.15, item.owned));
      if (credits < price) return prev;
      setCredits(c => c - price);
      setTotalPurchases(p => p + 1);
      return prev.map(i => i.id === itemId ? { ...i, owned: i.owned + 1 } : i);
    });
  }, [credits]);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (passiveIncome <= 0) return;
    const interval = setInterval(() => {
      const earned = Math.floor(passiveIncome * difficultyMultiplier);
      setCredits(prev => prev + earned);
      setSeason(prev => {
        const newXp = prev.xp + 1;
        if (newXp >= prev.xpRequired && prev.level < prev.maxLevel) {
          return { ...prev, xp: newXp - prev.xpRequired, level: prev.level + 1, xpRequired: Math.floor(prev.xpRequired * 1.5) };
        }
        return { ...prev, xp: newXp };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [passiveIncome, difficultyMultiplier]);

  useEffect(() => {
    checkAchievements(totalClicks, credits, totalPurchases, season.level, achievements);
  }, [totalClicks, credits, totalPurchases, season.level]);

  const state: GameState = { credits, totalClicks, clicksPerSecond, clickPower, passiveIncome, shopItems, achievements, settings, season, totalPurchases };

  useEffect(() => {
    const timer = setInterval(() => saveState(state), 5000);
    return () => clearInterval(timer);
  }, [credits, totalClicks, shopItems, achievements, settings, season, totalPurchases]);

  return { state, handleClick, earnCredits, buyItem, updateSettings, newAchievement, setNewAchievement };
}