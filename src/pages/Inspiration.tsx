import { useState, useMemo, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  Shuffle,
  Check,
  X,
  ChefHat,
  RotateCcw,
  Zap,
  Heart,
  Plus,
  Search,
  BookmarkPlus,
  Bookmark,
  Clock,
  ChefHat as ChefHatIcon,
  UtensilsCrossed,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/common/Badge';
import { useSpiceStore } from '@/store/useSpiceStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useShoppingStore } from '@/store/useShoppingStore';
import { useRecordStore } from '@/store/useRecordStore';
import { classicPairingsData } from '@/data/classicPairings';
import { dishSuggestionsData } from '@/data/dishSuggestions';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { Spice, ClassicPairing, DishSuggestion, FlavorTag, SpiceUsage } from '@/types';

interface PairingMatch {
  pairing: ClassicPairing;
  matchedSpices: string[];
  missingSpices: string[];
  matchRate: number;
}

interface ChallengeCard {
  spice: Spice;
  flipped: boolean;
  suggestion: string;
}

interface DishMatch {
  dish: DishSuggestion;
  matchedSpices: string[];
  missingSpices: string[];
  matchRate: number;
}

type TabType = 'dishes' | 'pairings' | 'challenge' | 'favorites';

const creativeSuggestions: Record<string, string[]> = {
  default: [
    '尝试搭配乳制品，柔和香料的辛辣感',
    '用橄榄油浸渍，制作风味蘸料',
    '加入热锅冷油，激发底层香气',
    '与蜂蜜结合，打造甜咸平衡',
    '用白酒或料酒烹炒，释放芳香物质',
    '低温慢炖，让风味逐层渗透',
  ],
  香草类: [
    '切碎后拌入沙拉，增添清新草本香',
    '制作香草黄油，涂抹面包或烹饪肉类',
    '加入橄榄油浸泡，制作香草油',
    '烘焙时撒入表面，增加视觉和嗅觉层次',
  ],
  辛香类: [
    '现磨使用，香气释放最充分',
    '热油爆香，作为菜肴基底',
    '搭配奶油白酱，柔和辛辣感',
    '加入腌制料，提前入味',
  ],
  辣椒类: [
    '与花椒搭配，打造麻辣风味',
    '用醋浸泡，制作酸辣调料',
    '低温油炸，提取红色素和辣度',
    '搭配豆类，增加植物蛋白吸收',
  ],
  籽类: [
    '干锅烘炒后研磨，香气翻倍',
    '加入咖喱基底，增加层次厚度',
    '制作香料包，炖煮汤品时取出',
    '搭配酸奶，制作印度风味蘸酱',
  ],
  根茎类: [
    '磨粉加入米饭，制作黄金饭',
    '与椰奶同煮，东南亚风味必备',
    '加热牛奶，制作暖身黄金奶',
    '搭配花椰菜等根茎蔬菜同炒',
  ],
  皮类: [
    '制作卤水时加入，增加甜香底味',
    '与苹果、梨等水果同炖',
    '热红酒必备香料，节日氛围拉满',
    '磨粉加入烘焙甜点，温暖冬日',
  ],
  叶类: [
    '汤底增香必备，烹饪后取出',
    '制作意面酱时加入几片',
    '与番茄同炖，酸甜与草本完美融合',
    '塞入整鸡腹腔，烘烤增香',
  ],
  混合类: [
    '直接作为复合调味料使用',
    '腌制肉类时提前涂抹',
    '制作蘸料盐，提升食用体验',
    '撒入烤制表面，焦香四溢',
  ],
 花香类: [
    '甜点制作的点睛之笔',
    '浸泡于糖浆中，制作花香糖浆',
    '与米饭同煮，波斯风味藏红花饭',
    '加入奶茶，宫廷养生饮品',
  ],
};

const flavorTags: FlavorTag[] = [
  '麻辣',
  '草本',
  '烟熏',
  '甜香',
  '咖喱',
  '卤味',
  '香辣',
  '清新',
  '浓郁',
];

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-spice-sage/15 text-spice-sageDark',
  medium: 'bg-spice-saffron/15 text-spice-brownDark',
  hard: 'bg-spice-cinnamon/15 text-spice-cinnamon',
};

