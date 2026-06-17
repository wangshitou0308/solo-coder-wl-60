import { useState, useMemo } from 'react';
import { BookOpen, Sparkles, Search, ChefHat, ChevronDown, ChevronUp, Utensils, Info, AlertCircle, Users, Flame } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/common/Badge';
import { flavorKnowledgeData } from '@/data/flavorKnowledge';
import { classicPairingsData } from '@/data/classicPairings';
import { cuisineConfigsData } from '@/data/cuisineConfigs';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { FlavorKnowledge, ClassicPairing, CuisineConfig } from '@/types';

type TabKey = 'encyclopedia' | 'pairings' | 'ingredients' | 'cuisines';

const commonIngredients = ['牛肉', '猪肉', '鸡肉', '羊肉', '鱼肉', '虾', '土豆', '番茄', '鸡蛋', '米饭', '豆腐', '蘑菇', '胡萝卜', '洋葱', '青椒', '茄子'];

const tabItems: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
  { key: 'encyclopedia', label: '香料百科', icon: BookOpen },
  { key: 'pairings', label: '经典搭配', icon: Sparkles },
  { key: 'ingredients', label: '食材反查', icon: Search },
  { key: 'cuisines', label: '菜系配置', icon: ChefHat },
];

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState<TabKey>('encyclopedia');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const ingredientRecommendations = useMemo(() => {
    if (!selectedIngredient) return null;
    return classicPairingsData.filter((p) =>
      p.targetIngredient.includes(selectedIngredient) || selectedIngredient.includes(p.targetIngredient)
    );
  }, [selectedIngredient]);

  return (
    <PageContainer activeMenu="flavor-knowledge">
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-spice-charcoal">风味知识库</h1>
          <p className="mt-1 text-sm text-spice-brown/70">探索香料的世界，解锁无限风味可能</p>
        </div>

        <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-spice-cream border border-spice-creamDark">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-1 min-w-[120px] justify-center',
                  isActive
                    ? 'bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md'
                    : 'text-spice-brown hover:bg-spice-creamDark/50 hover:text-spice-charcoal'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'encyclopedia' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flavorKnowledgeData.map((item: FlavorKnowledge) => {
              const isExpanded = expandedId === item.spiceName;
              return (
                <div
                  key={item.spiceName}
                  className={cn(
                    'rounded-2xl bg-white border border-spice-creamDark overflow-hidden transition-all duration-300',
                    isExpanded && 'shadow-lg ring-2 ring-spice-sage/20'
                  )}
                >
                  <button
                    onClick={() => toggleExpand(item.spiceName)}
                    className="w-full p-5 text-left flex items-start gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-spice-creamDark to-spice-cream flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{generateSpiceEmoji(item.spiceName)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-display text-lg font-semibold text-spice-charcoal">
                          {item.spiceName}
                        </h3>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-spice-brown flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-spice-brown flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-spice-brown/70 line-clamp-2">{item.flavorProfile}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <Badge text={item.category} variant="info" />
                        {item.cuisines.slice(0, 2).map((c) => (
                          <Badge key={c} text={c} variant="notice" />
                        ))}
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-spice-creamDark/50 pt-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-spice-sageDark" />
                          <h4 className="text-sm font-semibold text-spice-charcoal">风味特征</h4>
                        </div>
                        <p className="text-sm text-spice-brown/80 leading-relaxed">{item.flavorProfile}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Utensils className="h-4 w-4 text-spice-saffron" />
                          <h4 className="text-sm font-semibold text-spice-charcoal">常见用途</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.commonUses.map((u) => (
                            <span
                              key={u}
                              className="px-3 py-1 rounded-full bg-spice-saffron/10 text-spice-brownDark text-xs border border-spice-saffron/20"
                            >
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-spice-sage" />
                          <h4 className="text-sm font-semibold text-spice-charcoal">相性食材</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.compatibleIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-3 py-1 rounded-full bg-spice-sage/10 text-spice-sageDark text-xs border border-spice-sage/20"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-spice-cinnamon" />
                          <h4 className="text-sm font-semibold text-spice-charcoal">搭配禁忌</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.pairingTaboos.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1 rounded-full bg-spice-cinnamon/10 text-spice-cinnamon text-xs border border-spice-cinnamon/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'pairings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classicPairingsData.map((pairing: ClassicPairing) => (
              <div
                key={pairing.id}
                className="rounded-2xl bg-white border border-spice-creamDark p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge text={pairing.cuisineType} variant="info" />
                    <h3 className="font-display text-lg font-semibold text-spice-charcoal mt-2">
                      {pairing.targetIngredient}
                    </h3>
                  </div>
                  <span className="text-4xl">{generateSpiceEmoji(pairing.targetIngredient)}</span>
                </div>

                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-spice-sage/20 to-spice-brown/20 flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      {pairing.spices.slice(0, 2).map((spice) => (
                        <div
                          key={spice.name}
                          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-spice-creamDark"
                          title={spice.name}
                        >
                          <span className="text-xl">{generateSpiceEmoji(spice.name)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {pairing.spices.map((s) => (
                    <Badge key={s.name} text={`${s.name} ${s.amount}`} variant="success" />
                  ))}
                </div>

                <p className="text-sm text-spice-brown/80 leading-relaxed text-center">
                  {pairing.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-spice-creamDark p-6">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-spice-brown/60" />
                <input
                  type="text"
                  placeholder="输入食材名称，查找推荐搭配..."
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ingredientInput.trim()) {
                      setSelectedIngredient(ingredientInput.trim());
                    }
                  }}
                  className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-spice-cream border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all text-base"
                />
                {ingredientInput && (
                  <button
                    onClick={() => {
                      setSelectedIngredient(ingredientInput.trim());
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-spice-sage to-spice-sageDark text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    搜索
                  </button>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-spice-brown/80 mb-3">
                  常见食材
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonIngredients.map((ing) => {
                    const isSelected = selectedIngredient === ing;
                    return (
                      <button
                        key={ing}
                        onClick={() => {
                          setSelectedIngredient(ing);
                          setIngredientInput(ing);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                          isSelected
                            ? 'bg-gradient-to-r from-spice-saffron to-spice-brown text-white border-transparent shadow-md'
                            : 'bg-spice-cream text-spice-charcoal border-spice-creamDark hover:border-spice-saffron/50 hover:bg-spice-saffron/10'
                        )}
                      >
                        <span className="mr-1">{generateSpiceEmoji(ing)}</span>
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedIngredient && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                    「{selectedIngredient}」推荐搭配
                  </h2>
                  <Badge text={`${ingredientRecommendations?.length || 0}个方案`} variant="info" />
                </div>
                {ingredientRecommendations && ingredientRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ingredientRecommendations.map((pairing) => (
                      <div
                        key={pairing.id}
                        className="rounded-2xl bg-white border border-spice-creamDark p-5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{generateSpiceEmoji(pairing.targetIngredient)}</span>
                          <div>
                            <Badge text={pairing.cuisineType} variant="info" />
                            <h3 className="font-semibold text-spice-charcoal mt-1">{pairing.targetIngredient}</h3>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {pairing.spices.map((s) => (
                            <Badge key={s.name} text={`${s.name} ${s.amount}`} variant="success" />
                          ))}
                        </div>
                        <p className="text-sm text-spice-brown/80 leading-relaxed">{pairing.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center rounded-2xl bg-white border border-spice-creamDark">
                    <Search className="mx-auto h-12 w-12 text-spice-brown/30" />
                    <p className="mt-4 text-spice-brown/60">暂无「{selectedIngredient}」的搭配方案</p>
                    <p className="text-sm text-spice-brown/40 mt-1">试试其他食材吧</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cuisines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cuisineConfigsData.map((cuisine: CuisineConfig) => (
              <div
                key={cuisine.id}
                className="rounded-2xl bg-white border border-spice-creamDark overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="h-32 bg-gradient-to-br from-spice-sage/20 via-spice-saffron/20 to-spice-brown/20 flex items-center justify-center relative">
                  <span className="text-6xl">{cuisine.icon}</span>
                  <Badge
                    text={cuisine.name}
                    variant="info"
                    className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm"
                  />
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-spice-brown/80 leading-relaxed">{cuisine.description}</p>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4 text-spice-cinnamon" />
                      <h4 className="text-sm font-semibold text-spice-charcoal">核心香料</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cuisine.coreSpices.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-spice-cinnamon/10 text-spice-cinnamon text-xs border border-spice-cinnamon/20"
                        >
                          <span>{generateSpiceEmoji(s)}</span>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="h-4 w-4 text-spice-sageDark" />
                      <h4 className="text-sm font-semibold text-spice-charcoal">代表菜品</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cuisine.representativeDishes.map((d) => (
                        <span
                          key={d}
                          className="px-2.5 py-1 rounded-full bg-spice-sage/10 text-spice-sageDark text-xs border border-spice-sage/20"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
