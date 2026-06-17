import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'notice' | 'info';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-spice-sage/15 text-spice-sageDark border-spice-sage/30',
  warning: 'bg-spice-saffron/20 text-spice-brownDark border-spice-saffron/40',
  danger: 'bg-spice-cinnamon/15 text-spice-cinnamon border-spice-cinnamon/30',
  notice: 'bg-spice-brown/15 text-spice-brownDark border-spice-brown/30',
  info: 'bg-spice-sageLight/30 text-spice-sageDark border-spice-sage/40',
};

export default function Badge({
  text,
  variant = 'info',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {text}
    </span>
  );
}
