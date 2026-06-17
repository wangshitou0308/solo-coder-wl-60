import { useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spice } from '@/types';
import ProgressBar from '@/components/common/ProgressBar';
import Badge from '@/components/common/Badge';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { getExpiryStatus, formatDate } from '@/utils/dateUtils';

interface SpiceDetailProps {
  open: boolean;
  onClose: () => void;
  spice: Spice | null;
  onEdit: () => void;
  onDelete: () => void;
  onOpenBottle: () => void;
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

export default function SpiceDetail({
  open,
  onClose,
  spice,
  onEdit,
  onDelete,
  onOpenBottle,
}: SpiceDetailProps) {
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

  if (!open || !spice) return null;

  const emoji = generateSpiceEmoji(spice.name);
  const expiryResult = getExpiryStatus(spice.expiryDate, spice.openDate);
  const isExpired = expiryResult.status === 'expired';

  const expiryBadgeVariant =
    expiryResult.status === 'normal'
      ? 'success'
      : expiryResult.status === 'soon'
      ? 'warning'
      : 'danger';

  const usageHistory = [
    {
      id: '1',
      date: '2026-06-15',
      dish: '黑椒牛排',
      amount: '少量',
    },
    {
      id: '2',
      date: '2026-06-10',
      dish: '意式蔬菜汤',
      amount: '1茶匙',
    },
    {
      id: '3',
      date: '2026-06-05',
      dish: '烤土豆',
      amount: '适量',
    },
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

          <div className="flex-1 overflow-y-auto">
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
                    </div>
                    <div className="rounded-xl bg-spice-creamDark/30 p-3 text-center">
                      <div className="text-xs text-spice-brown/70">最低阈值</div>
                      <div className="mt-1 font-display text-xl font-bold text-spice-brownDark">
                        {spice.minThreshold}%
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
                    </div>
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
                <div className="mb-4 flex items-center gap-2">
                  <History className="h-4 w-4 text-spice-sageDark" />
                  <h3 className="text-sm font-semibold text-spice-charcoal">使用历史</h3>
                </div>

                <div className="space-y-3">
                  {usageHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl bg-spice-creamDark/30 p-3"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-spice-sage/15">
                        <ChefHat className="h-4 w-4 text-spice-sageDark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-spice-charcoal truncate">
                            {item.dish}
                          </span>
                          <span className="shrink-0 text-xs text-spice-brown/60">
                            {item.date}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-spice-brown/70">
                          用量：{item.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    </div>
  );
}
