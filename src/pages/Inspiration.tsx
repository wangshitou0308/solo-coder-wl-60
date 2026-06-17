import { useState, useMemo, useEffect } from 'react';
import { Lightbulb, Sparkles, Shuffle, Check, X, ChefHat, RotateCcw, Zap } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/common/Badge';
import { useSpiceStore } from '@/store/useSpiceStore';
import { classicPairingsData } from '@/data/classicPairings';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { Spice, ClassicPairing } from '@/types';

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
  const [shuffleKey, setShuffleKey] = useState(0);
  const [challengeCards, setChallengeCards] = useState<ChallengeCard[]>([]);

  const availableSpiceNames = useMemo(() => new Set(spices.map((s) => s.name)), [spices]);

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
        const matchRate = pairing.spices.length > 0
          ? Math.round((matchedSpices.length / pairing.spices.length) * 100)
          : 0;
        return { pairing, matchedSpices, missingSpices, matchRate };
      })
      .filter((m) => m.matchRate > 0)
      .sort((a, b) => b.matchRate - a.matchRate || b.matchedSpices.length - a.matchedSpices.length)
      .slice(0, 6);
  }, [availableSpiceNames]);

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

  return (
    <PageContainer>
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-spice-charcoal">创意灵感</h1>
          <p className="mt-1 text-sm text-spice-brown/70">发现香料的无限可能，激发烹饪创意</p>
        </div>

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
              {pairingMatches.map((match) => (
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
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge text={match.pairing.cuisineType} variant="notice" />
                        <h3 className="font-semibold text-spice-charcoal mt-1.5">
                          {match.pairing.targetIngredient}
                        </h3>
                      </div>
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
                          <div className="flex items-center gap-1 text-xs font-semibold text-spice-cinnamon mb-1.5">
                            <X className="h-3 w-3" />
                            <span>缺少 ({match.missingSpices.length})</span>
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
              ))}
            </div>
          )}
        </div>

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
                onClick={() => setChallengeCards((prev) => prev.map((c) => ({ ...c, flipped: false })))}
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
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-spice-saffron" />
                    <h3 className="font-semibold text-spice-charcoal">
                      {challengeCards.map((c) => c.spice.name).join(' + ')}
                    </h3>
                  </div>
                  <p className="text-sm text-spice-brown/80 leading-relaxed pl-7">
                    {threeWaySuggestion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
