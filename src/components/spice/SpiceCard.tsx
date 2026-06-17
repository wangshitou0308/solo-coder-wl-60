import { AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spice, ExpiryStatus } from '@/types';
import ProgressBar from '@/components/common/ProgressBar';
import Badge from '@/components/common/Badge';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { getExpiryStatus } from '@/utils/dateUtils';

interface SpiceCardProps {
  spice: Spice;
  onClick: () => void;
}

const variantMap: Record<ExpiryStatus, 'success' | 'warning' | 'danger' | 'notice'> = {
  normal: 'success',
  soon: 'warning',
  urgent: 'danger',
  expired: 'danger',
};

export default function SpiceCard({ spice, onClick }: SpiceCardProps) {
  const emoji = generateSpiceEmoji(spice.name);
  const expiryResult = getExpiryStatus(spice.expiryDate, spice.openDate);
  const isExpired = expiryResult.status === 'expired';

  const renderExpiryText = () => {
    if (isExpired) {
      return `已过期 ${Math.abs(expiryResult.days)} 天`;
    }
    if (expiryResult.days <= 7) {
      return `剩余 ${expiryResult.days} 天`;
    }
    if (expiryResult.days <= 30) {
      return `剩余 ${expiryResult.days} 天`;
    }
    return `剩余 ${expiryResult.days} 天`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl bg-spice-cream border border-spice-creamDark transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-xl',
        isExpired && 'animate-pulse'
      )}
    >
      <div className="relative h-32 flex items-center justify-center bg-gradient-to-br from-spice-creamDark to-spice-cream overflow-hidden">
        <div className="text-6xl transform transition-transform duration-500 group-hover:scale-110">
          {emoji}
        </div>
        {!spice.openDate && (
          <div className="absolute top-2 right-2">
            <Badge text="未开瓶" variant="notice" />
          </div>
        )}
        {spice.isSeasonal && (
          <div className="absolute top-2 left-2">
            <Badge text={spice.seasonType || '季节限定'} variant="info" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-spice-charcoal line-clamp-1">
              {spice.name}
            </h3>
            <Badge
              text={spice.category}
              variant="info"
              className="shrink-0"
            />
          </div>
          <p className="mt-1 text-sm text-spice-brown/80">
            {spice.form}
          </p>
        </div>

        <ProgressBar
          value={spice.remainingAmount}
          threshold={spice.minThreshold}
          showLabel={false}
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-spice-brown/70">
            {isExpired ? (
              <AlertTriangle className="h-3.5 w-3.5 text-spice-cinnamon" />
            ) : (
              <Calendar className="h-3.5 w-3.5" />
            )}
            <Badge
              text={renderExpiryText()}
              variant={variantMap[expiryResult.status]}
            />
          </div>
          <span className="text-xs font-medium text-spice-brown/70">
            {spice.remainingAmount}%
          </span>
        </div>
      </div>
    </div>
  );
}
