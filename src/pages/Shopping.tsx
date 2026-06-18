import { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  AlertTriangle,
  Download,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Package,
  Layers,
  Building2,
  MapPin,
  Zap,
  CheckCircle2,
  X,
  Search,
  Clock,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Badge from '@/components/common/Badge';
import { useSpiceStore } from '@/store/useSpiceStore';
import { useShoppingStore } from '@/store/useShoppingStore';
import { getSeasonByMonth } from '@/utils/dateUtils';
import {
  exportShoppingListTxt,
  exportShoppingListMarkdown,
  exportShoppingListPrint,
} from '@/utils/exportUtils';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { SpiceCategory, SeasonType, ShoppingPriority } from '@/types';

const seasonIcons: Record<string, typeof Sun> = {
  春季: Flower2,
  夏季: Sun,
  秋季: Leaf,
  冬季: Snowflake,
};

const seasonColors: Record<string, string> = {
  春季: 'from-pink-400/20 to-green-400/20 border-pink-400/30',
  夏季: 'from-orange-400/20 to-yellow-400/20 border-orange-400/30',
  秋季: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  冬季: 'from-blue-400/20 to-cyan-400/20 border-blue-400/30',
};

const nextSeasonMap: Record<string, string> = {
  春季: '夏季',
  夏季: '秋季',
  秋季: '冬季',
  冬季: '春季',
};

const priorityConfig: Record<ShoppingPriority, { label: string; color: string; bgColor: string; icon: typeof Zap }> = {
  urgent: { label: '紧急', color: 'text-spice-cinnamon', bgColor: 'bg-spice-cinnamon/10 border-spice-cinnamon/20', icon: AlertTriangle },
  soon: { label: '近期', color: 'text-spice-saffron', bgColor: 'bg-spice-saffron/10 border-spice-saffron/20', icon: Clock },
  optional: { label: '可选', color: 'text-spice-sageDark', bgColor: 'bg-spice-sage/10 border-spice-sage/20', icon: Package },
};

const groupByOptions = [
  { key: 'priority', label: '按优先级', icon: Zap },
  { key: 'category', label: '按类别', icon: Layers },
  { key: 'brand', label: '按品牌', icon: Building2 },
  { key: 'storageLocation', label: '按位置', icon: MapPin },
];

type ExportFormat = 'txt' | 'markdown' | 'print';

export default function Shopping() {
  const spices = useSpiceStore((state) => state.spices);
  const {
    items,
    groupBy,
    setGroupBy,
    toggleCheck,
    toggleCheckAll,
    removeItem,
    updateItemAmount,
    purchaseChecked,
    addItem,
    refreshAutoItems,
    getGroupedItems,
  } = useShoppingStore();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const currentSeason = getSeasonByMonth();
  const nextSeason = nextSeasonMap[currentSeason];

  useEffect(() => {
    refreshAutoItems();
  }, [spices.length, refreshAutoItems]);

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

  const groupedItems = useMemo(() => {
    const groups = getGroupedItems();
    if (groupBy === 'priority') {
      const ordered: Record<string, typeof items> = {};
      ['urgent', 'soon', 'optional'].forEach((key) => {
        if (groups[key]) {
          ordered[key] = groups[key];
        }
      });
      Object.keys(groups).forEach((key) => {
        if (!['urgent', 'soon', 'optional'].includes(key)) {
          ordered[key] = groups[key];
        }
      });
      return ordered;
    }
    return groups;
  }, [getGroupedItems, groupBy]);

  const availableToAdd = useMemo(() => {
    const addedIds = new Set(items.map((i) => i.spiceId));
    return spices
      .filter((s) => !addedIds.has(s.id))
      .filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [spices, items, searchQuery]);

  const checkedCount = useMemo(() => items.filter((i) => i.checked).length, [items]);
  const allChecked = items.length > 0 && items.every((i) => i.checked);

  const handleExport = (format: ExportFormat) => {
    const checkedItems = items.filter((i) => i.checked);
    const exportItems = checkedItems.length > 0 ? checkedItems : items;

    switch (format) {
      case 'txt':
        exportShoppingListTxt(exportItems);
        break;
      case 'markdown':
        exportShoppingListMarkdown(exportItems);
        break;
      case 'print':
        exportShoppingListPrint(exportItems);
        break;
    }
    setExportFormat(null);
  };

  const handlePurchase = () => {
    if (checkedCount === 0) return;
    if (confirm(`确认将选中的 ${checkedCount} 项香料入库吗？`)) {
      purchaseChecked();
    }
  };

  const handleAddToShopping = (spiceId: string) => {
    addItem(spiceId, '手动添加');
  };

  const CurrentSeasonIcon = seasonIcons[currentSeason];
  const NextSeasonIcon = seasonIcons[nextSeason];

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-spice-charcoal">采购清单</h1>
            <p className="mt-1 text-sm text-spice-brown/70">智能提醒，购物无忧</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-spice-sage/30 bg-spice-sage/10 text-spice-sageDark font-medium hover:bg-spice-sage/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>添加香料</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setExportFormat(exportFormat ? null : 'txt')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice-saffron to-spice-brown text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>导出清单</span>
              </button>
              {exportFormat !== null && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-white border border-spice-creamDark shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full px-4 py-2.5 text-left text-sm text-spice-charcoal hover:bg-spice-cream transition-colors"
                  >
                    TXT 格式
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="w-full px-4 py-2.5 text-left text-sm text-spice-charcoal hover:bg-spice-cream transition-colors"
                  >
                    Markdown 格式
                  </button>
                  <button
                    onClick={() => handleExport('print')}
                    className="w-full px-4 py-2.5 text-left text-sm text-spice-charcoal hover:bg-spice-cream transition-colors"
                  >
                    可打印格式
                  </button>
                </div>
              )}
            </div>
          </div>
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
          <div className="flex items-center justify-between p-5 border-b border-spice-creamDark flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-spice-sageDark" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">购物清单</h2>
              <Badge text={`${items.length}项`} variant="info" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-spice-cream p-1">
                {groupByOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setGroupBy(option.key as any)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                        groupBy === option.key
                          ? 'bg-white text-spice-sageDark shadow-sm'
                          : 'text-spice-brown/60 hover:text-spice-charcoal'
                      )}
                    >
                      <OptionIcon className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {items.length > 0 && (
                <button
                  onClick={toggleCheckAll}
                  className="text-sm font-medium text-spice-sageDark hover:text-spice-sage transition-colors"
                >
                  {allChecked ? '取消全选' : '全选'}
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-spice-sage" />
              <p className="mt-4 text-spice-sageDark font-medium">购物清单为空</p>
              <p className="text-sm text-spice-brown/50 mt-1">香料库存充足，无需采购</p>
            </div>
          ) : (
            <div className="divide-y divide-spice-creamDark/50 max-h-[500px] overflow-y-auto">
              {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
                const priorityInfo = priorityConfig[groupKey as ShoppingPriority];
                const GroupIcon = priorityInfo?.icon || Package;
                const groupLabel = priorityInfo?.label || groupKey;

                return (
                  <div key={groupKey}>
                    <div className={cn(
                      'px-5 py-3 flex items-center gap-2',
                      priorityInfo ? `${priorityInfo.bgColor} border-b` : 'bg-spice-cream/50 border-b border-spice-creamDark/50'
                    )}>
                      <GroupIcon className={cn('h-4 w-4', priorityInfo?.color || 'text-spice-brown')} />
                      <span className={cn('text-sm font-semibold', priorityInfo?.color || 'text-spice-charcoal')}>
                        {groupLabel}
                      </span>
                      <span className="text-xs text-spice-brown/60">
                        {groupItems.length} 项
                      </span>
                    </div>
                    {groupItems.map((item) => {
                      const isUrgent = item.priority === 'urgent';
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-center gap-4 p-4 transition-colors',
                            item.checked ? 'bg-spice-sage/5' : 'hover:bg-spice-cream/30'
                          )}
                        >
                          <div
                            className={cn(
                              'w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
                              item.checked
                                ? 'bg-spice-sage border-spice-sage'
                                : 'border-spice-creamDark hover:border-spice-sage/50'
                            )}
                            onClick={() => toggleCheck(item.id)}
                          >
                            {item.checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                          </div>

                          <span className="text-2xl w-10 text-center flex-shrink-0">
                            {generateSpiceEmoji(item.spiceName)}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={cn(
                                'font-medium truncate',
                                item.checked ? 'text-spice-brown/60 line-through' : 'text-spice-charcoal'
                              )}>
                                {item.spiceName}
                              </p>
                              {item.addedManually && (
                                <Badge text="手动添加" variant="info" />
                              )}
                              {isUrgent && <Badge text="紧急" variant="danger" />}
                            </div>
                            <p className="text-xs text-spice-brown/60 mt-0.5">
                              {item.category} · {item.brand} · {item.reason}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1 rounded-lg bg-spice-cream px-2 py-1">
                              <input
                                type="number"
                                value={item.suggestedAmount}
                                onChange={(e) => updateItemAmount(item.id, Number(e.target.value))}
                                className="w-16 bg-transparent text-sm font-medium text-spice-charcoal text-center focus:outline-none"
                                min="0"
                              />
                              <span className="text-xs text-spice-brown/60">{item.unit}</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded-lg text-spice-brown/40 hover:text-spice-cinnamon hover:bg-spice-cinnamon/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {items.length > 0 && (
            <div className="p-4 border-t border-spice-creamDark bg-spice-cream/50 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-spice-brown/70">已选</span>
                <span className="font-bold text-spice-charcoal">{checkedCount}</span>
                <span className="text-spice-brown/70">/ {items.length} 项</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const checkedIds = items.filter((i) => i.checked).map((i) => i.id);
                    checkedIds.forEach((id) => removeItem(id));
                  }}
                  disabled={checkedCount === 0}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    checkedCount === 0
                      ? 'text-spice-brown/40 bg-spice-creamDark/30 cursor-not-allowed'
                      : 'text-spice-brown border border-spice-creamDark hover:bg-white'
                  )}
                >
                  清除选中
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={checkedCount === 0}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all',
                    checkedCount === 0
                      ? 'bg-spice-creamDark text-spice-brown/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-spice-sage to-spice-sageDark text-white hover:shadow-lg'
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>确认入库 ({checkedCount})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-spice-charcoal/60 backdrop-blur-sm"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-fade-in-up max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-spice-charcoal">
                添加香料到采购清单
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 rounded-lg text-spice-brown/60 hover:text-spice-charcoal hover:bg-spice-cream transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-brown/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索香料名称或类别..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-spice-cream border border-spice-creamDark text-sm text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {availableToAdd.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-10 w-10 text-spice-brown/30" />
                  <p className="mt-3 text-sm text-spice-brown/50">
                    {searchQuery ? '没有找到匹配的香料' : '所有香料都已在采购清单中'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableToAdd.map((spice) => (
                    <div
                      key={spice.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-spice-creamDark hover:border-spice-sage/30 hover:bg-spice-sage/5 transition-all"
                    >
                      <span className="text-2xl">{generateSpiceEmoji(spice.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-spice-charcoal truncate">
                          {spice.name}
                        </p>
                        <p className="text-xs text-spice-brown/60">
                          {spice.category} · {spice.brand} · 剩余 {spice.remainingAmount}%
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToShopping(spice.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-spice-sage/10 text-spice-sageDark hover:bg-spice-sage/20 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        添加
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
