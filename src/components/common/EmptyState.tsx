import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-spice-sage/10 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-spice-cream to-spice-creamDark shadow-inner">
          <Icon
            className="h-12 w-12 text-spice-brown/60"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h3 className="mt-6 font-display text-xl font-semibold text-spice-charcoal">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-spice-brown/80 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center rounded-full bg-spice-sage px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-spice-sageDark hover:shadow-lg active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
