import { useMemo } from 'react';
import { Package, Layers, AlertTriangle, TrendingDown, BarChart3, PieChart as PieChartIcon, Calendar, UtensilsCrossed } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import StatCard from '@/components/common/StatCard';
import Badge from '@/components/common/Badge';
import { useInventoryStats, useUsageStats } from '@/hooks/useStatistics';
import { useSpiceStore } from '@/store/useSpiceStore';
import { getExpiryStatus } from '@/utils/dateUtils';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { SpiceCategory, ExpiryStatus } from '@/types';

const categoryColors: Record<SpiceCategory, string> = {
  香草类: '#7A9E7E',
  辛香类: '#C1584F',
  辣椒类: '#DC2626',
  花香类: '#DB2777',
  籽类: '#CA8A04',
  根茎类: '#F97316',
  混合类: '#6366F1',
  皮类: '#92400E',
  叶类: '#059669',
};

const badgeVariantMap: Record<ExpiryStatus, 'success' | 'warning' | 'danger' | 'notice'> = {
  normal: 'success',
  soon: 'warning',
  urgent: 'danger',
  expired: 'danger',
};

export default function Dashboard() {
  const inventoryStats = useInventoryStats();
  const usageStats = useUsageStats();
  const spices = useSpiceStore((state) => state.spices);

  const expiringSpices = useMemo(() => {
    return spices
      .map((spice) => ({
        ...spice,
        expiryResult: getExpiryStatus(spice.expiryDate, spice.openDate),
      }))
      .filter(
        (s) =>
          s.expiryResult.status === 'soon' ||
          s.expiryResult.status === 'urgent' ||
          s.expiryResult.status === 'expired'
      )
      .sort((a, b) => a.expiryResult.days - b.expiryResult.days)
      .slice(0, 6);
  }, [spices]);

  const categoryData = useMemo(() => {
    return inventoryStats.categoryDistribution.map((item) => ({
      label: item.category,
      value: item.count,
      color: item.color,
    }));
  }, [inventoryStats.categoryDistribution]);

  const pieTotal = categoryData.reduce((sum, item) => sum + item.value, 0);

  const barMax = usageStats.topSpices.length > 0 ? usageStats.topSpices[0].count : 1;

  return (
    <PageContainer activeMenu="dashboard">
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-spice-charcoal">数据看板</h1>
          <p className="mt-1 text-sm text-spice-brown/70">香料管理概览与使用趋势</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Package}
            title="香料总数"
            value={inventoryStats.totalCount}
            color="sage"
            trend={{ value: 12, isUp: true }}
          />
          <StatCard
            icon={Layers}
            title="类别数"
            value={inventoryStats.categoryDistribution.length}
            color="brown"
          />
          <StatCard
            icon={AlertTriangle}
            title="临期数量"
            value={inventoryStats.expiringCount}
            color="cinnamon"
          />
          <StatCard
            icon={TrendingDown}
            title="低库存"
            value={inventoryStats.lowStockCount}
            color="saffron"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 border border-spice-creamDark shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-spice-sage" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">月度使用排行</h2>
            </div>
            {usageStats.topSpices.length === 0 ? (
              <div className="py-12 text-center text-spice-brown/60 text-sm">暂无使用记录</div>
            ) : (
              <div className="space-y-3">
                {usageStats.topSpices.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="w-6 text-xs font-bold text-spice-brown/60">#{index + 1}</span>
                    <span className="text-2xl w-8 flex-shrink-0 text-center">
                      {generateSpiceEmoji(item.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-spice-charcoal truncate">
                          {item.name}
                        </span>
                        <span className="text-xs font-semibold text-spice-sageDark ml-2">
                          {item.count}次
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-spice-creamDark overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-spice-sage to-spice-sageDark transition-all duration-500"
                          style={{ width: `${(item.count / barMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 border border-spice-creamDark shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <PieChartIcon className="h-5 w-5 text-spice-brown" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">类别分布</h2>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    let cumulativePercent = 0;
                    return categoryData.map((item, index) => {
                      const percent = pieTotal > 0 ? (item.value / pieTotal) * 100 : 0;
                      const startPercent = cumulativePercent;
                      cumulativePercent += percent;
                      const strokeDasharray = `${percent} ${100 - percent}`;
                      const strokeDashoffset = -startPercent;
                      return (
                        <circle
                          key={index}
                          cx="18"
                          cy="18"
                          r="15.9155"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="5"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-spice-charcoal">{pieTotal}</span>
                  <span className="text-xs text-spice-brown/60">总数</span>
                </div>
              </div>
              <div className="flex-1 min-w-[160px] space-y-2">
                {categoryData.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-spice-charcoal flex-1 truncate">{item.label}</span>
                    <span className="text-xs font-semibold text-spice-brown/80">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 border border-spice-creamDark shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="h-5 w-5 text-spice-cinnamon" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">临期香料</h2>
            </div>
            {expiringSpices.length === 0 ? (
              <div className="py-12 text-center text-spice-brown/60 text-sm">暂无临期香料</div>
            ) : (
              <div className="space-y-3">
                {expiringSpices.map((spice) => {
                  const isExpired = spice.expiryResult.status === 'expired';
                  return (
                    <div
                      key={spice.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                        isExpired
                          ? 'bg-spice-cinnamon/5 border-spice-cinnamon/20'
                          : 'bg-spice-cream border-spice-creamDark'
                      )}
                    >
                      <span className="text-3xl w-10 flex-shrink-0 text-center">
                        {generateSpiceEmoji(spice.name)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-spice-charcoal truncate">{spice.name}</h3>
                          <Badge
                            text={spice.category}
                            variant="info"
                          />
                        </div>
                        <p className="text-xs text-spice-brown/70 mt-0.5">{spice.form} · {spice.remainingAmount}%</p>
                      </div>
                      <Badge
                        text={
                          isExpired
                            ? `已过期${Math.abs(spice.expiryResult.days)}天`
                            : `剩余${spice.expiryResult.days}天`
                        }
                        variant={badgeVariantMap[spice.expiryResult.status]}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 border border-spice-creamDark shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <UtensilsCrossed className="h-5 w-5 text-spice-saffron" />
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">最常用搭配</h2>
            </div>
            {usageStats.topPairings.length === 0 ? (
              <div className="py-12 text-center text-spice-brown/60 text-sm">暂无搭配记录</div>
            ) : (
              <div className="space-y-3">
                {usageStats.topPairings.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-spice-cream border border-spice-creamDark"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spice-saffron to-spice-brown flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-spice-charcoal truncate">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-sm font-semibold text-spice-brownDark">{item.count}</span>
                      <span className="text-xs text-spice-brown/60">次</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
