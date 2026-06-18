import { useEffect, useState, useMemo } from 'react';
import {
  X,
  Edit2,
  Trash2,
  FlaskConical,
  Building2,
  Calendar,
  MapPin,
  Package,
  Layers,
  StickyNote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Unlock,
  History,
  ChefHat,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  Star,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spice, InventoryLog, CookingRecord } from '@/types';
import ProgressBar from '@/components/common/ProgressBar';
import Badge from '@/components/common/Badge';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { getExpiryStatus, formatDate } from '@/utils/dateUtils';
import { useRecordStore } from '@/store/useRecordStore';
import { useSpiceStore } from '@/store/useSpiceStore';

interface SpiceDetailProps {
  open: boolean;
  onClose: () => void;
  spice: Spice | null;
  onEdit: () => void;
  onDelete: () => void;
  onOpenBottle: () => void;
  onAddToShopping?: () => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoItem({ icon, label, value, highlight }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-spice-creamDark/30 p-3">
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          highlight ? 'bg-spice-sage/15 text-spice-sageDark' : 'bg-spice-cream text-spice-brown'
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-spice-brown/70">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-spice-charcoal break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

const logTypeConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  restock: { label: '补货', color: 'text-spice-sageDark bg-spice-sage/15', icon: Plus },
  open: { label: '开瓶', color: 'text-spice-saffron bg-spice-saffron/15', icon: Unlock },
  consume: { label: '消耗', color: 'text-spice-cinnamon bg-spice-cinnamon/15', icon: Minus },
  adjust: { label: '调整', color: 'text-spice-brown bg-spice-brown/15', icon: Edit2 },
  purchase: { label: '购入', color: 'text-spice-sageDark bg-spice-sage/15', icon: ShoppingCart },
};

export default function SpiceDetail({
  open,
  onClose,
  spice,
  onEdit,
  onDelete,
  onOpenBottle,
  onAddToShopping,
}: SpiceDetailProps) {
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockPercent, setRestockPercent] = useState(100);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustPercent, setAdjustPercent] = useState(50);
  const [adjustNote, setAdjustNote] = useState('');
  const [activeSection, setActiveSection] = useState<'info' | 'logs'>('info');

  const getSpiceLogs = useSpiceStore((state) => state.getSpiceLogs);
  const restockSpice = useSpiceStore((state) => state.restockSpice);
  const adjustInventory = useSpiceStore((state) => state.adjustInventory);
  const getRemainingAmountInUnit = useSpiceStore((state) => state.getRemainingAmountInUnit);
  const getSpiceUsageHistory = useRecordStore((state) => state.getSpiceUsageHistory);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (spice) {
      setRestockPercent(100);
      setAdjustPercent(Math.round(spice.remainingAmount));
      setAdjustNote('');
    }
  }, [spice?.id, open]);

  if (!open || !spice) return null;

  const emoji = generateSpiceEmoji(spice.name);
  const expiryResult = getExpiryStatus(spice.expiryDate, spice.openDate);
  const isExpired = expiryResult.status === 'expired';
  const remainingInUnit = getRemainingAmountInUnit(spice);

  const expiryBadgeVariant =
    expiryResult.status === 'normal'
      ? 'success'
      : expiryResult.status === 'soon'
      ? 'warning'
      : 'danger';

  const usageHistory: CookingRecord[] = useMemo(() => {
    return getSpiceUsageHistory(spice.id);
  }, [spice.id, getSpiceUsageHistory]);

  const inventoryLogs: InventoryLog[] = useMemo(() => {
    return getSpiceLogs(spice.id);
  }, [spice.id, getSpiceLogs]);

  const getUsageAmount = (record: CookingRecord): string => {
    const usage = record.usages.find((u) => u.spiceId === spice.id);
    return usage ? `${usage.amount}${usage.unit}` : '-';
  };

  const handleRestock = () => {
    restockSpice(spice.id, restockPercent, `快速补货至 ${restockPercent}%`);
    setRestockOpen(false);
  };

  const handleAdjust = () => {
    adjustInventory(spice.id, adjustPercent, adjustNote || '手动调整');
    setAdjustOpen(false);
  };

  const restockPresets = [
    { label: '满瓶', value: 100 },
    { label: '80%', value: 80 },
    { label: '50%', value: 50 },
  ];

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-spice-charcoal/50 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 flex w-full max-w-lg animate-fade-in-up">
        <div className="flex h-full w-full flex-col bg-spice-cream shadow-2xl">
          <div className="relative h-56 shrink-0 overflow-hidden bg-gradient-to-br from-spice-creamDark via-spice-cream to-spice-sageLight/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl drop-shadow-lg">{emoji}</span>
            </div>

            {isExpired && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-spice-cinnamon/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" />
                已过期
              </div>
            )}

            {spice.isSeasonal && (
              <div className="absolute left-4 top-4">
                <Badge text={spice.seasonType || '季节限定'} variant="info" />
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-spice-charcoal shadow-md backdrop-blur transition-colors hover:bg-white"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-spice-cream via-spice-cream/80 to-transparent p-6 pt-12">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-spice-charcoal">
                  {spice.name}
                </h2>
                <Badge text={spice.category} variant="info" />
              </div>
              <p className="mt-1 text-sm text-spice-brown/80">
                {spice.form} · {spice.brand || '未记录品牌'}
              </p>
            </div>
          </div>

          <div className="shrink-0 border-b border-spice-creamDark bg-white px-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveSection('info')}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors border-b-2',
                  activeSection === 'info'
                    ? 'text-spice-sageDark border-spice-sage'
                    : 'text-spice-brown/60 border-transparent hover:text-spice-charcoal'
                )}
              >
                详情
              </button>
              <button
                onClick={() => setActiveSection('logs')}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors border-b-2',
                  activeSection === 'logs'
                    ? 'text-spice-sageDark border-spice-sage'
                    : 'text-spice-brown/60 border-transparent hover:text-spice-charcoal'
                )}
              >
                库存日志
                {inventoryLogs.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-spice-creamDark text-spice-brown">
                    {inventoryLogs.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSection === 'info' && (
              <div className="space-y-6 p-6">
                <div className="rounded-2xl border border-spice-creamDark bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-spice-sage" />
                    <h3 className="text-sm font-semibold text-spice-charcoal">库存状态</h3>
                  </div>

                  <div className="space-y-3">
                    <ProgressBar
                      value={spice.remainingAmount}
                      threshold={spice.minThreshold}
                    />

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="rounded-xl bg-spice-creamDark/30 p-3 text-center">
                        <div className="text-xs text-spice-brown/70">剩余量</div>
                        <div className="mt-1 font-display text-xl font-bold text-spice-sageDark">
                          {spice.remainingAmount}%
                        </div>
                        <div className="text-xs text-spice-brown/60">
                          ≈ {remainingInUnit}{spice.unit}
                        </div>
                      </div>
                      <div className="rounded-xl bg-spice-creamDark/30 p-3 text-center">
                        <div className="text-xs text-spice-brown/70">最低阈值</div>
                        <div className="mt-1 font-display text-xl font-bold text-spice-brownDark">
                          {spice.minThreshold}%
                        </div>
                        <div className="text-xs text-spice-brown/60">
                          {spice.fullAmount}{spice.unit}装
                        </div>
                      </div>
                      <div className="rounded-xl bg-spice-creamDark/30 p-3 text-center">
                        <div className="text-xs text-spice-brown/70">保质期</div>
                        <div
                          className={cn(
                            'mt-1 font-display text-xl font-bold',
                            isExpired ? 'text-spice-cinnamon' : 'text-spice-sageDark'
                          )}
                        >
                          {isExpired ? '已过期' : `${expiryResult.days}天`}
                        </div>
                        <div className="text-xs text-spice-brown/60">
                          {spice.openDate ? '已开瓶' : '未开瓶'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setRestockOpen(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-spice-sage/10 text-spice-sageDark hover:bg-spice-sage/20 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        快速补货
                      </button>
                      <button
                        onClick={() => setAdjustOpen(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-spice-creamDark/50 text-spice-brown hover:bg-spice-creamDark transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        手动调整
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-spice-creamDark bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-spice-saffron" />
                    <h3 className="text-sm font-semibold text-spice-charcoal">基本信息</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem
                      icon={<FlaskConical className="h-4 w-4" />}
                      label="类别"
                      value={spice.category}
                      highlight
                    />
                    <InfoItem
                      icon={<Layers className="h-4 w-4" />}
                      label="形态"
                      value={spice.form}
                      highlight
                    />
                    <InfoItem
                      icon={<Building2 className="h-4 w-4" />}
                      label="品牌"
                      value={spice.brand || '未记录'}
                    />
                    <InfoItem
                      icon={<MapPin className="h-4 w-4" />}
                      label="储存位置"
                      value={spice.storageLocation}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-spice-creamDark bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-spice-cinnamon" />
                    <h3 className="text-sm font-semibold text-spice-charcoal">日期信息</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-spice-creamDark/30 p-3">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-spice-brown" />
                        <span className="text-sm text-spice-brown/80">购买日期</span>
                      </div>
                      <span className="text-sm font-medium text-spice-charcoal">
                        {formatDate(spice.purchaseDate)}
                      </span>
                    </div>

                    <div
                      className={cn(
                        'flex items-center justify-between rounded-xl p-3',
                        isExpired
                          ? 'bg-spice-cinnamon/10 border border-spice-cinnamon/20'
                          : 'bg-spice-creamDark/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={cn(
                            'h-4 w-4',
                            isExpired ? 'text-spice-cinnamon' : 'text-spice-brown'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm',
                            isExpired ? 'text-spice-cinnamon' : 'text-spice-brown/80'
                          )}
                        >
                          保质日期
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isExpired ? 'text-spice-cinnamon' : 'text-spice-charcoal'
                          )}
                        >
                          {formatDate(spice.expiryDate)}
                        </span>
                        <Badge
                          text={
                            isExpired
                              ? `已过期${Math.abs(expiryResult.days)}天`
                              : `剩余${expiryResult.days}天`
                          }
                          variant={expiryBadgeVariant}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-spice-creamDark/30 p-3">
                      <div className="flex items-center gap-3">
                        {spice.openDate ? (
                          <Unlock className="h-4 w-4 text-spice-sageDark" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-spice-sage" />
                        )}
                        <span className="text-sm text-spice-brown/80">开瓶状态</span>
                      </div>
                      <span className="text-sm font-medium text-spice-charcoal">
                        {spice.openDate
                          ? `已开瓶 (${formatDate(spice.openDate)})`
                          : '未开瓶'}
                      </span>
                    </div>
                  </div>
                </div>

                {spice.notes && (
                  <div className="rounded-2xl border border-spice-creamDark bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-spice-brownLight" />
                      <h3 className="text-sm font-semibold text-spice-charcoal">备注</h3>
                    </div>
                    <p className="rounded-xl bg-spice-creamDark/30 p-3 text-sm text-spice-charcoal/90 leading-relaxed">
                      {spice.notes}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-spice-creamDark bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-spice-sageDark" />
                      <h3 className="text-sm font-semibold text-spice-charcoal">使用历史</h3>
                    </div>
                    <span className="text-xs text-spice-brown/60">
                      共 {usageHistory.length} 次
                    </span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {usageHistory.length === 0 ? (
                      <div className="py-6 text-center">
                        <ChefHat className="mx-auto h-8 w-8 text-spice-brown/30" />
                        <p className="mt-2 text-sm text-spice-brown/50">暂无使用记录</p>
                      </div>
                    ) : (
                      usageHistory.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-start gap-3 rounded-xl bg-spice-creamDark/30 p-3"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-spice-sage/15">
                            <ChefHat className="h-4 w-4 text-spice-sageDark" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-spice-charcoal truncate">
                                {record.dishName}
                              </span>
                              <span className="shrink-0 text-xs text-spice-brown/60">
                                {formatDate(record.cookDate)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-spice-brown/70">
                              <span>用量：{getUsageAmount(record)}</span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star
                                    key={n}
                                    className={cn(
                                      'h-3 w-3',
                                      n <= record.flavorRating
                                        ? 'fill-spice-saffron text-spice-saffron'
                                        : 'text-spice-creamDark'
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            {record.notes && (
                              <p className="mt-1 text-xs text-spice-brown/60 line-clamp-1">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'logs' && (
              <div className="p-6">
                <div className="space-y-3">
                  {inventoryLogs.length === 0 ? (
                    <div className="py-16 text-center">
                      <History className="mx-auto h-10 w-10 text-spice-brown/30" />
                      <p className="mt-3 text-sm text-spice-brown/50">暂无库存变化日志</p>
                    </div>
                  ) : (
                    inventoryLogs.map((log) => {
                      const config = logTypeConfig[log.type] || logTypeConfig.adjust;
                      const LogIcon = config.icon;
                      const isPositive = log.amount >= 0;
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 rounded-xl bg-white border border-spice-creamDark p-3"
                        >
                          <div
                            className={cn(
                              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                              config.color
                            )}
                          >
                            <LogIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-spice-charcoal">
                                {config.label}
                              </span>
                              <span className="shrink-0 text-xs text-spice-brown/60">
                                {formatDate(log.createdAt)}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-spice-brown/70">
                              <span
                                className={cn(
                                  'font-medium',
                                  log.type === 'consume'
                                    ? 'text-spice-cinnamon'
                                    : isPositive
                                    ? 'text-spice-sageDark'
                                    : 'text-spice-cinnamon'
                                )}
                              >
                                {log.type === 'open'
                                  ? '-'
                                  : `${isPositive ? '+' : ''}${log.amount}${log.unit}`}
                              </span>
                              <span>→</span>
                              <span>剩余 {log.remainingAfter}%</span>
                            </div>
                            {log.note && (
                              <p className="mt-1 text-xs text-spice-brown/60">{log.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-spice-creamDark bg-white p-4">
            <div className="flex items-center gap-3">
              {!spice.openDate && (
                <button
                  type="button"
                  onClick={onOpenBottle}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-spice-sage/30 bg-spice-sage/10 px-4 py-3 text-sm font-medium text-spice-sageDark transition-colors hover:bg-spice-sage/20"
                >
                  <Unlock className="h-4 w-4" />
                  标记开瓶
                </button>
              )}
              {onAddToShopping && (
                <button
                  type="button"
                  onClick={onAddToShopping}
                  className="flex items-center justify-center gap-2 rounded-xl border border-spice-saffron/30 bg-spice-saffron/10 px-4 py-3 text-sm font-medium text-spice-brownDark transition-colors hover:bg-spice-saffron/20"
                >
                  <ShoppingCart className="h-4 w-4" />
                  加入采购
                </button>
              )}
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center justify-center gap-2 rounded-xl border border-spice-cinnamon/30 bg-spice-cinnamon/10 px-4 py-3 text-sm font-medium text-spice-cinnamon transition-colors hover:bg-spice-cinnamon/20"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-spice-sage px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-spice-sageDark shadow-md hover:shadow-lg"
              >
                <Edit2 className="h-4 w-4" />
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>

      {restockOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-spice-charcoal/60 backdrop-blur-sm"
            onClick={() => setRestockOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fade-in-up">
            <h3 className="font-display text-lg font-semibold text-spice-charcoal mb-4">
              快速补货
            </h3>
            <p className="text-sm text-spice-brown/70 mb-4">
              将 {spice.name} 库存恢复至指定比例
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                {restockPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setRestockPercent(preset.value)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                      restockPercent === preset.value
                        ? 'bg-spice-sage text-white'
                        : 'bg-spice-cream text-spice-charcoal hover:bg-spice-creamDark'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-spice-brown/70 mb-2">
                  自定义比例
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={restockPercent}
                  onChange={(e) => setRestockPercent(Number(e.target.value))}
                  className="w-full accent-spice-sage"
                />
                <div className="flex justify-between text-xs text-spice-brown/60 mt-1">
                  <span>0%</span>
                  <span className="font-semibold text-spice-sageDark">
                    {restockPercent}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              <div className="rounded-xl bg-spice-cream p-3 text-sm">
                <div className="flex justify-between text-spice-brown/70">
                  <span>当前余量</span>
                  <span>{spice.remainingAmount}%</span>
                </div>
                <div className="flex justify-between text-spice-charcoal font-medium mt-1">
                  <span>补货后</span>
                  <span className="text-spice-sageDark">{restockPercent}%</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRestockOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-spice-brown border border-spice-creamDark hover:bg-spice-creamDark/50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRestock}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-spice-sage text-white hover:bg-spice-sageDark transition-colors"
                >
                  确认补货
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adjustOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-spice-charcoal/60 backdrop-blur-sm"
            onClick={() => setAdjustOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fade-in-up">
            <h3 className="font-display text-lg font-semibold text-spice-charcoal mb-4">
              手动调整库存
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-spice-brown/70 mb-2">
                  调整后库存
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={adjustPercent}
                  onChange={(e) => setAdjustPercent(Number(e.target.value))}
                  className="w-full accent-spice-sage"
                />
                <div className="flex justify-between text-xs text-spice-brown/60 mt-1">
                  <span>0%</span>
                  <span className="font-semibold text-spice-sageDark">
                    {adjustPercent}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              <div className="rounded-xl bg-spice-cream p-3 text-sm">
                <div className="flex justify-between text-spice-brown/70">
                  <span>原库存</span>
                  <span>{spice.remainingAmount}%</span>
                </div>
                <div className="flex justify-between text-spice-charcoal font-medium mt-1">
                  <span>调整后</span>
                  <span
                    className={
                      adjustPercent >= spice.remainingAmount
                        ? 'text-spice-sageDark'
                        : 'text-spice-cinnamon'
                    }
                  >
                    {adjustPercent}%
                    {adjustPercent !== spice.remainingAmount && (
                      <span className="text-xs ml-1">
                        ({adjustPercent >= spice.remainingAmount ? '+' : ''}
                        {adjustPercent - spice.remainingAmount}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-spice-brown/70 mb-2">
                  调整说明
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="例如：盘点调整、破损丢弃..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-sm text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAdjustOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-spice-brown border border-spice-creamDark hover:bg-spice-creamDark/50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdjust}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-spice-sage text-white hover:bg-spice-sageDark transition-colors"
                >
                  确认调整
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
