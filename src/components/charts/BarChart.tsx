import { cn } from '@/lib/utils';

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  maxValue?: number;
  showValue?: boolean;
  className?: string;
}

export default function BarChart({
  data,
  maxValue,
  showValue = true,
  className,
}: BarChartProps) {
  const computedMax = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item, index) => {
        const percentage = Math.min((item.value / computedMax) * 100, 100);
        const barColor = item.color || '#7A9E7E';

        return (
          <div key={index} className="group">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-spice-charcoal">
                {item.label}
              </span>
              {showValue && (
                <span className="shrink-0 text-sm font-semibold text-spice-brownDark">
                  {item.value}
                </span>
              )}
            </div>
            <div className="relative h-7 w-full overflow-hidden rounded-lg bg-spice-creamDark">
              <div
                className={cn(
                  'h-full rounded-lg transition-all duration-700 ease-out origin-left',
                  'hover:scale-x-[1.02] hover:shadow-lg'
                )}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: barColor,
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div
                  className="h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
