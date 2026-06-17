import { useState, useMemo } from 'react';
import { ShoppingCart, AlertTriangle, Download, Sun, Snowflake, Leaf, Flower2, ChevronRight, Check } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/common/Badge';
import { useSpiceStore } from '@/store/useSpiceStore';
import { getSeasonByMonth } from '@/utils/dateUtils';
import { exportShoppingList } from '@/utils/exportUtils';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { SpiceCategory, SeasonType } from '@/types';

const seasonIcons: Record<string, typeof Sun> = {
  '春季': Flower2,
  '夏季': Sun,
  '秋季': Leaf,
  '冬季': Snowflake,
};

const seasonColors: Record<string, string> = {
  '春季': 'from-pink-400/20 to-green-400/20 border-pink-400/30',
  '夏季': 'from-orange-400/20 to-yellow-400/20 border-orange-400/30',
  '秋季': 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  '冬季': 'from-blue-400/20 to-cyan-400/20 border-blue-400/30',
};

const nextSeasonMap: Record<string, string> = {
  '春季': '夏季',
  '夏季': '秋季',
  '秋季': '冬季',
  '冬季': '春季',
};

export default function Shopping() {
  const spices = useSpiceStore((state) => state.spices);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const currentSeason = getSeasonByMonth();
  const nextSeason = nextSeasonMap[currentSeason];

  const lowStockSpices = useMemo(() => {
    return spices.filter((s) => s.remainingAmount <= s.minThreshold);
  }, [spices]);

  const lowStockByCategory = useMemo(() => {
    const map = new Map<SpiceCategory, typeof spices>();
    lowStockSpices.forEach((spice) => {
      const list = map.get(spice.category) || [];
      list.push(spice);
      map.set(spice.category, list);
    });
    return map;
  }, [lowStockSpices]);

  const seasonalSpices = useMemo(() => {
    const current = spices.filter(
      (s) => s.isSeasonal && s.seasonType === currentSeason
    );
    const next = spices.filter(
      (s) => s.isSeasonal && s.seasonType === nextSeason
    );
    return { current, next };
  }, [spices, currentSeason, nextSeason]);

  const shoppingItems = useMemo(() => {
    return [...lowStockSpices].sort((a, b) => a.remainingAmount - b.remainingAmount);
  }, [lowStockSpices]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (checkedItems.size === shoppingItems.length) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(shoppingItems.map((s) => s.id)));
    }
  };

  const handleExport = () => {
    exportShoppingList(spices);
  };

  const CurrentSeasonIcon = seasonIcons[currentSeason];
  const NextSeasonIcon = seasonIcons[nextSeason];

  return (
    <PageContainer activeMenu="shopping-list">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-spice-charcoal">采购清单</h1>
            <p className="mt-1 text-sm text-spice-brown/70">智能提醒，购物无忧</p>
          </div>
          {shoppingItems.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice-saffron to-spice-brown text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>导出清单</span>
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-spice-cinnamon" />
            <h2 className="font-display text-lg font-semibold text-spice-charcoal">低库存预警</h2>
            <Badge text={`${lowStockSpices.length}种`} variant="danger" />
          </div>

          {lowStockSpices.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white border border-spice-creamDark">
              <ShoppingCart className="mx-auto h-14 w-14 text-spice-sage" />
              <p className="mt-4 text-spice-sageDark font-medium">库存状态良好</p>
              <p className="text-sm text-spice-brown/50 mt-1">暂时没有需要补货的香料</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(lowStockByCategory.entries()).map(([category, list]) => (
                <div
                  key={category}
                  className="rounded-2xl bg-white border border-spice-creamDark p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge text={category} variant="danger" />
                    <span className="text-xs text-spice-brown/60">{list.length}种待补</span>
                  </div>
                  <div className="space-y-3">
                    {list.map((spice) => (
                      <div
                        key={spice.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-spice-cinnamon/5 border border-spice-cinnamon/10"
                      >
                        <span className="text-2xl w-9 text-center flex-shrink-0">
                          {generateSpiceEmoji(spice.name)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-spice-charcoal truncate">{spice.name}</p>
                          <p className="text-xs text-spice-brown/60">{spice.form} · {spice.brand}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-spice-cinnamon">{spice.remainingAmount}%</p>
                          <div className="w-14 h-1.5 rounded-full bg-spice-creamDark mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-spice-cinnamon"
                              style={{ width: `${spice.remainingAmount}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            'rounded-2xl p-6 border bg-gradient-to-br',
            seasonColors[currentSeason]
          )}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge text="当季" variant="success" className="bg-white/60 backdrop-blur-sm" />
                <h3 className="font-display text-xl font-bold text-spice-charcoal mt-2">
                  {currentSeason}香料
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <CurrentSeasonIcon className="h-6 w-6 text-spice-charcoal" />
              </div>
            </div>
            {seasonalSpices.current.length === 0 ? (
              <p className="text-sm text-spice-brown/70 py-4">暂无当季限定香料</p>
            ) : (
              <div className="space-y-2">
                {seasonalSpices.current.map((spice) => (
                  <div
                    key={spice.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 backdrop-blur-sm"
                  >
                    <span className="text-xl">{generateSpiceEmoji(spice.name)}</span>
                    <span className="text-sm font-medium text-spice-charcoal flex-1 truncate">{spice.name}</span>
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      spice.remainingAmount <= spice.minThreshold
                        ? 'bg-spice-cinnamon/20 text-spice-cinnamon'
                        : 'bg-spice-sage/20 text-spice-sageDark'
                    )}>
                      {spice.remainingAmount}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cn(
            'rounded-2xl p-6 border bg-gradient-to-br',
            seasonColors[nextSeason]
          )}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge text="下季预热" variant="notice" className="bg-white/60 backdrop-blur-sm" />
                <h3 className="font-display text-xl font-bold text-spice-charcoal mt-2">
                  {nextSeason}提前备
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <NextSeasonIcon className="h-6 w-6 text-spice-charcoal" />
              </div>
            </div>
            {seasonalSpices.next.length === 0 ? (
              <p className="text-sm text-spice-brown/70 py-4">暂无下季限定香料</p>
            ) : (
              <div className="space-y-2">
                {seasonalSpices.next.map((spice) => (
                  <div
                    key={spice.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 backdrop-blur-sm"
                  >
                    <span className="text-xl">{generateSpiceEmoji(spice.name)}</span>
                    <span className="text-sm font-medium text-spice-charcoal flex-1 truncate">{spice.name}</span>
                    <ChevronRight className="h-4 w-4 text-spice-brown/50" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-spice-creamDark overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-spice-creamDark">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-spice-sageDark" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">购物清单</h2>
              <Badge text={`${shoppingItems.length}项`} variant="info" />
            </div>
            {shoppingItems.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm font-medium text-spice-sageDark hover:text-spice-sage transition-colors"
              >
                {checkedItems.size === shoppingItems.length ? '取消全选' : '全选'}
              </button>
            )}
          </div>

          {shoppingItems.length === 0 ? (
            <div className="py-16 text-center">
              <Check className="mx-auto h-14 w-14 text-spice-sage" />
              <p className="mt-4 text-spice-sageDark font-medium">购物清单为空</p>
              <p className="text-sm text-spice-brown/50 mt-1">香料库存充足，无需采购</p>
            </div>
          ) : (
            <div className="divide-y divide-spice-creamDark/50">
              {shoppingItems.map((spice) => {
                const checked = checkedItems.has(spice.id);
                const isLow = spice.remainingAmount <= 10;
                return (
                  <label
                    key={spice.id}
                    className={cn(
                      'flex items-center gap-4 p-4 cursor-pointer transition-colors',
                      checked ? 'bg-spice-sage/5' : 'hover:bg-spice-cream/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        checked
                          ? 'bg-spice-sage border-spice-sage'
                          : 'border-spice-creamDark hover:border-spice-sage/50'
                      )}
                      onClick={() => toggleCheck(spice.id)}
                    >
                      {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-2xl w-10 text-center flex-shrink-0">
                      {generateSpiceEmoji(spice.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn(
                          'font-medium truncate',
                          checked ? 'text-spice-brown/60 line-through' : 'text-spice-charcoal'
                        )}>
                          {spice.name}
                        </p>
                        <Badge text={spice.category} variant="info" />
                        {isLow && <Badge text="紧急" variant="danger" />}
                      </div>
                      <p className="text-xs text-spice-brown/60 mt-0.5">
                        {spice.form} · {spice.brand} · 最低阈值 {spice.minThreshold}%
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn(
                        'text-lg font-bold',
                        isLow ? 'text-spice-cinnamon' : 'text-spice-saffron'
                      )}>
                        {spice.remainingAmount}%
                      </p>
                      <p className="text-xs text-spice-brown/50">当前余量</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {shoppingItems.length > 0 && (
            <div className="p-4 border-t border-spice-creamDark bg-spice-cream/50 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-spice-brown/70">已选</span>
                <span className="font-bold text-spice-charcoal">{checkedItems.size}</span>
                <span className="text-spice-brown/70">/ {shoppingItems.length} 项</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckedItems(new Set())}
                  disabled={checkedItems.size === 0}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    checkedItems.size === 0
                      ? 'text-spice-brown/40 bg-spice-creamDark/30 cursor-not-allowed'
                      : 'text-spice-brown border border-spice-creamDark hover:bg-white'
                  )}
                >
                  清除选择
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>导出购物清单</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
