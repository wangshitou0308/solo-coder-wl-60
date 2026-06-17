import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  threshold?: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  threshold = 20,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  let barColor = '';
  if (clampedValue > threshold) {
    barColor = 'bg-spice-sage';
  } else if (clampedValue > 10) {
    barColor = 'bg-spice-saffron';
  } else {
    barColor = 'bg-spice-cinnamon';
  }

  let labelColor = '';
  if (clampedValue > threshold) {
    labelColor = 'text-spice-sageDark';
  } else if (clampedValue > 10) {
    labelColor = 'text-spice-brown';
  } else {
    labelColor = 'text-spice-cinnamon';
  }

  const remaining = 100 - clampedValue;

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-spice-creamDark">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            barColor
          )}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {showLabel && (
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={cn('font-medium', labelColor)}>
            {clampedValue}% 已使用
          </span>
          <span className="text-spice-brown/70">
            剩余 {remaining}%
          </span>
        </div>
      )}
    </div>
  );
}
