import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatColor = 'sage' | 'brown' | 'saffron' | 'cinnamon';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isUp?: boolean;
  };
  color?: StatColor;
  className?: string;
}

const gradientMap: Record<StatColor, string> = {
  sage: 'from-spice-sage to-spice-sageDark',
  brown: 'from-spice-brown to-spice-brownDark',
  saffron: 'from-spice-saffron to-spice-brown',
  cinnamon: 'from-spice-cinnamon to-spice-brownDark',
};

const iconBgMap: Record<StatColor, string> = {
  sage: 'bg-white/25',
  brown: 'bg-white/25',
  saffron: 'bg-white/25',
  cinnamon: 'bg-white/25',
};

export default function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  color = 'sage',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
        gradientMap[color],
        className
      )}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-4 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl backdrop-blur-sm',
            iconBgMap[color]
          )}
        >
          <Icon className="h-7 w-7" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/85">{title}</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight">
            {value}
          </p>

          {trend && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trend.isUp ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
              )}
            >
              {trend.isUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.isUp ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