function getSuggestion(category: string): string {
  const list = creativeSuggestions[category] || creativeSuggestions.default;
  return list[Math.floor(Math.random() * list.length)];
}

function getThreeWaySuggestion(categories: string[]): string {
  const hasHerb = categories.some((c) => ['香草类', '叶类'].includes(c));
  const hasSpicy = categories.some((c) => ['辣椒类', '辛香类'].includes(c));
  const hasAromatic = categories.some((c) => ['皮类', '籽类', '根茎类', '花香类'].includes(c));

  if (hasHerb && hasSpicy) {
    return '辛辣香草组合：建议用于腌制肉类或炒制海鲜，香草的清新平衡辣味，层次分明回味无穷';
  }
  if (hasHerb && hasAromatic) {
    return '草本芳香组合：完美适配炖汤和慢炖菜，草本清香与温暖香料融合，汤底醇厚';
  }
  if (hasSpicy && hasAromatic) {
    return '辛香浓郁组合：咖喱、炖肉、烧烤的绝佳选择，香辣交织，异域风情拉满';
  }
  if (hasHerb) {
    return '清新草本调：适合搭配鸡肉、鱼肉、蔬菜，清淡中见层次，健康烹饪首选';
  }
  if (hasSpicy) {
    return '热辣刺激调：川菜、湘菜、墨西哥菜灵魂，注意用量，可搭配乳制品解辣';
  }
  if (hasAromatic) {
    return '温暖芳香调：适合红烧、卤味、烘焙，甜香气息让菜肴更有深度';
  }
  return '创意混搭调：突破常规，尝试中东或北非风味，加入干果和couscous带来惊喜';
}

