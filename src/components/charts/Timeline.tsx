import { Circle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  date: string;
  title: string;
  subtitle?: string;
  icon?: 'circle' | 'check' | 'alert' | 'clock' | React.ReactNode;
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const iconMap = {
  circle: Circle,
  check: CheckCircle2,
  alert: AlertCircle,
  clock: Clock,
};

const iconColorMap: Record<string, string> = {
  circle: 'text-spice-sage bg-spice-sage/15 border-spice-sage/30',
  check: 'text-spice-sageDark bg-spice-sage/20 border-spice-sage/40',
  alert: 'text-spice-cinnamon bg-spice-cinnamon/15 border-spice-cinnamon/30',
  clock: 'text-spice-saffron bg-spice-saffron/15 border-spice-saffron/30',
};

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-spice-sage/40 via-spice-creamDark to-spice-sage/20" />

      <div className="space-y-5">
        {items.map((item, index) => {
          const IconComponent =
            typeof item.icon === 'string'
              ? iconMap[item.icon as keyof typeof iconMap] || Circle
              : null;

          const customIcon =
            typeof item.icon !== 'string' && item.icon ? item.icon : null;

          const iconColorClass =
            typeof item.icon === 'string'
              ? iconColorMap[item.icon] || iconColorMap.circle
              : iconColorMap.circle;

          return (
            <div key={index} className="relative flex gap-4 pl-10">
              <div
                className={cn(
                  'absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 backdrop-blur-sm',
                  iconColorClass,
                  'shadow-md'
                )}
              >
                {customIcon ? (
                  <div className="h-5 w-5">{customIcon}</div>
                ) : IconComponent ? (
                  <IconComponent className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="rounded-2xl border border-spice-creamDark bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-spice-sage/30">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-display text-base font-semibold text-spice-charcoal">
                      {item.title}
                    </h4>
                    <span className="shrink-0 inline-flex items-center rounded-full bg-spice-creamDark/50 px-2.5 py-0.5 text-xs font-medium text-spice-brown">
                      {item.date}
                    </span>
                  </div>

                  {item.subtitle && (
                    <p className="text-sm text-spice-brown/80 mb-2">
                      {item.subtitle}
                    </p>
                  )}

                  {item.content && (
                    <div className="mt-2 pt-2 border-t border-spice-creamDark/50">
                      {item.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