export default function Inspiration() {
  const spices = useSpiceStore((state) => state.spices);
  const { toggleFavorite, isFavorite, getFavoritesByType } = useFavoriteStore();
  const { addItemByName: addToShoppingByName } = useShoppingStore();
  const { addDraft } = useRecordStore();

  const [activeTab, setActiveTab] = useState<TabType>('dishes');
  const [shuffleKey, setShuffleKey] = useState(0);
  const [challengeCards, setChallengeCards] = useState<ChallengeCard[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<FlavorTag[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');

  const availableSpiceNames = useMemo(() => new Set(spices.map((s) => s.name)), [spices]);
  const availableSpiceMap = useMemo(() => {
    const map = new Map<string, Spice>();
    spices.forEach((s) => map.set(s.name, s));
    return map;
  }, [spices]);

  const pairingMatches = useMemo<PairingMatch[]>(() => {
    return classicPairingsData
      .map((pairing) => {
        const matchedSpices: string[] = [];
        const missingSpices: string[] = [];
        pairing.spices.forEach((spice) => {
          if (availableSpiceNames.has(spice.name)) {
            matchedSpices.push(spice.name);
          } else {
            missingSpices.push(spice.name);
          }
        });
        const matchRate =
          pairing.spices.length > 0
            ? Math.round((matchedSpices.length / pairing.spices.length) * 100)
            : 0;
        return { pairing, matchedSpices, missingSpices, matchRate };
      })
      .filter((m) => m.matchRate > 0)
      .sort((a, b) => b.matchRate - a.matchRate || b.matchedSpices.length - a.matchedSpices.length)
      .slice(0, 6);
  }, [availableSpiceNames]);

  const dishMatches = useMemo<DishMatch[]>(() => {
    let dishes = dishSuggestionsData;

    if (selectedFlavors.length > 0) {
      dishes = dishes.filter((dish) =>
        selectedFlavors.some((flavor) => dish.flavorTags.includes(flavor))
      );
    }

    if (ingredientInput.trim()) {
      const keywords = ingredientInput
        .split(/[,，、\s]+/)
        .filter(Boolean)
        .map((k) => k.toLowerCase());
      dishes = dishes.filter(
        (dish) =>
          keywords.some((keyword) =>
            dish.ingredients.some((ing) => ing.toLowerCase().includes(keyword))
          ) ||
          keywords.some((keyword) => dish.name.toLowerCase().includes(keyword))
      );
    }

    return dishes
      .map((dish) => {
        const matchedSpices: string[] = [];
        const missingSpices: string[] = [];
        dish.requiredSpices.forEach((spice) => {
          if (availableSpiceNames.has(spice.name)) {
            matchedSpices.push(spice.name);
          } else {
            missingSpices.push(spice.name);
          }
        });
        const matchRate =
          dish.requiredSpices.length > 0
            ? Math.round((matchedSpices.length / dish.requiredSpices.length) * 100)
            : 0;
        return { dish, matchedSpices, missingSpices, matchRate };
      })
      .sort((a, b) => b.matchRate - a.matchRate || b.matchedSpices.length - a.matchedSpices.length);
  }, [availableSpiceNames, selectedFlavors, ingredientInput]);

  const favoriteDishes = useMemo(() => {
    const favs = getFavoritesByType('dish');
    return favs
      .map((fav) => {
        const dish = dishSuggestionsData.find((d) => d.id === fav.itemId);
        if (!dish) return null;
        const matchedSpices: string[] = [];
        const missingSpices: string[] = [];
        dish.requiredSpices.forEach((spice) => {
          if (availableSpiceNames.has(spice.name)) {
            matchedSpices.push(spice.name);
          } else {
            missingSpices.push(spice.name);
          }
        });
        return { dish, matchedSpices, missingSpices, matchRate: 0 };
      })
      .filter(Boolean) as DishMatch[];
  }, [getFavoritesByType, availableSpiceNames]);

  const favoritePairings = useMemo(() => {
    const favs = getFavoritesByType('pairing');
    return favs
      .map((fav) => {
        const pairing = classicPairingsData.find((p) => p.id === fav.itemId);
        if (!pairing) return null;
        const matchedSpices: string[] = [];
        const missingSpices: string[] = [];
        pairing.spices.forEach((spice) => {
          if (availableSpiceNames.has(spice.name)) {
            matchedSpices.push(spice.name);
          } else {
            missingSpices.push(spice.name);
          }
        });
        const matchRate =
          pairing.spices.length > 0
            ? Math.round((matchedSpices.length / pairing.spices.length) * 100)
            : 0;
        return { pairing, matchedSpices, missingSpices, matchRate };
      })
      .filter(Boolean) as PairingMatch[];
  }, [getFavoritesByType, availableSpiceNames]);

  const favoriteChallenges = useMemo(() => {
    return getFavoritesByType('challenge');
  }, [getFavoritesByType]);

  const generateChallenge = () => {
    const shuffled = [...spices].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(3, spices.length));
    const cards: ChallengeCard[] = selected.map((spice) => ({
      spice,
      flipped: false,
      suggestion: getSuggestion(spice.category),
    }));
    setChallengeCards(cards);
    setShuffleKey((k) => k + 1);
  };

  useEffect(() => {
    generateChallenge();
  }, [spices.length]);

  const allFlipped = challengeCards.length === 3 && challengeCards.every((c) => c.flipped);

  const threeWaySuggestion = useMemo(() => {
    if (!allFlipped) return '';
    const cats = challengeCards.map((c) => c.spice.category);
    return getThreeWaySuggestion(cats);
  }, [allFlipped, challengeCards]);

  const flipCard = (index: number) => {
    setChallengeCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, flipped: !card.flipped } : card))
    );
  };

  const toggleFlavor = (flavor: FlavorTag) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((f) => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleToggleFavorite = (type: 'dish' | 'pairing' | 'challenge', itemId: string, itemData: Record<string, unknown>) => {
    toggleFavorite(type, itemId, itemData);
  };

  const handleAddMissingToShopping = (missingSpices: string[], category?: string) => {
    missingSpices.forEach((spiceName) => {
      addToShoppingByName(spiceName, category, '创意灵感推荐补充');
    });
    alert(`已将 ${missingSpices.length} 种香料添加到采购清单`);
  };

  const handleSaveChallengeAsDraft = () => {
    if (!allFlipped) return;

    const usages: SpiceUsage[] = challengeCards.map((card) => ({
      spiceId: card.spice.id,
      spiceName: card.spice.name,
      amount: 2,
      unit: card.spice.unit,
    }));

    const dishName = `${challengeCards.map((c) => c.spice.name).join('·')}创意菜`;

    addDraft({
      dishName,
      cookDate: new Date().toISOString().split('T')[0],
      ingredients: '',
      usages,
      flavorRating: 3,
      notes: '来自随机三香料挑战的创意搭配',
      source: 'challenge',
    });

    alert('已保存为烹饪记录草稿，可在记录页面查看');
  };

  const handleSaveDishAsDraft = (dish: DishSuggestion) => {
    const usages: SpiceUsage[] = dish.requiredSpices
      .map((spice) => {
        const spiceInfo = availableSpiceMap.get(spice.name);
        if (!spiceInfo) return null;
        const amountMatch = spice.amount.match(/[\d.]+/);
        const amount = amountMatch ? Number(amountMatch[0]) : 2;
        const unitMatch = spice.amount.match(/[^0-9.]+/);
        const unit = unitMatch ? unitMatch[0].trim() : spiceInfo.unit;
        return {
          spiceId: spiceInfo.id,
          spiceName: spiceInfo.name,
          amount,
          unit,
        };
      })
      .filter(Boolean) as SpiceUsage[];

    if (usages.length === 0) {
      alert('没有匹配到库存中的香料');
      return;
    }

    addDraft({
      dishName: dish.name,
      cookDate: new Date().toISOString().split('T')[0],
      ingredients: dish.ingredients.join('、'),
      usages,
      flavorRating: 3,
      notes: `来自创意灵感：${dish.description}`,
      source: 'dish',
    });

    alert('已保存为烹饪记录草稿，可在记录页面查看');
  };

  const tabs = [
    { key: 'dishes', label: '菜品推荐', icon: UtensilsCrossed },
    { key: 'pairings', label: '经典搭配', icon: Sparkles },
    { key: 'challenge', label: '风味挑战', icon: Shuffle },
    { key: 'favorites', label: '我的收藏', icon: Heart },
  ];

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-spice-charcoal">创意灵感</h1>
          <p className="mt-1 text-sm text-spice-brown/70">发现香料的无限可能，激发烹饪创意</p>
        </div>

        <div className="flex rounded-xl bg-spice-cream p-1 gap-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-white text-spice-sageDark shadow-sm'
                    : 'text-spice-brown/60 hover:text-spice-charcoal'
                )}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'dishes' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-spice-creamDark p-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-spice-sage" />
                <h3 className="text-sm font-semibold text-spice-charcoal">输入食材找灵感</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="输入食材名称，如：牛肉、鸡肉、土豆..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-spice-cream border border-spice-creamDark text-sm text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
                />
                {ingredientInput && (
                  <button
                    onClick={() => setIngredientInput('')}
                    className="p-2.5 rounded-xl text-spice-brown/60 hover:text-spice-charcoal hover:bg-spice-cream transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-spice-creamDark p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-spice-saffron" />
                <h3 className="text-sm font-semibold text-spice-charcoal">按风味筛选</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {flavorTags.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => toggleFlavor(flavor)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      selectedFlavors.includes(flavor)
                        ? 'bg-spice-sage text-white'
                        : 'bg-spice-cream text-spice-brown hover:bg-spice-creamDark'
                    )}
                  >
                    {flavor}
                  </button>
                ))}
                {selectedFlavors.length > 0 && (
                  <button
                    onClick={() => setSelectedFlavors([])}
                    className="px-3 py-1.5 rounded-full text-sm text-spice-cinnamon hover:bg-spice-cinnamon/10 transition-colors"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-spice-creamDark p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spice-sage to-spice-sageDark flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                      推荐菜品
                    </h2>
                    <p className="text-xs text-spice-brown/60">基于你的香料库存推荐</p>
                  </div>
                </div>
                <Badge text={`${dishMatches.length}道`} variant="info" />
              </div>

              {dishMatches.length === 0 ? (
                <div className="py-16 text-center">
                  <Sparkles className="mx-auto h-14 w-14 text-spice-brown/30" />
                  <p className="mt-4 text-spice-brown/60">暂无匹配菜品</p>
                  <p className="text-sm text-spice-brown/40 mt-1">试试调整筛选条件</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dishMatches.map(({ dish, matchedSpices, missingSpices, matchRate }) => {
                    const isFav = isFavorite('dish', dish.id);
                    return (
                      <div
                        key={dish.id}
                        className="rounded-xl border border-spice-creamDark overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-2 bg-spice-creamDark">
                          <div
                            className={cn(
                              'h-full transition-all duration-500',
                              matchRate === 100
                                ? 'bg-gradient-to-r from-spice-sage to-spice-sageDark'
                                : matchRate >= 50
                                ? 'bg-gradient-to-r from-spice-saffron to-spice-brown'
                                : 'bg-gradient-to-r from-spice-cinnamon to-spice-brown'
                            )}
                            style={{ width: `${matchRate}%` }}
                          />
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-spice-charcoal">
                                  {dish.name}
                                </h3>
                                <Badge text={dish.cuisineType} variant="notice" />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  text={difficultyLabels[dish.difficulty]}
                                  className={cn(difficultyColors[dish.difficulty])}
                                />
                                {dish.cookTime && (
                                  <span className="flex items-center gap-1 text-xs text-spice-brown/60">
                                    <Clock className="h-3 w-3" />
                                    {dish.cookTime}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() =>
                                  handleToggleFavorite('dish', dish.id, { name: dish.name })
                                }
                                className="p-1.5 rounded-lg hover:bg-spice-cream transition-colors"
                              >
                                {isFav ? (
                                  <Heart className="h-4 w-4 text-spice-cinnamon fill-spice-cinnamon" />
                                ) : (
                                  <Heart className="h-4 w-4 text-spice-brown/40" />
                                )}
                              </button>
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm',
                                  matchRate === 100
                                    ? 'bg-spice-sage/15 text-spice-sageDark'
                                    : matchRate >= 50
                                    ? 'bg-spice-saffron/15 text-spice-brownDark'
                                    : 'bg-spice-cinnamon/15 text-spice-cinnamon'
                                )}
                              >
                                {matchRate}%
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-spice-brown/70 leading-relaxed">
                            {dish.description}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {dish.flavorTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md text-xs bg-spice-cream text-spice-brown"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="space-y-2 pt-2 border-t border-spice-creamDark/50">
                            {matchedSpices.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-spice-sageDark mb-1.5">
                                  <Check className="h-3 w-3" />
                                  <span>已有 ({matchedSpices.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {matchedSpices.map((s) => (
                                    <span
                                      key={s}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-spice-sage/10 text-spice-sageDark text-xs border border-spice-sage/20"
                                    >
                                      <span>{generateSpiceEmoji(s)}</span>
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {missingSpices.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-1 text-xs font-semibold text-spice-cinnamon">
                                    <X className="h-3 w-3" />
                                    <span>缺少 ({missingSpices.length})</span>
                                  </div>
                                  <button
                                    onClick={() => handleAddMissingToShopping(missingSpices, dish.requiredSpices[0]?.category)}
                                    className="text-xs text-spice-sageDark hover:text-spice-sage flex items-center gap-1"
                                  >
                                    <Plus className="h-3 w-3" />
                                    加入采购
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {missingSpices.map((s) => (
                                    <span
                                      key={s}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-spice-cinnamon/10 text-spice-cinnamon text-xs border border-spice-cinnamon/20 border-dashed"
                                    >
                                      <span>{generateSpiceEmoji(s)}</span>
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleSaveDishAsDraft(dish)}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-spice-sage/10 text-spice-sageDark hover:bg-spice-sage/20 transition-colors"
                          >
                            <BookmarkPlus className="h-4 w-4" />
                            保存为烹饪草稿
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pairings' && (
          <div className="rounded-2xl bg-white border border-spice-creamDark p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spice-sage to-spice-sageDark flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                    库存搭配推荐
                  </h2>
                  <p className="text-xs text-spice-brown/60">基于你的香料库存匹配经典搭配</p>
                </div>
              </div>
              <Badge text={`${pairingMatches.length}个方案`} variant="info" />
            </div>

            {pairingMatches.length === 0 ? (
              <div className="py-16 text-center">
                <Sparkles className="mx-auto h-14 w-14 text-spice-brown/30" />
                <p className="mt-4 text-spice-brown/60">暂无匹配方案</p>
                <p className="text-sm text-spice-brown/40 mt-1">添加更多香料解锁搭配推荐</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pairingMatches.map((match) => {
                  const isFav = isFavorite('pairing', match.pairing.id);
                  return (
                    <div
                      key={match.pairing.id}
                      className="rounded-xl border border-spice-creamDark overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-2 bg-spice-creamDark">
                        <div
                          className={cn(
                            'h-full transition-all duration-500',
                            match.matchRate === 100
                              ? 'bg-gradient-to-r from-spice-sage to-spice-sageDark'
                              : match.matchRate >= 50
                              ? 'bg-gradient-to-r from-spice-saffron to-spice-brown'
                              : 'bg-gradient-to-r from-spice-cinnamon to-spice-brown'
                          )}
                          style={{ width: `${match.matchRate}%` }}
                        />
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge text={match.pairing.cuisineType} variant="notice" />
                            <h3 className="font-semibold text-spice-charcoal mt-1.5">
                              {match.pairing.targetIngredient}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleToggleFavorite('pairing', match.pairing.id, {
                                  name: match.pairing.targetIngredient,
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-spice-cream transition-colors"
                            >
                              {isFav ? (
                                <Heart className="h-4 w-4 text-spice-cinnamon fill-spice-cinnamon" />
                              ) : (
                                <Heart className="h-4 w-4 text-spice-brown/40" />
                              )}
                            </button>
                            <div
                              className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm',
                                match.matchRate === 100
                                  ? 'bg-spice-sage/15 text-spice-sageDark'
                                  : match.matchRate >= 50
                                  ? 'bg-spice-saffron/15 text-spice-brownDark'
                                  : 'bg-spice-cinnamon/15 text-spice-cinnamon'
                              )}
                            >
                              {match.matchRate}%
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {match.matchedSpices.length > 0 && (
                            <div>
                              <div className="flex items-center gap-1 text-xs font-semibold text-spice-sageDark mb-1.5">
                                <Check className="h-3 w-3" />
                                <span>已有 ({match.matchedSpices.length})</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {match.matchedSpices.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-spice-sage/10 text-spice-sageDark text-xs border border-spice-sage/20"
                                  >
                                    <span>{generateSpiceEmoji(s)}</span>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {match.missingSpices.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1 text-xs font-semibold text-spice-cinnamon">
                                  <X className="h-3 w-3" />
                                  <span>缺少 ({match.missingSpices.length})</span>
                                </div>
                                <button
                                  onClick={() => handleAddMissingToShopping(match.missingSpices)}
                                  className="text-xs text-spice-sageDark hover:text-spice-sage flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  加入采购
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {match.missingSpices.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-spice-cinnamon/10 text-spice-cinnamon text-xs border border-spice-cinnamon/20 border-dashed"
                                  >
                                    <span>{generateSpiceEmoji(s)}</span>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-spice-brown/70 leading-relaxed pt-2 border-t border-spice-creamDark/50">
                          {match.pairing.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenge' && (
          <div className="rounded-2xl bg-gradient-to-br from-spice-saffron/10 via-spice-brown/5 to-spice-cinnamon/10 border border-spice-saffron/20 p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spice-saffron to-spice-brown flex items-center justify-center">
                  <Shuffle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                    随机风味挑战
                  </h2>
                  <p className="text-xs text-spice-brown/60">摇一摇，随机选3种香料，创意混搭</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setChallengeCards((prev) => prev.map((c) => ({ ...c, flipped: false })))
                  }
                  disabled={challengeCards.every((c) => !c.flipped)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    challengeCards.every((c) => !c.flipped)
                      ? 'text-spice-brown/40 bg-spice-creamDark/30 cursor-not-allowed'
                      : 'text-spice-brown border border-spice-creamDark bg-white hover:bg-spice-creamDark/30'
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>翻回</span>
                </button>
                <button
                  onClick={generateChallenge}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-spice-saffron to-spice-brown text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Shuffle className="h-4 w-4" />
                  <span>摇一摇</span>
                </button>
              </div>
            </div>

            {spices.length < 3 ? (
              <div className="py-16 text-center bg-white/50 rounded-xl border border-dashed border-spice-saffron/30">
                <ChefHat className="mx-auto h-14 w-14 text-spice-saffron" />
                <p className="mt-4 text-spice-brownDark font-medium">香料不足</p>
                <p className="text-sm text-spice-brown/50 mt-1">至少需要3种香料才能开启挑战</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  key={shuffleKey}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  style={{ perspective: '1000px' }}
                >
                  {challengeCards.map((card, index) => (
                    <div
                      key={card.spice.id}
                      className="relative h-64 cursor-pointer group"
                      onClick={() => flipCard(index)}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div
                        className={cn(
                          'absolute inset-0 transition-transform duration-500 w-full h-full'
                        )}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-2xl bg-white border border-spice-creamDark shadow-md flex flex-col items-center justify-center p-6 backface-hidden group-hover:shadow-lg transition-shadow"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-spice-saffron/20 to-spice-brown/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-5xl">{generateSpiceEmoji(card.spice.name)}</span>
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-spice-brown/60 mb-1">
                            第 {index + 1} 张
                          </p>
                          <Badge text={card.spice.category} variant="info" />
                          <p className="mt-3 text-sm text-spice-brown/60 flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5" />
                            点击翻开
                          </p>
                        </div>

                        <div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-spice-sage to-spice-sageDark shadow-lg flex flex-col p-5 text-white"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-2xl">{generateSpiceEmoji(card.spice.name)}</span>
                            </div>
                            <div>
                              <h3 className="font-display text-lg font-bold">{card.spice.name}</h3>
                              <p className="text-xs text-white/70">{card.spice.form}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center">
                            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Lightbulb className="h-4 w-4 text-spice-saffron" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                  创意建议
                                </p>
                              </div>
                              <p className="text-sm leading-relaxed">{card.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {allFlipped && (
                  <div className="animate-fade-in-up rounded-xl bg-white border border-spice-sage/30 p-5 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-spice-saffron" />
                        <h3 className="font-semibold text-spice-charcoal">
                          {challengeCards.map((c) => c.spice.name).join(' + ')}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleFavorite(
                              'challenge',
                              `challenge-${shuffleKey}`,
                              {
                                spices: challengeCards.map((c) => c.spice.name),
                                suggestion: threeWaySuggestion,
                              }
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-spice-cream text-spice-brown hover:bg-spice-creamDark transition-colors"
                        >
                          <Heart className="h-3.5 w-3.5" />
                          收藏
                        </button>
                        <button
                          onClick={handleSaveChallengeAsDraft}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-spice-sage/10 text-spice-sageDark hover:bg-spice-sage/20 transition-colors"
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          存为草稿
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-spice-brown/80 leading-relaxed pl-7">
                      {threeWaySuggestion}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-spice-creamDark p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spice-cinnamon to-spice-saffron flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                    我的收藏
                  </h2>
                  <p className="text-xs text-spice-brown/60">收藏的搭配、挑战和菜品</p>
                </div>
              </div>

              {favoriteDishes.length === 0 &&
              favoritePairings.length === 0 &&
              favoriteChallenges.length === 0 ? (
                <div className="py-16 text-center">
                  <Bookmark className="mx-auto h-14 w-14 text-spice-brown/30" />
                  <p className="mt-4 text-spice-brown/60">还没有收藏</p>
                  <p className="text-sm text-spice-brown/40 mt-1">点击心形图标收藏喜欢的内容</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {favoriteDishes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-spice-charcoal mb-3 flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4 text-spice-sage" />
                        菜品推荐 ({favoriteDishes.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {favoriteDishes.map(({ dish, matchedSpices, missingSpices }) => (
                          <div
                            key={dish.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-spice-cream/50 border border-spice-creamDark"
                          >
                            <span className="text-2xl">{generateSpiceEmoji(dish.name)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-spice-charcoal truncate">
                                {dish.name}
                              </p>
                              <p className="text-xs text-spice-brown/60">
                                {dish.cuisineType} · 已有 {matchedSpices.length}/
                                {dish.requiredSpices.length} 种香料
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleToggleFavorite('dish', dish.id, { name: dish.name })
                              }
                              className="p-1.5 rounded-lg hover:bg-white transition-colors"
                            >
                              <Heart className="h-4 w-4 text-spice-cinnamon fill-spice-cinnamon" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {favoritePairings.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-spice-charcoal mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-spice-saffron" />
                        经典搭配 ({favoritePairings.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {favoritePairings.map(({ pairing, matchedSpices }) => (
                          <div
                            key={pairing.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-spice-cream/50 border border-spice-creamDark"
                          >
                            <span className="text-2xl">
                              {generateSpiceEmoji(pairing.targetIngredient)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-spice-charcoal truncate">
                                {pairing.targetIngredient}
                              </p>
                              <p className="text-xs text-spice-brown/60">
                                {pairing.cuisineType} · 匹配 {matchedSpices.length}/
                                {pairing.spices.length}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleToggleFavorite('pairing', pairing.id, {
                                  name: pairing.targetIngredient,
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-white transition-colors"
                            >
                              <Heart className="h-4 w-4 text-spice-cinnamon fill-spice-cinnamon" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {favoriteChallenges.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-spice-charcoal mb-3 flex items-center gap-2">
                        <Shuffle className="h-4 w-4 text-spice-cinnamon" />
                        挑战组合 ({favoriteChallenges.length})
                      </h3>
                      <div className="space-y-2">
                        {favoriteChallenges.map((fav) => {
                          const data = fav.itemData as { spices?: string[]; suggestion?: string };
                          return (
                            <div
                              key={fav.id}
                              className="flex items-start gap-3 p-3 rounded-xl bg-spice-cream/50 border border-spice-creamDark"
                            >
                              <div className="flex -space-x-2">
                                {(data.spices || []).slice(0, 3).map((s, i) => (
                                  <span
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-white border-2 border-spice-cream flex items-center justify-center text-lg"
                                  >
                                    {generateSpiceEmoji(s)}
                                  </span>
                                ))}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-spice-charcoal">
                                  {(data.spices || []).join(' + ')}
                                </p>
                                <p className="text-xs text-spice-brown/60 mt-0.5 line-clamp-1">
                                  {data.suggestion}
                                </p>
                              </div>
                              <button
                                onClick={() => handleToggleFavorite('challenge', fav.itemId, data)}
                                className="p-1.5 rounded-lg hover:bg-white transition-colors shrink-0"
                              >
                                <Heart className="h-4 w-4 text-spice-cinnamon fill-spice-cinnamon" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
